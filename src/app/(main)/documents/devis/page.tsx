import { Header } from "@/components/layout/Header";
import { PageTable } from "@/components/ui/page-table";
import { Badge } from "@/components/ui/badge";
import { prisma } from "@/lib/prisma";
import { formatCurrency, formatDate, STATUT_DEVIS_LABELS } from "@/lib/utils";
import { FilePlus } from "lucide-react";
import Link from "next/link";

const badge: Record<string, "default" | "success" | "warning" | "danger"> = {
  EN_ATTENTE: "warning", ACCEPTE: "success", REFUSE: "danger", EXPIRE: "default",
};

export default async function DevisPage() {
  const devis = await prisma.devis.findMany({
    orderBy: { createdAt: "desc" },
    include: { client: true, vehicule: true },
  });

  return (
    <div className="flex flex-col flex-1">
      <Header title="Devis" subtitle={`${devis.length} devis`} />
      <div className="flex-1 p-6">
        <PageTable
          rows={devis}
          getKey={(d) => d.id}
          addHref="/documents/devis/nouveau"
          addLabel="Nouveau devis"
          emptyIcon={<FilePlus className="w-6 h-6 text-[#9ca3af]" />}
          emptyText="Aucun devis"
          columns={[
            { key: "numero", label: "Numéro", render: (d) => <span className="font-mono font-bold text-[#3b82f6]">{d.numero}</span> },
            { key: "client", label: "Client", render: (d) => <span className="font-medium text-[#1e2433]">{d.client.prenom} {d.client.nom}</span> },
            { key: "vehicule", label: "Véhicule", render: (d) => <span className="text-[#6b7280]">{d.vehicule ? `${d.vehicule.marque} ${d.vehicule.modele}` : "—"}</span> },
            { key: "dateEmission", label: "Date", render: (d) => <span className="text-[#6b7280]">{formatDate(d.dateEmission)}</span> },
            { key: "montantTTC", label: "Montant TTC", render: (d) => <span className="font-semibold">{formatCurrency(d.montantTTC)}</span> },
            { key: "statut", label: "Statut", render: (d) => <Badge variant={badge[d.statut]}>{STATUT_DEVIS_LABELS[d.statut]}</Badge> },
            { key: "actions", label: "", render: (d) => <Link href={`/documents/devis/${d.id}`} className="text-[#3b82f6] hover:underline text-xs font-medium">Voir →</Link> },
          ]}
        />
      </div>
    </div>
  );
}
