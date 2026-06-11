import { Header } from "@/components/layout/Header";
import { PageTable } from "@/components/ui/page-table";
import { prisma } from "@/lib/prisma";
import { Car } from "lucide-react";
import Link from "next/link";

export default async function VehiculesPage() {
  const vehicules = await prisma.vehicule.findMany({
    orderBy: { createdAt: "desc" },
    include: { client: true, _count: { select: { ordres: true } } },
  });

  return (
    <div className="flex flex-col flex-1">
      <Header title="Véhicules" subtitle={`${vehicules.length} véhicule(s)`} />
      <div className="flex-1 p-6">
        <PageTable
          rows={vehicules}
          getKey={(v) => v.id}
          addHref="/base/vehicules/nouveau"
          addLabel="Nouveau véhicule"
          emptyIcon={<Car className="w-6 h-6 text-[#9ca3af]" />}
          emptyText="Aucun véhicule"
          columns={[
            { key: "immatriculation", label: "Immatriculation", render: (v) => <span className="font-mono font-bold text-[#1e2433]">{v.immatriculation}</span> },
            { key: "marque", label: "Marque / Modèle", render: (v) => <><div className="font-medium text-[#1e2433]">{v.marque} {v.modele}</div><div className="text-xs text-[#9ca3af]">{v.annee} · {v.couleur ?? "—"}</div></> },
            { key: "carburant", label: "Carburant", render: (v) => <span className="text-[#6b7280]">{v.carburant ?? "—"}</span> },
            { key: "client", label: "Propriétaire", render: (v) => <Link href={`/base/clients/${v.client.id}`} className="text-[#3b82f6] hover:underline">{v.client.prenom} {v.client.nom}</Link> },
            { key: "ordres", label: "Interventions", render: (v) => <span className="font-medium">{v._count.ordres}</span> },
            { key: "actions", label: "", render: (v) => (
              <div className="flex gap-3">
                <Link href={`/base/vehicules/${v.id}`} className="text-[#3b82f6] hover:underline text-xs font-medium">Voir →</Link>
                <Link href={`/documents/ordres/nouveau?vehiculeId=${v.id}`} className="text-[#10b981] hover:underline text-xs font-medium">+ Ordre</Link>
              </div>
            )},
          ]}
        />
      </div>
    </div>
  );
}
