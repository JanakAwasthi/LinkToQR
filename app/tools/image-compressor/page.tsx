"use client"

import { useState, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { FileDropzone } from "@/components/file-dropzone"
import { Progress } from "@/components/ui/progress"
import { Download, FileArchiveIcon as Compress, Info } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface CompressedImage {
  original: File
  compressed: Blob
  originalSize: number
  compressedSize: number
  compressionRatio: number
  dataUrl: string
}

export default function ImageCompressorPage() {
  const [images, setImages] = useState<CompressedImage[]>([])
  const [quality, setQuality] = useState([80])
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const { toast } = useToast()

  const compressImage = useCallback((file: File, quality: number): Promise<CompressedImage> => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement("canvas")
      const ctx = canvas.getContext("2d")
      const img = new Image()

      img.onload = () => {
        // Calculate new dimensions (optional: add resize logic here)
        canvas.width = img.width
        canvas.height = img.height

        // Draw and compress
        ctx?.drawImage(img, 0, 0)

        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressionRatio = ((file.size - blob.size) / file.size) * 100
              resolve({
                original: file,
                compressed: blob,
                originalSize: file.size,
                compressedSize: blob.size,
                compressionRatio,
                dataUrl: canvas.toDataURL("image/jpeg", quality / 100),
              })
            } else {
              reject(new Error("Failed to compress image"))
            }
          },
          "image/jpeg",
          quality / 100,
        )
      }

      img.onerror = () => reject(new Error("Failed to load image"))
      img.src = URL.createObjectURL(file)
    })
  }, [])

  const handleFilesAccepted = useCallback(
    async (files: File[]) => {
      setIsProcessing(true)
      setProgress(0)
      const compressedImages: CompressedImage[] = []

      for (let i = 0; i < files.length; i++) {
        try {
          const compressed = await compressImage(files[i], quality[0])
          compressedImages.push(compressed)
          setProgress(((i + 1) / files.length) * 100)
        } catch (error) {
          toast({
            title: "Compression Failed",
            description: `Failed to compress ${files[i].name}`,
            variant: "destructive",
          })
        }
      }

      setImages(compressedImages)
      setIsProcessing(false)
      toast({
        title: "Compression Complete",
        description: `Successfully compressed ${compressedImages.length} images`,
      })
    },
    [quality, compressImage, toast],
  )

  const downloadImage = (image: CompressedImage) => {
    const link = document.createElement("a")
    link.href = URL.createObjectURL(image.compressed)
    link.download = `compressed_${image.original.name}`
    link.click()
  }

  const downloadAll = () => {
    images.forEach((image) => downloadImage(image))
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Compress className="h-12 w-12 text-orange-500 mr-4" />
            <h1 className="text-4xl font-bold gradient-text">Image Compressor</h1>
          </div>
          <p className="text-lg text-muted-foreground">
            Reduce image file size while maintaining quality using advanced compression
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Info className="h-5 w-5 mr-2" />
                  Upload Images
                </CardTitle>
              </CardHeader>
              <CardContent>
                <FileDropzone
                  onFilesAccepted={handleFilesAccepted}
                  acceptedFileTypes={["image/jpeg", "image/png", "image/webp"]}
                  maxFileSize={50 * 1024 * 1024} // 50MB
                  maxFiles={10}
                />
              </CardContent>
            </Card>

            {isProcessing && (
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Processing Images...</span>
                    <span className="text-sm text-muted-foreground">{Math.round(progress)}%</span>
                  </div>
                  <Progress value={progress} className="w-full" />
                </CardContent>
              </Card>
            )}

            {images.length > 0 && (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Compressed Images ({images.length})</CardTitle>
                    <Button onClick={downloadAll} className="flex items-center">
                      <Download className="h-4 w-4 mr-2" />
                      Download All
                    </Button>
                  </div>
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
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <span>
                              {formatFileSize(image.originalSize)} → {formatFileSize(image.compressedSize)}
                            </span>
                            <Badge variant="outline" className="text-green-600">
                              {image.compressionRatio.toFixed(1)}% smaller
                            </Badge>
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
                <CardTitle>Compression Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Quality: {quality[0]}%</label>
                  <Slider value={quality} onValueChange={setQuality} max={100} min={10} step={5} className="w-full" />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>Smaller file</span>
                    <span>Better quality</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Features</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2" />
                    Batch processing
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-2" />
                    Adjustable quality
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mr-2" />
                    Real-time preview
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mr-2" />
                    No server upload
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
