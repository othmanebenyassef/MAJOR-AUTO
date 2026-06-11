import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { prisma } from "@/lib/prisma";
import { formatCurrency, formatDate, STATUT_ORDRE_LABELS } from "@/lib/utils";
import {
  Users,
  Car,
  ClipboardList,
  TrendingUp,
  AlertTriangle,
  Clock,
  CheckCircle,
  Wrench,
} from "lucide-react";

async function getDashboardData() {
  const [
    totalClients,
    totalVehicules,
    ordresEnCours,
    ordresEnAttente,
    facturesMois,
    piecesCritiques,
    derniersOrdres,
    chiffreAffaireMois,
  ] = await Promise.all([
    prisma.client.count(),
    prisma.vehicule.count(),
    prisma.ordreReparation.count({ where: { statut: "EN_COURS" } }),
    prisma.ordreReparation.count({ where: { statut: "EN_ATTENTE" } }),
    prisma.facture.count({
      where: {
        statut: "EN_ATTENTE",
        dateEmission: { gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) },
      },
    }),
    prisma.pieceDetachee.count({
      where: { quantiteStock: { lte: prisma.pieceDetachee.fields.seuilAlerte } },
    }).catch(() => 0),
    prisma.ordreReparation.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { vehicule: { include: { client: true } } },
    }),
    prisma.facture.aggregate({
      where: {
        statut: "PAYEE",
        datePaiement: { gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) },
      },
      _sum: { montantTTC: true },
    }),
  ]);

  return {
    totalClients,
    totalVehicules,
    ordresEnCours,
    ordresEnAttente,
    facturesMois,
    piecesCritiques,
    derniersOrdres,
    chiffreAffaireMois: chiffreAffaireMois._sum.montantTTC ?? 0,
  };
}

const statutBadgeVariant: Record<string, "default" | "success" | "warning" | "danger" | "info"> = {
  EN_ATTENTE: "warning",
  EN_COURS: "info",
  EN_PAUSE: "default",
  TERMINE: "success",
  LIVRE: "success",
};

export default async function DashboardPage() {
  const data = await getDashboardData();

  const stats = [
    {
      title: "Chiffre d'affaires (mois)",
      value: formatCurrency(data.chiffreAffaireMois),
      icon: TrendingUp,
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      title: "Clients",
      value: data.totalClients.toString(),
      icon: Users,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      title: "Véhicules enregistrés",
      value: data.totalVehicules.toString(),
      icon: Car,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
    {
      title: "Ordres en cours",
      value: data.ordresEnCours.toString(),
      icon: Wrench,
      color: "text-orange-600",
      bg: "bg-orange-50",
    },
    {
      title: "En attente",
      value: data.ordresEnAttente.toString(),
      icon: Clock,
      color: "text-yellow-600",
      bg: "bg-yellow-50",
    },
    {
      title: "Factures impayées",
      value: data.facturesMois.toString(),
      icon: AlertTriangle,
      color: "text-red-600",
      bg: "bg-red-50",
    },
  ];

  return (
    <div className="flex flex-col flex-1">
      <Header
        title="Tableau de bord"
        subtitle={`Bonjour ! Voici l'état de votre garage aujourd'hui — ${new Date().toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}`}
      />
      <div className="flex-1 p-6 space-y-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.title}>
                <CardContent className="pt-4">
                  <div className={`w-10 h-10 ${stat.bg} rounded-lg flex items-center justify-center mb-3`}>
                    <Icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-xs text-gray-500 mt-1">{stat.title}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Derniers ordres */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Derniers ordres de réparation</CardTitle>
                <a href="/ordres" className="text-xs text-blue-600 hover:underline">Voir tout</a>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {data.derniersOrdres.length === 0 ? (
                <div className="px-6 py-8 text-center text-gray-500 text-sm">
                  <ClipboardList className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                  Aucun ordre de réparation
                </div>
              ) : (
                <table className="w-full">
                  <thead>
                    <tr className="text-xs text-gray-500 border-b border-gray-100">
                      <th className="text-left px-6 py-3 font-medium">Numéro</th>
                      <th className="text-left px-6 py-3 font-medium">Client</th>
                      <th className="text-left px-6 py-3 font-medium">Véhicule</th>
                      <th className="text-left px-6 py-3 font-medium">Statut</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.derniersOrdres.map((ordre) => (
                      <tr key={ordre.id} className="border-b border-gray-50 hover:bg-gray-50">
                        <td className="px-6 py-3 text-sm font-medium text-blue-600">{ordre.numero}</td>
                        <td className="px-6 py-3 text-sm text-gray-900">
                          {ordre.vehicule.client.prenom} {ordre.vehicule.client.nom}
                        </td>
                        <td className="px-6 py-3 text-sm text-gray-600">
                          {ordre.vehicule.marque} {ordre.vehicule.modele}
                        </td>
                        <td className="px-6 py-3">
                          <Badge variant={statutBadgeVariant[ordre.statut]}>
                            {STATUT_ORDRE_LABELS[ordre.statut]}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </CardContent>
          </Card>

          {/* Accès rapides */}
          <Card>
            <CardHeader>
              <CardTitle>Actions rapides</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { href: "/ordres/nouveau", label: "Nouvel ordre", icon: ClipboardList, color: "bg-blue-50 text-blue-700 hover:bg-blue-100" },
                  { href: "/clients/nouveau", label: "Nouveau client", icon: Users, color: "bg-green-50 text-green-700 hover:bg-green-100" },
                  { href: "/vehicules/nouveau", label: "Nouveau véhicule", icon: Car, color: "bg-purple-50 text-purple-700 hover:bg-purple-100" },
                  { href: "/factures/nouvelle", label: "Nouvelle facture", icon: TrendingUp, color: "bg-orange-50 text-orange-700 hover:bg-orange-100" },
                  { href: "/stock", label: "Gestion stock", icon: AlertTriangle, color: "bg-yellow-50 text-yellow-700 hover:bg-yellow-100" },
                  { href: "/livraisons", label: "Livraisons", icon: CheckCircle, color: "bg-teal-50 text-teal-700 hover:bg-teal-100" },
                ].map((action) => {
                  const Icon = action.icon;
                  return (
                    <a
                      key={action.href}
                      href={action.href}
                      className={`flex items-center gap-3 p-4 rounded-lg ${action.color} transition-colors`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="text-sm font-medium">{action.label}</span>
                    </a>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
