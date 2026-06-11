import { Header } from "@/components/layout/Header";
import { Card, CardContent } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { Car, Plus } from "lucide-react";
import Link from "next/link";

export default async function VehiculesPage() {
  const vehicules = await prisma.vehicule.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      client: true,
      _count: { select: { ordres: true } },
    },
  });

  return (
    <div className="flex flex-col flex-1">
      <Header title="Véhicules" subtitle={`${vehicules.length} véhicule(s) enregistré(s)`} />
      <div className="flex-1 p-6">
        <div className="flex justify-end mb-6">
          <Link
            href="/vehicules/nouveau"
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Nouveau véhicule
          </Link>
        </div>

        {vehicules.length === 0 ? (
          <Card>
            <CardContent className="py-16 text-center">
              <Car className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p className="text-gray-500">Aucun véhicule enregistré</p>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-xs text-gray-500 border-b border-gray-100 bg-gray-50">
                    <th className="text-left px-6 py-3 font-medium">Immatriculation</th>
                    <th className="text-left px-6 py-3 font-medium">Marque / Modèle</th>
                    <th className="text-left px-6 py-3 font-medium">Année</th>
                    <th className="text-left px-6 py-3 font-medium">Client</th>
                    <th className="text-left px-6 py-3 font-medium">Interventions</th>
                    <th className="text-left px-6 py-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {vehicules.map((v) => (
                    <tr key={v.id} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="px-6 py-3 font-mono text-sm font-bold text-gray-900">{v.immatriculation}</td>
                      <td className="px-6 py-3 text-sm">{v.marque} {v.modele}</td>
                      <td className="px-6 py-3 text-sm text-gray-600">{v.annee}</td>
                      <td className="px-6 py-3 text-sm">
                        <Link href={`/clients/${v.client.id}`} className="text-blue-600 hover:underline">
                          {v.client.prenom} {v.client.nom}
                        </Link>
                      </td>
                      <td className="px-6 py-3 text-sm text-gray-600">{v._count.ordres}</td>
                      <td className="px-6 py-3">
                        <Link href={`/vehicules/${v.id}`} className="text-sm text-blue-600 hover:underline mr-3">
                          Voir
                        </Link>
                        <Link href={`/ordres/nouveau?vehiculeId=${v.id}`} className="text-sm text-green-600 hover:underline">
                          + Ordre
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
