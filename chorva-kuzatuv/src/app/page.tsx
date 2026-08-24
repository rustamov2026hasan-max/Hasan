import React from "react";
import Link from "next/link";
import { ArrowRight, MapPin, Activity, ShieldAlert, Wifi, Battery, Smartphone, BarChart3, Brain, Cpu, Database } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center">
              <MapPin className="text-white w-5 h-5" />
            </div>
            <span className="font-bold text-xl tracking-tight text-brand-900 dark:text-brand-50">
              CHORVA KUZATUV
            </span>
          </div>
          <nav className="hidden md:flex gap-6 items-center text-sm font-medium">
            <Link href="#features" className="hover:text-brand-600 transition-colors">Imkoniyatlar</Link>
            <Link href="#how-it-works" className="hover:text-brand-600 transition-colors">Qanday ishlaydi?</Link>
            <Link href="#hardware" className="hover:text-brand-600 transition-colors">Qurilma</Link>
            <Link href="#roadmap" className="hover:text-brand-600 transition-colors">Rejalar</Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="default">
                Platformaga kirish
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-24 pb-32 lg:pt-32 lg:pb-40 border-b">
          <div className="absolute inset-0 z-0 bg-[url('https://images.unsplash.com/photo-1596733430284-f74372752174?q=80&w=2574&auto=format&fit=crop')] bg-cover bg-center opacity-[0.03] dark:opacity-[0.05]" />
          <div className="absolute inset-0 z-0 bg-gradient-to-b from-brand-50/50 to-background dark:from-brand-950/20 dark:to-background" />
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
              <Badge variant="secondary" className="mb-6 px-4 py-1.5 text-sm bg-brand-100 text-brand-700 dark:bg-brand-900/30 dark:text-brand-300">
                O'zbekiston uchun maxsus ishlab chiqilgan
              </Badge>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-8 text-foreground">
                Chorvangizni <span className="text-brand-600">xaritada ko'ring.</span><br className="hidden md:block"/> Harakatini biling. Xavfni oldindan aniqlang.
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-2xl">
                GPS, IoT va AI yordamida chorva mollarini telefon va kompyuterdan real vaqtda kuzating.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                <Link href="/dashboard" className="w-full sm:w-auto">
                  <Button size="lg" className="w-full text-lg h-14 px-8 rounded-full shadow-lg hover:shadow-xl transition-all">
                    Platformani ko'rish <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Link href="#how-it-works" className="w-full sm:w-auto">
                  <Button variant="outline" size="lg" className="w-full text-lg h-14 px-8 rounded-full bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
                    Qanday ishlaydi?
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Barcha kerakli imkoniyatlar</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Fermerlar va chorvadorlar uchun eng zarur bo'lgan texnologiyalar bitta platformada.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <FeatureCard 
                icon={<MapPin className="w-8 h-8 text-brand-500" />}
                title="Jonli xarita"
                description="Hayvonlarni xaritada real vaqtda ko'rish. Har bir chorvaning aniq manzilini aniqlash."
              />
              <FeatureCard 
                icon={<ShieldAlert className="w-8 h-8 text-amber-500" />}
                title="GeoFence"
                description="Chorva belgilangan xavfsiz hududdan chiqsa, darhol telefoningizga ogohlantirish keladi."
              />
              <FeatureCard 
                icon={<Activity className="w-8 h-8 text-blue-500" />}
                title="Harakat tarixi"
                description="Hayvonning kunlik va haftalik yurgan yo'nalishini xaritada chizib ko'rsatish."
              />
              <FeatureCard 
                icon={<Battery className="w-8 h-8 text-green-500" />}
                title="Qurilma holati"
                description="Batareya quvvati va GPS signal kuchini doimiy nazorat qilish."
              />
              <FeatureCard 
                icon={<BarChart3 className="w-8 h-8 text-purple-500" />}
                title="Analytics"
                description="Fermerga tushunarli grafiklar, statistikalar va harakatlanish tahlillari."
              />
              <FeatureCard 
                icon={<Brain className="w-8 h-8 text-rose-500" />}
                title="Aqlli ogohlantirish"
                description="G'ayritabiiy holatlarni aniqlash va kutilmagan xavflarni oldini olish."
              />
            </div>
          </div>
        </section>

        {/* How it Works / Architecture */}
        <section id="how-it-works" className="py-24 bg-muted/50 border-y">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Tizim qanday ishlaydi?</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Oddiy va ishonchli arxitektura orqali ma'lumotlar uzluksiz yetkazib beriladi.
              </p>
            </div>

            <div className="flex flex-col lg:flex-row items-center justify-between gap-12 max-w-5xl mx-auto relative">
              {/* Connecting line for desktop */}
              <div className="hidden lg:block absolute top-1/2 left-0 w-full h-1 bg-gradient-to-r from-brand-200 via-brand-500 to-blue-400 -z-10 -translate-y-1/2 rounded-full opacity-50" />
              
              <Step 
                number="1"
                icon={<Cpu />}
                title="GPS Bo'yinbog'"
                desc="Chorvaga maxsus datchik taqiladi"
              />
              <Step 
                number="2"
                icon={<Wifi />}
                title="Aloqa tarmog'i"
                desc="GSM/LoRa orqali ma'lumot uzatish"
              />
              <Step 
                number="3"
                icon={<Database />}
                title="Bulutli server"
                desc="Ma'lumotlarni yig'ish va qayta ishlash"
              />
              <Step 
                number="4"
                icon={<Smartphone />}
                title="Mobil va Web"
                desc="Fermer dastur orqali kuzatadi"
              />
            </div>
          </div>
        </section>

        {/* Investor Section / Roadmap */}
        <section id="roadmap" className="py-24 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Loyihaning rivojlanish rejasi</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Startap loyiha sifatida bosqichma-bosqich kengayish strategiyasi.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              <RoadmapCard 
                phase="Phase 1"
                title="MVP"
                status="current"
                items={["Dastlabki veb platforma", "Xarita integratsiyasi", "Demo ma'lumotlar"]}
              />
              <RoadmapCard 
                phase="Phase 2"
                title="GPS Pilot"
                status="upcoming"
                items={["Haqiqiy qurilmalar testi", "Jizzax/Samarqand regionlari", "Fermerlar bilan sinov"]}
              />
              <RoadmapCard 
                phase="Phase 3"
                title="Analytics & AI"
                status="upcoming"
                items={["Sun'iy intellekt tahlillari", "Xulq-atvor anomaliyalari", "Aqlli ogohlantirishlar"]}
              />
              <RoadmapCard 
                phase="Phase 4"
                title="Kengayish"
                status="upcoming"
                items={["Butun respublika bo'ylab", "Markaziy Osiyo bozoriga chiqish", "Yangi turdagi datchiklar"]}
              />
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-24 bg-brand-900 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1596733430284-f74372752174?q=80&w=2574&auto=format&fit=crop')] bg-cover bg-center opacity-10 mix-blend-overlay" />
          <div className="container mx-auto px-4 relative z-10 text-center">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Tizimni sinab ko'rishga tayyormisiz?</h2>
            <p className="text-xl text-brand-100 mb-10 max-w-2xl mx-auto">
              Demo versiyada platformaning barcha imkoniyatlari bilan tanishib chiqing.
            </p>
            <Link href="/dashboard">
              <Button size="lg" className="h-14 px-10 text-lg bg-white text-brand-900 hover:bg-brand-50 rounded-full shadow-2xl">
                Demo Platformani ochish
              </Button>
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-400 py-12 border-t border-slate-800">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-6">
            <MapPin className="text-brand-500 w-6 h-6" />
            <span className="font-bold text-xl text-white">CHORVA KUZATUV</span>
          </div>
          <p className="mb-6">O'zbekiston chorvachiligi uchun raqamli yechim.</p>
          <p className="text-sm">© {new Date().getFullYear()} Chorva Kuzatuv. Barcha huquqlar himoyalangan.</p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <Card className="card-hover border-border/50">
      <CardHeader>
        <div className="w-14 h-14 rounded-xl bg-muted flex items-center justify-center mb-4">
          {icon}
        </div>
        <CardTitle className="text-xl">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-base">{description}</CardDescription>
      </CardContent>
    </Card>
  )
}

