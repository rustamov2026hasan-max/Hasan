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

          {/* Activity Chart */}
          <Card className="shadow-sm">
            <CardHeader className="pb-3 border-b">
              <CardTitle>Poda faolligi</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-6">
              <div className="h-[200px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={activityData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      itemStyle={{ fontSize: '13px' }}
                      labelStyle={{ fontSize: '13px', fontWeight: 'bold', color: '#0f172a', marginBottom: '4px' }}
                    />
                    <Line type="monotone" name="Faol (%)" dataKey="active" stroke="#22c55e" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                    <Line type="monotone" name="Dam olayotgan (%)" dataKey="resting" stroke="#94a3b8" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
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
