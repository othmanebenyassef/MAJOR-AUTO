import { Header } from "@/components/layout/Header";
import { PageTable } from "@/components/ui/page-table";
import { prisma } from "@/lib/prisma";
import { Building2 } from "lucide-react";
import Link from "next/link";

export default async function FournisseursPage() {
  const fournisseurs = await prisma.fournisseur.findMany({
    orderBy: { nom: "asc" },
    include: { _count: { select: { pieces: true } } },
  });

  return (
    <div className="flex flex-col flex-1">
      <Header title="Fournisseurs" subtitle={`${fournisseurs.length} fournisseur(s)`} />
      <div className="flex-1 p-6">
        <PageTable
          rows={fournisseurs}
          getKey={(f) => f.id}
          addHref="/base/fournisseurs/nouveau"
          addLabel="Nouveau fournisseur"
          emptyIcon={<Building2 className="w-6 h-6 text-[#9ca3af]" />}
          emptyText="Aucun fournisseur"
          columns={[
            { key: "nom", label: "Nom", render: (f) => <span className="font-medium text-[#1e2433]">{f.nom}</span> },
            { key: "telephone", label: "Téléphone", render: (f) => <span className="text-[#6b7280]">{f.telephone ?? "—"}</span> },
            { key: "email", label: "Email", render: (f) => <span className="text-[#6b7280]">{f.email ?? "—"}</span> },
            { key: "contact", label: "Contact", render: (f) => <span className="text-[#6b7280]">{f.contact ?? "—"}</span> },
            { key: "pieces", label: "Pièces liées", render: (f) => <span className="font-medium">{f._count.pieces}</span> },
          ]}
        />
      </div>
    </div>
  );
}
