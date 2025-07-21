"use client"

import { useState, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileDropzone } from "@/components/file-dropzone"
import { Progress } from "@/components/ui/progress"
import { FileImage, Download, Trash2, ArrowUp, ArrowDown } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { jsPDF } from "jspdf"

type PageSize = "A4" | "A3" | "Letter" | "Legal"

interface ImageFile {
  file: File
  dataUrl: string
  name: string
}

export default function PhotoToPDFPage() {
  const [images, setImages] = useState<ImageFile[]>([])
  const [pageSize, setPageSize] = useState<PageSize>("A4")
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const { toast } = useToast()

  const handleFilesAccepted = useCallback(
    async (files: File[]) => {
      const imageFiles: ImageFile[] = []

      for (const file of files) {
        const dataUrl = await new Promise<string>((resolve) => {
          const reader = new FileReader()
          reader.onload = (e) => resolve(e.target?.result as string)
          reader.readAsDataURL(file)
        })

        imageFiles.push({
          file,
          dataUrl,
          name: file.name,
        })
      }

      setImages((prev) => [...prev, ...imageFiles])
      toast({
        title: "Images Added",
        description: `Added ${imageFiles.length} images`,
      })
    },
    [toast],
  )

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index))
  }

  const moveImage = (index: number, direction: "up" | "down") => {
    setImages((prev) => {
      const newImages = [...prev]
      const targetIndex = direction === "up" ? index - 1 : index + 1

      if (targetIndex >= 0 && targetIndex < newImages.length) {
        ;[newImages[index], newImages[targetIndex]] = [newImages[targetIndex], newImages[index]]
      }

      return newImages
    })
  }

  const generatePDF = async () => {
    if (images.length === 0) {
      toast({
        title: "No Images",
        description: "Please add at least one image",
        variant: "destructive",
      })
      return
    }

    setIsProcessing(true)
    setProgress(0)

    try {
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: pageSize.toLowerCase() as any,
      })

      const pageWidth = pdf.internal.pageSize.getWidth()
      const pageHeight = pdf.internal.pageSize.getHeight()
      const margin = 10

      for (let i = 0; i < images.length; i++) {
        if (i > 0) {
          pdf.addPage()
        }

        const img = new Image()
        img.crossOrigin = "anonymous"

        await new Promise<void>((resolve, reject) => {
          img.onload = () => {
            const imgWidth = img.width
            const imgHeight = img.height
            const ratio = Math.min((pageWidth - 2 * margin) / imgWidth, (pageHeight - 2 * margin) / imgHeight)

            const width = imgWidth * ratio
            const height = imgHeight * ratio
            const x = (pageWidth - width) / 2
            const y = (pageHeight - height) / 2

            pdf.addImage(images[i].dataUrl, "JPEG", x, y, width, height)
            resolve()
          }
          img.onerror = reject
          img.src = images[i].dataUrl
        })

        setProgress(((i + 1) / images.length) * 100)
      }

      pdf.save(`photos-to-pdf-${Date.now()}.pdf`)

      toast({
        title: "PDF Generated",
        description: "PDF has been successfully created and downloaded",
      })
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "Failed to generate PDF",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
      setProgress(0)
    }
  }

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <FileImage className="h-12 w-12 text-emerald-500 mr-4" />
            <h1 className="text-4xl font-bold gradient-text">Photo to PDF</h1>
          </div>
          <p className="text-lg text-muted-foreground">Convert multiple images to a single PDF document</p>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Upload Images</CardTitle>
            </CardHeader>
            <CardContent>
              <FileDropzone
                onFilesAccepted={handleFilesAccepted}
                acceptedFileTypes={["image/jpeg", "image/png", "image/webp"]}
                maxFileSize={50 * 1024 * 1024}
                maxFiles={50}
              />
            </CardContent>
          </Card>

          {isProcessing && (
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Generating PDF...</span>
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
                  <CardTitle>Images ({images.length})</CardTitle>
                  <div className="flex items-center space-x-4">
                    <Select value={pageSize} onValueChange={(value: PageSize) => setPageSize(value)}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="A4">A4</SelectItem>
                        <SelectItem value="A3">A3</SelectItem>
                        <SelectItem value="Letter">Letter</SelectItem>
                        <SelectItem value="Legal">Legal</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button onClick={generatePDF} disabled={isProcessing}>
                      <Download className="h-4 w-4 mr-2" />
                      Generate PDF
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {images.map((image, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <img
                        src={image.dataUrl || "/placeholder.svg"}
                        alt={image.name}
                        className="w-full h-32 object-cover rounded mb-2"
                      />
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium truncate">{image.name}</span>
                        <div className="flex space-x-1">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => moveImage(index, "up")}
                            disabled={index === 0}
                          >
                            <ArrowUp className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => moveImage(index, "down")}
                            disabled={index === images.length - 1}
                          >
                            <ArrowDown className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => removeImage(index)}>
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
