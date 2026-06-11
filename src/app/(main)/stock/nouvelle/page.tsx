"use client";

import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NouvellePiecePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    reference: "", nom: "", description: "", categorie: "",
    quantiteStock: "0", seuilAlerte: "5",
    prixAchat: "", prixVente: "",
    fournisseur: "", emplacement: "",
  });

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, [k]: e.target.value });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/stock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          quantiteStock: parseInt(form.quantiteStock),
          seuilAlerte: parseInt(form.seuilAlerte),
          prixAchat: parseFloat(form.prixAchat),
          prixVente: parseFloat(form.prixVente),
        }),
      });
      if (res.ok) { router.push("/stock"); router.refresh(); }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col flex-1">
      <Header title="Nouvelle pièce" />
      <div className="flex-1 p-6 max-w-2xl">
        <Card>
          <CardHeader><CardTitle>Informations pièce détachée</CardTitle></CardHeader>
          <CardContent>
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
                <Button type="button" variant="outline" onClick={() => router.back()}>Annuler</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
