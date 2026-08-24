import Link from "next/link";
import { Map, LayoutDashboard, Settings, Bell, LogOut } from "lucide-react";
import { MOCK_FARM_STATS } from "@/data/mock";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Desktop Sidebar (Hidden on mobile) */}
      <aside className="w-64 bg-card border-r border-border flex flex-col hidden md:flex">
        <div className="h-16 flex items-center px-6 border-b border-border">
          <Link href="/" className="flex items-center gap-2 text-brand-600 touch-target">
            <Map className="w-6 h-6" />
            <span className="font-bold text-lg">CHORVA KUZATUV</span>
          </Link>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 mt-4 px-2">Menu</div>
          <Link href="/dashboard" className="flex items-center gap-3 px-3 rounded-md bg-brand-50 dark:bg-brand-900/20 text-brand-700 dark:text-brand-300 font-medium touch-target justify-start">
            <LayoutDashboard className="w-5 h-5" />
            Asosiy Panel
          </Link>
          <Link href="/dashboard/map" className="flex items-center gap-3 px-3 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground font-medium transition-colors touch-target justify-start">
            <Map className="w-5 h-5" />
            Jonli Xarita
          </Link>
          <Link href="/dashboard/alerts" className="flex items-center justify-between px-3 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground font-medium transition-colors touch-target">
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
          <Link href="/dashboard/settings" className="flex items-center gap-3 px-3 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground font-medium transition-colors touch-target justify-start">
            <Settings className="w-5 h-5" />
            Sozlamalar
          </Link>
        </nav>

        <div className="p-4 border-t border-border">
          <Link href="/" className="flex items-center gap-3 px-3 rounded-md text-muted-foreground hover:bg-red-50 hover:text-red-600 font-medium transition-colors touch-target justify-start">
            <LogOut className="w-5 h-5" />
            Chiqish
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden pb-[70px] md:pb-0 relative">
        <div className="flex-1 overflow-auto bg-background">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Navigation (Ergonomic Thumb-Zone) */}
      <nav className="md:hidden fixed bottom-0 w-full h-[70px] bg-card border-t border-border flex items-center justify-around z-50 px-2 shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
        <Link href="/dashboard" className="flex flex-col items-center justify-center text-brand-600 touch-target w-full">
          <LayoutDashboard className="w-6 h-6 mb-1" />
          <span className="text-[10px] font-medium">Panel</span>
        </Link>
        <Link href="/dashboard/map" className="flex flex-col items-center justify-center text-muted-foreground hover:text-foreground touch-target w-full">
          <Map className="w-6 h-6 mb-1" />
          <span className="text-[10px] font-medium">Xarita</span>
        </Link>
        <Link href="/dashboard/alerts" className="flex flex-col items-center justify-center text-muted-foreground hover:text-foreground touch-target w-full relative">
          <Bell className="w-6 h-6 mb-1" />
          {MOCK_FARM_STATS.activeAlerts > 0 && (
            <span className="absolute top-1 right-3 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border border-card">
              {MOCK_FARM_STATS.activeAlerts}
            </span>
          )}
          <span className="text-[10px] font-medium">Xavf</span>
        </Link>
        <Link href="/dashboard/settings" className="flex flex-col items-center justify-center text-muted-foreground hover:text-foreground touch-target w-full">
          <Settings className="w-6 h-6 mb-1" />
          <span className="text-[10px] font-medium">Sozlama</span>
        </Link>
      </nav>
    </div>
  );
}
