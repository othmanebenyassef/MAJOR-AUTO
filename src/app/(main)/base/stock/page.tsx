"use client";

import { Header } from "@/components/layout/Header";
import { PageTable } from "@/components/ui/page-table";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Boxes, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { formatCurrency } from "@/lib/utils";

type Piece = { id: string; reference: string; nom: string; categorie: string; quantiteStock: number; seuilAlerte: number; prixAchat: number; prixVente: number; fournisseur: { nom: string } | null };
const emptyForm = { reference: "", nom: "", description: "", categorie: "", quantiteStock: "0", seuilAlerte: "5", prixAchat: "", prixVente: "", fournisseur: "", emplacement: "" };

export default function StockPage() {
  const [pieces, setPieces] = useState<Piece[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);

  const load = useCallback(() =>
    fetch("/api/stock").then(r => r.json()).then(setPieces), []);

  useEffect(() => { load(); }, [load]);

  const alertes = pieces.filter(p => p.quantiteStock <= p.seuilAlerte).length;
  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, [k]: e.target.value });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/stock", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, quantiteStock: parseInt(form.quantiteStock), seuilAlerte: parseInt(form.seuilAlerte), prixAchat: parseFloat(form.prixAchat), prixVente: parseFloat(form.prixVente) }),
      });
      if (res.ok) { setOpen(false); setForm(emptyForm); load(); }
    } finally { setLoading(false); }
  }

  return (
    <div className="flex flex-col flex-1">
      <Header title="Stock pièces & fournitures" subtitle={`${pieces.length} référence(s) · ${alertes} alerte(s)`} />
      <div className="flex-1 p-6">
        {alertes > 0 && (
          <div className="mb-4 flex items-center gap-2.5 px-4 py-3 bg-[#fff1f3] border border-[#fda4b0] rounded-xl text-sm text-[#e11d48]">
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            <span><strong>{alertes}</strong> pièce(s) en dessous du seuil d'alerte</span>
          </div>
        )}
        <PageTable
          rows={pieces} getKey={p => p.id}
          onAdd={() => setOpen(true)} addLabel="Nouvelle pièce"
          emptyIcon={<Boxes className="w-6 h-6 text-[#9ca3af]" />}
          emptyText="Stock vide"
          columns={[
            { key: "reference", label: "Référence", render: p => <span className="font-mono text-xs font-bold text-[#6b7280]">{p.reference}</span> },
            { key: "nom", label: "Désignation", render: p => <><div className="font-medium text-[#1e2433]">{p.nom}</div><div className="text-xs text-[#9ca3af]">{p.categorie}</div></> },
            { key: "fournisseur", label: "Fournisseur", render: p => <span className="text-[#6b7280]">{p.fournisseur?.nom ?? "—"}</span> },
            { key: "quantiteStock", label: "Stock", render: p => <span className={`font-bold ${p.quantiteStock <= p.seuilAlerte ? "text-[#f43f5e]" : "text-[#10b981]"}`}>{p.quantiteStock}</span> },
            { key: "seuilAlerte", label: "Seuil", render: p => <span className="text-[#9ca3af]">{p.seuilAlerte}</span> },
            { key: "prixAchat", label: "P. Achat", render: p => <span className="text-[#6b7280]">{formatCurrency(p.prixAchat)}</span> },
            { key: "prixVente", label: "P. Vente", render: p => <span className="font-medium">{formatCurrency(p.prixVente)}</span> },
            { key: "statut", label: "", render: p => <Badge variant={p.quantiteStock <= p.seuilAlerte ? "danger" : "success"}>{p.quantiteStock <= p.seuilAlerte ? "Stock bas" : "OK"}</Badge> },
            { key: "actions", label: "", render: p => <Link href={`/base/stock/${p.id}`} className="text-[#3b82f6] hover:underline text-xs font-medium">Gérer →</Link> },
          ]}
        />
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title="Nouvelle pièce détachée">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input label="Référence *" required value={form.reference} onChange={set("reference")} />
            <Input label="Catégorie *" required value={form.categorie} onChange={set("categorie")} />
          </div>
          <Input label="Nom *" required value={form.nom} onChange={set("nom")} />
          <Input label="Description" value={form.description} onChange={set("description")} />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Prix d'achat (MAD) *" required type="number" step="0.01" value={form.prixAchat} onChange={set("prixAchat")} />
            <Input label="Prix de vente (MAD) *" required type="number" step="0.01" value={form.prixVente} onChange={set("prixVente")} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Quantité en stock" type="number" value={form.quantiteStock} onChange={set("quantiteStock")} />
            <Input label="Seuil d'alerte" type="number" value={form.seuilAlerte} onChange={set("seuilAlerte")} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Fournisseur" value={form.fournisseur} onChange={set("fournisseur")} />
            <Input label="Emplacement" placeholder="ex: Étagère A3" value={form.emplacement} onChange={set("emplacement")} />
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
