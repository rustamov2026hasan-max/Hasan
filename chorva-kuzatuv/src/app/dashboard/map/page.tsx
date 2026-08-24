"use client";

import dynamic from "next/dynamic";
import { Card, CardContent } from "@/components/ui/card";

// Dynamically import Map to prevent SSR issues with Leaflet
const FullMap = dynamic(() => import("@/components/Map"), { 
  ssr: false,
  loading: () => <div className="w-full h-full bg-muted animate-pulse flex items-center justify-center">Xarita yuklanmoqda...</div>
});

export default function MapPage() {
  return (
    <div className="flex flex-col h-[calc(100vh-64px)] md:h-screen">
      <div className="p-4 md:p-6 pb-0 flex-shrink-0">
        <h1 className="text-2xl font-bold tracking-tight">Jonli Xarita</h1>
        <p className="text-muted-foreground mb-4">Barcha hayvonlarning real vaqtdagi joylashuvi</p>
      </div>
      
      <div className="flex-1 p-4 md:p-6 pt-0 min-h-0">
        <Card className="w-full h-full border-border/60 shadow-sm overflow-hidden flex flex-col">
          <CardContent className="p-0 flex-1 relative min-h-[400px]">
            <FullMap />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
