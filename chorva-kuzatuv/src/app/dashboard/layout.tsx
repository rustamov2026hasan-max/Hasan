import Link from "next/link";
import { Map, LayoutDashboard, Settings, Bell, LogOut } from "lucide-react";
import { MOCK_FARM_STATS } from "@/data/mock";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen bg-muted/30 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-card border-r border-border flex flex-col hidden md:flex">
        <div className="h-16 flex items-center px-6 border-b border-border">
          <Link href="/" className="flex items-center gap-2 text-brand-600">
            <Map className="w-6 h-6" />
            <span className="font-bold text-lg">CHORVA KUZATUV</span>
          </Link>
        </div>
        
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 mt-4 px-2">Menu</div>
          <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2 rounded-md bg-brand-50 dark:bg-brand-900/20 text-brand-700 dark:text-brand-300 font-medium">
            <LayoutDashboard className="w-5 h-5" />
            Asosiy Panel
          </Link>
          <Link href="/dashboard/map" className="flex items-center gap-3 px-3 py-2 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground font-medium transition-colors">
            <Map className="w-5 h-5" />
            Jonli Xarita
          </Link>
          <Link href="/dashboard/alerts" className="flex items-center justify-between px-3 py-2 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground font-medium transition-colors">
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5" />
              Ogohlantirishlar
            </div>
            {MOCK_FARM_STATS.activeAlerts > 0 && (
              <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                {MOCK_FARM_STATS.activeAlerts}
              </span>
            )}
          </Link>
          <Link href="/dashboard/settings" className="flex items-center gap-3 px-3 py-2 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground font-medium transition-colors">
            <Settings className="w-5 h-5" />
            Sozlamalar
          </Link>
        </nav>

        <div className="p-4 border-t border-border">
          <Link href="/" className="flex items-center gap-3 px-3 py-2 rounded-md text-muted-foreground hover:bg-red-50 hover:text-red-600 font-medium transition-colors">
            <LogOut className="w-5 h-5" />
            Chiqish
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile Header (hidden on desktop) */}
        <header className="h-16 border-b border-border bg-card flex items-center justify-between px-4 md:hidden">
          <Link href="/" className="flex items-center gap-2 text-brand-600">
            <Map className="w-6 h-6" />
            <span className="font-bold text-lg">CHORVA KUZATUV</span>
          </Link>
          <button className="p-2 text-muted-foreground">
             <LayoutDashboard className="w-6 h-6" />
          </button>
        </header>
        
        <div className="flex-1 overflow-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
