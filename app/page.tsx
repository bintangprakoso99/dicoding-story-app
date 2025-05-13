import StoryList from "@/components/StoryList"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function Home() {
  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Dicoding Story</h1>
        <p className="text-muted-foreground">Bagikan cerita dan pengalamanmu bersama Dicoding</p>
      </div>

      <div className="flex justify-end">
        <Button asChild>
          <Link href="/stories/create">Bagikan Cerita Baru</Link>
        </Button>
      </div>

      <StoryList />
    </div>
  )
}
