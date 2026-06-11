"use client";

import { Bell, Search } from "lucide-react";

interface HeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export function Header({ title, subtitle, actions }: HeaderProps) {
  return (
    <header className="bg-white border-b border-[#e8eaf0] px-6 py-4 flex items-center justify-between sticky top-0 z-30">
      <div>
        <h1 className="text-lg font-bold text-[#1e2433]">{title}</h1>
        {subtitle && <p className="text-sm text-[#9ca3af] mt-0.5">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-3">
        {actions}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#9ca3af]" />
          <input
            type="text"
            placeholder="Rechercher…"
            className="pl-9 pr-4 py-2 bg-[#f8f9fc] border border-[#e8eaf0] rounded-xl text-sm text-[#1e2433] placeholder:text-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#c7d7fd] focus:border-[#3b82f6] transition w-52"
          />
        </div>
        <button className="relative p-2 hover:bg-[#f8f9fc] rounded-xl transition">
          <Bell className="w-4 h-4 text-[#6b7280]" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-[#f43f5e] rounded-full" />
        </button>
      </div>
    </header>
  );
}
