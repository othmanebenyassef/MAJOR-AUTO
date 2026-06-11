import { Header } from "@/components/layout/Header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { prisma } from "@/lib/prisma";
import { formatCurrency, formatDate } from "@/lib/utils";
import { UserCog, Plus, Phone, Mail } from "lucide-react";
import Link from "next/link";

export default async function PersonnelPage() {
  const personnel = await prisma.personnel.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { ordres: true } } },
  });

  const masseSalariale = personnel
    .filter((p) => p.actif && p.salaire)
    .reduce((s, p) => s + (p.salaire ?? 0), 0);

  return (
    <div className="flex flex-col flex-1">
      <Header
        title="Personnel"
        subtitle={`${personnel.filter((p) => p.actif).length} employé(s) actif(s) — Masse salariale : ${formatCurrency(masseSalariale)}`}
      />
      <div className="flex-1 p-6">
        <div className="flex justify-end mb-6">
          <Link
            href="/personnel/nouveau"
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700"
          >
            <Plus className="w-4 h-4" />
            Nouveau employé
          </Link>
        </div>

        {personnel.length === 0 ? (
          <Card>
            <CardContent className="py-16 text-center">
              <UserCog className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p className="text-gray-500">Aucun employé enregistré</p>
            </CardContent>
          </Card>
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
                    {p.telephone && (
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Phone className="w-3.5 h-3.5" />
                        {p.telephone}
                      </div>
                    )}
                    {p.email && (
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Mail className="w-3.5 h-3.5" />
                        {p.email}
                      </div>
                    )}
                    {p.salaire && (
                      <div className="text-sm text-gray-500">Salaire : {formatCurrency(p.salaire)}/mois</div>
                    )}
                    {p.dateEmbauche && (
                      <div className="text-xs text-gray-400">Embauché le {formatDate(p.dateEmbauche)}</div>
                    )}
                    <div className="text-xs text-gray-400">{p._count.ordres} intervention(s)</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
