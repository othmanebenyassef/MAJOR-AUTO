import { Header } from "@/components/layout/Header";
import { PageTable } from "@/components/ui/page-table";
import { Badge } from "@/components/ui/badge";
import { prisma } from "@/lib/prisma";
import { formatDate, STATUT_ORDRE_LABELS, parseServices } from "@/lib/utils";
import { ClipboardList } from "lucide-react";
import Link from "next/link";

const badge: Record<string, "default" | "success" | "warning" | "info"> = {
  EN_ATTENTE: "warning", EN_COURS: "info", EN_PAUSE: "default", TERMINE: "success", LIVRE: "success",
};

export default async function OrdresPage() {
  const ordres = await prisma.ordreReparation.findMany({
    orderBy: { createdAt: "desc" },
    include: { vehicule: { include: { client: true } }, technicien: true },
  });

  return (
    <div className="flex flex-col flex-1">
      <Header title="Ordres de réparation" subtitle={`${ordres.length} ordre(s)`} />
      <div className="flex-1 p-6">
        <PageTable
          rows={ordres}
          getKey={(o) => o.id}
          addHref="/documents/ordres/nouveau"
          addLabel="Nouvel ordre"
          emptyIcon={<ClipboardList className="w-6 h-6 text-[#9ca3af]" />}
          emptyText="Aucun ordre de réparation"
          columns={[
            { key: "numero", label: "Numéro", render: (o) => <span className="font-mono font-bold text-[#3b82f6]">{o.numero}</span> },
            { key: "client", label: "Client", render: (o) => <span className="font-medium text-[#1e2433]">{o.vehicule.client.prenom} {o.vehicule.client.nom}</span> },
            { key: "vehicule", label: "Véhicule", render: (o) => <><div className="text-[#1e2433]">{o.vehicule.marque} {o.vehicule.modele}</div><div className="text-xs font-mono text-[#9ca3af]">{o.vehicule.immatriculation}</div></> },
            { key: "services", label: "Services", render: (o) => <div className="flex flex-wrap gap-1">{parseServices(o.typeService).slice(0,2).map(s=><span key={s} className="text-xs bg-[#eef3ff] text-[#3b82f6] px-2 py-0.5 rounded-full">{s}</span>)}{parseServices(o.typeService).length>2&&<span className="text-xs text-[#9ca3af]">+{parseServices(o.typeService).length-2}</span>}</div> },
            { key: "technicien", label: "Technicien", render: (o) => <span className="text-[#6b7280]">{o.technicien ? `${o.technicien.prenom} ${o.technicien.nom}` : "—"}</span> },
            { key: "dateEntree", label: "Entrée", render: (o) => <span className="text-[#6b7280]">{formatDate(o.dateEntree)}</span> },
            { key: "statut", label: "Statut", render: (o) => <Badge variant={badge[o.statut]}>{STATUT_ORDRE_LABELS[o.statut]}</Badge> },
            { key: "actions", label: "", render: (o) => <Link href={`/documents/ordres/${o.id}`} className="text-[#3b82f6] hover:underline text-xs font-medium">Voir →</Link> },
          ]}
        />
      </div>
    </div>
  );
}
