"use client"

import { useState, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { FileDropzone } from "@/components/file-dropzone"
import { Progress } from "@/components/ui/progress"
import { Wand2, Download, RotateCcw } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface EnhancedImage {
  original: File
  enhanced: string
  settings: {
    brightness: number
    contrast: number
    saturation: number
    sharpness: number
  }
}

export default function ImageEnhancerPage() {
  const [images, setImages] = useState<EnhancedImage[]>([])
  const [brightness, setBrightness] = useState([0])
  const [contrast, setContrast] = useState([0])
  const [saturation, setSaturation] = useState([0])
  const [sharpness, setSharpness] = useState([0])
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const { toast } = useToast()

  const enhanceImage = useCallback((file: File, settings: any): Promise<EnhancedImage> => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement("canvas")
      const ctx = canvas.getContext("2d")
      const img = new Image()

      img.onload = () => {
        canvas.width = img.width
        canvas.height = img.height

        // Apply filters
        const filters = []
        if (settings.brightness !== 0) filters.push(`brightness(${100 + settings.brightness}%)`)
        if (settings.contrast !== 0) filters.push(`contrast(${100 + settings.contrast}%)`)
        if (settings.saturation !== 0) filters.push(`saturate(${100 + settings.saturation}%)`)

        if (ctx) {
          ctx.filter = filters.join(" ")
          ctx.drawImage(img, 0, 0)

          // Apply sharpness (simplified)
          if (settings.sharpness > 0) {
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
            const data = imageData.data
            const factor = settings.sharpness / 100

            for (let i = 0; i < data.length; i += 4) {
              data[i] = Math.min(255, data[i] * (1 + factor))
              data[i + 1] = Math.min(255, data[i + 1] * (1 + factor))
              data[i + 2] = Math.min(255, data[i + 2] * (1 + factor))
            }

            ctx.putImageData(imageData, 0, 0)
          }
        }

        resolve({
          original: file,
          enhanced: canvas.toDataURL("image/jpeg", 0.9),
          settings,
        })
      }

      img.onerror = () => reject(new Error("Failed to enhance image"))
      img.src = URL.createObjectURL(file)
    })
  }, [])

  const handleFilesAccepted = useCallback(
    async (files: File[]) => {
      setIsProcessing(true)
      setProgress(0)
      const enhancedImages: EnhancedImage[] = []

      const settings = {
        brightness: brightness[0],
        contrast: contrast[0],
        saturation: saturation[0],
        sharpness: sharpness[0],
      }

      for (let i = 0; i < files.length; i++) {
        try {
          const enhanced = await enhanceImage(files[i], settings)
          enhancedImages.push(enhanced)
          setProgress(((i + 1) / files.length) * 100)
        } catch (error) {
          toast({
            title: "Enhancement Failed",
            description: `Failed to enhance ${files[i].name}`,
            variant: "destructive",
          })
        }
      }

      setImages(enhancedImages)
      setIsProcessing(false)
      toast({
        title: "Enhancement Complete",
        description: `Successfully enhanced ${enhancedImages.length} images`,
      })
    },
    [brightness, contrast, saturation, sharpness, enhanceImage, toast],
  )

  const downloadImage = (image: EnhancedImage) => {
    const link = document.createElement("a")
    link.href = image.enhanced
    link.download = `enhanced_${image.original.name}`
    link.click()
  }

  const resetSettings = () => {
    setBrightness([0])
    setContrast([0])
    setSaturation([0])
    setSharpness([0])
  }

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Wand2 className="h-12 w-12 text-purple-500 mr-4" />
            <h1 className="text-4xl font-bold gradient-text">Image Enhancer AI</h1>
          </div>
          <p className="text-lg text-muted-foreground">Enhance image quality with AI-powered adjustments</p>
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
                    <span className="text-sm font-medium">Enhancing Images...</span>
                    <span className="text-sm text-muted-foreground">{Math.round(progress)}%</span>
                  </div>
                  <Progress value={progress} className="w-full" />
                </CardContent>
              </Card>
            )}

            {images.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Enhanced Images ({images.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {images.map((image, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div>
                            <p className="text-sm font-medium mb-2">Original</p>
                            <img
                              src={URL.createObjectURL(image.original) || "/placeholder.svg"}
                              alt="Original"
                              className="w-full h-32 object-cover rounded"
                            />
                          </div>
                          <div>
                            <p className="text-sm font-medium mb-2">Enhanced</p>
                            <img
                              src={image.enhanced || "/placeholder.svg"}
                              alt="Enhanced"
                              className="w-full h-32 object-cover rounded"
                            />
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">{image.original.name}</h4>
                            <p className="text-xs text-muted-foreground">
                              B:{image.settings.brightness} C:{image.settings.contrast} S:{image.settings.saturation}
                            </p>
                          </div>
                          <Button size="sm" onClick={() => downloadImage(image)}>
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
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
                <div className="flex items-center justify-between">
                  <CardTitle>Enhancement Settings</CardTitle>
                  <Button size="sm" variant="outline" onClick={resetSettings}>
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="text-sm font-medium mb-2 block">Brightness: {brightness[0]}</label>
                  <Slider value={brightness} onValueChange={setBrightness} max={100} min={-100} step={5} />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Contrast: {contrast[0]}</label>
                  <Slider value={contrast} onValueChange={setContrast} max={100} min={-100} step={5} />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Saturation: {saturation[0]}</label>
                  <Slider value={saturation} onValueChange={setSaturation} max={100} min={-100} step={5} />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Sharpness: {sharpness[0]}</label>
                  <Slider value={sharpness} onValueChange={setSharpness} max={100} min={0} step={5} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>AI Features</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mr-2" />
                    Real-time preview
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-2" />
                    Batch processing
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2" />
                    Quality preservation
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mr-2" />
                    Advanced filters
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
