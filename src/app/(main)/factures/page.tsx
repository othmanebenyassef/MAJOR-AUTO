import { Header } from "@/components/layout/Header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { prisma } from "@/lib/prisma";
import { formatCurrency, formatDate, STATUT_FACTURE_LABELS } from "@/lib/utils";
import { FileText, Plus } from "lucide-react";
import Link from "next/link";

const badgeVariant: Record<string, "default" | "success" | "warning" | "danger" | "info"> = {
  EN_ATTENTE: "warning",
  PARTIELLEMENT_PAYEE: "info",
  PAYEE: "success",
  ANNULEE: "danger",
};

export default async function FacturesPage() {
  const factures = await prisma.facture.findMany({
    orderBy: { createdAt: "desc" },
    include: { client: true },
  });

  const totalImpaye = factures
    .filter((f) => f.statut !== "PAYEE" && f.statut !== "ANNULEE")
    .reduce((s, f) => s + f.montantTTC, 0);

  return (
    <div className="flex flex-col flex-1">
      <Header title="Facturation" subtitle={`${factures.length} facture(s) — ${formatCurrency(totalImpaye)} impayé`} />
      <div className="flex-1 p-6">
        <div className="flex justify-end mb-6">
          <Link
            href="/factures/nouvelle"
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700"
          >
            <Plus className="w-4 h-4" />
            Nouvelle facture
          </Link>
        </div>

        {factures.length === 0 ? (
          <Card>
            <div className="py-16 text-center">
              <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p className="text-gray-500">Aucune facture</p>
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
                    <th className="text-left px-6 py-3 font-medium">Date</th>
                    <th className="text-right px-6 py-3 font-medium">Montant TTC</th>
                    <th className="text-left px-6 py-3 font-medium">Statut</th>
                    <th className="text-left px-6 py-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {factures.map((f) => (
                    <tr key={f.id} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="px-6 py-3 font-mono text-sm font-bold text-blue-600">{f.numero}</td>
                      <td className="px-6 py-3 text-sm">{f.client.prenom} {f.client.nom}</td>
                      <td className="px-6 py-3 text-sm text-gray-600">{formatDate(f.dateEmission)}</td>
                      <td className="px-6 py-3 text-sm font-semibold text-right">{formatCurrency(f.montantTTC)}</td>
                      <td className="px-6 py-3">
                        <Badge variant={badgeVariant[f.statut]}>{STATUT_FACTURE_LABELS[f.statut]}</Badge>
                      </td>
                      <td className="px-6 py-3">
                        <Link href={`/factures/${f.id}`} className="text-sm text-blue-600 hover:underline">
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
