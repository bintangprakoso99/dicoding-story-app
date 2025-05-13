"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { getStoryDetail } from "@/lib/api"
import type { Story } from "@/types"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import Link from "next/link"
import Image from "next/image"
import { formatDate } from "@/lib/utils"
import StoryMap from "@/components/StoryMap"
import { Skeleton } from "@/components/ui/skeleton"

export default function StoryDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [story, setStory] = useState<Story | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const fetchStory = async () => {
      try {
        const data = await getStoryDetail(id as string)
        setStory(data)
      } catch (error) {
        toast({
          title: "Error",
          description: "Gagal memuat detail cerita",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchStory()
  }, [id, toast])

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-[300px] w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    )
  }

  if (!story) {
    return (
      <div className="text-center py-8">
        <h1 className="text-2xl font-bold mb-4">Cerita tidak ditemukan</h1>
        <Button asChild>
          <Link href="/">Kembali ke Beranda</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{story.name}</h1>
        <Button variant="outline" asChild>
          <Link href="/">Kembali</Link>
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="relative aspect-video w-full">
            <Image
              src={story.photoUrl || "/placeholder.svg"}
              alt={`Foto dari ${story.name}`}
              fill
              className="object-cover rounded-t-lg"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority
            />
          </div>
          <div className="p-6 space-y-4">
            <p className="text-lg">{story.description}</p>
            <p className="text-sm text-muted-foreground">Dibagikan pada: {formatDate(story.createdAt)}</p>
          </div>
        </CardContent>
      </Card>

      {story.lat && story.lon && (
        <div className="space-y-2">
          <h2 className="text-xl font-semibold">Lokasi</h2>
          <div className="h-[400px] rounded-lg overflow-hidden">
            <StoryMap stories={[story]} />
          </div>
        </div>
      )}
    </div>
  )
}
