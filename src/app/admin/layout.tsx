"use client";

import { usePathname, useRouter } from "next/navigation";
import { Leaf, UtensilsCrossed, Users, Sparkles, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

const navItems = [
  { href: "/admin/menu", label: "Menu", icon: UtensilsCrossed },
  { href: "/admin/employees", label: "Employees", icon: Users },
  { href: "/admin/generate", label: "Generate Plans", icon: Sparkles },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="sticky top-0 flex h-screen w-60 shrink-0 flex-col border-r border-gray-100 bg-white">
        <div className="flex items-center gap-2 px-5 py-5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#1B6B4D]">
            <Leaf className="h-4 w-4 text-white" />
          </div>
          <div>
            <span className="font-semibold text-[#1A1A2E]">NutriTech</span>
            <span className="ml-1.5 rounded bg-[#E8A838]/10 px-1.5 py-0.5 text-[10px] font-medium text-[#E8A838]">
              Admin
            </span>
          </div>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-4">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <button
                key={item.href}
                onClick={() => router.push(item.href)}
                className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  active
                    ? "bg-[#1B6B4D]/10 text-[#1B6B4D]"
                    : "text-[#3A4A42]/70 hover:bg-gray-50 hover:text-[#3A4A42]"
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="border-t border-gray-100 px-3 py-3">
          <Button variant="ghost" size="sm" className="w-full justify-start" onClick={logout}>
            <LogOut className="mr-2 h-4 w-4" /> Log out
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 bg-[#F7FAF8] p-8">{children}</main>
    </div>
  );
}
