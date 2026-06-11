import { Header } from "@/components/layout/Header";
import { PageTable } from "@/components/ui/page-table";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import { Users } from "lucide-react";
import Link from "next/link";

export default async function ClientsPage() {
  const clients = await prisma.client.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { vehicules: true } } },
  });

  return (
    <div className="flex flex-col flex-1">
      <Header title="Clients" subtitle={`${clients.length} client(s)`} />
      <div className="flex-1 p-6">
        <PageTable
          rows={clients}
          getKey={(c) => c.id}
          addHref="/base/clients/nouveau"
          addLabel="Nouveau client"
          emptyIcon={<Users className="w-6 h-6 text-[#9ca3af]" />}
          emptyText="Aucun client enregistré"
          columns={[
            { key: "nom", label: "Nom", render: (c) => <Link href={`/base/clients/${c.id}`} className="font-medium text-[#1e2433] hover:text-[#3b82f6]">{c.prenom} {c.nom}</Link> },
            { key: "telephone", label: "Téléphone", render: (c) => <span className="text-[#6b7280]">{c.telephone}</span> },
            { key: "email", label: "Email", render: (c) => <span className="text-[#6b7280]">{c.email ?? "—"}</span> },
            { key: "ville", label: "Ville", render: (c) => <span className="text-[#6b7280]">{c.ville ?? "—"}</span> },
            { key: "vehicules", label: "Véhicules", render: (c) => <span className="font-medium text-[#1e2433]">{c._count.vehicules}</span> },
            { key: "createdAt", label: "Depuis", render: (c) => <span className="text-[#9ca3af]">{formatDate(c.createdAt)}</span> },
            { key: "actions", label: "", render: (c) => <Link href={`/base/clients/${c.id}`} className="text-[#3b82f6] hover:underline text-xs font-medium">Voir →</Link> },
          ]}
        />
      </div>
    </div>
  );
}
