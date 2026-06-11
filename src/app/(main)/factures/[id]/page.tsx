import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { prisma } from "@/lib/prisma";
import { formatCurrency, formatDate, STATUT_FACTURE_LABELS } from "@/lib/utils";
import { notFound } from "next/navigation";
import { FactureActions } from "@/components/factures/FactureActions";

const badgeVariant: Record<string, "default" | "success" | "warning" | "danger" | "info"> = {
  EN_ATTENTE: "warning",
  PARTIELLEMENT_PAYEE: "info",
  PAYEE: "success",
  ANNULEE: "danger",
};

export default async function FactureDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const facture = await prisma.facture.findUnique({
    where: { id },
    include: {
      client: true,
      ordre: {
        include: {
          vehicule: true,
          lignes: { include: { piece: true } },
        },
      },
    },
  });

  if (!facture) notFound();

  return (
    <div className="flex flex-col flex-1">
      <Header title={`Facture ${facture.numero}`} subtitle={`${facture.client.prenom} ${facture.client.nom}`} />
      <div className="flex-1 p-6 space-y-6 max-w-4xl">
        <div className="flex items-center justify-between">
          <Badge variant={badgeVariant[facture.statut]} className="text-sm px-3 py-1">
            {STATUT_FACTURE_LABELS[facture.statut]}
          </Badge>
          <FactureActions factureId={facture.id} statut={facture.statut} />
        </div>

        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-2 gap-8">
              <div>
                <h3 className="font-bold text-gray-900 text-lg mb-1">MAJOR AUTO</h3>
                <p className="text-sm text-gray-500">Garage & Carrosserie</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-2xl text-gray-900">{facture.numero}</p>
                <p className="text-sm text-gray-500">Émis le {formatDate(facture.dateEmission)}</p>
                {facture.dateEcheance && (
                  <p className="text-sm text-red-500">Échéance : {formatDate(facture.dateEcheance)}</p>
                )}
              </div>
            </div>

            <div className="border-t border-gray-100 mt-6 pt-6">
              <h4 className="text-xs font-medium text-gray-500 uppercase mb-2">Client</h4>
              <p className="font-semibold text-gray-900">{facture.client.prenom} {facture.client.nom}</p>
              <p className="text-sm text-gray-500">{facture.client.telephone}</p>
              {facture.client.adresse && <p className="text-sm text-gray-500">{facture.client.adresse}</p>}
            </div>

            {facture.ordre && (
              <div className="border-t border-gray-100 mt-6 pt-6">
                <h4 className="text-xs font-medium text-gray-500 uppercase mb-3">Détail des prestations</h4>
                <table className="w-full">
                  <thead>
                    <tr className="text-xs text-gray-500 bg-gray-50">
                      <th className="text-left px-4 py-2">Description</th>
                      <th className="text-right px-4 py-2">Qté</th>
                      <th className="text-right px-4 py-2">P.U. HT</th>
                      <th className="text-right px-4 py-2">Total HT</th>
                    </tr>
                  </thead>
                  <tbody>
                    {facture.ordre.lignes.map((l) => (
                      <tr key={l.id} className="border-t border-gray-50">
                        <td className="px-4 py-2 text-sm">{l.description}</td>
                        <td className="px-4 py-2 text-sm text-right">{l.quantite}</td>
                        <td className="px-4 py-2 text-sm text-right">{formatCurrency(l.prixUnitaire)}</td>
                        <td className="px-4 py-2 text-sm font-medium text-right">{formatCurrency(l.quantite * l.prixUnitaire)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div className="flex justify-end mt-6 border-t border-gray-100 pt-4">
              <div className="space-y-1 text-sm min-w-52">
                <div className="flex justify-between text-gray-600">
                  <span>Total HT</span>
                  <span>{formatCurrency(facture.montantHT)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>TVA ({facture.tva}%)</span>
                  <span>{formatCurrency(facture.montantTTC - facture.montantHT)}</span>
                </div>
                <div className="flex justify-between font-bold text-gray-900 border-t border-gray-200 pt-2 mt-2 text-base">
                  <span>Total TTC</span>
                  <span>{formatCurrency(facture.montantTTC)}</span>
                </div>
                {facture.modePaiement && (
                  <div className="text-xs text-gray-400 text-right">Payé par {facture.modePaiement}</div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
