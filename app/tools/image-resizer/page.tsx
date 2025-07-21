"use client"

import { useState, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { FileDropzone } from "@/components/file-dropzone"
import { Progress } from "@/components/ui/progress"
import { Crop, Download, Lock } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ResizedImage {
  original: File
  resized: Blob
  originalDimensions: { width: number; height: number }
  newDimensions: { width: number; height: number }
  dataUrl: string
}

export default function ImageResizerPage() {
  const [images, setImages] = useState<ResizedImage[]>([])
  const [width, setWidth] = useState(800)
  const [height, setHeight] = useState(600)
  const [maintainAspectRatio, setMaintainAspectRatio] = useState(true)
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const { toast } = useToast()

  const resizeImage = useCallback(
    (file: File, targetWidth: number, targetHeight: number, maintainRatio: boolean): Promise<ResizedImage> => {
      return new Promise((resolve, reject) => {
        const canvas = document.createElement("canvas")
        const ctx = canvas.getContext("2d")
        const img = new Image()

        img.onload = () => {
          let newWidth = targetWidth
          let newHeight = targetHeight

          if (maintainRatio) {
            const aspectRatio = img.width / img.height
            if (targetWidth / targetHeight > aspectRatio) {
              newWidth = targetHeight * aspectRatio
            } else {
              newHeight = targetWidth / aspectRatio
            }
          }

          canvas.width = newWidth
          canvas.height = newHeight

          ctx?.drawImage(img, 0, 0, newWidth, newHeight)

          canvas.toBlob(
            (blob) => {
              if (blob) {
                resolve({
                  original: file,
                  resized: blob,
                  originalDimensions: { width: img.width, height: img.height },
                  newDimensions: { width: newWidth, height: newHeight },
                  dataUrl: canvas.toDataURL("image/jpeg", 0.9),
                })
              } else {
                reject(new Error("Failed to resize image"))
              }
            },
            "image/jpeg",
            0.9,
          )
        }

        img.onerror = () => reject(new Error("Failed to load image"))
        img.src = URL.createObjectURL(file)
      })
    },
    [],
  )

  const handleFilesAccepted = useCallback(
    async (files: File[]) => {
      setIsProcessing(true)
      setProgress(0)
      const resizedImages: ResizedImage[] = []

      for (let i = 0; i < files.length; i++) {
        try {
          const resized = await resizeImage(files[i], width, height, maintainAspectRatio)
          resizedImages.push(resized)
          setProgress(((i + 1) / files.length) * 100)
        } catch (error) {
          toast({
            title: "Resize Failed",
            description: `Failed to resize ${files[i].name}`,
            variant: "destructive",
          })
        }
      }

      setImages(resizedImages)
      setIsProcessing(false)
      toast({
        title: "Resize Complete",
        description: `Successfully resized ${resizedImages.length} images`,
      })
    },
    [width, height, maintainAspectRatio, resizeImage, toast],
  )

  const downloadImage = (image: ResizedImage) => {
    const link = document.createElement("a")
    link.href = URL.createObjectURL(image.resized)
    link.download = `resized_${image.original.name}`
    link.click()
  }

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Crop className="h-12 w-12 text-blue-500 mr-4" />
            <h1 className="text-4xl font-bold gradient-text">Image Resizer</h1>
          </div>
          <p className="text-lg text-muted-foreground">Resize images while maintaining aspect ratio</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Upload Images</CardTitle>
              </CardHeader>
              <CardContent>
                <FileDropzone
                  onFilesAccepted={handleFilesAccepted}
                  acceptedFileTypes={["image/jpeg", "image/png", "image/webp"]}
                  maxFileSize={50 * 1024 * 1024}
                  maxFiles={10}
                />
              </CardContent>
            </Card>

            {isProcessing && (
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Resizing Images...</span>
                    <span className="text-sm text-muted-foreground">{Math.round(progress)}%</span>
                  </div>
                  <Progress value={progress} className="w-full" />
                </CardContent>
              </Card>
            )}

            {images.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Resized Images ({images.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {images.map((image, index) => (
                      <div key={index} className="flex items-center space-x-4 p-4 border rounded-lg">
                        <img
                          src={image.dataUrl || "/placeholder.svg"}
                          alt={image.original.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                        <div className="flex-1">
                          <h4 className="font-medium">{image.original.name}</h4>
                          <div className="text-sm text-muted-foreground">
                            {image.originalDimensions.width}×{image.originalDimensions.height} →{" "}
                            {Math.round(image.newDimensions.width)}×{Math.round(image.newDimensions.height)}
                          </div>
                        </div>
                        <Button size="sm" onClick={() => downloadImage(image)}>
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Resize Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="width">Width (px)</Label>
                  <Input
                    id="width"
                    type="number"
                    value={width}
                    onChange={(e) => setWidth(Number(e.target.value))}
                    min="1"
                    max="4000"
                  />
                </div>
                <div>
                  <Label htmlFor="height">Height (px)</Label>
                  <Input
                    id="height"
                    type="number"
                    value={height}
                    onChange={(e) => setHeight(Number(e.target.value))}
                    min="1"
                    max="4000"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="aspect-ratio" checked={maintainAspectRatio} onCheckedChange={setMaintainAspectRatio} />
                  <Label htmlFor="aspect-ratio" className="flex items-center">
                    <Lock className="h-4 w-4 mr-1" />
                    Maintain aspect ratio
                  </Label>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
