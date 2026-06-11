"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function FactureActions({ factureId, statut }: { factureId: string; statut: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [modePaiement, setModePaiement] = useState("Espèces");

  async function marquerPayee() {
    setLoading(true);
    try {
      await fetch(`/api/factures/${factureId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ statut: "PAYEE", modePaiement, datePaiement: new Date() }),
      });
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  if (statut === "PAYEE" || statut === "ANNULEE") return null;

  return (
    <div className="flex items-center gap-3">
      <select
        className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white"
        value={modePaiement}
        onChange={(e) => setModePaiement(e.target.value)}
      >
        {["Espèces", "Carte bancaire", "Virement", "Chèque"].map((m) => (
          <option key={m}>{m}</option>
        ))}
      </select>
      <Button size="sm" disabled={loading} onClick={marquerPayee}>
        Marquer payée
      </Button>
    </div>
  );
}
