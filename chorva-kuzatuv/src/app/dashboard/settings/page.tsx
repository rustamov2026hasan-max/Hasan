import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function SettingsPage() {
  return (
    <div className="p-4 md:p-8 space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Sozlamalar</h1>
        <p className="text-muted-foreground">Tizim va profil sozlamalarini boshqarish</p>
      </div>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Profil ma'lumotlari</CardTitle>
          <CardDescription>Fermer profili va aloqa ma'lumotlari</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <label className="text-sm font-medium">F.I.Sh</label>
            <input type="text" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" defaultValue="Abdulla Qodirov" />
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium">Telefon raqam</label>
            <input type="text" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" defaultValue="+998 90 123 45 67" />
          </div>
          <Button className="mt-4">Saqlash</Button>
        </CardContent>
      </Card>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Ogohlantirish sozlamalari</CardTitle>
          <CardDescription>SMS va Email xabarnomalarini sozlash</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div>
              <p className="font-medium">SMS xabarnomalar</p>
              <p className="text-sm text-muted-foreground">Muhim xavflar haqida SMS orqali xabar olish</p>
            </div>
            <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
              <input type="checkbox" name="toggle" id="toggle1" className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 appearance-none cursor-pointer" defaultChecked />
              <label htmlFor="toggle1" className="toggle-label block overflow-hidden h-5 rounded-full bg-brand-500 cursor-pointer"></label>
            </div>
          </div>
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div>
              <p className="font-medium">Email xabarnomalar</p>
              <p className="text-sm text-muted-foreground">Haftalik hisobotlarni emailga yuborish</p>
            </div>
            <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
              <input type="checkbox" name="toggle" id="toggle2" className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 appearance-none cursor-pointer" />
              <label htmlFor="toggle2" className="toggle-label block overflow-hidden h-5 rounded-full bg-slate-300 cursor-pointer"></label>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
