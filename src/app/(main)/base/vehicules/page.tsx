"use client";

import { Header } from "@/components/layout/Header";
import { PageTable } from "@/components/ui/page-table";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Car } from "lucide-react";
import Link from "next/link";
import { useState, useEffect, useCallback } from "react";

type Vehicule = { id: string; immatriculation: string; marque: string; modele: string; annee: number; couleur: string | null; carburant: string | null; client: { id: string; prenom: string; nom: string }; _count: { ordres: number } };
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

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setForm({ ...form, [k]: e.target.value });

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

  return (
    <div className="flex flex-col flex-1">
      <Header title="Véhicules" subtitle={`${vehicules.length} véhicule(s)`} />
      <div className="flex-1 p-6">
        <PageTable
          rows={vehicules} getKey={v => v.id}
          onAdd={() => setOpen(true)} addLabel="Nouveau véhicule"
          emptyIcon={<Car className="w-6 h-6 text-[#9ca3af]" />}
          emptyText="Aucun véhicule"
          columns={[
            { key: "immatriculation", label: "Immatriculation", render: v => <span className="font-mono font-bold text-[#1e2433]">{v.immatriculation}</span> },
            { key: "marque", label: "Marque / Modèle", render: v => <><div className="font-medium text-[#1e2433]">{v.marque} {v.modele}</div><div className="text-xs text-[#9ca3af]">{v.annee} · {v.couleur ?? "—"}</div></> },
            { key: "carburant", label: "Carburant", render: v => <span className="text-[#6b7280]">{v.carburant ?? "—"}</span> },
            { key: "client", label: "Propriétaire", render: v => <Link href={`/base/clients/${v.client.id}`} className="text-[#3b82f6] hover:underline">{v.client.prenom} {v.client.nom}</Link> },
            { key: "ordres", label: "Interventions", render: v => <span className="font-medium">{v._count.ordres}</span> },
            { key: "actions", label: "", render: v => <div className="flex gap-3"><Link href={`/base/vehicules/${v.id}`} className="text-[#3b82f6] hover:underline text-xs font-medium">Voir →</Link><Link href={`/documents/ordres/nouveau?vehiculeId=${v.id}`} className="text-[#10b981] hover:underline text-xs font-medium">+ Ordre</Link></div> },
          ]}
        />
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
