"use client";

import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DateInput } from "@/components/ui/date-input";
import { useState } from "react";
import { useRouter } from "next/navigation";

const CATEGORIES = ["LOYER", "ELECTRICITE", "EAU", "SALAIRES", "FOURNITURES", "ASSURANCE", "MAINTENANCE", "TRANSPORT", "AUTRE"];
const CAT_LABELS: Record<string, string> = {
  LOYER: "Loyer", ELECTRICITE: "Électricité", EAU: "Eau", SALAIRES: "Salaires",
  FOURNITURES: "Fournitures", ASSURANCE: "Assurance", MAINTENANCE: "Maintenance",
  TRANSPORT: "Transport", AUTRE: "Autre",
};

export default function NouvelleChargePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    libelle: "", categorie: "AUTRE", montant: "",
    date: new Date().toISOString().split("T")[0],
    recurrente: false, periodicite: "Mensuelle", notes: "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/charges", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, montant: parseFloat(form.montant), date: new Date(form.date) }),
      });
      if (res.ok) { router.push("/charges"); router.refresh(); }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col flex-1">
      <Header title="Nouvelle charge" />
      <div className="flex-1 p-6 max-w-xl">
        <Card>
          <CardHeader><CardTitle>Ajouter une charge</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input label="Libellé *" required value={form.libelle} onChange={(e) => setForm({ ...form, libelle: e.target.value })} />
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Catégorie *</label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={form.categorie}
                  onChange={(e) => setForm({ ...form, categorie: e.target.value })}
                >
                  {CATEGORIES.map((c) => <option key={c} value={c}>{CAT_LABELS[c]}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input label="Montant (MAD) *" required type="number" step="0.01" value={form.montant} onChange={(e) => setForm({ ...form, montant: e.target.value })} />
                <DateInput label="Date *" required value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="recurrente"
                  checked={form.recurrente}
                  onChange={(e) => setForm({ ...form, recurrente: e.target.checked })}
                  className="w-4 h-4"
                />
                <label htmlFor="recurrente" className="text-sm text-gray-700">Charge récurrente</label>
              </div>
              {form.recurrente && (
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">Périodicité</label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white"
                    value={form.periodicite}
                    onChange={(e) => setForm({ ...form, periodicite: e.target.value })}
                  >
                    {["Mensuelle", "Trimestrielle", "Semestrielle", "Annuelle"].map((p) => <option key={p}>{p}</option>)}
                  </select>
                </div>
              )}
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Notes</label>
                <textarea
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                />
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
