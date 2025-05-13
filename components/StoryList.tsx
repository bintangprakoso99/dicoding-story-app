"use client"

import { useEffect, useState } from "react"
import { getAllStories } from "@/lib/api"
import type { Story } from "@/types"
import { useToast } from "@/components/ui/use-toast"
import StoryCard from "@/components/StoryCard"
import { Skeleton } from "@/components/ui/skeleton"

export default function StoryList() {
  const [stories, setStories] = useState<Story[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const { toast } = useToast()

  const fetchStories = async (pageNum: number, append = false) => {
    try {
      const loadingState = append ? setIsLoadingMore : setIsLoading
      loadingState(true)

      const data = await getAllStories({ page: pageNum })

      if (data.length === 0) {
        setHasMore(false)
      } else {
        setStories((prev) => (append ? [...prev, ...data] : data))
        setPage(pageNum)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal memuat data cerita",
        variant: "destructive",
      })
    } finally {
      const loadingState = append ? setIsLoadingMore : setIsLoading
      loadingState(false)
    }
  }

  useEffect(() => {
    fetchStories(1)
  }, [])

  const loadMore = () => {
    if (!isLoadingMore && hasMore) {
      fetchStories(page + 1, true)
    }
  }

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoadingMore && !isLoading) {
          loadMore()
        }
      },
      { threshold: 0.5 },
    )

    const sentinel = document.getElementById("scroll-sentinel")
    if (sentinel) {
      observer.observe(sentinel)
    }

    return () => {
      if (sentinel) {
        observer.unobserve(sentinel)
      }
    }
  }, [hasMore, isLoadingMore, isLoading])

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="h-[200px] w-full rounded-lg" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ))}
      </div>
    )
  }

  if (stories.length === 0) {
    return (
      <div className="text-center py-12 bg-muted rounded-lg">
        <h2 className="text-xl font-semibold mb-2">Belum ada cerita</h2>
        <p className="text-muted-foreground mb-4">Jadilah yang pertama berbagi cerita!</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stories.map((story) => (
          <StoryCard key={story.id} story={story} />
        ))}
      </div>

      {hasMore && (
        <div id="scroll-sentinel" className="py-4 text-center">
          {isLoadingMore ? (
            <div className="space-y-3">
              <Skeleton className="h-[200px] w-full rounded-lg" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-full" />
            </div>
          ) : (
            <p className="text-muted-foreground">Scroll untuk memuat lebih banyak</p>
          )}
        </div>
      )}
    </div>
  )
}
