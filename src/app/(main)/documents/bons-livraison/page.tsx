import { Header } from "@/components/layout/Header";
import { Card, CardContent } from "@/components/ui/card";
import { Package } from "lucide-react";
import Link from "next/link";

export default function Page() {
  return (
    <div className="flex flex-col flex-1">
      <Header title="Bons de livraison" />
      <div className="flex-1 p-6">
        <Card>
          <CardContent className="py-16 text-center">
            <div className="w-12 h-12 rounded-2xl bg-[#f8f9fc] flex items-center justify-center mx-auto mb-3">
              <Package className="w-6 h-6 text-[#9ca3af]" />
            </div>
            <p className="text-sm text-[#9ca3af] mb-3">Aucun document pour l'instant</p>
            <Link href="/documents/bons-livraison/nouveau" className="inline-flex items-center gap-2 bg-[#3b82f6] text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-[#2563eb]">
              + Créer
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
