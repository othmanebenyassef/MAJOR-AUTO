import { Header } from "@/components/layout/Header";
import { PageTable } from "@/components/ui/page-table";
import { prisma } from "@/lib/prisma";
import { FileBarChart } from "lucide-react";

export default async function BureauxPage() {
  const bureaux = await prisma.bureauExpertise.findMany({
    orderBy: { nom: "asc" },
    include: { _count: { select: { procesVerbaux: true } } },
  });

  return (
    <div className="flex flex-col flex-1">
      <Header title="Bureaux d'expertises" subtitle={`${bureaux.length} bureau(x)`} />
      <div className="flex-1 p-6">
        <PageTable
          rows={bureaux}
          getKey={(b) => b.id}
          addHref="/base/bureaux/nouveau"
          addLabel="Nouveau bureau"
          emptyIcon={<FileBarChart className="w-6 h-6 text-[#9ca3af]" />}
          emptyText="Aucun bureau d'expertise"
          columns={[
            { key: "nom", label: "Nom", render: (b) => <span className="font-medium text-[#1e2433]">{b.nom}</span> },
            { key: "telephone", label: "Téléphone", render: (b) => <span className="text-[#6b7280]">{b.telephone ?? "—"}</span> },
            { key: "email", label: "Email", render: (b) => <span className="text-[#6b7280]">{b.email ?? "—"}</span> },
            { key: "contact", label: "Contact", render: (b) => <span className="text-[#6b7280]">{b.contact ?? "—"}</span> },
            { key: "pv", label: "PV liés", render: (b) => <span className="font-medium">{b._count.procesVerbaux}</span> },
          ]}
        />
      </div>
    </div>
  );
}
