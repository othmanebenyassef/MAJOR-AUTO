"use client";

import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DateInput } from "@/components/ui/date-input";
import { useState } from "react";
import { useRouter } from "next/navigation";

const CATEGORIES_ENTREE = ["Règlement facture", "Acompte client", "Vente pièce", "Autre recette"];
const CATEGORIES_SORTIE = ["Achat pièces", "Salaire", "Loyer", "Facture fournisseur", "Carburant", "Autre dépense"];
const COMPTES = ["Caisse", "Banque CIH", "Banque Attijariwafa", "Banque BMCE", "Banque Populaire"];

export default function NouvelleOperationPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState<"ENTREE" | "SORTIE">("ENTREE");
  const [form, setForm] = useState({
    categorie: "", libelle: "", montant: "",
    date: new Date().toISOString().split("T")[0],
    compte: "Caisse", reference: "", notes: "",
  });

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm({ ...form, [k]: e.target.value });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/journal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, type, montant: parseFloat(form.montant), date: new Date(form.date) }),
      });
      if (res.ok) { router.push("/journal"); router.refresh(); }
    } finally { setLoading(false); }
  }

  const cats = type === "ENTREE" ? CATEGORIES_ENTREE : CATEGORIES_SORTIE;

  return (
    <div className="flex flex-col flex-1">
      <Header title="Nouvelle opération" />
      <div className="flex-1 p-6 max-w-xl">
        <Card>
          <CardHeader><CardTitle>Saisir une opération de caisse / banque</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Type toggle */}
              <div>
                <label className="text-xs font-medium text-[#6b7280] uppercase tracking-wide block mb-2">Type d'opération</label>
                <div className="flex gap-2">
                  {(["ENTREE", "SORTIE"] as const).map((t) => (
                    <button key={t} type="button" onClick={() => setType(t)}
                      className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition ${
                        type === t
                          ? t === "ENTREE" ? "bg-[#edfaf4] text-[#10b981] border-2 border-[#a7f0c8]" : "bg-[#fff1f3] text-[#f43f5e] border-2 border-[#fda4b0]"
                          : "bg-[#f8f9fc] text-[#9ca3af] border-2 border-transparent"
                      }`}
                    >
                      {t === "ENTREE" ? "↑ Entrée" : "↓ Sortie"}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-[#6b7280] uppercase tracking-wide block mb-1">Catégorie</label>
                <select value={form.categorie} onChange={set("categorie")} required
                  className="w-full px-3 py-2.5 bg-[#f8f9fc] border border-[#e8eaf0] rounded-xl text-sm text-[#1e2433] focus:outline-none focus:ring-2 focus:ring-[#c7d7fd]">
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
                <select value={form.compte} onChange={set("compte")}
                  className="w-full px-3 py-2.5 bg-[#f8f9fc] border border-[#e8eaf0] rounded-xl text-sm text-[#1e2433] focus:outline-none focus:ring-2 focus:ring-[#c7d7fd]">
                  {COMPTES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>

              <Input label="Référence (facture, bon…)" value={form.reference} onChange={set("reference")} placeholder="ex: FAC-202506-1234" />

              <div className="flex gap-3 pt-2">
                <Button type="submit" disabled={loading}>{loading ? "Enregistrement…" : "Enregistrer"}</Button>
                <Button type="button" variant="outline" onClick={() => router.back()}>Annuler</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
