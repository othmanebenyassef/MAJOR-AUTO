"use client";

import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DateInput } from "@/components/ui/date-input";
import { useState } from "react";
import { useRouter } from "next/navigation";

const POSTES = ["Mécanicien", "Carrossier", "Électricien auto", "Peintre", "Technicien diagnostic", "Réceptionniste", "Gérant"];

export default function NouveauPersonnelPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    nom: "", prenom: "", poste: "", telephone: "", email: "", salaire: "", dateEmbauche: "",
  });

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm({ ...form, [k]: e.target.value });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/personnel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          salaire: form.salaire ? parseFloat(form.salaire) : null,
          dateEmbauche: form.dateEmbauche ? new Date(form.dateEmbauche) : null,
        }),
      });
      if (res.ok) { router.push("/base/personnel"); router.refresh(); }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col flex-1">
      <Header title="Nouvel employé" />
      <div className="flex-1 p-6 max-w-2xl">
        <Card>
          <CardHeader><CardTitle>Informations employé</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input label="Prénom *" required value={form.prenom} onChange={set("prenom")} />
                <Input label="Nom *" required value={form.nom} onChange={set("nom")} />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Poste *</label>
                <select
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  value={form.poste}
                  onChange={set("poste")}
                >
                  <option value="">Sélectionner...</option>
                  {POSTES.map((p) => <option key={p}>{p}</option>)}
                </select>
              </div>
              <Input label="Téléphone" value={form.telephone} onChange={set("telephone")} />
              <Input label="Email" type="email" value={form.email} onChange={set("email")} />
              <div className="grid grid-cols-2 gap-4">
                <Input label="Salaire mensuel (MAD)" type="number" step="0.01" value={form.salaire} onChange={set("salaire")} />
                <DateInput label="Date d'embauche" value={form.dateEmbauche} onChange={set("dateEmbauche")} />
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
