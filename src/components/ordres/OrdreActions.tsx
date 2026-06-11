"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface Props {
  ordreId: string;
  statut: string;
  hasFacture: boolean;
}

const TRANSITIONS: Record<string, string[]> = {
  EN_ATTENTE: ["EN_COURS"],
  EN_COURS: ["EN_PAUSE", "TERMINE"],
  EN_PAUSE: ["EN_COURS"],
  TERMINE: ["LIVRE"],
  LIVRE: [],
};

const LABELS: Record<string, string> = {
  EN_COURS: "Démarrer",
  EN_PAUSE: "Mettre en pause",
  TERMINE: "Marquer terminé",
  LIVRE: "Marquer livré",
};

export function OrdreActions({ ordreId, statut, hasFacture }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const nextStatuts = TRANSITIONS[statut] || [];

  async function changeStatut(newStatut: string) {
    setLoading(true);
    try {
      await fetch(`/api/ordres/${ordreId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ statut: newStatut }),
      });
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  async function genererFacture() {
    setLoading(true);
    try {
      const res = await fetch(`/api/ordres/${ordreId}/facture`, { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        router.push(`/factures/${data.id}`);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center gap-2">
      {nextStatuts.map((s) => (
        <Button key={s} size="sm" variant="outline" disabled={loading} onClick={() => changeStatut(s)}>
          {LABELS[s]}
        </Button>
      ))}
      {statut === "TERMINE" && !hasFacture && (
        <Button size="sm" disabled={loading} onClick={genererFacture}>
          Générer facture
        </Button>
      )}
      {hasFacture && (
        <span className="text-sm text-green-600 font-medium">✓ Facture générée</span>
      )}
    </div>
  );
}
