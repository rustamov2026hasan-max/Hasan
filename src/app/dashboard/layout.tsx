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
      <aside className="w-[280px] bg-card border-r border-border flex-col hidden md:flex shadow-[4px_0_24px_rgba(0,0,0,0.02)] relative z-10">
        <div className="h-20 flex items-center px-8 border-b border-border bg-card">
          <Link href="/" className="flex items-center gap-3 text-brand-600 touch-target">
            <div className="bg-brand-500/10 p-2 rounded-xl">
              <Map className="w-7 h-7 text-brand-600 dark:text-brand-400" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-lg tracking-tight text-foreground leading-tight">CHORVA</span>
              <span className="text-xs font-semibold text-brand-600 uppercase tracking-widest leading-none">Kuzatuv</span>
            </div>
          </Link>
        </div>
        
        <nav className="flex-1 p-6 space-y-2.5 overflow-y-auto">
          <div className="text-[11px] font-bold text-muted-foreground/70 uppercase tracking-widest mb-4 px-3">Asosiy Menyu</div>
          
          <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3.5 rounded-xl bg-brand-50 border border-brand-100 dark:bg-brand-900/30 dark:border-brand-800 text-brand-700 dark:text-brand-300 font-semibold shadow-sm transition-all hover:shadow-md touch-target justify-start">
            <LayoutDashboard className="w-5 h-5 text-brand-600 dark:text-brand-400" />
            Asosiy Panel
          </Link>
          
          <Link href="/dashboard/map" className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground font-medium transition-all touch-target justify-start group">
            <Map className="w-5 h-5 text-muted-foreground group-hover:text-brand-500 transition-colors" />
            Jonli Xarita
          </Link>
          
          <Link href="/dashboard/alerts" className="flex items-center justify-between px-4 py-3.5 rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground font-medium transition-all touch-target group">
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-muted-foreground group-hover:text-amber-500 transition-colors" />
              Ogohlantirishlar
            </div>
            {MOCK_FARM_STATS.activeAlerts > 0 && (
              <span className="bg-red-500 text-white text-[11px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                {MOCK_FARM_STATS.activeAlerts}
              </span>
            )}
          </Link>
          
          <div className="text-[11px] font-bold text-muted-foreground/70 uppercase tracking-widest mb-4 mt-8 px-3">Tizim</div>
          
          <Link href="/dashboard/settings" className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground font-medium transition-all touch-target justify-start group">
            <Settings className="w-5 h-5 text-muted-foreground group-hover:text-slate-500 transition-colors" />
            Sozlamalar
          </Link>
        </nav>

        <div className="p-6 border-t border-border bg-muted/20">
          <Link href="/" className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-muted-foreground hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/30 dark:hover:text-red-400 font-medium transition-all touch-target justify-start">
            <LogOut className="w-5 h-5" />
            Tizimdan chiqish
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
