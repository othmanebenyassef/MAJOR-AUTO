"use client";

import { Header } from "@/components/layout/Header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageTable } from "@/components/ui/page-table";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DateInput } from "@/components/ui/date-input";
import { BookOpen, ArrowUpCircle, ArrowDownCircle } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { formatCurrency, formatDate } from "@/lib/utils";

type Entree = { id: string; type: "ENTREE" | "SORTIE"; categorie: string; libelle: string; montant: number; date: string; compte: string; reference: string | null };

const CATEGORIES_ENTREE = ["Règlement facture", "Acompte client", "Vente pièce", "Autre recette"];
const CATEGORIES_SORTIE = ["Achat pièces", "Salaire", "Loyer", "Facture fournisseur", "Carburant", "Autre dépense"];
const COMPTES = ["Caisse", "Banque CIH", "Banque Attijariwafa", "Banque BMCE", "Banque Populaire"];
const emptyForm = { categorie: "", libelle: "", montant: "", date: new Date().toISOString().split("T")[0], compte: "Caisse", reference: "", notes: "" };

export default function JournalPage() {
  const [entrees, setEntrees] = useState<Entree[]>([]);
  const [open, setOpen] = useState(false);
  const [type, setType] = useState<"ENTREE" | "SORTIE">("ENTREE");
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);

  const load = useCallback(() =>
    fetch("/api/journal").then(r => r.json()).then(setEntrees), []);

  useEffect(() => { load(); }, [load]);

  const totalEntrees = entrees.filter(e => e.type === "ENTREE").reduce((s, e) => s + e.montant, 0);
  const totalSorties = entrees.filter(e => e.type === "SORTIE").reduce((s, e) => s + e.montant, 0);
  const solde = totalEntrees - totalSorties;
  const cats = type === "ENTREE" ? CATEGORIES_ENTREE : CATEGORIES_SORTIE;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/journal", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, type, montant: parseFloat(form.montant), date: new Date(form.date) }),
      });
      if (res.ok) { setOpen(false); setForm(emptyForm); load(); }
    } finally { setLoading(false); }
  }

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setForm({ ...form, [k]: e.target.value });

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

      <Modal open={open} onClose={() => setOpen(false)} title="Nouvelle opération">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-medium text-[#6b7280] uppercase tracking-wide block mb-2">Type d'opération</label>
            <div className="flex gap-2">
              {(["ENTREE", "SORTIE"] as const).map(t => (
                <button key={t} type="button" onClick={() => setType(t)} className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition ${type === t ? (t === "ENTREE" ? "bg-[#edfaf4] text-[#10b981] border-2 border-[#a7f0c8]" : "bg-[#fff1f3] text-[#f43f5e] border-2 border-[#fda4b0]") : "bg-[#f8f9fc] text-[#9ca3af] border-2 border-transparent"}`}>
                  {t === "ENTREE" ? "↑ Entrée" : "↓ Sortie"}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-[#6b7280] uppercase tracking-wide block mb-1">Catégorie</label>
            <select value={form.categorie} onChange={set("categorie")} required className="w-full px-3 py-2.5 bg-[#f8f9fc] border border-[#e8eaf0] rounded-xl text-sm text-[#1e2433] focus:outline-none focus:ring-2 focus:ring-[#c7d7fd]">
              <option value="">Sélectionner…</option>
              {cats.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <Input label="Libellé *" required value={form.libelle} onChange={set("libelle")} placeholder="Description de l'opération" />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Montant (MAD) *" required type="number" step="0.01" value={form.montant} onChange={set("montant")} />
            <DateInput label="Date *" required value={form.date} onChange={set("date")} />
          </div>
          <div>
            <label className="text-xs font-medium text-[#6b7280] uppercase tracking-wide block mb-1">Compte</label>
            <select value={form.compte} onChange={set("compte")} className="w-full px-3 py-2.5 bg-[#f8f9fc] border border-[#e8eaf0] rounded-xl text-sm text-[#1e2433] focus:outline-none focus:ring-2 focus:ring-[#c7d7fd]">
              {COMPTES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <Input label="Référence (facture, bon…)" value={form.reference} onChange={set("reference")} placeholder="ex: FAC-202506-1234" />
          <div className="flex gap-3 pt-2">
            <Button type="submit" disabled={loading}>{loading ? "Enregistrement…" : "Enregistrer"}</Button>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Annuler</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
