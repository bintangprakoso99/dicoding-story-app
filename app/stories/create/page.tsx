"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { addNewStory } from "@/lib/api"
import CreateStoryMap from "@/components/CreateStoryMap"
import { Camera, RefreshCw, Loader2 } from "lucide-react"

export default function CreateStoryPage() {
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [description, setDescription] = useState("")
  const [photoBlob, setPhotoBlob] = useState<Blob | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [location, setLocation] = useState<{ lat: number; lon: number } | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [cameraError, setCameraError] = useState<string | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [cameraActive, setCameraActive] = useState(false)

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      toast({
        title: "Akses ditolak",
        description: "Anda harus login terlebih dahulu",
        variant: "destructive",
      })
      router.push("/login")
    }
  }, [user, router, toast])

  // Initialize camera with error handling
  const startCamera = async () => {
    try {
      setCameraError(null)
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      })

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        setCameraActive(true)
      }
    } catch (error) {
      console.error("Camera error:", error)
      setCameraError(
        "Gagal mengakses kamera. Pastikan browser Anda mendukung akses kamera dan Anda telah memberikan izin.",
      )
      toast({
        title: "Error",
        description: "Gagal mengakses kamera. Periksa izin browser Anda.",
        variant: "destructive",
      })
    }
  }

  // Stop camera
  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
      tracks.forEach((track) => track.stop())
      videoRef.current.srcObject = null
      setCameraActive(false)
    }
  }

  // Take photo with improved error handling
  const takePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      try {
        const video = videoRef.current
        const canvas = canvasRef.current
        const context = canvas.getContext("2d")

        if (!context) {
          throw new Error("Tidak dapat mengakses context canvas")
        }

        // Ensure video is playing and has dimensions
        if (video.videoWidth === 0 || video.videoHeight === 0) {
          throw new Error("Video stream tidak tersedia atau belum siap")
        }

        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        context.drawImage(video, 0, 0, canvas.width, canvas.height)

        canvas.toBlob(
          (blob) => {
            if (blob) {
              setPhotoBlob(blob)
              setPhotoPreview(URL.createObjectURL(blob))
              stopCamera()
            } else {
              throw new Error("Gagal mengambil foto (blob null)")
            }
          },
          "image/jpeg",
          0.8,
        )
      } catch (error) {
        console.error("Error taking photo:", error)
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "Gagal mengambil foto",
          variant: "destructive",
        })
      }
    }
  }

  // Reset photo
  const resetPhoto = () => {
    if (photoPreview) {
      URL.revokeObjectURL(photoPreview)
    }
    setPhotoBlob(null)
    setPhotoPreview(null)
    startCamera()
  }

  // Handle location selection
  const handleLocationSelect = (lat: number, lon: number) => {
    setLocation({ lat, lon })
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!photoBlob) {
      toast({
        title: "Error",
        description: "Silakan ambil foto terlebih dahulu",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      await addNewStory({
        description,
        photo: photoBlob,
        lat: location?.lat || null,
        lon: location?.lon || null,
      })

      toast({
        title: "Berhasil",
        description: "Cerita berhasil dibagikan",
      })

      router.push("/")
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Gagal membagikan cerita",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Start camera on component mount
  useEffect(() => {
    if (!cameraActive && !photoPreview) {
      startCamera()
    }

    // Cleanup on unmount
    return () => {
      stopCamera()
      if (photoPreview) {
        URL.revokeObjectURL(photoPreview)
      }
    }
  }, [cameraActive, photoPreview])

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Bagikan Cerita Baru</h1>
        <Button variant="outline" asChild>
          <a href="/">Batal</a>
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="description">Cerita Anda</Label>
          <Textarea
            id="description"
            placeholder="Ceritakan pengalaman Anda..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="min-h-[120px]"
            disabled={isSubmitting}
          />
        </div>

        <div className="space-y-2">
          <Label>Foto</Label>
          <Card>
            <CardContent className="p-4 space-y-4">
              {photoPreview ? (
                <div className="space-y-4">
                  <div className="relative aspect-video w-full overflow-hidden rounded-md">
                    <img
                      src={photoPreview || "/placeholder.svg"}
                      alt="Preview foto"
                      className="object-contain w-full h-full"
                    />
                  </div>
                  <Button
                    type="button"
                    onClick={resetPhoto}
                    variant="outline"
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    <RefreshCw className="mr-2 h-4 w-4" /> Ambil Ulang Foto
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {cameraError ? (
                    <div className="p-4 text-center bg-destructive/10 text-destructive rounded-md">
                      <p>{cameraError}</p>
                      <Button type="button" onClick={startCamera} variant="outline" className="mt-2">
                        Coba Lagi
                      </Button>
                    </div>
                  ) : (
                    <>
                      <div className="relative aspect-video w-full overflow-hidden rounded-md bg-muted">
                        <video
                          ref={videoRef}
                          autoPlay
                          playsInline
                          className="w-full h-full object-cover"
                          onCanPlay={() => setCameraActive(true)}
                        />
                      </div>
                      <Button
                        type="button"
                        onClick={takePhoto}
                        variant="secondary"
                        className="w-full"
                        disabled={!cameraActive || isSubmitting}
                      >
                        <Camera className="mr-2 h-4 w-4" /> Ambil Foto
                      </Button>
                    </>
                  )}
                </div>
              )}
              <canvas ref={canvasRef} style={{ display: "none" }} />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-2">
          <Label>Lokasi</Label>
          <p className="text-sm text-muted-foreground">Klik pada peta untuk menentukan lokasi</p>
          <div className="h-[400px] rounded-lg overflow-hidden">
            <CreateStoryMap onLocationSelect={handleLocationSelect} />
          </div>
          {location && (
            <p className="text-sm">
              Lokasi dipilih: {location.lat.toFixed(6)}, {location.lon.toFixed(6)}
            </p>
          )}
        </div>

        <Button type="submit" className="w-full" disabled={isSubmitting || !photoBlob}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Mengirim...
            </>
          ) : (
            "Bagikan Cerita"
          )}
        </Button>
      </form>
    </div>
  )
}
