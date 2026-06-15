"use client";

import { Header } from "@/components/layout/Header";
import { PageTable } from "@/components/ui/page-table";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Users } from "lucide-react";
import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { formatDate } from "@/lib/utils";

type Client = { id: string; prenom: string; nom: string; telephone: string; email: string | null; ville: string | null; createdAt: string; _count: { vehicules: number } };
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
      <Header title="Clients" subtitle={`${clients.length} client(s)`} />
      <div className="flex-1 p-6">
        <PageTable
          rows={clients} getKey={c => c.id}
          onAdd={() => setOpen(true)} addLabel="Nouveau client"
          emptyIcon={<Users className="w-6 h-6 text-[#9ca3af]" />}
          emptyText="Aucun client enregistré"
          columns={[
            { key: "nom", label: "Nom", render: c => <Link href={`/base/clients/${c.id}`} className="font-medium text-[#1e2433] hover:text-[#3b82f6]">{c.prenom} {c.nom}</Link> },
            { key: "telephone", label: "Téléphone", render: c => <span className="text-[#6b7280]">{c.telephone}</span> },
            { key: "email", label: "Email", render: c => <span className="text-[#6b7280]">{c.email ?? "—"}</span> },
            { key: "ville", label: "Ville", render: c => <span className="text-[#6b7280]">{c.ville ?? "—"}</span> },
            { key: "vehicules", label: "Véhicules", render: c => <span className="font-medium text-[#1e2433]">{c._count.vehicules}</span> },
            { key: "createdAt", label: "Depuis", render: c => <span className="text-[#9ca3af]">{formatDate(c.createdAt)}</span> },
            { key: "actions", label: "", render: c => <Link href={`/base/clients/${c.id}`} className="text-[#3b82f6] hover:underline text-xs font-medium">Voir →</Link> },
          ]}
        />
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
