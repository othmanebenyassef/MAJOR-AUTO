"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { formatCurrency } from "@/lib/utils";
import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface Ligne {
  id: string;
  type: string;
  description: string;
  quantite: number;
  prixUnitaire: number;
  piece: { nom: string } | null;
}

interface Props {
  ordreId: string;
  lignes: Ligne[];
  totalHT: number;
}

export function LignesOrdre({ ordreId, lignes, totalHT }: Props) {
  const router = useRouter();
  const [adding, setAdding] = useState(false);
  const [loading, setLoading] = useState(false);
  const [newLigne, setNewLigne] = useState({
    type: "MAIN_OEUVRE",
    description: "",
    quantite: "1",
    prixUnitaire: "",
  });

  async function addLigne() {
    if (!newLigne.description || !newLigne.prixUnitaire) return;
    setLoading(true);
    try {
      await fetch(`/api/ordres/${ordreId}/lignes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newLigne,
          quantite: parseFloat(newLigne.quantite),
          prixUnitaire: parseFloat(newLigne.prixUnitaire),
        }),
      });
      setNewLigne({ type: "MAIN_OEUVRE", description: "", quantite: "1", prixUnitaire: "" });
      setAdding(false);
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  async function deleteLigne(ligneId: string) {
    await fetch(`/api/ordres/${ordreId}/lignes/${ligneId}`, { method: "DELETE" });
    router.refresh();
  }

  const tva = totalHT * 0.2;
  const ttc = totalHT + tva;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Lignes de travaux</CardTitle>
          <Button size="sm" variant="outline" onClick={() => setAdding(true)}>
            <Plus className="w-4 h-4" />
            Ajouter une ligne
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <table className="w-full">
          <thead>
            <tr className="text-xs text-gray-500 border-b border-gray-100 bg-gray-50">
              <th className="text-left px-6 py-3 font-medium">Type</th>
              <th className="text-left px-6 py-3 font-medium">Description</th>
              <th className="text-right px-6 py-3 font-medium">Qté</th>
              <th className="text-right px-6 py-3 font-medium">P.U. HT</th>
              <th className="text-right px-6 py-3 font-medium">Total HT</th>
              <th className="px-6 py-3" />
            </tr>
          </thead>
          <tbody>
            {lignes.map((l) => (
              <tr key={l.id} className="border-b border-gray-50">
                <td className="px-6 py-3 text-xs text-gray-500">
                  {l.type === "MAIN_OEUVRE" ? "Main d'œuvre" : l.type === "PIECE" ? "Pièce" : "Forfait"}
                </td>
                <td className="px-6 py-3 text-sm">{l.description}</td>
                <td className="px-6 py-3 text-sm text-right">{l.quantite}</td>
                <td className="px-6 py-3 text-sm text-right">{formatCurrency(l.prixUnitaire)}</td>
                <td className="px-6 py-3 text-sm font-medium text-right">{formatCurrency(l.quantite * l.prixUnitaire)}</td>
                <td className="px-6 py-3 text-right">
                  <button onClick={() => deleteLigne(l.id)} className="text-red-500 hover:text-red-700 p-1">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}

            {adding && (
              <tr className="border-b border-blue-100 bg-blue-50">
                <td className="px-3 py-2">
                  <select
                    className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm bg-white"
                    value={newLigne.type}
                    onChange={(e) => setNewLigne({ ...newLigne, type: e.target.value })}
                  >
                    <option value="MAIN_OEUVRE">Main d'œuvre</option>
                    <option value="PIECE">Pièce</option>
                    <option value="FORFAIT">Forfait</option>
                  </select>
                </td>
                <td className="px-3 py-2">
                  <input
                    className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm"
                    placeholder="Description"
                    value={newLigne.description}
                    onChange={(e) => setNewLigne({ ...newLigne, description: e.target.value })}
                  />
                </td>
                <td className="px-3 py-2">
                  <input
                    type="number"
                    step="0.5"
                    className="w-20 px-2 py-1.5 border border-gray-300 rounded text-sm text-right"
                    value={newLigne.quantite}
                    onChange={(e) => setNewLigne({ ...newLigne, quantite: e.target.value })}
                  />
                </td>
                <td className="px-3 py-2">
                  <input
                    type="number"
                    step="0.01"
                    className="w-28 px-2 py-1.5 border border-gray-300 rounded text-sm text-right"
                    placeholder="0.00"
                    value={newLigne.prixUnitaire}
                    onChange={(e) => setNewLigne({ ...newLigne, prixUnitaire: e.target.value })}
                  />
                </td>
                <td className="px-3 py-2 text-sm text-right font-medium text-gray-600">
                  {newLigne.prixUnitaire
                    ? formatCurrency(parseFloat(newLigne.quantite || "1") * parseFloat(newLigne.prixUnitaire))
                    : "-"}
                </td>
                <td className="px-3 py-2">
                  <div className="flex gap-1">
                    <button
                      onClick={addLigne}
                      disabled={loading}
                      className="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700"
                    >
                      OK
                    </button>
                    <button
                      onClick={() => setAdding(false)}
                      className="text-xs text-gray-500 px-2 py-1 rounded hover:bg-gray-100"
                    >
                      ✕
                    </button>
                  </div>
                </td>
              </tr>
            )}

            {lignes.length === 0 && !adding && (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-sm text-gray-400">
                  Aucune ligne — cliquez sur "Ajouter une ligne"
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {lignes.length > 0 && (
          <div className="border-t border-gray-100 px-6 py-4 flex justify-end">
            <div className="space-y-1 text-sm min-w-48">
              <div className="flex justify-between text-gray-600">
                <span>Total HT</span>
                <span>{formatCurrency(totalHT)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>TVA (20%)</span>
                <span>{formatCurrency(tva)}</span>
              </div>
              <div className="flex justify-between font-bold text-gray-900 border-t border-gray-200 pt-1 mt-1">
                <span>Total TTC</span>
                <span>{formatCurrency(ttc)}</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
