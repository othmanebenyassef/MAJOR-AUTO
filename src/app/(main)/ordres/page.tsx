import { Header } from "@/components/layout/Header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { prisma } from "@/lib/prisma";
import { formatDate, STATUT_ORDRE_LABELS } from "@/lib/utils";
import { ClipboardList, Plus } from "lucide-react";
import Link from "next/link";

const badgeVariant: Record<string, "default" | "success" | "warning" | "danger" | "info"> = {
  EN_ATTENTE: "warning",
  EN_COURS: "info",
  EN_PAUSE: "default",
  TERMINE: "success",
  LIVRE: "success",
};

export default async function OrdresPage() {
  const ordres = await prisma.ordreReparation.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      vehicule: { include: { client: true } },
      technicien: true,
    },
  });

  return (
    <div className="flex flex-col flex-1">
      <Header title="Ordres de réparation" subtitle={`${ordres.length} ordre(s) au total`} />
      <div className="flex-1 p-6">
        <div className="flex justify-end mb-6">
          <Link
            href="/ordres/nouveau"
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700"
          >
            <Plus className="w-4 h-4" />
            Nouvel ordre
          </Link>
        </div>

        {ordres.length === 0 ? (
          <Card>
            <div className="py-16 text-center">
              <ClipboardList className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p className="text-gray-500">Aucun ordre de réparation</p>
            </div>
          </Card>
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
                  {ordres.map((o) => (
                    <tr key={o.id} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="px-6 py-3 font-mono text-sm font-bold text-blue-600">{o.numero}</td>
                      <td className="px-6 py-3 text-sm">{o.vehicule.client.prenom} {o.vehicule.client.nom}</td>
                      <td className="px-6 py-3 text-sm text-gray-600">
                        {o.vehicule.marque} {o.vehicule.modele}
                        <br />
                        <span className="font-mono text-xs">{o.vehicule.immatriculation}</span>
                      </td>
                      <td className="px-6 py-3">
                        <div className="flex flex-wrap gap-1">
                          {o.typeService.slice(0, 2).map((s) => (
                            <span key={s} className="text-xs bg-gray-100 text-gray-700 px-1.5 py-0.5 rounded">{s}</span>
                          ))}
                          {o.typeService.length > 2 && (
                            <span className="text-xs text-gray-400">+{o.typeService.length - 2}</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-3 text-sm text-gray-600">
                        {o.technicien ? `${o.technicien.prenom} ${o.technicien.nom}` : "-"}
                      </td>
                      <td className="px-6 py-3 text-sm text-gray-600">{formatDate(o.dateEntree)}</td>
                      <td className="px-6 py-3">
                        <Badge variant={badgeVariant[o.statut]}>{STATUT_ORDRE_LABELS[o.statut]}</Badge>
                      </td>
                      <td className="px-6 py-3">
                        <Link href={`/ordres/${o.id}`} className="text-sm text-blue-600 hover:underline">
                          Voir
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
