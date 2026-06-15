"use client";

import { Header } from "@/components/layout/Header";
import { PageTable } from "@/components/ui/page-table";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DateSelect } from "@/components/ui/date-select";
import { UserCog } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { formatCurrency } from "@/lib/utils";

type Personnel = { id: string; prenom: string; nom: string; poste: string; telephone: string | null; salaire: number | null; actif: boolean; _count: { ordres: number } };
const POSTES = ["Mécanicien", "Carrossier", "Électricien auto", "Peintre", "Technicien diagnostic", "Réceptionniste", "Gérant"];
const emptyForm = { nom: "", prenom: "", poste: "", telephone: "", email: "", salaire: "", dateEmbauche: "" };

export default function PersonnelPage() {
  const [personnel, setPersonnel] = useState<Personnel[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);

  const load = useCallback(() =>
    fetch("/api/personnel").then(r => r.json()).then(setPersonnel), []);

  useEffect(() => { load(); }, [load]);

  const masseSalariale = personnel.filter(p => p.actif && p.salaire).reduce((s, p) => s + (p.salaire ?? 0), 0);
  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setForm({ ...form, [k]: e.target.value });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/personnel", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, salaire: form.salaire ? parseFloat(form.salaire) : null, dateEmbauche: form.dateEmbauche ? new Date(form.dateEmbauche) : null }),
      });
      if (res.ok) { setOpen(false); setForm(emptyForm); load(); }
    } finally { setLoading(false); }
  }

  return (
    <div className="flex flex-col flex-1">
      <Header title="Personnel" subtitle={`${personnel.filter(p => p.actif).length} actif(s) · Masse salariale : ${formatCurrency(masseSalariale)}`} />
      <div className="flex-1 p-6">
        <PageTable
          rows={personnel} getKey={p => p.id}
          onAdd={() => setOpen(true)} addLabel="Nouvel employé"
          emptyIcon={<UserCog className="w-6 h-6 text-[#9ca3af]" />}
          emptyText="Aucun employé"
          columns={[
            { key: "nom", label: "Employé", render: p => <><div className="font-medium text-[#1e2433]">{p.prenom} {p.nom}</div><div className="text-xs text-[#3b82f6]">{p.poste}</div></> },
            { key: "telephone", label: "Téléphone", render: p => <span className="text-[#6b7280]">{p.telephone ?? "—"}</span> },
            { key: "salaire", label: "Salaire", render: p => <span className="font-medium">{p.salaire ? formatCurrency(p.salaire) : "—"}</span> },
            { key: "ordres", label: "Interventions", render: p => <span className="font-medium">{p._count.ordres}</span> },
            { key: "actif", label: "Statut", render: p => <Badge variant={p.actif ? "success" : "default"}>{p.actif ? "Actif" : "Inactif"}</Badge> },
          ]}
        />
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title="Nouvel employé">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input label="Prénom *" required value={form.prenom} onChange={set("prenom")} />
            <Input label="Nom *" required value={form.nom} onChange={set("nom")} />
          </div>
          <div>
            <label className="text-xs font-medium text-[#6b7280] uppercase tracking-wide block mb-1">Poste *</label>
            <select required className="w-full px-3 py-2.5 bg-[#f8f9fc] border border-[#e8eaf0] rounded-xl text-sm text-[#1e2433] focus:outline-none focus:ring-2 focus:ring-[#c7d7fd] focus:border-[#3b82f6]" value={form.poste} onChange={set("poste")}>
              <option value="">Sélectionner...</option>
              {POSTES.map(p => <option key={p}>{p}</option>)}
            </select>
          </div>
          <Input label="Téléphone" value={form.telephone} onChange={set("telephone")} />
          <Input label="Email" type="email" value={form.email} onChange={set("email")} />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Salaire mensuel (MAD)" type="number" step="0.01" value={form.salaire} onChange={set("salaire")} />
            <DateSelect label="Date d'embauche" value={form.dateEmbauche} onChange={val => setForm({ ...form, dateEmbauche: val })} />
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
