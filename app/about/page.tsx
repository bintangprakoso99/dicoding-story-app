import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function AboutPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Tentang Aplikasi</h1>

      <Card>
        <CardHeader>
          <CardTitle>Dicoding Story App</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            Aplikasi berbagi cerita yang memungkinkan pengguna untuk berbagi pengalaman mereka bersama Dicoding melalui
            foto dan cerita.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Fitur Utama</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc pl-5 space-y-2">
            <li>Berbagi cerita dengan foto dan lokasi</li>
            <li>Melihat cerita dari pengguna lain</li>
            <li>Melihat lokasi cerita di peta</li>
            <li>Mengambil foto langsung dari kamera</li>
            <li>Notifikasi push untuk aktivitas baru</li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Teknologi</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc pl-5 space-y-2">
            <li>Next.js 14 dengan App Router</li>
            <li>Tailwind CSS untuk styling</li>
            <li>Leaflet untuk peta interaktif</li>
            <li>Web API (Camera, Geolocation)</li>
            <li>Dicoding Story API</li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Dibuat Oleh</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Aplikasi ini dibuat sebagai proyek submission untuk kelas Dicoding.</p>
        </CardContent>
      </Card>
    </div>
  )
}
