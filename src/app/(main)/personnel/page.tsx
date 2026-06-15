"use client";

import { Header } from "@/components/layout/Header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DateSelect } from "@/components/ui/date-select";
import { UserCog, Plus, Phone, Mail } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { formatCurrency, formatDate } from "@/lib/utils";

type Personnel = { id: string; prenom: string; nom: string; poste: string; telephone: string | null; email: string | null; salaire: number | null; dateEmbauche: string | null; actif: boolean; _count: { ordres: number } };

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

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setForm({ ...form, [k]: e.target.value });

  return (
    <div className="flex flex-col flex-1">
      <Header title="Personnel" subtitle={`${personnel.filter(p => p.actif).length} employé(s) actif(s) — Masse salariale : ${formatCurrency(masseSalariale)}`} />
      <div className="flex-1 p-6">
        <div className="flex justify-end mb-6">
          <button onClick={() => setOpen(true)} className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700">
            <Plus className="w-4 h-4" /> Nouveau employé
          </button>
        </div>

        {personnel.length === 0 ? (
          <Card><CardContent className="py-16 text-center">
            <UserCog className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p className="text-gray-500">Aucun employé enregistré</p>
          </CardContent></Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {personnel.map((p) => (
              <Card key={p.id} className={!p.actif ? "opacity-60" : ""}>
                <CardContent className="pt-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                      <span className="text-purple-700 font-bold text-sm">{p.prenom[0]}{p.nom[0]}</span>
                    </div>
                    <Badge variant={p.actif ? "success" : "default"}>{p.actif ? "Actif" : "Inactif"}</Badge>
                  </div>
                  <h3 className="font-semibold text-gray-900">{p.prenom} {p.nom}</h3>
                  <p className="text-sm text-blue-600 font-medium">{p.poste}</p>
                  <div className="mt-2 space-y-1">
                    {p.telephone && <div className="flex items-center gap-2 text-sm text-gray-500"><Phone className="w-3.5 h-3.5" />{p.telephone}</div>}
                    {p.email && <div className="flex items-center gap-2 text-sm text-gray-500"><Mail className="w-3.5 h-3.5" />{p.email}</div>}
                    {p.salaire && <div className="text-sm text-gray-500">Salaire : {formatCurrency(p.salaire)}/mois</div>}
                    {p.dateEmbauche && <div className="text-xs text-gray-400">Embauché le {formatDate(p.dateEmbauche)}</div>}
                    <div className="text-xs text-gray-400">{p._count.ordres} intervention(s)</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
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
