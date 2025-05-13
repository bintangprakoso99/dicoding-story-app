import type { Story } from "@/types"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { formatDate } from "@/lib/utils"
import Link from "next/link"
import Image from "next/image"
import { MapPin } from "lucide-react"

interface StoryCardProps {
  story: Story
}

export default function StoryCard({ story }: StoryCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <Link href={`/stories/${story.id}`} className="block">
        <div className="relative aspect-video w-full">
          <Image
            src={story.photoUrl || "/placeholder.svg"}
            alt={`Foto dari ${story.name}`}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      </Link>
      <CardContent className="p-4">
        <Link href={`/stories/${story.id}`} className="block">
          <h3 className="font-semibold text-lg mb-2 hover:text-primary transition-colors">{story.name}</h3>
          <p className="text-sm text-muted-foreground mb-2 line-clamp-3">{story.description}</p>
        </Link>
        <div className="flex justify-between items-center text-xs text-muted-foreground">
          <span>{formatDate(story.createdAt)}</span>
          {story.lat && story.lon && (
            <span className="flex items-center">
              <MapPin size={12} className="mr-1" /> Lokasi tersedia
            </span>
          )}
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Link href={`/stories/${story.id}`} className="text-sm text-primary hover:underline">
          Lihat detail
        </Link>
      </CardFooter>
    </Card>
  )
}
