"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MOCK_FARM_STATS, MOCK_ALERTS } from "@/data/mock";
import { Activity, AlertTriangle, BatteryWarning, WifiOff, CheckCircle2, TrendingUp, TrendingDown, ThermometerSun, Map } from "lucide-react";
import { Badge } from "@/components/ui/badge";

// Dynamically import Map to prevent SSR issues with Leaflet
const MapPreview = dynamic(() => import("@/components/Map"), { 
  ssr: false,
  loading: () => <div className="w-full h-full bg-muted/50 animate-pulse rounded-2xl flex flex-col items-center justify-center text-muted-foreground"><Map className="w-10 h-10 mb-4 opacity-50"/> Xarita ulanmoqda...</div>
});

export default function Dashboard() {
  const [stats, setStats] = useState(MOCK_FARM_STATS);
  const [alerts, setAlerts] = useState(MOCK_ALERTS);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const statsRes = await fetch("http://localhost:8000/api/v1/dashboard/stats");
        if (statsRes.ok) setStats(await statsRes.json());
        
        const alertsRes = await fetch("http://localhost:8000/api/v1/dashboard/alerts");
        if (alertsRes.ok) setAlerts(await alertsRes.json());
      } catch (err) {
        // Silently fallback to mock data on error
      }
    };
    
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-4 md:p-8 space-y-8 max-w-[1800px] mx-auto min-h-screen">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-card p-6 rounded-2xl shadow-sm border border-border/50">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Operativ Boshqaruv</h1>
          <p className="text-muted-foreground font-medium mt-1">Fermaning jonli telemetriya ko'rsatkichlari (Toshkent vaqti)</p>
        </div>
        <div className="flex items-center gap-3 bg-brand-50 dark:bg-brand-900/30 px-4 py-2 rounded-xl border border-brand-100 dark:border-brand-800">
          <ThermometerSun className="w-5 h-5 text-amber-500" />
          <span className="font-bold text-brand-700 dark:text-brand-300">32°C / 10K+ Lux (Quyosh)</span>
        </div>
      </div>

      {/* Premium KPI Cards (AgTech Earthy Tones) */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
        <KPICard title="Jami Chorva" value={stats.totalAnimals.toString()} label="Barcha ro'yxatdagilar" icon={<CheckCircle2 className="w-5 h-5 text-slate-400" />} />
        <KPICard title="Online (Telemetriya)" value={stats.onlineCount.toString()} label="Faol aloqada" valueClass="text-brand-600 dark:text-brand-400" bgClass="bg-brand-50/50 dark:bg-brand-900/10" icon={<Activity className="w-5 h-5 text-brand-500" />} trend="+12" />
        <KPICard title="Offline (Ulanish yo'q)" value={stats.offlineCount.toString()} label="Aloqa uzilgan" valueClass="text-slate-600 dark:text-slate-400" icon={<WifiOff className="w-5 h-5 text-slate-400" />} />
        <KPICard title="Xavf va Alertlar" value={stats.activeAlerts.toString()} label="Zudlik bilan choralar" valueClass="text-red-600 dark:text-red-400" bgClass="bg-red-50/50 dark:bg-red-900/10 border-red-100 dark:border-red-900/50" icon={<AlertTriangle className="w-5 h-5 text-red-500" />} trend="+2" />
        <KPICard title="Batareya past" value={stats.lowBatteryCount.toString()} label="< 20% quvvat qoldi" valueClass="text-amber-600 dark:text-amber-500" icon={<BatteryWarning className="w-5 h-5 text-amber-500" />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 h-full">
        {/* Map Section (Premium Large Panel) */}
        <Card className="col-span-1 lg:col-span-2 flex flex-col shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-3xl overflow-hidden border-border/60">
          <CardHeader className="pb-4 border-b bg-muted/20 px-6 py-5">
            <div className="flex justify-between items-center">
              <CardTitle className="text-xl">Hududiy Nazorat (Jonli Xarita)</CardTitle>
              <Badge variant="outline" className="bg-brand-50 text-brand-700 border-brand-200">GPS Signal: A'lo</Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0 flex-1 min-h-[500px] lg:min-h-[600px] relative">
            <MapPreview />
            {/* Overlay Map controls logic can be here */}
          </CardContent>
        </Card>

        {/* Side Panel: Agentic AI & Alerts */}
        <div className="space-y-6 flex flex-col">
          
          {/* Telescoping Agentic AI Prompt (The "Now What?") */}
          <Card className="shadow-[0_8px_30px_rgb(0,0,0,0.04)] border-brand-400 bg-gradient-to-br from-brand-50 to-white dark:from-brand-950/40 dark:to-card rounded-3xl overflow-hidden">
            <CardHeader className="pb-3 border-b border-brand-100 dark:border-brand-900/50 px-6 py-5 bg-brand-500/5">
              <CardTitle className="text-brand-800 dark:text-brand-300 flex items-center gap-3 text-lg">
                <div className="bg-brand-100 dark:bg-brand-900 p-2 rounded-lg">
                  <Activity className="w-5 h-5 text-brand-600" />
                </div>
                AI Maslahatchi
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-5">
              <div className="bg-white dark:bg-card p-5 rounded-2xl border border-border shadow-sm">
                <div className="flex items-start gap-3 mb-3">
                  <AlertTriangle className="w-6 h-6 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-base text-foreground mb-1">Yaylov almashinish vaqti keldi</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      <strong className="text-foreground">B-12 sektori</strong> yaylov biomassasi kritik darajadan tushib ketdi (NDVI &lt; 0.145). Tuproq eroziyasini oldini olish uchun qoramollarni zudlik bilan <strong>B-13 sektoriga</strong> o'tkazish tavsiya etiladi.
                    </p>
                  </div>
                </div>
                
                {/* Premium Slide-to-Confirm */}
                <div className="mt-5 slide-confirm flex items-center w-full touch-target shadow-inner bg-muted rounded-full relative overflow-hidden h-14 border border-border/50">
                  <div className="absolute left-1 top-1 bottom-1 bg-brand-500 flex items-center justify-center rounded-full px-6 min-w-[80px] cursor-pointer hover:bg-brand-600 transition-colors z-20 text-white font-black shadow-md">
                    O'TKAZISH
                  </div>
                  <span className="w-full text-center text-[13px] font-bold text-muted-foreground z-10 pl-16 uppercase tracking-wider">
                    Tasdiqlash uchun suring
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Active Alerts Panel */}
          <Card className="shadow-sm rounded-3xl flex-1 border-border/60 flex flex-col">
            <CardHeader className="pb-4 border-b px-6 py-5">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Tezkor Xabarnomalar</CardTitle>
                <Badge variant="destructive" className="rounded-xl px-3">{stats.activeAlerts} ta faol</Badge>
              </div>
            </CardHeader>
            <CardContent className="p-0 flex-1 overflow-y-auto min-h-[300px]">
              <div className="divide-y divide-border/50">
                {alerts.map(alert => (
                  <div key={alert.id} className={`p-5 flex gap-4 transition-colors hover:bg-muted/30 ${alert.isResolved ? 'opacity-50 grayscale' : ''}`}>
                    <div className="mt-1 shrink-0 bg-background rounded-full p-2 border border-border/50 shadow-sm">
                      {alert.type === 'Geofence Breach' && <AlertTriangle className="w-5 h-5 text-red-500" />}
                      {alert.type === 'Low Battery' && <BatteryWarning className="w-5 h-5 text-amber-500" />}
                      {alert.type === 'Signal Lost' && <WifiOff className="w-5 h-5 text-slate-400" />}
                      {alert.type === 'Safe' && <CheckCircle2 className="w-5 h-5 text-brand-500" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1.5">
                        <span className="font-bold text-base">{alert.animalId}</span>
                        <span className="text-xs font-medium text-muted-foreground/70 bg-muted px-2 py-0.5 rounded-md">{new Date(alert.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                      </div>
                      <p className="text-sm text-muted-foreground leading-snug">{alert.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function KPICard({ title, value, label, valueClass = "", bgClass = "bg-card", icon, trend }: { title: string, value: string, label: string, valueClass?: string, bgClass?: string, icon?: React.ReactNode, trend?: string }) {
  return (
    <Card className={`shadow-sm border-border/60 rounded-2xl overflow-hidden transition-all hover:shadow-md ${bgClass}`}>
      <CardContent className="p-5 flex flex-col justify-between h-full relative">
        {icon && <div className="absolute top-5 right-5 opacity-40">{icon}</div>}
        <div>
          <h3 className="text-[13px] font-bold text-muted-foreground uppercase tracking-wider mb-2 pr-8">{title}</h3>
          <div className="flex items-baseline gap-2 mb-1">
            <div className={`text-4xl font-black tracking-tighter ${valueClass}`}>{value}</div>
            {trend && (
              <span className="text-xs font-bold text-brand-600 bg-brand-100 dark:bg-brand-900/50 dark:text-brand-400 px-1.5 py-0.5 rounded-md flex items-center">
                <TrendingUp className="w-3 h-3 mr-0.5" />
                {trend}
              </span>
            )}
          </div>
        </div>
        <p className="text-xs font-medium text-muted-foreground/80 mt-2">{label}</p>
      </CardContent>
    </Card>
  )
}
