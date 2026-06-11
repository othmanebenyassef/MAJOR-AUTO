import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("fr-MA", {
    style: "currency",
    currency: "MAD",
  }).format(amount);
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(date));
}

export function generateNumero(prefix: string): string {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const random = Math.floor(Math.random() * 9000) + 1000;
  return `${prefix}-${year}${month}-${random}`;
}

export const SERVICES = [
  "Carrosserie",
  "Peinture au four",
  "Mécanique",
  "Diagnostic",
  "Electricité",
  "Climatisation",
  "Révision",
  "Freinage",
  "Suspension",
  "Echappement",
];

export const STATUT_ORDRE_LABELS: Record<string, string> = {
  EN_ATTENTE: "En attente",
  EN_COURS: "En cours",
  EN_PAUSE: "En pause",
  TERMINE: "Terminé",
  LIVRE: "Livré",
};

export const STATUT_FACTURE_LABELS: Record<string, string> = {
  EN_ATTENTE: "En attente",
  PARTIELLEMENT_PAYEE: "Partiellement payée",
  PAYEE: "Payée",
  ANNULEE: "Annulée",
};

export const STATUT_LIVRAISON_LABELS: Record<string, string> = {
  EN_ATTENTE: "En attente",
  EN_COURS: "En cours",
  LIVRE: "Livré",
  ANNULE: "Annulé",
};
