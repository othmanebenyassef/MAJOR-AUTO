import { Header } from "@/components/layout/Header";
import { PageTable } from "@/components/ui/page-table";
import { Badge } from "@/components/ui/badge";
import { prisma } from "@/lib/prisma";
import { formatDate, STATUT_LIVRAISON_LABELS } from "@/lib/utils";
import { Truck } from "lucide-react";
import Link from "next/link";

const badge: Record<string, "default" | "success" | "warning" | "info" | "danger"> = {
  EN_ATTENTE: "warning", EN_COURS: "info", LIVRE: "success", ANNULE: "danger",
};

export default async function LivraisonsPage() {
  const livraisons = await prisma.livraison.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div className="flex flex-col flex-1">
      <Header title="Livraisons" subtitle={`${livraisons.length} livraison(s)`} />
      <div className="flex-1 p-6">
        <PageTable
          rows={livraisons}
          getKey={(l) => l.id}
          addHref="/livraisons/nouvelle"
          addLabel="Nouvelle livraison"
          emptyIcon={<Truck className="w-6 h-6 text-[#9ca3af]" />}
          emptyText="Aucune livraison"
          columns={[
            { key: "numero", label: "Numéro", render: (l) => <span className="font-mono font-bold text-[#3b82f6]">{l.numero}</span> },
            { key: "client", label: "Client", render: (l) => <><div className="font-medium text-[#1e2433]">{l.clientNom}</div><div className="text-xs text-[#9ca3af]">{l.clientTel}</div></> },
            { key: "vehicule", label: "Véhicule", render: (l) => <span className="text-[#6b7280]">{l.vehiculeInfo}</span> },
            { key: "adresse", label: "Adresse", render: (l) => <span className="text-[#6b7280] max-w-xs truncate block">{l.adresse}</span> },
            { key: "datePrevu", label: "Date prévue", render: (l) => <span className="text-[#6b7280]">{formatDate(l.datePrevu)}</span> },
            { key: "statut", label: "Statut", render: (l) => <Badge variant={badge[l.statut]}>{STATUT_LIVRAISON_LABELS[l.statut]}</Badge> },
          ]}
        />
      </div>
    </div>
  );
}
