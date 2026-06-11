import { Header } from "@/components/layout/Header";
import { Card, CardContent } from "@/components/ui/card";
import { PageTable } from "@/components/ui/page-table";
import { prisma } from "@/lib/prisma";
import { formatCurrency, formatDate } from "@/lib/utils";
import { TrendingDown } from "lucide-react";

const CAT_LABELS: Record<string, string> = {
  LOYER: "Loyer", ELECTRICITE: "Électricité", EAU: "Eau", SALAIRES: "Salaires",
  FOURNITURES: "Fournitures", ASSURANCE: "Assurance", MAINTENANCE: "Maintenance",
  TRANSPORT: "Transport", AUTRE: "Autre",
};

export default async function ChargesPage() {
  const charges = await prisma.charge.findMany({ orderBy: { date: "desc" } });

  const now = new Date();
  const totalMois = charges
    .filter(c => { const d = new Date(c.date); return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear(); })
    .reduce((s, c) => s + c.montant, 0);

  const byCategorie = charges.reduce((acc: Record<string, number>, c) => {
    acc[c.categorie] = (acc[c.categorie] || 0) + c.montant;
    return acc;
  }, {});

  return (
    <div className="flex flex-col flex-1">
      <Header title="Charges d'exploitation" subtitle={`Ce mois : ${formatCurrency(totalMois)}`} />
      <div className="flex-1 p-6 space-y-6">
        {Object.keys(byCategorie).length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(byCategorie).map(([cat, total]) => (
              <Card key={cat}>
                <CardContent className="pt-4 pb-4">
                  <p className="text-xs text-[#9ca3af] font-medium uppercase tracking-wide">{CAT_LABELS[cat] || cat}</p>
                  <p className="text-lg font-bold text-[#f43f5e] mt-1">{formatCurrency(total)}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <PageTable
          rows={charges}
          getKey={(c) => c.id}
          addHref="/charges/nouvelle"
          addLabel="Ajouter une charge"
          emptyIcon={<TrendingDown className="w-6 h-6 text-[#9ca3af]" />}
          emptyText="Aucune charge enregistrée"
          columns={[
            { key: "date", label: "Date", render: (c) => <span className="text-[#6b7280]">{formatDate(c.date)}</span> },
            { key: "libelle", label: "Libellé", render: (c) => <span className="font-medium text-[#1e2433]">{c.libelle}</span> },
            { key: "categorie", label: "Catégorie", render: (c) => <span className="text-xs bg-[#f5f3ff] text-[#7c3aed] px-2.5 py-1 rounded-full font-medium">{CAT_LABELS[c.categorie] || c.categorie}</span> },
            { key: "montant", label: "Montant", className: "text-right", render: (c) => <span className="font-bold text-[#f43f5e]">{formatCurrency(c.montant)}</span> },
            { key: "recurrence", label: "Récurrence", render: (c) => <span className="text-[#9ca3af] text-xs">{c.recurrente ? `Récurrente (${c.periodicite})` : "Ponctuelle"}</span> },
          ]}
        />
      </div>
    </div>
  );
}
