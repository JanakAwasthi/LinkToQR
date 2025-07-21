"use client"

import { useState, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileDropzone } from "@/components/file-dropzone"
import { Progress } from "@/components/ui/progress"
import { RefreshCw, Download } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

type ImageFormat = "jpeg" | "png" | "webp"

interface ConvertedImage {
  original: File
  converted: Blob
  originalFormat: string
  newFormat: ImageFormat
  dataUrl: string
}

export default function FormatConverterPage() {
  const [images, setImages] = useState<ConvertedImage[]>([])
  const [targetFormat, setTargetFormat] = useState<ImageFormat>("jpeg")
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const { toast } = useToast()

  const convertImage = useCallback((file: File, format: ImageFormat): Promise<ConvertedImage> => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement("canvas")
      const ctx = canvas.getContext("2d")
      const img = new Image()

      img.onload = () => {
        canvas.width = img.width
        canvas.height = img.height

        // For PNG to JPEG conversion, add white background
        if (format === "jpeg" && file.type === "image/png") {
          ctx!.fillStyle = "#FFFFFF"
          ctx!.fillRect(0, 0, canvas.width, canvas.height)
        }

        ctx?.drawImage(img, 0, 0)

        const mimeType = `image/${format}`
        const quality = format === "jpeg" ? 0.9 : undefined

        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve({
                original: file,
                converted: blob,
                originalFormat: file.type.split("/")[1],
                newFormat: format,
                dataUrl: canvas.toDataURL(mimeType, quality),
              })
            } else {
              reject(new Error("Failed to convert image"))
            }
          },
          mimeType,
          quality,
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
      const convertedImages: ConvertedImage[] = []

      for (let i = 0; i < files.length; i++) {
        try {
          const converted = await convertImage(files[i], targetFormat)
          convertedImages.push(converted)
          setProgress(((i + 1) / files.length) * 100)
        } catch (error) {
          toast({
            title: "Conversion Failed",
            description: `Failed to convert ${files[i].name}`,
            variant: "destructive",
          })
        }
      }

      setImages(convertedImages)
      setIsProcessing(false)
      toast({
        title: "Conversion Complete",
        description: `Successfully converted ${convertedImages.length} images`,
      })
    },
    [targetFormat, convertImage, toast],
  )

  const downloadImage = (image: ConvertedImage) => {
    const link = document.createElement("a")
    link.href = URL.createObjectURL(image.converted)
    const fileName = image.original.name.replace(/\.[^/.]+$/, "") + `.${image.newFormat}`
    link.download = fileName
    link.click()
  }

  const downloadAll = () => {
    images.forEach((image) => downloadImage(image))
  }

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <RefreshCw className="h-12 w-12 text-cyan-500 mr-4" />
            <h1 className="text-4xl font-bold gradient-text">Format Converter</h1>
          </div>
          <p className="text-lg text-muted-foreground">Convert between JPG, PNG, and WebP formats</p>
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
                  maxFiles={20}
                />
              </CardContent>
            </Card>

            {isProcessing && (
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Converting Images...</span>
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
                    <CardTitle>Converted Images ({images.length})</CardTitle>
                    <Button onClick={downloadAll}>
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
                          <div className="text-sm text-muted-foreground">
                            {image.originalFormat.toUpperCase()} → {image.newFormat.toUpperCase()}
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
                <CardTitle>Conversion Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <div>
                  <label className="text-sm font-medium mb-2 block">Target Format</label>
                  <Select value={targetFormat} onValueChange={(value: ImageFormat) => setTargetFormat(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="jpeg">JPEG (.jpg)</SelectItem>
                      <SelectItem value="png">PNG (.png)</SelectItem>
                      <SelectItem value="webp">WebP (.webp)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Format Info</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div>
                    <strong>JPEG:</strong> Best for photos, smaller file size, no transparency
                  </div>
                  <div>
                    <strong>PNG:</strong> Best for graphics, supports transparency, larger file size
                  </div>
                  <div>
                    <strong>WebP:</strong> Modern format, excellent compression, supports transparency
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
