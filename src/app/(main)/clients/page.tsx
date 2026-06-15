"use client";

import { Header } from "@/components/layout/Header";
import { Card, CardContent } from "@/components/ui/card";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Users, Phone, Mail, Car, Plus } from "lucide-react";
import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { formatDate } from "@/lib/utils";

type Client = { id: string; prenom: string; nom: string; telephone: string; email: string | null; createdAt: string; _count: { vehicules: number } };

const emptyForm = { nom: "", prenom: "", telephone: "", email: "", adresse: "" };

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);

  const load = useCallback(() =>
    fetch("/api/clients", { cache: "no-store" }).then(r => r.json()).then(setClients), []);

  useEffect(() => { load(); }, [load]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/clients", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      if (res.ok) { setOpen(false); setForm(emptyForm); load(); }
    } finally { setLoading(false); }
  }

  return (
    <div className="flex flex-col flex-1">
      <Header title="Clients" subtitle={`${clients.length} client(s) enregistré(s)`} />
      <div className="flex-1 p-6">
        <div className="flex justify-between items-center mb-6">
          <div />
          <button onClick={() => setOpen(true)} className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
            <Plus className="w-4 h-4" /> Nouveau client
          </button>
        </div>

        {clients.length === 0 ? (
          <Card><CardContent className="py-16 text-center">
            <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p className="text-gray-500">Aucun client enregistré</p>
          </CardContent></Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {clients.map((client) => (
              <Link key={client.id} href={`/clients/${client.id}`}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="pt-5">
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-700 font-bold text-sm">{client.prenom[0]}{client.nom[0]}</span>
                      </div>
                      <span className="text-xs text-gray-400">{formatDate(client.createdAt)}</span>
                    </div>
                    <h3 className="font-semibold text-gray-900">{client.prenom} {client.nom}</h3>
                    <div className="mt-2 space-y-1">
                      <div className="flex items-center gap-2 text-sm text-gray-500"><Phone className="w-3.5 h-3.5" />{client.telephone}</div>
                      {client.email && <div className="flex items-center gap-2 text-sm text-gray-500"><Mail className="w-3.5 h-3.5" />{client.email}</div>}
                      <div className="flex items-center gap-2 text-sm text-gray-500"><Car className="w-3.5 h-3.5" />{client._count.vehicules} véhicule(s)</div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title="Nouveau client">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input label="Prénom *" required value={form.prenom} onChange={e => setForm({ ...form, prenom: e.target.value })} />
            <Input label="Nom *" required value={form.nom} onChange={e => setForm({ ...form, nom: e.target.value })} />
          </div>
          <Input label="Téléphone *" required value={form.telephone} onChange={e => setForm({ ...form, telephone: e.target.value })} />
          <Input label="Email" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
          <Input label="Adresse" value={form.adresse} onChange={e => setForm({ ...form, adresse: e.target.value })} />
          <div className="flex gap-3 pt-2">
            <Button type="submit" disabled={loading}>{loading ? "Enregistrement..." : "Enregistrer"}</Button>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Annuler</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
