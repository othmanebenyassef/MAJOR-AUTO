"use client";

import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function NouveauVehiculeForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [clients, setClients] = useState<{ id: string; nom: string; prenom: string }[]>([]);
  const [form, setForm] = useState({
    immatriculation: "",
    marque: "",
    modele: "",
    annee: new Date().getFullYear().toString(),
    couleur: "",
    kilometrage: "",
    vin: "",
    carburant: "Essence",
    clientId: searchParams.get("clientId") || "",
  });

  useEffect(() => {
    fetch("/api/clients").then((r) => r.json()).then(setClients);
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/vehicules", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, annee: parseInt(form.annee), kilometrage: form.kilometrage ? parseInt(form.kilometrage) : null }),
      });
      if (res.ok) {
        router.push("/vehicules");
        router.refresh();
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col flex-1">
      <Header title="Nouveau véhicule" />
      <div className="flex-1 p-6 max-w-2xl">
        <Card>
          <CardHeader><CardTitle>Informations du véhicule</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Select
                label="Client *"
                required
                value={form.clientId}
                onChange={(e) => setForm({ ...form, clientId: e.target.value })}
                options={[
                  { value: "", label: "Sélectionner un client..." },
                  ...clients.map((c) => ({ value: c.id, label: `${c.prenom} ${c.nom}` })),
                ]}
              />
              <Input
                label="Immatriculation *"
                required
                placeholder="ex: 12345-A-1"
                value={form.immatriculation}
                onChange={(e) => setForm({ ...form, immatriculation: e.target.value.toUpperCase() })}
              />
              <div className="grid grid-cols-2 gap-4">
                <Input label="Marque *" required value={form.marque} onChange={(e) => setForm({ ...form, marque: e.target.value })} />
                <Input label="Modèle *" required value={form.modele} onChange={(e) => setForm({ ...form, modele: e.target.value })} />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <Input label="Année" type="number" value={form.annee} onChange={(e) => setForm({ ...form, annee: e.target.value })} />
                <Input label="Couleur" value={form.couleur} onChange={(e) => setForm({ ...form, couleur: e.target.value })} />
                <Select
                  label="Carburant"
                  value={form.carburant}
                  onChange={(e) => setForm({ ...form, carburant: e.target.value })}
                  options={["Essence", "Diesel", "Hybride", "Électrique", "GPL"].map((v) => ({ value: v, label: v }))}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input label="Kilométrage" type="number" value={form.kilometrage} onChange={(e) => setForm({ ...form, kilometrage: e.target.value })} />
                <Input label="N° VIN" value={form.vin} onChange={(e) => setForm({ ...form, vin: e.target.value })} />
              </div>
              <div className="flex gap-3 pt-2">
                <Button type="submit" disabled={loading}>
                  {loading ? "Enregistrement..." : "Enregistrer"}
                </Button>
                <Button type="button" variant="outline" onClick={() => router.back()}>Annuler</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function NouveauVehiculePage() {
  return (
    <Suspense>
      <NouveauVehiculeForm />
    </Suspense>
  );
}
