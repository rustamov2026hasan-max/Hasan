"use client";

import dynamic from "next/dynamic";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MOCK_FARM_STATS, MOCK_ALERTS } from "@/data/mock";
import { Activity, AlertTriangle, BatteryWarning, WifiOff, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Dynamically import Map to prevent SSR issues with Leaflet
const MapPreview = dynamic(() => import("@/components/Map"), { 
  ssr: false,
  loading: () => <div className="w-full h-full bg-muted animate-pulse rounded-xl flex items-center justify-center">Xarita yuklanmoqda...</div>
});

const activityData = [
  { time: '08:00', active: 45, resting: 55 },
  { time: '10:00', active: 70, resting: 30 },
  { time: '12:00', active: 20, resting: 80 },
  { time: '14:00', active: 35, resting: 65 },
  { time: '16:00', active: 85, resting: 15 },
  { time: '18:00', active: 60, resting: 40 },
];

export default function Dashboard() {
  return (
    <div className="p-4 md:p-8 space-y-6 max-w-[1600px] mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Asosiy Panel</h1>
          <p className="text-muted-foreground">Fermaning joriy holati va xulosalar</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        <KPICard title="Jami Chorva" value={MOCK_FARM_STATS.totalAnimals.toString()} label="Barcha ro'yxatdagilar" />
        <KPICard title="Online" value={MOCK_FARM_STATS.onlineCount.toString()} label="Faol aloqada" valueClass="text-green-500" />
        <KPICard title="Offline" value={MOCK_FARM_STATS.offlineCount.toString()} label="Aloqa yo'q" valueClass="text-slate-500" />
        <KPICard title="Alertlar" value={MOCK_FARM_STATS.activeAlerts.toString()} label="Yechilmagan xavflar" valueClass="text-red-500" />
        <KPICard title="Batareya past" value={MOCK_FARM_STATS.lowBatteryCount.toString()} label="< 20% quvvat" valueClass="text-amber-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map Section */}
        <Card className="col-span-1 lg:col-span-2 flex flex-col shadow-sm">
          <CardHeader className="pb-3 border-b">
            <CardTitle>Jonli Xarita</CardTitle>
          </CardHeader>
          <CardContent className="p-0 flex-1 min-h-[400px]">
            <MapPreview />
          </CardContent>
        </Card>

        {/* Side Panel: Alerts & Analytics */}
        <div className="space-y-6 flex flex-col">
          {/* Active Alerts */}
          <Card className="shadow-sm flex-1">
            <CardHeader className="pb-3 border-b">
              <div className="flex items-center justify-between">
                <CardTitle>So'nggi ogohlantirishlar</CardTitle>
                <Badge variant="destructive">{MOCK_FARM_STATS.activeAlerts} ta yangi</Badge>
              </div>
            </CardHeader>
            <CardContent className="p-0 max-h-[300px] overflow-y-auto">
              <div className="divide-y divide-border">
                {MOCK_ALERTS.map(alert => (
                  <div key={alert.id} className={`p-4 flex gap-3 ${alert.isResolved ? 'opacity-60' : 'bg-muted/30'}`}>
                    <div className="mt-0.5">
                      {alert.type === 'Geofence Breach' && <AlertTriangle className="w-5 h-5 text-red-500" />}
                      {alert.type === 'Low Battery' && <BatteryWarning className="w-5 h-5 text-amber-500" />}
                      {alert.type === 'Signal Lost' && <WifiOff className="w-5 h-5 text-slate-500" />}
                      {alert.type === 'Safe' && <CheckCircle2 className="w-5 h-5 text-green-500" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-sm">{alert.animalId}</span>
                        <span className="text-xs text-muted-foreground">{new Date(alert.timestamp).toLocaleTimeString()}</span>
                      </div>
                      <p className="text-sm text-foreground">{alert.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Agentic AI Prompt (Telescoping Interface) */}
          <Card className="shadow-sm border-brand-500 bg-brand-50 dark:bg-brand-900/20">
            <CardHeader className="pb-2 border-b border-brand-200 dark:border-brand-800">
              <CardTitle className="text-brand-800 dark:text-brand-300 flex items-center gap-2">
                <Activity className="w-5 h-5" />
                AI AgTech Maslahatchi
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-4 space-y-4">
              <div className="bg-card p-4 rounded-lg border border-border">
                <h4 className="font-semibold text-sm mb-2 text-red-600 dark:text-red-400">🚨 Anomaliya aniqlandi!</h4>
                <p className="text-sm text-foreground mb-3">
                  <strong>B-12 sektori</strong> yaylov biomassasi kritik darajadan tushib ketdi (NDVI &lt; 0.145). 
                  Qoramollarni zudlik bilan sog'lom oziqa maydoniga (<strong>B-13 sektori</strong>) ko'chirish tavsiya etiladi.
                </p>
                
                {/* Slide-to-Confirm Mockup */}
                <div className="slide-confirm flex items-center w-full touch-target shadow-inner">
                  <div className="h-full bg-brand-500 flex items-center justify-center rounded-full px-4 min-w-[60px] cursor-pointer hover:bg-brand-600 transition-colors z-10 text-white font-bold">
                    →
                  </div>
                  <span className="absolute w-full text-center text-xs font-semibold text-muted-foreground z-0">
                    Tasdiqlash uchun torting
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function KPICard({ title, value, label, valueClass = "" }: { title: string, value: string, label: string, valueClass?: string }) {
  return (
    <Card className="shadow-sm border-border/60">
      <CardContent className="p-5">
        <h3 className="text-sm font-medium text-muted-foreground mb-1">{title}</h3>
        <div className={`text-3xl font-bold mb-1 ${valueClass}`}>{value}</div>
        <p className="text-xs text-muted-foreground">{label}</p>
      </CardContent>
    </Card>
  )
}
