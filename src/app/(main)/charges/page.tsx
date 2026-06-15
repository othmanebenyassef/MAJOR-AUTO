"use client";

import { Header } from "@/components/layout/Header";
import { Card, CardContent } from "@/components/ui/card";
import { PageTable } from "@/components/ui/page-table";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DateInput } from "@/components/ui/date-input";
import { TrendingDown } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { formatCurrency, formatDate } from "@/lib/utils";

type Charge = { id: string; libelle: string; categorie: string; montant: number; date: string; recurrente: boolean; periodicite: string | null };

const CATEGORIES = ["LOYER", "ELECTRICITE", "EAU", "SALAIRES", "FOURNITURES", "ASSURANCE", "MAINTENANCE", "TRANSPORT", "AUTRE"];
const CAT_LABELS: Record<string, string> = { LOYER: "Loyer", ELECTRICITE: "Électricité", EAU: "Eau", SALAIRES: "Salaires", FOURNITURES: "Fournitures", ASSURANCE: "Assurance", MAINTENANCE: "Maintenance", TRANSPORT: "Transport", AUTRE: "Autre" };
const emptyForm = { libelle: "", categorie: "AUTRE", montant: "", date: new Date().toISOString().split("T")[0], recurrente: false, periodicite: "Mensuelle", notes: "" };

export default function ChargesPage() {
  const [charges, setCharges] = useState<Charge[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);

  const load = useCallback(() =>
    fetch("/api/charges").then(r => r.json()).then(setCharges), []);

  useEffect(() => { load(); }, [load]);

  const now = new Date();
  const totalMois = charges.filter(c => { const d = new Date(c.date); return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear(); }).reduce((s, c) => s + c.montant, 0);
  const byCategorie = charges.reduce((acc: Record<string, number>, c) => { acc[c.categorie] = (acc[c.categorie] || 0) + c.montant; return acc; }, {});

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/charges", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, montant: parseFloat(form.montant), date: new Date(form.date) }),
      });
      if (res.ok) { setOpen(false); setForm(emptyForm); load(); }
    } finally { setLoading(false); }
  }

  return (
    <div className="flex flex-col flex-1">
      <Header title="Charges d'exploitation" subtitle={`Ce mois : ${formatCurrency(totalMois)}`} />
      <div className="flex-1 p-6 space-y-6">
        {Object.keys(byCategorie).length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(byCategorie).map(([cat, total]) => (
              <Card key={cat}><CardContent className="pt-4 pb-4">
                <p className="text-xs text-[#9ca3af] font-medium uppercase tracking-wide">{CAT_LABELS[cat] || cat}</p>
                <p className="text-lg font-bold text-[#f43f5e] mt-1">{formatCurrency(total)}</p>
              </CardContent></Card>
            ))}
          </div>
        )}

        <PageTable
          rows={charges} getKey={c => c.id}
          onAdd={() => setOpen(true)} addLabel="Ajouter une charge"
          emptyIcon={<TrendingDown className="w-6 h-6 text-[#9ca3af]" />}
          emptyText="Aucune charge enregistrée"
          columns={[
            { key: "date", label: "Date", render: c => <span className="text-[#6b7280]">{formatDate(c.date)}</span> },
            { key: "libelle", label: "Libellé", render: c => <span className="font-medium text-[#1e2433]">{c.libelle}</span> },
            { key: "categorie", label: "Catégorie", render: c => <span className="text-xs bg-[#f5f3ff] text-[#7c3aed] px-2.5 py-1 rounded-full font-medium">{CAT_LABELS[c.categorie] || c.categorie}</span> },
            { key: "montant", label: "Montant", className: "text-right", render: c => <span className="font-bold text-[#f43f5e]">{formatCurrency(c.montant)}</span> },
            { key: "recurrence", label: "Récurrence", render: c => <span className="text-[#9ca3af] text-xs">{c.recurrente ? `Récurrente (${c.periodicite})` : "Ponctuelle"}</span> },
          ]}
        />
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title="Ajouter une charge">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Libellé *" required value={form.libelle} onChange={e => setForm({ ...form, libelle: e.target.value })} />
          <div>
            <label className="text-xs font-medium text-[#6b7280] uppercase tracking-wide block mb-1">Catégorie *</label>
            <select className="w-full px-3 py-2.5 bg-[#f8f9fc] border border-[#e8eaf0] rounded-xl text-sm text-[#1e2433] focus:outline-none focus:ring-2 focus:ring-[#c7d7fd]" value={form.categorie} onChange={e => setForm({ ...form, categorie: e.target.value })}>
              {CATEGORIES.map(c => <option key={c} value={c}>{CAT_LABELS[c]}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Montant (MAD) *" required type="number" step="0.01" value={form.montant} onChange={e => setForm({ ...form, montant: e.target.value })} />
            <DateInput label="Date *" required value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="recurrente" checked={form.recurrente} onChange={e => setForm({ ...form, recurrente: e.target.checked })} className="w-4 h-4" />
            <label htmlFor="recurrente" className="text-sm text-gray-700">Charge récurrente</label>
          </div>
          {form.recurrente && (
            <div>
              <label className="text-xs font-medium text-[#6b7280] uppercase tracking-wide block mb-1">Périodicité</label>
              <select className="w-full px-3 py-2.5 bg-[#f8f9fc] border border-[#e8eaf0] rounded-xl text-sm text-[#1e2433] focus:outline-none focus:ring-2 focus:ring-[#c7d7fd]" value={form.periodicite} onChange={e => setForm({ ...form, periodicite: e.target.value })}>
                {["Mensuelle", "Trimestrielle", "Semestrielle", "Annuelle"].map(p => <option key={p}>{p}</option>)}
              </select>
            </div>
          )}
          <div>
            <label className="text-xs font-medium text-[#6b7280] uppercase tracking-wide block mb-1">Notes</label>
            <textarea rows={2} className="w-full px-3 py-2.5 bg-[#f8f9fc] border border-[#e8eaf0] rounded-xl text-sm text-[#1e2433] focus:outline-none focus:ring-2 focus:ring-[#c7d7fd]" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} />
          </div>
          <div className="flex gap-3 pt-2">
            <Button type="submit" disabled={loading}>{loading ? "Enregistrement..." : "Enregistrer"}</Button>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Annuler</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
