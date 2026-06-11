import { Header } from "@/components/layout/Header";
import { PageTable } from "@/components/ui/page-table";
import { prisma } from "@/lib/prisma";
import { Handshake } from "lucide-react";

export default async function PartenairesPage() {
  const partenaires = await prisma.partenaire.findMany({ orderBy: { nom: "asc" } });

  return (
    <div className="flex flex-col flex-1">
      <Header title="Partenaires" subtitle={`${partenaires.length} partenaire(s)`} />
      <div className="flex-1 p-6">
        <PageTable
          rows={partenaires}
          getKey={(p) => p.id}
          addHref="/base/partenaires/nouveau"
          addLabel="Nouveau partenaire"
          emptyIcon={<Handshake className="w-6 h-6 text-[#9ca3af]" />}
          emptyText="Aucun partenaire"
          columns={[
            { key: "nom", label: "Nom", render: (p) => <span className="font-medium text-[#1e2433]">{p.nom}</span> },
            { key: "type", label: "Type", render: (p) => <span className="text-xs bg-[#eef3ff] text-[#3b82f6] px-2.5 py-1 rounded-full font-medium">{p.type}</span> },
            { key: "telephone", label: "Téléphone", render: (p) => <span className="text-[#6b7280]">{p.telephone ?? "—"}</span> },
            { key: "email", label: "Email", render: (p) => <span className="text-[#6b7280]">{p.email ?? "—"}</span> },
            { key: "notes", label: "Notes", render: (p) => <span className="text-[#9ca3af] truncate max-w-xs block">{p.notes ?? "—"}</span> },
          ]}
        />
      </div>
    </div>
  );
}
