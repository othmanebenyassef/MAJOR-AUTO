"use client";

import { Header } from "@/components/layout/Header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageTable } from "@/components/ui/page-table";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DateSelect } from "@/components/ui/date-select";
import { BookOpen, ArrowUpCircle, ArrowDownCircle, Plus, Trash2 } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { formatCurrency, formatDate } from "@/lib/utils";

type Entree = { id: string; type: "ENTREE" | "SORTIE"; categorie: string; libelle: string; montant: number; date: string; compte: string; reference: string | null };
type Ligne = { id: number; type: "ENTREE" | "SORTIE"; categorie: string; libelle: string; montant: string; date: string; compte: string; reference: string };

const CATEGORIES_ENTREE = ["Règlement facture", "Acompte client", "Vente pièce", "Autre recette"];
const CATEGORIES_SORTIE = ["Achat pièces", "Salaire", "Loyer", "Facture fournisseur", "Carburant", "Autre dépense"];
const COMPTES = ["Caisse", "Banque CIH", "Banque Attijariwafa", "Banque BMCE", "Banque Populaire"];

const newLigne = (id: number): Ligne => ({
  id, type: "ENTREE", categorie: "", libelle: "", montant: "",
  date: new Date().toISOString().split("T")[0], compte: "Caisse", reference: "",
});

