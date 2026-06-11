import { Header } from "@/components/layout/Header";
import { PageTable } from "@/components/ui/page-table";
import { Badge } from "@/components/ui/badge";
import { prisma } from "@/lib/prisma";
import { formatCurrency, formatDate, STATUT_FACTURE_LABELS } from "@/lib/utils";
import { Receipt } from "lucide-react";
import Link from "next/link";

const badge: Record<string, "default" | "success" | "warning" | "info" | "danger"> = {
  EN_ATTENTE: "warning", PARTIELLEMENT_PAYEE: "info", PAYEE: "success", ANNULEE: "danger",
};

export default async function FacturesPage() {
  const factures = await prisma.facture.findMany({
    orderBy: { createdAt: "desc" },
    include: { client: true },
  });

  const totalImpaye = factures
    .filter(f => f.statut !== "PAYEE" && f.statut !== "ANNULEE")
    .reduce((s, f) => s + f.montantTTC, 0);

  return (
    <div className="flex flex-col flex-1">
      <Header title="Factures" subtitle={`${factures.length} facture(s) · ${formatCurrency(totalImpaye)} impayé`} />
      <div className="flex-1 p-6">
        <PageTable
          rows={factures}
          getKey={(f) => f.id}
          addHref="/documents/factures/nouvelle"
          addLabel="Nouvelle facture"
          emptyIcon={<Receipt className="w-6 h-6 text-[#9ca3af]" />}
          emptyText="Aucune facture"
          columns={[
            { key: "numero", label: "Numéro", render: (f) => <span className="font-mono font-bold text-[#3b82f6]">{f.numero}</span> },
            { key: "client", label: "Client", render: (f) => <span className="font-medium text-[#1e2433]">{f.client.prenom} {f.client.nom}</span> },
            { key: "dateEmission", label: "Date", render: (f) => <span className="text-[#6b7280]">{formatDate(f.dateEmission)}</span> },
            { key: "montantTTC", label: "Montant TTC", className: "text-right", render: (f) => <span className="font-semibold text-[#1e2433]">{formatCurrency(f.montantTTC)}</span> },
            { key: "statut", label: "Statut", render: (f) => <Badge variant={badge[f.statut]}>{STATUT_FACTURE_LABELS[f.statut]}</Badge> },
            { key: "actions", label: "", render: (f) => <Link href={`/documents/factures/${f.id}`} className="text-[#3b82f6] hover:underline text-xs font-medium">Voir →</Link> },
          ]}
        />
      </div>
    </div>
  );
}
