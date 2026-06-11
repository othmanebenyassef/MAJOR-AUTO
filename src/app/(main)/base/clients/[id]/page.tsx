import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { prisma } from "@/lib/prisma";
import { formatDate, STATUT_ORDRE_LABELS } from "@/lib/utils";
import { notFound } from "next/navigation";
import { Phone, Mail, MapPin, Car, ClipboardList } from "lucide-react";
import Link from "next/link";

export default async function ClientDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const client = await prisma.client.findUnique({
    where: { id },
    include: {
      vehicules: {
        include: {
          ordres: { orderBy: { createdAt: "desc" }, take: 3 },
        },
      },
    },
  });

  if (!client) notFound();

  return (
    <div className="flex flex-col flex-1">
      <Header
        title={`${client.prenom} ${client.nom}`}
        subtitle="Fiche client"
      />
      <div className="flex-1 p-6 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader><CardTitle>Coordonnées</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Phone className="w-4 h-4 text-gray-400" />
                <span>{client.telephone}</span>
              </div>
              {client.email && (
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span>{client.email}</span>
                </div>
              )}
              {client.adresse && (
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span>{client.adresse}</span>
                </div>
              )}
              <p className="text-xs text-gray-400 pt-2">Client depuis le {formatDate(client.createdAt)}</p>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Véhicules ({client.vehicules.length})</CardTitle>
                <Link
                  href={`/vehicules/nouveau?clientId=${client.id}`}
                  className="text-sm text-blue-600 hover:underline"
                >
                  + Ajouter
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {client.vehicules.length === 0 ? (
                <div className="text-center py-6 text-gray-500 text-sm">
                  <Car className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                  Aucun véhicule enregistré
                </div>
              ) : (
                <div className="space-y-3">
                  {client.vehicules.map((v) => (
                    <div key={v.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-sm">{v.marque} {v.modele} ({v.annee})</p>
                        <p className="text-xs text-gray-500">{v.immatriculation} • {v.couleur}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500">{v.ordres.length} intervention(s)</p>
                        <Link href={`/vehicules/${v.id}`} className="text-xs text-blue-600 hover:underline">
                          Voir fiche
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
