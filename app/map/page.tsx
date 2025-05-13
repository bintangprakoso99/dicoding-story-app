"use client"

import { useEffect, useState } from "react"
import { getAllStories } from "@/lib/api"
import type { Story } from "@/types"
import { useToast } from "@/components/ui/use-toast"
import StoryMap from "@/components/StoryMap"
import { Skeleton } from "@/components/ui/skeleton"

export default function MapPage() {
  const [stories, setStories] = useState<Story[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const data = await getAllStories({ location: 1 })
        setStories(data.filter((story) => story.lat && story.lon))
      } catch (error) {
        toast({
          title: "Error",
          description: "Gagal memuat data cerita",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchStories()
  }, [toast])

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Peta Cerita</h1>
        <p className="text-muted-foreground">{stories.length} cerita ditemukan</p>
      </div>

      {isLoading ? (
        <Skeleton className="h-[600px] w-full" />
      ) : (
        <div className="h-[600px] rounded-lg overflow-hidden">
          <StoryMap stories={stories} />
        </div>
      )}
    </div>
  )
}
