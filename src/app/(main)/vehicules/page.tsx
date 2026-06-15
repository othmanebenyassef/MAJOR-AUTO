"use client";

import { Header } from "@/components/layout/Header";
import { Card, CardContent } from "@/components/ui/card";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Car, Plus } from "lucide-react";
import Link from "next/link";
import { useState, useEffect, useCallback } from "react";

type Vehicule = { id: string; immatriculation: string; marque: string; modele: string; annee: number; client: { id: string; prenom: string; nom: string }; _count: { ordres: number } };

const emptyForm = { immatriculation: "", marque: "", modele: "", annee: new Date().getFullYear().toString(), couleur: "", kilometrage: "", vin: "", carburant: "Essence", clientId: "" };

export default function VehiculesPage() {
  const [vehicules, setVehicules] = useState<Vehicule[]>([]);
  const [clients, setClients] = useState<{ id: string; prenom: string; nom: string }[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);

  const load = useCallback(() =>
    fetch("/api/vehicules", { cache: "no-store" }).then(r => r.json()).then(setVehicules), []);

  useEffect(() => {
    load();
    fetch("/api/clients", { cache: "no-store" }).then(r => r.json()).then(setClients);
  }, [load]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/vehicules", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, annee: parseInt(form.annee), kilometrage: form.kilometrage ? parseInt(form.kilometrage) : null }),
      });
      if (res.ok) { setOpen(false); setForm(emptyForm); load(); }
    } finally { setLoading(false); }
  }

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setForm({ ...form, [k]: e.target.value });

  return (
    <div className="flex flex-col flex-1">
      <Header title="Véhicules" subtitle={`${vehicules.length} véhicule(s) enregistré(s)`} />
      <div className="flex-1 p-6">
        <div className="flex justify-end mb-6">
          <button onClick={() => setOpen(true)} className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
            <Plus className="w-4 h-4" /> Nouveau véhicule
          </button>
        </div>

        {vehicules.length === 0 ? (
          <Card><CardContent className="py-16 text-center">
            <Car className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p className="text-gray-500">Aucun véhicule enregistré</p>
          </CardContent></Card>
        ) : (
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-xs text-gray-500 border-b border-gray-100 bg-gray-50">
                    <th className="text-left px-6 py-3 font-medium">Immatriculation</th>
                    <th className="text-left px-6 py-3 font-medium">Marque / Modèle</th>
                    <th className="text-left px-6 py-3 font-medium">Année</th>
                    <th className="text-left px-6 py-3 font-medium">Client</th>
                    <th className="text-left px-6 py-3 font-medium">Interventions</th>
                    <th className="text-left px-6 py-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {vehicules.map((v) => (
                    <tr key={v.id} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="px-6 py-3 font-mono text-sm font-bold text-gray-900">{v.immatriculation}</td>
                      <td className="px-6 py-3 text-sm">{v.marque} {v.modele}</td>
                      <td className="px-6 py-3 text-sm text-gray-600">{v.annee}</td>
                      <td className="px-6 py-3 text-sm">
                        <Link href={`/clients/${v.client.id}`} className="text-blue-600 hover:underline">{v.client.prenom} {v.client.nom}</Link>
                      </td>
                      <td className="px-6 py-3 text-sm text-gray-600">{v._count.ordres}</td>
                      <td className="px-6 py-3">
                        <Link href={`/vehicules/${v.id}`} className="text-sm text-blue-600 hover:underline mr-3">Voir</Link>
                        <Link href={`/ordres/nouveau?vehiculeId=${v.id}`} className="text-sm text-green-600 hover:underline">+ Ordre</Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title="Nouveau véhicule">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Select label="Client *" required value={form.clientId} onChange={set("clientId")}
            options={[{ value: "", label: "Sélectionner un client..." }, ...clients.map(c => ({ value: c.id, label: `${c.prenom} ${c.nom}` }))]} />
          <Input label="Immatriculation *" required placeholder="ex: 12345-A-1" value={form.immatriculation} onChange={e => setForm({ ...form, immatriculation: e.target.value.toUpperCase() })} />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Marque *" required value={form.marque} onChange={set("marque")} />
            <Input label="Modèle *" required value={form.modele} onChange={set("modele")} />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <Input label="Année" type="number" value={form.annee} onChange={set("annee")} />
            <Input label="Couleur" value={form.couleur} onChange={set("couleur")} />
            <Select label="Carburant" value={form.carburant} onChange={set("carburant")}
              options={["Essence", "Diesel", "Hybride", "Électrique", "GPL"].map(v => ({ value: v, label: v }))} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Kilométrage" type="number" value={form.kilometrage} onChange={set("kilometrage")} />
            <Input label="N° VIN" value={form.vin} onChange={set("vin")} />
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
