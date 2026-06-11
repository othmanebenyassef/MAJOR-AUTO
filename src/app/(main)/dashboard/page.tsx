import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { prisma } from "@/lib/prisma";
import { formatCurrency, formatDate, STATUT_ORDRE_LABELS, parseServices } from "@/lib/utils";
import {
  Users, Car, ClipboardList, TrendingUp,
  AlertTriangle, Clock, Wrench, FileText,
  ArrowUpRight, ArrowDownRight,
} from "lucide-react";
import Link from "next/link";

async function getData() {
  const [clients, vehicules, ordresEnCours, ordresEnAttente, facturesImpayees, alertesStock,
    derniersOrdres, caThisMois, caLastMois] = await Promise.all([
    prisma.client.count(),
    prisma.vehicule.count(),
    prisma.ordreReparation.count({ where: { statut: "EN_COURS" } }),
    prisma.ordreReparation.count({ where: { statut: "EN_ATTENTE" } }),
    prisma.facture.count({ where: { statut: { in: ["EN_ATTENTE", "PARTIELLEMENT_PAYEE"] } } }),
    prisma.pieceDetachee.findMany({ where: { quantiteStock: { lte: 5 } } }),
    prisma.ordreReparation.findMany({
      take: 6, orderBy: { createdAt: "desc" },
      include: { vehicule: { include: { client: true } }, technicien: true },
    }),
    prisma.facture.aggregate({
      where: { statut: "PAYEE", datePaiement: { gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) } },
      _sum: { montantTTC: true },
    }),
    prisma.facture.aggregate({
      where: { statut: "PAYEE", datePaiement: { gte: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1), lt: new Date(new Date().getFullYear(), new Date().getMonth(), 1) } },
      _sum: { montantTTC: true },
    }),
  ]);

  return { clients, vehicules, ordresEnCours, ordresEnAttente, facturesImpayees,
    alertesStock: alertesStock.length, derniersOrdres,
    caThisMois: caThisMois._sum.montantTTC ?? 0, caLastMois: caLastMois._sum.montantTTC ?? 0 };
}

const statutBadge: Record<string, "default" | "success" | "warning" | "info"> = {
  EN_ATTENTE: "warning", EN_COURS: "info", EN_PAUSE: "default", TERMINE: "success", LIVRE: "success",
};

