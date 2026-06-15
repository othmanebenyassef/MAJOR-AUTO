"use client";

import { Header } from "@/components/layout/Header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageTable } from "@/components/ui/page-table";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BookOpen, ArrowUpCircle, ArrowDownCircle, Plus, Trash2 } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { formatCurrency, formatDate } from "@/lib/utils";

type Entree = { id: string; type: "ENTREE" | "SORTIE"; categorie: string; libelle: string; montant: number; date: string; compte: string; reference: string | null };
type Ligne = { id: number; type: "ENTREE" | "SORTIE"; categorie: string; libelle: string; montant: string; date: string; compte: string; reference: string };

const COMPTES = ["Espèces", "Chèque", "Virement", "CB", "Caisse", "Banque CIH", "Banque Attijariwafa", "Banque BMCE", "Banque Populaire"];

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
    fetch("/api/journal", { cache: "no-store" }).then(r => r.json()).then(setEntrees).catch(console.error), []);

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
      const results = await Promise.all(
        lignes.map(({ id: _id, ...l }) =>
          fetch("/api/journal", {
            method: "POST", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...l, montant: parseFloat(l.montant), date: l.date }),
          }).then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); })
        )
      );
      if (results.length > 0) { resetModal(); await load(); }
    } finally { setLoading(false); }
  }

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

      <Modal open={open} onClose={resetModal} title="Nouvelle saisie — Journal" wide>
        <form onSubmit={handleSubmit}>
          {/* Info */}
          <p className="text-xs text-[#6b7280] bg-[#f8f9fc] border border-[#e8eaf0] rounded-lg px-3 py-2 mb-4">
            Remplissez une ou plusieurs lignes, puis cliquez sur « Valider ». Les champs obligatoires : Désignation et Montant.
          </p>

          {/* Table */}
          <div className="overflow-x-auto rounded-xl border border-[#e8eaf0]">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#f8f9fc] border-b border-[#e8eaf0]">
                  <th className="px-2 py-2 text-xs font-semibold text-[#9ca3af] uppercase tracking-wide w-8">#</th>
                  <th className="px-2 py-2 text-xs font-semibold text-[#9ca3af] uppercase tracking-wide">Date</th>
                  <th className="px-2 py-2 text-xs font-semibold text-[#9ca3af] uppercase tracking-wide">Type</th>
                  <th className="px-2 py-2 text-xs font-semibold text-[#9ca3af] uppercase tracking-wide">Désignation</th>
                  <th className="px-2 py-2 text-xs font-semibold text-[#9ca3af] uppercase tracking-wide">Cat.</th>
                  <th className="px-2 py-2 text-xs font-semibold text-[#9ca3af] uppercase tracking-wide">Tiers</th>
                  <th className="px-2 py-2 text-xs font-semibold text-[#9ca3af] uppercase tracking-wide">Mode</th>
                  <th className="px-2 py-2 text-xs font-semibold text-[#9ca3af] uppercase tracking-wide text-right">Montant</th>
                  <th className="w-8" />
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f0f2f7]">
                {lignes.map((l, idx) => (
                  <tr key={l.id} className="hover:bg-[#f8f9fc]">
                    {/* # */}
                    <td className="px-2 py-2 text-center text-xs text-[#9ca3af] font-medium">{idx + 1}</td>

                    {/* Date */}
                    <td className="px-1 py-1">
                      <input
                        type="date"
                        value={l.date}
                        onChange={e => updateLigne(l.id, "date", e.target.value)}
                        required
                        className="w-36 px-2 py-1.5 bg-white border border-[#e8eaf0] rounded-lg text-sm text-[#1e2433] focus:outline-none focus:ring-2 focus:ring-[#c7d7fd] focus:border-[#3b82f6]"
                      />
                    </td>

                    {/* Type */}
                    <td className="px-1 py-1">
                      <select
                        value={l.type}
                        onChange={e => updateLigne(l.id, "type", e.target.value)}
                        className="px-2 py-1.5 bg-white border border-[#e8eaf0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#c7d7fd]"
                      >
                        <option value="ENTREE">Entrée</option>
                        <option value="SORTIE">Sortie</option>
                      </select>
                    </td>

                    {/* Désignation */}
                    <td className="px-1 py-1">
                      <input
                        required
                        placeholder="Désignation *"
                        value={l.libelle}
                        onChange={e => updateLigne(l.id, "libelle", e.target.value)}
                        className="w-44 px-2 py-1.5 bg-white border border-[#e8eaf0] rounded-lg text-sm text-[#1e2433] placeholder:text-[#c4c9d4] focus:outline-none focus:ring-2 focus:ring-[#c7d7fd] focus:border-[#3b82f6]"
                      />
                    </td>

                    {/* Catégorie */}
                    <td className="px-1 py-1">
                      <select
                        value={l.categorie}
                        onChange={e => updateLigne(l.id, "categorie", e.target.value)}
                        className="px-2 py-1.5 bg-white border border-[#e8eaf0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#c7d7fd]"
                      >
                        <option value="Client">Client</option>
                        <option value="Personnel">Personnel</option>
                        <option value="Fournisseur">Fournisseur</option>
                        <option value="Autre">Autre</option>
                      </select>
                    </td>

                    {/* Tiers */}
                    <td className="px-1 py-1">
                      <input
                        placeholder="Libre"
                        value={l.reference}
                        onChange={e => updateLigne(l.id, "reference", e.target.value)}
                        className="w-32 px-2 py-1.5 bg-white border border-[#e8eaf0] rounded-lg text-sm text-[#1e2433] placeholder:text-[#c4c9d4] focus:outline-none focus:ring-2 focus:ring-[#c7d7fd]"
                      />
                    </td>

                    {/* Mode */}
                    <td className="px-1 py-1">
                      <select
                        value={l.compte}
                        onChange={e => updateLigne(l.id, "compte", e.target.value)}
                        className="px-2 py-1.5 bg-white border border-[#e8eaf0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#c7d7fd]"
                      >
                        <option>Espèces</option>
                        <option>Chèque</option>
                        <option>Virement</option>
                        <option>CB</option>
                        <option>Caisse</option>
                        <option>Banque CIH</option>
                        <option>Banque Attijariwafa</option>
                        <option>Banque BMCE</option>
                        <option>Banque Populaire</option>
                      </select>
                    </td>

                    {/* Montant */}
                    <td className="px-1 py-1">
                      <input
                        required
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="0,00 *"
                        value={l.montant}
                        onChange={e => updateLigne(l.id, "montant", e.target.value)}
                        className="w-24 px-2 py-1.5 bg-white border border-[#e8eaf0] rounded-lg text-sm text-right text-[#1e2433] placeholder:text-[#c4c9d4] focus:outline-none focus:ring-2 focus:ring-[#c7d7fd] focus:border-[#3b82f6]"
                      />
                    </td>

                    {/* Supprimer */}
                    <td className="px-1 py-1 text-center">
                      {lignes.length > 1 && (
                        <button type="button" onClick={() => removeLigne(l.id)} className="p-1 hover:bg-[#fff1f3] rounded-lg group transition-colors">
                          <Trash2 className="w-3.5 h-3.5 text-[#c4c9d4] group-hover:text-[#f43f5e]" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between mt-4">
            <button type="button" onClick={addLigne}
              className="flex items-center gap-1.5 text-sm text-[#3b82f6] hover:text-[#2563eb] font-medium transition-colors">
              <Plus className="w-4 h-4" /> Ajouter une ligne
            </button>
            <div className="flex gap-3">
              <Button type="button" variant="outline" onClick={resetModal}>Annuler</Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Enregistrement…" : `Valider ${lignes.length} ligne${lignes.length > 1 ? "s" : ""}`}
              </Button>
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
}
