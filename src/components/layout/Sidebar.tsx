"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  BookOpen,
  TrendingDown,
  Truck,
  FileText,
  Database,
  ChevronDown,
  ChevronRight,
  ClipboardList,
  FileCheck,
  ShoppingCart,
  Package,
  Wrench,
  Shield,
  Users,
  Car,
  UserCog,
  Boxes,
  Building2,
  Handshake,
  Receipt,
  FilePlus,
  FileBarChart,
} from "lucide-react";

interface NavItem {
  href?: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  children?: { href: string; label: string; icon: React.ComponentType<{ className?: string }> }[];
}

const navItems: NavItem[] = [
  {
    href: "/dashboard",
    label: "Tableau de bord",
    icon: LayoutDashboard,
  },
  {
    href: "/journal",
    label: "Journal",
    icon: BookOpen,
  },
  {
    href: "/charges",
    label: "Charges d'exploitation",
    icon: TrendingDown,
  },
  {
    href: "/livraisons",
    label: "Livraisons",
    icon: Truck,
  },
  {
    label: "Documents",
    icon: FileText,
    children: [
      { href: "/documents/proces-verbal",     label: "Procès-verbal",             icon: FileCheck },
      { href: "/documents/devis",              label: "Devis",                     icon: FilePlus },
      { href: "/documents/ordres",             label: "Ordres de réparation",      icon: ClipboardList },
      { href: "/documents/bons-commande",      label: "Bons de commande",          icon: ShoppingCart },
      { href: "/documents/bons-livraison",     label: "Bons de livraison",         icon: Package },
      { href: "/documents/factures",           label: "Factures",                  icon: Receipt },
      { href: "/documents/fiches-techniques",  label: "Fiches techniques",         icon: Wrench },
      { href: "/documents/attestations",       label: "Attestation d'immobilisation", icon: Shield },
    ],
  },
  {
    label: "Base de données",
    icon: Database,
    children: [
      { href: "/base/clients",      label: "Clients",                        icon: Users },
      { href: "/base/vehicules",    label: "Véhicules",                      icon: Car },
      { href: "/base/personnel",    label: "Personnel",                      icon: UserCog },
      { href: "/base/stock",        label: "Stock pièces & fournitures",     icon: Boxes },
      { href: "/base/fournisseurs", label: "Fournisseurs",                   icon: Building2 },
      { href: "/base/bureaux",      label: "Bureaux d'expertises",           icon: FileBarChart },
      { href: "/base/partenaires",  label: "Partenaires",                    icon: Handshake },
    ],
  },
];

function NavGroup({ item }: { item: NavItem }) {
  const pathname = usePathname();
  const isChildActive = item.children?.some((c) => pathname.startsWith(c.href));
  const [open, setOpen] = useState(isChildActive ?? false);

  if (!item.children) {
    const active = pathname.startsWith(item.href!);
    const Icon = item.icon;
    return (
      <Link
        href={item.href!}
        className={cn(
          "flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-150",
          active
            ? "bg-[#eef3ff] text-[#3b82f6]"
            : "text-[#6b7280] hover:bg-[#f8f9fc] hover:text-[#1e2433]"
        )}
      >
        <Icon className="w-4 h-4 flex-shrink-0" />
        <span>{item.label}</span>
      </Link>
    );
  }

  const Icon = item.icon;
  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          "w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-150",
          isChildActive
            ? "bg-[#eef3ff] text-[#3b82f6]"
            : "text-[#6b7280] hover:bg-[#f8f9fc] hover:text-[#1e2433]"
        )}
      >
        <Icon className="w-4 h-4 flex-shrink-0" />
        <span className="flex-1 text-left">{item.label}</span>
        {open
          ? <ChevronDown className="w-3.5 h-3.5 opacity-60" />
          : <ChevronRight className="w-3.5 h-3.5 opacity-40" />}
      </button>

      {open && (
        <div className="mt-0.5 ml-3 pl-4 border-l-2 border-[#e8eaf0] space-y-0.5">
          {item.children.map((child) => {
            const ChildIcon = child.icon;
            const active = pathname.startsWith(child.href);
            return (
              <Link
                key={child.href}
                href={child.href}
                className={cn(
                  "flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all duration-150",
                  active
                    ? "bg-[#eef3ff] text-[#3b82f6] font-medium"
                    : "text-[#6b7280] hover:bg-[#f8f9fc] hover:text-[#1e2433]"
                )}
              >
                <ChildIcon className="w-3.5 h-3.5 flex-shrink-0" />
                <span>{child.label}</span>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function Sidebar() {
  return (
    <aside className="w-64 bg-white border-r border-[#e8eaf0] flex flex-col min-h-screen fixed left-0 top-0 z-40">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-[#e8eaf0]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#eef3ff] flex items-center justify-center">
            <Wrench className="w-5 h-5 text-[#3b82f6]" />
          </div>
          <div>
            <p className="font-bold text-[#1e2433] text-sm leading-tight">MAJOR AUTO</p>
            <p className="text-[10px] text-[#9ca3af] font-medium uppercase tracking-wide">Garage & Carrosserie</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => (
          <NavGroup key={item.href ?? item.label} item={item} />
        ))}
      </nav>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-[#e8eaf0]">
        <div className="flex items-center gap-2.5 px-2">
          <div className="w-7 h-7 rounded-full bg-[#eef3ff] flex items-center justify-center">
            <span className="text-[#3b82f6] text-xs font-bold">MA</span>
          </div>
          <div>
            <p className="text-xs font-semibold text-[#1e2433]">Major Auto</p>
            <p className="text-[10px] text-[#9ca3af]">Administrateur</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
