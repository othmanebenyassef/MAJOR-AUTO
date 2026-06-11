import { Header } from "@/components/layout/Header";
import { PageTable } from "@/components/ui/page-table";
import { Badge } from "@/components/ui/badge";
import { prisma } from "@/lib/prisma";
import { formatCurrency } from "@/lib/utils";
import { Boxes, AlertTriangle } from "lucide-react";
import Link from "next/link";

export default async function StockPage() {
  const pieces = await prisma.pieceDetachee.findMany({
    orderBy: { nom: "asc" },
    include: { fournisseur: true },
  });
  const alertes = pieces.filter(p => p.quantiteStock <= p.seuilAlerte).length;

  return (
    <div className="flex flex-col flex-1">
      <Header title="Stock pièces & fournitures" subtitle={`${pieces.length} référence(s) · ${alertes} alerte(s)`} />
      <div className="flex-1 p-6">
        {alertes > 0 && (
          <div className="mb-4 flex items-center gap-2.5 px-4 py-3 bg-[#fff1f3] border border-[#fda4b0] rounded-xl text-sm text-[#e11d48]">
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            <span><strong>{alertes}</strong> pièce(s) en dessous du seuil d'alerte</span>
          </div>
        )}
        <PageTable
          rows={pieces}
          getKey={(p) => p.id}
          addHref="/base/stock/nouvelle"
          addLabel="Nouvelle pièce"
          emptyIcon={<Boxes className="w-6 h-6 text-[#9ca3af]" />}
          emptyText="Stock vide"
          columns={[
            { key: "reference", label: "Référence", render: (p) => <span className="font-mono text-xs font-bold text-[#6b7280]">{p.reference}</span> },
            { key: "nom", label: "Désignation", render: (p) => <><div className="font-medium text-[#1e2433]">{p.nom}</div><div className="text-xs text-[#9ca3af]">{p.categorie}</div></> },
            { key: "fournisseur", label: "Fournisseur", render: (p) => <span className="text-[#6b7280]">{p.fournisseur?.nom ?? "—"}</span> },
            { key: "quantiteStock", label: "Stock", render: (p) => <span className={`font-bold ${p.quantiteStock <= p.seuilAlerte ? "text-[#f43f5e]" : "text-[#10b981]"}`}>{p.quantiteStock}</span> },
            { key: "seuilAlerte", label: "Seuil", render: (p) => <span className="text-[#9ca3af]">{p.seuilAlerte}</span> },
            { key: "prixAchat", label: "P. Achat", render: (p) => <span className="text-[#6b7280]">{formatCurrency(p.prixAchat)}</span> },
            { key: "prixVente", label: "P. Vente", render: (p) => <span className="font-medium">{formatCurrency(p.prixVente)}</span> },
            { key: "statut", label: "", render: (p) => <Badge variant={p.quantiteStock <= p.seuilAlerte ? "danger" : "success"}>{p.quantiteStock <= p.seuilAlerte ? "Stock bas" : "OK"}</Badge> },
            { key: "actions", label: "", render: (p) => <Link href={`/base/stock/${p.id}`} className="text-[#3b82f6] hover:underline text-xs font-medium">Gérer →</Link> },
          ]}
        />
      </div>
    </div>
  );
}
