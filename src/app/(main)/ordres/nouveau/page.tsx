"use client";

import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { SERVICES } from "@/lib/utils";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function NouvelOrdreForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [vehicules, setVehicules] = useState<{ id: string; immatriculation: string; marque: string; modele: string; client: { prenom: string; nom: string } }[]>([]);
  const [techniciens, setTechniciens] = useState<{ id: string; prenom: string; nom: string }[]>([]);
  const [form, setForm] = useState({
    vehiculeId: searchParams.get("vehiculeId") || "",
    technicienId: "",
    description: "",
    kilometrage: "",
    services: [] as string[],
  });

  useEffect(() => {
    fetch("/api/vehicules").then((r) => r.json()).then(setVehicules);
    fetch("/api/personnel").then((r) => r.json()).then(setTechniciens);
  }, []);

  function toggleService(s: string) {
    setForm((f) => ({
      ...f,
      services: f.services.includes(s) ? f.services.filter((x) => x !== s) : [...f.services, s],
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (form.services.length === 0) return alert("Sélectionnez au moins un service");
    setLoading(true);
    try {
      const res = await fetch("/api/ordres", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          kilometrage: form.kilometrage ? parseInt(form.kilometrage) : null,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        router.push(`/ordres/${data.id}`);
        router.refresh();
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col flex-1">
      <Header title="Nouvel ordre de réparation" />
      <div className="flex-1 p-6 max-w-3xl">
        <Card>
          <CardHeader><CardTitle>Informations de l'intervention</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              <Select
                label="Véhicule *"
                required
                value={form.vehiculeId}
                onChange={(e) => setForm({ ...form, vehiculeId: e.target.value })}
                options={[
                  { value: "", label: "Sélectionner un véhicule..." },
                  ...vehicules.map((v) => ({
                    value: v.id,
                    label: `${v.immatriculation} — ${v.marque} ${v.modele} (${v.client.prenom} ${v.client.nom})`,
                  })),
                ]}
              />

              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">Types de service *</label>
                <div className="flex flex-wrap gap-2">
                  {SERVICES.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => toggleService(s)}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                        form.services.includes(s)
                          ? "bg-blue-600 text-white border-blue-600"
                          : "bg-white text-gray-600 border-gray-300 hover:border-blue-400"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Select
                  label="Technicien"
                  value={form.technicienId}
                  onChange={(e) => setForm({ ...form, technicienId: e.target.value })}
                  options={[
                    { value: "", label: "Non assigné" },
                    ...techniciens.map((t) => ({ value: t.id, label: `${t.prenom} ${t.nom}` })),
                  ]}
                />
                <Input
                  label="Kilométrage à l'entrée"
                  type="number"
                  value={form.kilometrage}
                  onChange={(e) => setForm({ ...form, kilometrage: e.target.value })}
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Description / Observations</label>
                <textarea
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Décrivez les travaux à effectuer..."
                />
              </div>

              <div className="flex gap-3 pt-2">
                <Button type="submit" disabled={loading}>
                  {loading ? "Création..." : "Créer l'ordre"}
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

export default function NouvelOrdrePage() {
  return (
    <Suspense>
      <NouvelOrdreForm />
    </Suspense>
  );
}
