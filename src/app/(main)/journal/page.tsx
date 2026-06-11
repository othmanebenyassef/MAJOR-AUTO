import { Header } from "@/components/layout/Header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageTable } from "@/components/ui/page-table";
import { prisma } from "@/lib/prisma";
import { formatCurrency, formatDate } from "@/lib/utils";
import { BookOpen, ArrowUpCircle, ArrowDownCircle } from "lucide-react";
import Link from "next/link";

export default async function JournalPage() {
  const entrees = await prisma.journalEntree.findMany({ orderBy: { date: "desc" } });

  const totalEntrees = entrees.filter(e => e.type === "ENTREE").reduce((s, e) => s + e.montant, 0);
  const totalSorties = entrees.filter(e => e.type === "SORTIE").reduce((s, e) => s + e.montant, 0);
  const solde = totalEntrees - totalSorties;

  return (
    <div className="flex flex-col flex-1">
      <Header title="Journal" subtitle="Entrées et sorties de caisses et banques" />
      <div className="flex-1 p-6 space-y-6">

        {/* Solde cards */}
        <div className="grid grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-5 pb-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 bg-[#edfaf4] rounded-xl flex items-center justify-center">
                  <ArrowUpCircle className="w-5 h-5 text-[#10b981]" />
                </div>
                <span className="text-xs font-semibold text-[#9ca3af] uppercase tracking-wide">Total Entrées</span>
              </div>
              <p className="text-2xl font-bold text-[#10b981]">{formatCurrency(totalEntrees)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-5 pb-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 bg-[#fff1f3] rounded-xl flex items-center justify-center">
                  <ArrowDownCircle className="w-5 h-5 text-[#f43f5e]" />
                </div>
                <span className="text-xs font-semibold text-[#9ca3af] uppercase tracking-wide">Total Sorties</span>
              </div>
              <p className="text-2xl font-bold text-[#f43f5e]">{formatCurrency(totalSorties)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-5 pb-4">
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-9 h-9 ${solde >= 0 ? "bg-[#eef3ff]" : "bg-[#fff1f3]"} rounded-xl flex items-center justify-center`}>
                  <BookOpen className={`w-5 h-5 ${solde >= 0 ? "text-[#3b82f6]" : "text-[#f43f5e]"}`} />
                </div>
                <span className="text-xs font-semibold text-[#9ca3af] uppercase tracking-wide">Solde</span>
              </div>
              <p className={`text-2xl font-bold ${solde >= 0 ? "text-[#3b82f6]" : "text-[#f43f5e]"}`}>{formatCurrency(solde)}</p>
            </CardContent>
          </Card>
        </div>

        <PageTable
          rows={entrees}
          getKey={(e) => e.id}
          addHref="/journal/nouvelle"
          addLabel="Nouvelle opération"
          emptyIcon={<BookOpen className="w-6 h-6 text-[#9ca3af]" />}
          emptyText="Aucune opération enregistrée"
          columns={[
            { key: "date", label: "Date", render: (e) => <span className="text-[#6b7280]">{formatDate(e.date)}</span> },
            { key: "type", label: "Type", render: (e) => (
              <Badge variant={e.type === "ENTREE" ? "success" : "danger"}>
                {e.type === "ENTREE" ? "↑ Entrée" : "↓ Sortie"}
              </Badge>
            )},
            { key: "compte", label: "Compte", render: (e) => <span className="text-xs bg-[#f5f3ff] text-[#7c3aed] px-2.5 py-1 rounded-full font-medium">{e.compte}</span> },
            { key: "categorie", label: "Catégorie", render: (e) => <span className="text-[#6b7280]">{e.categorie}</span> },
            { key: "libelle", label: "Libellé", render: (e) => <span className="font-medium text-[#1e2433]">{e.libelle}</span> },
            { key: "reference", label: "Référence", render: (e) => <span className="font-mono text-xs text-[#9ca3af]">{e.reference ?? "—"}</span> },
            { key: "montant", label: "Montant", className: "text-right", render: (e) => (
              <span className={`font-bold ${e.type === "ENTREE" ? "text-[#10b981]" : "text-[#f43f5e]"}`}>
                {e.type === "ENTREE" ? "+" : "−"}{formatCurrency(e.montant)}
              </span>
            )},
          ]}
        />
      </div>
    </div>
  );
}
