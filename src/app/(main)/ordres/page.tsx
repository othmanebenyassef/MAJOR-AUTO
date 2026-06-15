"use client";

import { Header } from "@/components/layout/Header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { ClipboardList, Plus } from "lucide-react";
import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { formatDate, STATUT_ORDRE_LABELS, parseServices, SERVICES } from "@/lib/utils";

type Ordre = { id: string; numero: string; statut: string; dateEntree: string; typeService: string; vehicule: { marque: string; modele: string; immatriculation: string; client: { prenom: string; nom: string } }; technicien: { prenom: string; nom: string } | null };

const badgeVariant: Record<string, "default" | "success" | "warning" | "danger" | "info"> = { EN_ATTENTE: "warning", EN_COURS: "info", EN_PAUSE: "default", TERMINE: "success", LIVRE: "success" };
const emptyForm = { vehiculeId: "", technicienId: "", description: "", kilometrage: "", services: [] as string[] };

export default function OrdresPage() {
  const [ordres, setOrdres] = useState<Ordre[]>([]);
  const [vehicules, setVehicules] = useState<{ id: string; immatriculation: string; marque: string; modele: string; client: { prenom: string; nom: string } }[]>([]);
  const [techniciens, setTechniciens] = useState<{ id: string; prenom: string; nom: string }[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);

  const load = useCallback(() =>
    fetch("/api/ordres").then(r => r.json()).then(setOrdres), []);

  useEffect(() => {
    load();
    fetch("/api/vehicules").then(r => r.json()).then(setVehicules);
    fetch("/api/personnel").then(r => r.json()).then(setTechniciens);
  }, [load]);

  function toggleService(s: string) {
    setForm(f => ({ ...f, services: f.services.includes(s) ? f.services.filter(x => x !== s) : [...f.services, s] }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (form.services.length === 0) return alert("Sélectionnez au moins un service");
    setLoading(true);
    try {
      const res = await fetch("/api/ordres", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, kilometrage: form.kilometrage ? parseInt(form.kilometrage) : null }),
      });
      if (res.ok) {
        const data = await res.json();
        setOpen(false); setForm(emptyForm); load();
        window.location.href = `/ordres/${data.id}`;
      }
    } finally { setLoading(false); }
  }

  return (
    <div className="flex flex-col flex-1">
      <Header title="Ordres de réparation" subtitle={`${ordres.length} ordre(s) au total`} />
      <div className="flex-1 p-6">
        <div className="flex justify-end mb-6">
          <button onClick={() => setOpen(true)} className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700">
            <Plus className="w-4 h-4" /> Nouvel ordre
          </button>
        </div>

        {ordres.length === 0 ? (
          <Card><CardContent className="py-16 text-center">
            <ClipboardList className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p className="text-gray-500">Aucun ordre de réparation</p>
          </CardContent></Card>
        ) : (
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-xs text-gray-500 border-b border-gray-100 bg-gray-50">
                    <th className="text-left px-6 py-3 font-medium">Numéro</th>
                    <th className="text-left px-6 py-3 font-medium">Client</th>
                    <th className="text-left px-6 py-3 font-medium">Véhicule</th>
                    <th className="text-left px-6 py-3 font-medium">Services</th>
                    <th className="text-left px-6 py-3 font-medium">Technicien</th>
                    <th className="text-left px-6 py-3 font-medium">Entrée</th>
                    <th className="text-left px-6 py-3 font-medium">Statut</th>
                    <th className="text-left px-6 py-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {ordres.map(o => (
                    <tr key={o.id} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="px-6 py-3 font-mono text-sm font-bold text-blue-600">{o.numero}</td>
                      <td className="px-6 py-3 text-sm">{o.vehicule.client.prenom} {o.vehicule.client.nom}</td>
                      <td className="px-6 py-3 text-sm text-gray-600">{o.vehicule.marque} {o.vehicule.modele}<br /><span className="font-mono text-xs">{o.vehicule.immatriculation}</span></td>
                      <td className="px-6 py-3">
                        <div className="flex flex-wrap gap-1">
                          {parseServices(o.typeService).slice(0, 2).map(s => <span key={s} className="text-xs bg-gray-100 text-gray-700 px-1.5 py-0.5 rounded">{s}</span>)}
                          {parseServices(o.typeService).length > 2 && <span className="text-xs text-gray-400">+{parseServices(o.typeService).length - 2}</span>}
                        </div>
                      </td>
                      <td className="px-6 py-3 text-sm text-gray-600">{o.technicien ? `${o.technicien.prenom} ${o.technicien.nom}` : "-"}</td>
                      <td className="px-6 py-3 text-sm text-gray-600">{formatDate(o.dateEntree)}</td>
                      <td className="px-6 py-3"><Badge variant={badgeVariant[o.statut]}>{STATUT_ORDRE_LABELS[o.statut]}</Badge></td>
                      <td className="px-6 py-3"><Link href={`/ordres/${o.id}`} className="text-sm text-blue-600 hover:underline">Voir</Link></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title="Nouvel ordre de réparation">
        <form onSubmit={handleSubmit} className="space-y-5">
          <Select label="Véhicule *" required value={form.vehiculeId} onChange={e => setForm({ ...form, vehiculeId: e.target.value })}
            options={[{ value: "", label: "Sélectionner un véhicule..." }, ...vehicules.map(v => ({ value: v.id, label: `${v.immatriculation} — ${v.marque} ${v.modele} (${v.client.prenom} ${v.client.nom})` }))]} />
          <div>
            <label className="text-xs font-medium text-[#6b7280] uppercase tracking-wide block mb-2">Types de service *</label>
            <div className="flex flex-wrap gap-2">
              {SERVICES.map(s => (
                <button key={s} type="button" onClick={() => toggleService(s)} className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${form.services.includes(s) ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-600 border-gray-300 hover:border-blue-400"}`}>{s}</button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Select label="Technicien" value={form.technicienId} onChange={e => setForm({ ...form, technicienId: e.target.value })}
              options={[{ value: "", label: "Non assigné" }, ...techniciens.map(t => ({ value: t.id, label: `${t.prenom} ${t.nom}` }))]} />
            <Input label="Kilométrage à l'entrée" type="number" value={form.kilometrage} onChange={e => setForm({ ...form, kilometrage: e.target.value })} />
          </div>
          <div>
            <label className="text-xs font-medium text-[#6b7280] uppercase tracking-wide block mb-1">Description / Observations</label>
            <textarea rows={3} className="w-full px-3 py-2.5 bg-[#f8f9fc] border border-[#e8eaf0] rounded-xl text-sm text-[#1e2433] focus:outline-none focus:ring-2 focus:ring-[#c7d7fd]" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Décrivez les travaux à effectuer..." />
          </div>
          <div className="flex gap-3 pt-2">
            <Button type="submit" disabled={loading}>{loading ? "Création..." : "Créer l'ordre"}</Button>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Annuler</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
