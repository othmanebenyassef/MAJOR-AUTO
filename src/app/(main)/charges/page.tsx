import { Header } from "@/components/layout/Header";
import { Card, CardContent } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { formatCurrency, formatDate } from "@/lib/utils";
import { TrendingDown, Plus } from "lucide-react";
import Link from "next/link";

const CATEGORIE_LABELS: Record<string, string> = {
  LOYER: "Loyer", ELECTRICITE: "Électricité", EAU: "Eau",
  SALAIRES: "Salaires", FOURNITURES: "Fournitures", ASSURANCE: "Assurance",
  MAINTENANCE: "Maintenance", TRANSPORT: "Transport", AUTRE: "Autre",
};

export default async function ChargesPage() {
  const charges = await prisma.charge.findMany({ orderBy: { date: "desc" } });

  const totalMois = charges
    .filter((c) => {
      const d = new Date(c.date);
      const now = new Date();
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    })
    .reduce((s, c) => s + c.montant, 0);

  const byCategorie = charges.reduce((acc, c) => {
    acc[c.categorie] = (acc[c.categorie] || 0) + c.montant;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="flex flex-col flex-1">
      <Header title="Charges d'exploitation" subtitle={`Ce mois : ${formatCurrency(totalMois)}`} />
      <div className="flex-1 p-6 space-y-6">
        <div className="flex justify-end">
          <Link
            href="/charges/nouvelle"
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700"
          >
            <Plus className="w-4 h-4" />
            Ajouter une charge
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Object.entries(byCategorie).map(([cat, total]) => (
            <Card key={cat}>
              <CardContent className="pt-4">
                <p className="text-xs text-gray-500 font-medium">{CATEGORIE_LABELS[cat] || cat}</p>
                <p className="text-xl font-bold text-gray-900 mt-1">{formatCurrency(total)}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {charges.length === 0 ? (
          <Card>
            <CardContent className="py-16 text-center">
              <TrendingDown className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p className="text-gray-500">Aucune charge enregistrée</p>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-xs text-gray-500 border-b border-gray-100 bg-gray-50">
                    <th className="text-left px-6 py-3 font-medium">Date</th>
                    <th className="text-left px-6 py-3 font-medium">Libellé</th>
                    <th className="text-left px-6 py-3 font-medium">Catégorie</th>
                    <th className="text-right px-6 py-3 font-medium">Montant</th>
                    <th className="text-left px-6 py-3 font-medium">Récurrence</th>
                  </tr>
                </thead>
                <tbody>
                  {charges.map((c) => (
                    <tr key={c.id} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="px-6 py-3 text-sm text-gray-600">{formatDate(c.date)}</td>
                      <td className="px-6 py-3 text-sm font-medium">{c.libelle}</td>
                      <td className="px-6 py-3 text-sm text-gray-600">{CATEGORIE_LABELS[c.categorie] || c.categorie}</td>
                      <td className="px-6 py-3 text-sm font-bold text-right text-red-600">{formatCurrency(c.montant)}</td>
                      <td className="px-6 py-3 text-sm text-gray-500">
                        {c.recurrente ? `Récurrente (${c.periodicite})` : "Ponctuelle"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
