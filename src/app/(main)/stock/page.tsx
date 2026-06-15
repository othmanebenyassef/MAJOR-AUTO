"use client";

import { Header } from "@/components/layout/Header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Package, Plus, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { formatCurrency } from "@/lib/utils";

type Piece = { id: string; reference: string; nom: string; categorie: string; quantiteStock: number; seuilAlerte: number; prixAchat: number; prixVente: number };

const emptyForm = { reference: "", nom: "", description: "", categorie: "", quantiteStock: "0", seuilAlerte: "5", prixAchat: "", prixVente: "", fournisseur: "", emplacement: "" };

export default function StockPage() {
  const [pieces, setPieces] = useState<Piece[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);

  const load = useCallback(() =>
    fetch("/api/stock").then(r => r.json()).then(setPieces), []);

  useEffect(() => { load(); }, [load]);

  const alertes = pieces.filter(p => p.quantiteStock <= p.seuilAlerte);
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
      <Header title="Stock de pièces détachées" subtitle={`${pieces.length} référence(s) — ${alertes.length} alerte(s) de stock`} />
      <div className="flex-1 p-6">
        {alertes.length > 0 && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-sm text-red-700">
            <AlertTriangle className="w-4 h-4" />
            {alertes.length} pièce(s) en dessous du seuil d'alerte
          </div>
        )}
        <div className="flex justify-end mb-6">
          <button onClick={() => setOpen(true)} className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700">
            <Plus className="w-4 h-4" /> Nouvelle pièce
          </button>
        </div>

        {pieces.length === 0 ? (
          <Card><CardContent className="py-16 text-center">
            <Package className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p className="text-gray-500">Stock vide</p>
          </CardContent></Card>
        ) : (
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-xs text-gray-500 border-b border-gray-100 bg-gray-50">
                    <th className="text-left px-6 py-3 font-medium">Référence</th>
                    <th className="text-left px-6 py-3 font-medium">Nom</th>
                    <th className="text-left px-6 py-3 font-medium">Catégorie</th>
                    <th className="text-right px-6 py-3 font-medium">Stock</th>
                    <th className="text-right px-6 py-3 font-medium">Seuil</th>
                    <th className="text-right px-6 py-3 font-medium">P. Achat</th>
                    <th className="text-right px-6 py-3 font-medium">P. Vente</th>
                    <th className="text-left px-6 py-3 font-medium">Statut</th>
                    <th className="text-left px-6 py-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pieces.map(p => {
                    const alerte = p.quantiteStock <= p.seuilAlerte;
                    return (
                      <tr key={p.id} className={`border-b border-gray-50 ${alerte ? "bg-red-50" : "hover:bg-gray-50"}`}>
                        <td className="px-6 py-3 font-mono text-sm text-gray-700">{p.reference}</td>
                        <td className="px-6 py-3 text-sm font-medium">{p.nom}</td>
                        <td className="px-6 py-3 text-sm text-gray-600">{p.categorie}</td>
                        <td className={`px-6 py-3 text-sm font-bold text-right ${alerte ? "text-red-600" : "text-gray-900"}`}>{p.quantiteStock}</td>
                        <td className="px-6 py-3 text-sm text-gray-400 text-right">{p.seuilAlerte}</td>
                        <td className="px-6 py-3 text-sm text-gray-600 text-right">{formatCurrency(p.prixAchat)}</td>
                        <td className="px-6 py-3 text-sm text-gray-900 font-medium text-right">{formatCurrency(p.prixVente)}</td>
                        <td className="px-6 py-3"><Badge variant={alerte ? "danger" : "success"}>{alerte ? "Stock bas" : "OK"}</Badge></td>
                        <td className="px-6 py-3"><Link href={`/stock/${p.id}`} className="text-sm text-blue-600 hover:underline">Gérer</Link></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        )}
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
