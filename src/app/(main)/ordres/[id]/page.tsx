import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { prisma } from "@/lib/prisma";
import { formatDate, formatCurrency, STATUT_ORDRE_LABELS, parseServices } from "@/lib/utils";
import { notFound } from "next/navigation";
import Link from "next/link";
import { OrdreActions } from "@/components/ordres/OrdreActions";
import { LignesOrdre } from "@/components/ordres/LignesOrdre";

const badgeVariant: Record<string, "default" | "success" | "warning" | "danger" | "info"> = {
  EN_ATTENTE: "warning",
  EN_COURS: "info",
  EN_PAUSE: "default",
  TERMINE: "success",
  LIVRE: "success",
};

export default async function OrdreDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const ordre = await prisma.ordreReparation.findUnique({
    where: { id },
    include: {
      vehicule: { include: { client: true } },
      technicien: true,
      lignes: { include: { piece: true } },
      facture: true,
    },
  });

  if (!ordre) notFound();

  const totalHT = ordre.lignes.reduce((sum, l) => sum + l.quantite * l.prixUnitaire, 0);

  return (
    <div className="flex flex-col flex-1">
      <Header
        title={`Ordre ${ordre.numero}`}
        subtitle={`${ordre.vehicule.marque} ${ordre.vehicule.modele} — ${ordre.vehicule.client.prenom} ${ordre.vehicule.client.nom}`}
      />
      <div className="flex-1 p-6 space-y-6">
        <div className="flex items-center justify-between">
          <Badge variant={badgeVariant[ordre.statut]} className="text-sm px-3 py-1">
            {STATUT_ORDRE_LABELS[ordre.statut]}
          </Badge>
          <OrdreActions ordreId={ordre.id} statut={ordre.statut} hasFacture={!!ordre.facture} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader><CardTitle>Véhicule</CardTitle></CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="font-mono font-bold text-lg text-gray-900">{ordre.vehicule.immatriculation}</div>
              <div className="text-gray-700">{ordre.vehicule.marque} {ordre.vehicule.modele} ({ordre.vehicule.annee})</div>
              {ordre.vehicule.couleur && <div className="text-gray-500">Couleur : {ordre.vehicule.couleur}</div>}
              {ordre.kilometrage && <div className="text-gray-500">Km : {ordre.kilometrage.toLocaleString()}</div>}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Client</CardTitle></CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="font-semibold text-gray-900">
                <Link href={`/clients/${ordre.vehicule.client.id}`} className="hover:text-blue-600">
                  {ordre.vehicule.client.prenom} {ordre.vehicule.client.nom}
                </Link>
              </div>
              <div className="text-gray-500">{ordre.vehicule.client.telephone}</div>
              {ordre.vehicule.client.email && <div className="text-gray-500">{ordre.vehicule.client.email}</div>}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Intervention</CardTitle></CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex flex-wrap gap-1">
                {parseServices(ordre.typeService).map((s) => (
                  <span key={s} className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-xs">{s}</span>
                ))}
              </div>
              <div className="text-gray-500">Entrée : {formatDate(ordre.dateEntree)}</div>
              {ordre.dateSortie && <div className="text-gray-500">Sortie : {formatDate(ordre.dateSortie)}</div>}
              {ordre.technicien && (
                <div className="text-gray-500">Tech : {ordre.technicien.prenom} {ordre.technicien.nom}</div>
              )}
            </CardContent>
          </Card>
        </div>

        {ordre.description && (
          <Card>
            <CardHeader><CardTitle>Description</CardTitle></CardHeader>
            <CardContent>
              <p className="text-sm text-gray-700 whitespace-pre-line">{ordre.description}</p>
            </CardContent>
          </Card>
        )}

        <LignesOrdre ordreId={ordre.id} lignes={ordre.lignes} totalHT={totalHT} />
      </div>
    </div>
  );
}
