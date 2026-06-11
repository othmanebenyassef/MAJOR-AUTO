import { Header } from "@/components/layout/Header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { prisma } from "@/lib/prisma";
import { formatDate, STATUT_LIVRAISON_LABELS } from "@/lib/utils";
import { Truck, Plus } from "lucide-react";
import Link from "next/link";

const badgeVariant: Record<string, "default" | "success" | "warning" | "danger" | "info"> = {
  EN_ATTENTE: "warning",
  EN_COURS: "info",
  LIVRE: "success",
  ANNULE: "danger",
};

export default async function LivraisonsPage() {
  const livraisons = await prisma.livraison.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div className="flex flex-col flex-1">
      <Header title="Livraisons" subtitle={`${livraisons.length} livraison(s)`} />
      <div className="flex-1 p-6">
        <div className="flex justify-end mb-6">
          <Link
            href="/livraisons/nouvelle"
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700"
          >
            <Plus className="w-4 h-4" />
            Nouvelle livraison
          </Link>
        </div>

        {livraisons.length === 0 ? (
          <Card>
            <CardContent className="py-16 text-center">
              <Truck className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p className="text-gray-500">Aucune livraison</p>
            </CardContent>
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
                    <th className="text-left px-6 py-3 font-medium">Adresse</th>
                    <th className="text-left px-6 py-3 font-medium">Date prévue</th>
                    <th className="text-left px-6 py-3 font-medium">Statut</th>
                    <th className="text-left px-6 py-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {livraisons.map((l) => (
                    <tr key={l.id} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="px-6 py-3 font-mono text-sm font-bold text-blue-600">{l.numero}</td>
                      <td className="px-6 py-3 text-sm">
                        <div>{l.clientNom}</div>
                        <div className="text-xs text-gray-400">{l.clientTel}</div>
                      </td>
                      <td className="px-6 py-3 text-sm text-gray-600">{l.vehiculeInfo}</td>
                      <td className="px-6 py-3 text-sm text-gray-600 max-w-xs truncate">{l.adresse}</td>
                      <td className="px-6 py-3 text-sm text-gray-600">{formatDate(l.datePrevu)}</td>
                      <td className="px-6 py-3">
                        <Badge variant={badgeVariant[l.statut]}>{STATUT_LIVRAISON_LABELS[l.statut]}</Badge>
                      </td>
                      <td className="px-6 py-3">
                        <Link href={`/livraisons/${l.id}`} className="text-sm text-blue-600 hover:underline">
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
