"use client";

import { Header } from "@/components/layout/Header";
import { PageTable } from "@/components/ui/page-table";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Truck } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { formatDate, STATUT_LIVRAISON_LABELS } from "@/lib/utils";

type Livraison = { id: string; numero: string; clientNom: string; clientTel: string; vehiculeInfo: string; adresse: string; datePrevu: string; statut: string };

const badge: Record<string, "default" | "success" | "warning" | "info" | "danger"> = { EN_ATTENTE: "warning", EN_COURS: "info", LIVRE: "success", ANNULE: "danger" };
const emptyForm = { clientNom: "", clientTel: "", adresse: "", vehiculeInfo: "", datePrevu: "", notes: "" };

export default function LivraisonsPage() {
  const [livraisons, setLivraisons] = useState<Livraison[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);

  const load = useCallback(() =>
    fetch("/api/livraisons", { cache: "no-store" }).then(r => r.json()).then(setLivraisons), []);

  useEffect(() => { load(); }, [load]);

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setForm({ ...form, [k]: e.target.value });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/livraisons", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, datePrevu: new Date(form.datePrevu) }),
      });
      if (res.ok) { setOpen(false); setForm(emptyForm); load(); }
    } finally { setLoading(false); }
  }

  return (
    <div className="flex flex-col flex-1">
      <Header title="Livraisons" subtitle={`${livraisons.length} livraison(s)`} />
      <div className="flex-1 p-6">
        <PageTable
          rows={livraisons} getKey={l => l.id}
          onAdd={() => setOpen(true)} addLabel="Nouvelle livraison"
          emptyIcon={<Truck className="w-6 h-6 text-[#9ca3af]" />}
          emptyText="Aucune livraison"
          columns={[
            { key: "numero", label: "Numéro", render: l => <span className="font-mono font-bold text-[#3b82f6]">{l.numero}</span> },
            { key: "client", label: "Client", render: l => <><div className="font-medium text-[#1e2433]">{l.clientNom}</div><div className="text-xs text-[#9ca3af]">{l.clientTel}</div></> },
            { key: "vehicule", label: "Véhicule", render: l => <span className="text-[#6b7280]">{l.vehiculeInfo}</span> },
            { key: "adresse", label: "Adresse", render: l => <span className="text-[#6b7280] max-w-xs truncate block">{l.adresse}</span> },
            { key: "datePrevu", label: "Date prévue", render: l => <span className="text-[#6b7280]">{formatDate(l.datePrevu)}</span> },
            { key: "statut", label: "Statut", render: l => <Badge variant={badge[l.statut]}>{STATUT_LIVRAISON_LABELS[l.statut]}</Badge> },
          ]}
        />
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title="Nouvelle livraison">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input label="Nom du client *" required value={form.clientNom} onChange={set("clientNom")} />
            <Input label="Téléphone *" required value={form.clientTel} onChange={set("clientTel")} />
          </div>
          <Input label="Véhicule *" required placeholder="ex: Toyota Corolla — 54321-B-2" value={form.vehiculeInfo} onChange={set("vehiculeInfo")} />
          <Input label="Adresse de livraison *" required value={form.adresse} onChange={set("adresse")} />
          <Input label="Date de livraison prévue *" required type="datetime-local" value={form.datePrevu} onChange={set("datePrevu")} />
          <div>
            <label className="text-xs font-medium text-[#6b7280] uppercase tracking-wide block mb-1">Notes</label>
            <textarea rows={2} className="w-full px-3 py-2.5 bg-[#f8f9fc] border border-[#e8eaf0] rounded-xl text-sm text-[#1e2433] focus:outline-none focus:ring-2 focus:ring-[#c7d7fd]" value={form.notes} onChange={set("notes")} />
          </div>
          <div className="flex gap-3 pt-2">
            <Button type="submit" disabled={loading}>{loading ? "Création..." : "Créer la livraison"}</Button>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Annuler</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
