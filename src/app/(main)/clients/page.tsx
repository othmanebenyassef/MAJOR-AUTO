import { Header } from "@/components/layout/Header";
import { Card, CardContent } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import { Users, Phone, Mail, Car, Plus } from "lucide-react";
import Link from "next/link";

export default async function ClientsPage() {
  const clients = await prisma.client.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { vehicules: true } } },
  });

  return (
    <div className="flex flex-col flex-1">
      <Header title="Clients" subtitle={`${clients.length} client(s) enregistré(s)`} />
      <div className="flex-1 p-6">
        <div className="flex justify-between items-center mb-6">
          <div />
          <Link
            href="/clients/nouveau"
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Nouveau client
          </Link>
        </div>

        {clients.length === 0 ? (
          <Card>
            <CardContent className="py-16 text-center">
              <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p className="text-gray-500">Aucun client enregistré</p>
              <Link href="/clients/nouveau" className="text-blue-600 text-sm mt-2 inline-block hover:underline">
                Ajouter le premier client
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {clients.map((client) => (
              <Link key={client.id} href={`/clients/${client.id}`}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="pt-5">
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-700 font-bold text-sm">
                          {client.prenom[0]}{client.nom[0]}
                        </span>
                      </div>
                      <span className="text-xs text-gray-400">{formatDate(client.createdAt)}</span>
                    </div>
                    <h3 className="font-semibold text-gray-900">{client.prenom} {client.nom}</h3>
                    <div className="mt-2 space-y-1">
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Phone className="w-3.5 h-3.5" />
                        {client.telephone}
                      </div>
                      {client.email && (
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Mail className="w-3.5 h-3.5" />
                          {client.email}
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Car className="w-3.5 h-3.5" />
                        {client._count.vehicules} véhicule(s)
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
