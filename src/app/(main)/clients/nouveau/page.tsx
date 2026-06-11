"use client";

import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NouveauClientPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    nom: "", prenom: "", telephone: "", email: "", adresse: "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        router.push("/clients");
        router.refresh();
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col flex-1">
      <Header title="Nouveau client" subtitle="Ajouter un nouveau client" />
      <div className="flex-1 p-6 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Informations client</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Prénom *"
                  required
                  value={form.prenom}
                  onChange={(e) => setForm({ ...form, prenom: e.target.value })}
                />
                <Input
                  label="Nom *"
                  required
                  value={form.nom}
                  onChange={(e) => setForm({ ...form, nom: e.target.value })}
                />
              </div>
              <Input
                label="Téléphone *"
                required
                value={form.telephone}
                onChange={(e) => setForm({ ...form, telephone: e.target.value })}
              />
              <Input
                label="Email"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
              <Input
                label="Adresse"
                value={form.adresse}
                onChange={(e) => setForm({ ...form, adresse: e.target.value })}
              />
              <div className="flex gap-3 pt-2">
                <Button type="submit" disabled={loading}>
                  {loading ? "Enregistrement..." : "Enregistrer"}
                </Button>
                <Button type="button" variant="outline" onClick={() => router.back()}>
                  Annuler
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
