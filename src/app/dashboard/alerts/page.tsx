import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MOCK_ALERTS } from "@/data/mock";
import { AlertTriangle, BatteryWarning, WifiOff, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function AlertsPage() {
  return (
    <div className="p-4 md:p-8 space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Ogohlantirishlar tarixi</h1>
        <p className="text-muted-foreground">Tizim tomonidan qayd etilgan barcha voqealar</p>
      </div>

      <Card className="shadow-sm">
        <CardHeader className="pb-4 border-b">
          <CardTitle>Barcha Ogohlantirishlar</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-border">
            {MOCK_ALERTS.map(alert => (
              <div key={alert.id} className={`p-4 md:p-6 flex flex-col sm:flex-row gap-4 sm:items-center justify-between transition-colors hover:bg-muted/30 ${alert.isResolved ? 'opacity-70' : 'bg-muted/10'}`}>
                <div className="flex gap-4">
                  <div className="mt-1">
                    {alert.type === 'Geofence Breach' && <AlertTriangle className="w-6 h-6 text-red-500" />}
                    {alert.type === 'Low Battery' && <BatteryWarning className="w-6 h-6 text-amber-500" />}
                    {alert.type === 'Signal Lost' && <WifiOff className="w-6 h-6 text-slate-500" />}
                    {alert.type === 'Safe' && <CheckCircle2 className="w-6 h-6 text-green-500" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span className="font-bold">{alert.animalId}</span>
                      <Badge variant={alert.isResolved ? "outline" : "default"} className={alert.isResolved ? "" : "bg-red-500 hover:bg-red-600 text-white"}>
                        {alert.isResolved ? "Hal etilgan" : "Faol"}
                      </Badge>
                    </div>
                    <p className="text-foreground font-medium mb-1">{alert.message}</p>
                    <p className="text-sm text-muted-foreground">{new Date(alert.timestamp).toLocaleString()}</p>
                  </div>
                </div>
                {!alert.isResolved && (
                  <button className="self-start sm:self-center text-sm font-medium text-brand-600 hover:text-brand-700 bg-brand-50 px-3 py-1.5 rounded-md transition-colors">
                    Hal etildi deb belgilash
                  </button>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
