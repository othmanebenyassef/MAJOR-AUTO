"use client";

import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NouvelleLivraisonPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    clientNom: "", clientTel: "", adresse: "",
    vehiculeInfo: "", datePrevu: "", notes: "",
  });

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm({ ...form, [k]: e.target.value });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/livraisons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, datePrevu: new Date(form.datePrevu) }),
      });
      if (res.ok) { router.push("/livraisons"); router.refresh(); }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col flex-1">
      <Header title="Nouvelle livraison" />
      <div className="flex-1 p-6 max-w-xl">
        <Card>
          <CardHeader><CardTitle>Informations livraison</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input label="Nom du client *" required value={form.clientNom} onChange={set("clientNom")} />
                <Input label="Téléphone *" required value={form.clientTel} onChange={set("clientTel")} />
              </div>
              <Input label="Véhicule *" required placeholder="ex: Toyota Corolla — 54321-B-2" value={form.vehiculeInfo} onChange={set("vehiculeInfo")} />
              <Input label="Adresse de livraison *" required value={form.adresse} onChange={set("adresse")} />
              <Input label="Date de livraison prévue *" required type="datetime-local" value={form.datePrevu} onChange={set("datePrevu")} />
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Notes</label>
                <textarea
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={form.notes}
                  onChange={set("notes")}
                />
              </div>
              <div className="flex gap-3 pt-2">
                <Button type="submit" disabled={loading}>{loading ? "Création..." : "Créer la livraison"}</Button>
                <Button type="button" variant="outline" onClick={() => router.back()}>Annuler</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
