"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  Car,
  ClipboardList,
  FileText,
  Package,
  UserCog,
  TrendingDown,
  Truck,
  Settings,
  Wrench,
} from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Tableau de bord", icon: LayoutDashboard },
  { href: "/clients", label: "Clients", icon: Users },
  { href: "/vehicules", label: "Véhicules", icon: Car },
  { href: "/ordres", label: "Ordres de réparation", icon: ClipboardList },
  { href: "/factures", label: "Facturation", icon: FileText },
  { href: "/stock", label: "Stock pièces", icon: Package },
  { href: "/personnel", label: "Personnel", icon: UserCog },
  { href: "/charges", label: "Charges", icon: TrendingDown },
  { href: "/livraisons", label: "Livraisons", icon: Truck },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-gray-900 text-white flex flex-col min-h-screen fixed left-0 top-0 z-40">
      <div className="px-6 py-5 border-b border-gray-700">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-blue-500 rounded-lg flex items-center justify-center">
            <Wrench className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="font-bold text-base leading-tight">MAJOR AUTO</p>
            <p className="text-xs text-gray-400">Garage & Carrosserie</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                active
                  ? "bg-blue-600 text-white"
                  : "text-gray-400 hover:text-white hover:bg-gray-800"
              )}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="px-3 py-4 border-t border-gray-700">
        <Link
          href="/settings"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
        >
          <Settings className="w-4 h-4" />
          Paramètres
        </Link>
      </div>
    </aside>
  );
}
