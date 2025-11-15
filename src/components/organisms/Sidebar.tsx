/** @format */

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/atoms/Logo";
import { ROUTES } from "@/lib/constants";
import {
  LayoutDashboard,
  Users,
  Heart,
  TrendingDown,
  FileText,
    Settings, 
  Contact,
  Home
} from "lucide-react";
import { useSidebarStore } from "@/store/sidebarStore";

const menuItems = [
  {
    title: "MENU",
    items: [
      {
        label: "Dashboard",
        icon: LayoutDashboard,
        href: ROUTES.DASHBOARD
      },
      {
        label: "Etudiants",
        icon: Contact,
        href: ROUTES.ETUDIANTS
      },
      {
        label: "Résidences",
        icon: Home,
        href: ROUTES.RESIDENCE
      },
      {
        label: "Cotisations",
        icon: Users,
        href: ROUTES.COTISATIONS
      },
      {
        label: "Dons",
        icon: Heart,
        href: ROUTES.DONS
      },
      {
        label: "Dépenses",
        icon: TrendingDown,
        href: ROUTES.DEPENSES
      },
      {
        label: "Rapports",
        icon: FileText,
        href: ROUTES.RAPPORTS
      }
    ]
  },
  {
    title: "AUTRES",
    items: [
      {
        label: "Paramètres",
        icon: Settings,
        href: ROUTES.PARAMETRES
      }
    ]
  }
];

export function Sidebar() {
  const pathname = usePathname();
  const { isOpen, closeSidebar } = useSidebarStore();

  return (
    <aside
      className={`fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-200 z-50 transform transition-transform duration-300
    ${isOpen ? "translate-x-0" : "-translate-x-full"}
    md:translate-x-0 md:static md:block`}>
      <div className="p-6">
        <Logo />
      </div>

      <nav className="flex-1 px-4 space-y-6 items-center">
        {menuItems.map((section) => (
          <div key={section.title} >
            <h3 className="px-3 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
              {section.title}
            </h3>
            <div className="">
              <button
                onClick={closeSidebar}
                className="text-gray-500 text-2xl absolute top-4 right-4 md:hidden ">
                ✕
              </button>
            </div>

            <ul className="space-y-1">
              {section.items.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2 rounded-lg text-xs md:text-sm font-medium transition-colors",
                        isActive
                          ? "bg-primary text-white"
                          : "text-gray-600 hover:bg-gray-100"
                      )}>
                      <Icon className="h-5 w-5" />
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
}