function Step({ number, icon, title, desc }: { number: string, icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="flex flex-col items-center text-center relative bg-card p-6 rounded-2xl shadow-sm border border-border w-full lg:w-64 z-10 glass-effect">
      <div className="w-16 h-16 rounded-full bg-brand-100 dark:bg-brand-900/50 text-brand-600 dark:text-brand-400 flex items-center justify-center mb-4 shadow-inner">
        {React.cloneElement(icon as React.ReactElement<any>, { className: "w-8 h-8" })}
      </div>
      <Badge className="absolute -top-3 -right-3 w-8 h-8 flex items-center justify-center rounded-full bg-brand-500 text-white text-sm">
        {number}
      </Badge>
      <h3 className="font-bold text-lg mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground">{desc}</p>
    </div>
  )
}

function RoadmapCard({ phase, title, status, items }: { phase: string, title: string, status: 'current' | 'upcoming', items: string[] }) {
  return (
    <Card className={status === 'current' ? 'border-brand-500 shadow-md ring-1 ring-brand-500/20' : 'opacity-80'}>
      <CardHeader className="pb-3">
        <Badge variant={status === 'current' ? 'default' : 'secondary'} className="w-fit mb-2">
          {phase}
        </Badge>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2 text-sm text-muted-foreground">
          {items.map((item, i) => (
            <li key={i} className="flex items-start gap-2">
              <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-brand-500 shrink-0" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