export default function JournalPage() {
  const [entrees, setEntrees] = useState<Entree[]>([]);
  const [open, setOpen] = useState(false);
  const [lignes, setLignes] = useState<Ligne[]>([newLigne(1)]);
  const [nextId, setNextId] = useState(2);
  const [loading, setLoading] = useState(false);

  const load = useCallback(() =>
    fetch("/api/journal").then(r => r.json()).then(setEntrees), []);

  useEffect(() => { load(); }, [load]);

  const totalEntrees = entrees.filter(e => e.type === "ENTREE").reduce((s, e) => s + e.montant, 0);
  const totalSorties = entrees.filter(e => e.type === "SORTIE").reduce((s, e) => s + e.montant, 0);
  const solde = totalEntrees - totalSorties;

  function addLigne() {
    setLignes(prev => [...prev, newLigne(nextId)]);
    setNextId(n => n + 1);
  }

  function removeLigne(id: number) {
    if (lignes.length === 1) return;
    setLignes(prev => prev.filter(l => l.id !== id));
  }

  function updateLigne(id: number, field: keyof Ligne, value: string) {
    setLignes(prev => prev.map(l => l.id === id ? { ...l, [field]: value } : l));
  }

  function resetModal() {
    setLignes([newLigne(1)]);
    setNextId(2);
    setOpen(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await Promise.all(
        lignes.map(l =>
          fetch("/api/journal", {
            method: "POST", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...l, montant: parseFloat(l.montant), date: new Date(l.date) }),
          })
        )
      );
      resetModal();
      load();
    } finally { setLoading(false); }
  }

  const selectCls = "px-2 py-2 bg-[#f8f9fc] border border-[#e8eaf0] rounded-lg text-sm text-[#1e2433] focus:outline-none focus:ring-2 focus:ring-[#c7d7fd]";

  return (
    <div className="flex flex-col flex-1">
      <Header title="Journal" subtitle="Entrées et sorties de caisses et banques" />
      <div className="flex-1 p-6 space-y-6">
        <div className="grid grid-cols-3 gap-4">
          <Card><CardContent className="pt-5 pb-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 bg-[#edfaf4] rounded-xl flex items-center justify-center"><ArrowUpCircle className="w-5 h-5 text-[#10b981]" /></div>
              <span className="text-xs font-semibold text-[#9ca3af] uppercase tracking-wide">Total Entrées</span>
            </div>
            <p className="text-2xl font-bold text-[#10b981]">{formatCurrency(totalEntrees)}</p>
          </CardContent></Card>
          <Card><CardContent className="pt-5 pb-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 bg-[#fff1f3] rounded-xl flex items-center justify-center"><ArrowDownCircle className="w-5 h-5 text-[#f43f5e]" /></div>
              <span className="text-xs font-semibold text-[#9ca3af] uppercase tracking-wide">Total Sorties</span>
            </div>
            <p className="text-2xl font-bold text-[#f43f5e]">{formatCurrency(totalSorties)}</p>
          </CardContent></Card>
          <Card><CardContent className="pt-5 pb-4">
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-9 h-9 ${solde >= 0 ? "bg-[#eef3ff]" : "bg-[#fff1f3]"} rounded-xl flex items-center justify-center`}><BookOpen className={`w-5 h-5 ${solde >= 0 ? "text-[#3b82f6]" : "text-[#f43f5e]"}`} /></div>
              <span className="text-xs font-semibold text-[#9ca3af] uppercase tracking-wide">Solde</span>
            </div>
            <p className={`text-2xl font-bold ${solde >= 0 ? "text-[#3b82f6]" : "text-[#f43f5e]"}`}>{formatCurrency(solde)}</p>
          </CardContent></Card>
        </div>

        <PageTable
          rows={entrees} getKey={e => e.id}
          onAdd={() => setOpen(true)} addLabel="Nouvelle opération"
          emptyIcon={<BookOpen className="w-6 h-6 text-[#9ca3af]" />}
          emptyText="Aucune opération enregistrée"
          columns={[
            { key: "date", label: "Date", render: e => <span className="text-[#6b7280]">{formatDate(e.date)}</span> },
            { key: "type", label: "Type", render: e => <Badge variant={e.type === "ENTREE" ? "success" : "danger"}>{e.type === "ENTREE" ? "↑ Entrée" : "↓ Sortie"}</Badge> },
            { key: "compte", label: "Compte", render: e => <span className="text-xs bg-[#f5f3ff] text-[#7c3aed] px-2.5 py-1 rounded-full font-medium">{e.compte}</span> },
            { key: "categorie", label: "Catégorie", render: e => <span className="text-[#6b7280]">{e.categorie}</span> },
            { key: "libelle", label: "Libellé", render: e => <span className="font-medium text-[#1e2433]">{e.libelle}</span> },
            { key: "reference", label: "Référence", render: e => <span className="font-mono text-xs text-[#9ca3af]">{e.reference ?? "—"}</span> },
            { key: "montant", label: "Montant", className: "text-right", render: e => <span className={`font-bold ${e.type === "ENTREE" ? "text-[#10b981]" : "text-[#f43f5e]"}`}>{e.type === "ENTREE" ? "+" : "−"}{formatCurrency(e.montant)}</span> },
          ]}
        />
      </div>

      <Modal open={open} onClose={resetModal} title="Nouvelles opérations">
        <form onSubmit={handleSubmit} className="space-y-3">
          {lignes.map((l, idx) => {
            const cats = l.type === "ENTREE" ? CATEGORIES_ENTREE : CATEGORIES_SORTIE;
            return (
              <div key={l.id} className="relative bg-[#f8f9fc] border border-[#e8eaf0] rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-[#9ca3af] uppercase tracking-wide">Ligne {idx + 1}</span>
                  {lignes.length > 1 && (
                    <button type="button" onClick={() => removeLigne(l.id)} className="p-1 hover:bg-[#fff1f3] rounded-lg transition-colors group">
                      <Trash2 className="w-4 h-4 text-[#9ca3af] group-hover:text-[#f43f5e]" />
                    </button>
                  )}
                </div>

                {/* Type toggle */}
                <div className="flex gap-2">
                  {(["ENTREE", "SORTIE"] as const).map(t => (
                    <button key={t} type="button" onClick={() => updateLigne(l.id, "type", t)}
                      className={`flex-1 py-2 rounded-lg text-xs font-medium transition ${l.type === t ? (t === "ENTREE" ? "bg-[#edfaf4] text-[#10b981] border border-[#a7f0c8]" : "bg-[#fff1f3] text-[#f43f5e] border border-[#fda4b0]") : "bg-white text-[#9ca3af] border border-[#e8eaf0]"}`}>
                      {t === "ENTREE" ? "↑ Entrée" : "↓ Sortie"}
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <select value={l.categorie} onChange={e => updateLigne(l.id, "categorie", e.target.value)} required className={selectCls}>
                    <option value="">Catégorie…</option>
                    {cats.map(c => <option key={c}>{c}</option>)}
                  </select>
                  <select value={l.compte} onChange={e => updateLigne(l.id, "compte", e.target.value)} className={selectCls}>
                    {COMPTES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>

                <Input placeholder="Libellé *" required value={l.libelle} onChange={e => updateLigne(l.id, "libelle", e.target.value)} />

                <div className="grid grid-cols-2 gap-2">
                  <Input placeholder="Montant (MAD) *" required type="number" step="0.01" value={l.montant} onChange={e => updateLigne(l.id, "montant", e.target.value)} />
                  <Input placeholder="Référence" value={l.reference} onChange={e => updateLigne(l.id, "reference", e.target.value)} />
                </div>

                <DateSelect label="Date *" required value={l.date} onChange={val => updateLigne(l.id, "date", val)} />
              </div>
            );
          })}

          {/* Bouton ajouter une ligne */}
          <button type="button" onClick={addLigne}
            className="w-full py-2.5 rounded-xl border-2 border-dashed border-[#c7d7fd] bg-[#eef3ff] text-[#3b82f6] text-sm font-medium hover:bg-[#dbeafe] transition flex items-center justify-center gap-2">
            <Plus className="w-4 h-4" /> Ajouter une ligne
          </button>

          <div className="flex gap-3 pt-1">
            <Button type="submit" disabled={loading}>
              {loading ? "Enregistrement…" : `Enregistrer ${lignes.length > 1 ? `(${lignes.length} lignes)` : ""}`}
            </Button>
            <Button type="button" variant="outline" onClick={resetModal}>Annuler</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
