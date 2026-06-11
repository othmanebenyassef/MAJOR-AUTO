import { Header } from "@/components/layout/Header";
import { PageTable } from "@/components/ui/page-table";
import { Badge } from "@/components/ui/badge";
import { prisma } from "@/lib/prisma";
import { formatCurrency } from "@/lib/utils";
import { UserCog } from "lucide-react";

export default async function PersonnelPage() {
  const personnel = await prisma.personnel.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { ordres: true } } },
  });

  const masseSalariale = personnel.filter(p => p.actif && p.salaire).reduce((s, p) => s + (p.salaire ?? 0), 0);

  return (
    <div className="flex flex-col flex-1">
      <Header title="Personnel" subtitle={`${personnel.filter(p => p.actif).length} actif(s) · Masse salariale : ${formatCurrency(masseSalariale)}`} />
      <div className="flex-1 p-6">
        <PageTable
          rows={personnel}
          getKey={(p) => p.id}
          addHref="/base/personnel/nouveau"
          addLabel="Nouvel employé"
          emptyIcon={<UserCog className="w-6 h-6 text-[#9ca3af]" />}
          emptyText="Aucun employé"
          columns={[
            { key: "nom", label: "Employé", render: (p) => <><div className="font-medium text-[#1e2433]">{p.prenom} {p.nom}</div><div className="text-xs text-[#3b82f6]">{p.poste}</div></> },
            { key: "telephone", label: "Téléphone", render: (p) => <span className="text-[#6b7280]">{p.telephone ?? "—"}</span> },
            { key: "salaire", label: "Salaire", render: (p) => <span className="font-medium">{p.salaire ? formatCurrency(p.salaire) : "—"}</span> },
            { key: "ordres", label: "Interventions", render: (p) => <span className="font-medium">{p._count.ordres}</span> },
            { key: "actif", label: "Statut", render: (p) => <Badge variant={p.actif ? "success" : "default"}>{p.actif ? "Actif" : "Inactif"}</Badge> },
          ]}
        />
      </div>
    </div>
  );
}