export default async function DashboardPage() {
  const d = await getData();
  const caEvol = d.caLastMois > 0 ? ((d.caThisMois - d.caLastMois) / d.caLastMois) * 100 : 0;

  const kpis = [
    { label: "C.A. ce mois", value: formatCurrency(d.caThisMois), sub: caEvol !== 0 ? `${caEvol > 0 ? "+" : ""}${caEvol.toFixed(1)}% vs mois dernier` : "Aucune donnée N-1", up: caEvol >= 0, icon: TrendingUp, pale: "bg-[#eef3ff]", color: "text-[#3b82f6]" },
    { label: "Clients", value: d.clients, icon: Users, pale: "bg-[#edfaf4]", color: "text-[#10b981]" },
    { label: "Véhicules", value: d.vehicules, icon: Car, pale: "bg-[#f5f3ff]", color: "text-[#8b5cf6]" },
    { label: "En cours", value: d.ordresEnCours, icon: Wrench, pale: "bg-[#fffbeb]", color: "text-[#f59e0b]" },
    { label: "En attente", value: d.ordresEnAttente, icon: Clock, pale: "bg-[#f0fdfa]", color: "text-[#14b8a6]" },
    { label: "Factures impayées", value: d.facturesImpayees, icon: FileText, pale: "bg-[#fff1f3]", color: "text-[#f43f5e]" },
  ];

  return (
    <div className="flex flex-col flex-1">
      <Header
        title="Tableau de bord"
        subtitle={new Date().toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
      />
      <div className="flex-1 p-6 space-y-6">

        {/* KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {kpis.map((k) => {
            const Icon = k.icon;
            return (
              <Card key={k.label} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-5 pb-4">
                  <div className={`w-9 h-9 ${k.pale} rounded-xl flex items-center justify-center mb-3`}>
                    <Icon className={`w-4 h-4 ${k.color}`} />
                  </div>
                  <p className="text-2xl font-bold text-[#1e2433]">{k.value}</p>
                  <p className="text-xs text-[#9ca3af] mt-1">{k.label}</p>
                  {"up" in k && k.sub && (
                    <p className={`text-xs mt-1 flex items-center gap-1 ${k.up ? "text-[#10b981]" : "text-[#f43f5e]"}`}>
                      {k.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                      {k.sub}
                    </p>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Derniers ordres */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Ordres de réparation récents</CardTitle>
                <Link href="/documents/ordres" className="text-xs text-[#3b82f6] hover:underline">Voir tout →</Link>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {d.derniersOrdres.length === 0 ? (
                <div className="px-6 py-10 text-center">
                  <ClipboardList className="w-8 h-8 mx-auto mb-2 text-[#e8eaf0]" />
                  <p className="text-sm text-[#9ca3af]">Aucun ordre pour l'instant</p>
                </div>
              ) : (
                <div className="divide-y divide-[#f0f2f7]">
                  {d.derniersOrdres.map((o) => (
                    <Link key={o.id} href={`/documents/ordres/${o.id}`} className="flex items-center gap-4 px-6 py-3.5 hover:bg-[#f8f9fc] transition-colors">
                      <div className="w-8 h-8 rounded-xl bg-[#eef3ff] flex items-center justify-center flex-shrink-0">
                        <Wrench className="w-4 h-4 text-[#3b82f6]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-[#1e2433] truncate">
                          {o.vehicule.client.prenom} {o.vehicule.client.nom}
                        </p>
                        <p className="text-xs text-[#9ca3af]">
                          {o.vehicule.marque} {o.vehicule.modele} · {o.numero}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <Badge variant={statutBadge[o.statut]}>{STATUT_ORDRE_LABELS[o.statut]}</Badge>
                        <span className="text-xs text-[#9ca3af]">{formatDate(o.dateEntree)}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Alertes + accès rapides */}
          <div className="space-y-4">
            {d.alertesStock > 0 && (
              <Card className="border-[#fda4b0]">
                <CardContent className="pt-4 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-[#fff1f3] flex items-center justify-center">
                      <AlertTriangle className="w-4 h-4 text-[#f43f5e]" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[#1e2433]">{d.alertesStock} alerte(s) stock</p>
                      <Link href="/base/stock" className="text-xs text-[#f43f5e] hover:underline">Voir le stock →</Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader><CardTitle>Actions rapides</CardTitle></CardHeader>
              <CardContent className="space-y-2 pt-3">
                {[
                  { href: "/documents/ordres/nouveau", label: "Nouvel ordre", color: "bg-[#eef3ff] text-[#3b82f6]" },
                  { href: "/documents/devis/nouveau",  label: "Nouveau devis",  color: "bg-[#edfaf4] text-[#10b981]" },
                  { href: "/documents/factures/nouvelle", label: "Nouvelle facture", color: "bg-[#fffbeb] text-[#f59e0b]" },
                  { href: "/base/clients/nouveau",     label: "Nouveau client", color: "bg-[#f5f3ff] text-[#8b5cf6]" },
                  { href: "/base/vehicules/nouveau",   label: "Nouveau véhicule", color: "bg-[#f0fdfa] text-[#14b8a6]" },
                  { href: "/journal/nouvelle",         label: "Entrée/sortie caisse", color: "bg-[#fff1f3] text-[#f43f5e]" },
                ].map((a) => (
                  <Link key={a.href} href={a.href}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl ${a.color} text-sm font-medium hover:opacity-90 transition`}
                  >
                    <span>→</span> {a.label}
                  </Link>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
