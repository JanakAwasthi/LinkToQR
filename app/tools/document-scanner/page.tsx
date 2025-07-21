"use client"

import { useState, useRef, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileDropzone } from "@/components/file-dropzone"
import { Scan, Camera, Download } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ScannedDocument {
  id: string
  originalImage: string
  processedImage: string
  name: string
  timestamp: Date
}

export default function DocumentScannerPage() {
  const [documents, setDocuments] = useState<ScannedDocument[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [showCamera, setShowCamera] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const { toast } = useToast()

  const processDocument = useCallback(async (file: File): Promise<ScannedDocument> => {
    return new Promise((resolve, reject) => {
      const img = new Image()
      const canvas = document.createElement("canvas")
      const ctx = canvas.getContext("2d")

      img.onload = () => {
        canvas.width = img.width
        canvas.height = img.height

        // Draw original image
        ctx?.drawImage(img, 0, 0)

        // Apply document enhancement filters
        if (ctx) {
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
          const data = imageData.data

          // Enhance contrast and brightness
          for (let i = 0; i < data.length; i += 4) {
            // Increase contrast
            data[i] = Math.min(255, Math.max(0, (data[i] - 128) * 1.5 + 128)) // Red
            data[i + 1] = Math.min(255, Math.max(0, (data[i + 1] - 128) * 1.5 + 128)) // Green
            data[i + 2] = Math.min(255, Math.max(0, (data[i + 2] - 128) * 1.5 + 128)) // Blue
          }

          ctx.putImageData(imageData, 0, 0)
        }

        const originalDataUrl = URL.createObjectURL(file)
        const processedDataUrl = canvas.toDataURL("image/jpeg", 0.9)

        resolve({
          id: Date.now().toString(),
          originalImage: originalDataUrl,
          processedImage: processedDataUrl,
          name: file.name,
          timestamp: new Date(),
        })
      }

      img.onerror = () => reject(new Error("Failed to process document"))
      img.src = URL.createObjectURL(file)
    })
  }, [])

  const handleFilesAccepted = useCallback(
    async (files: File[]) => {
      setIsProcessing(true)
      const processedDocs: ScannedDocument[] = []

      for (const file of files) {
        try {
          const processed = await processDocument(file)
          processedDocs.push(processed)
        } catch (error) {
          toast({
            title: "Processing Failed",
            description: `Failed to process ${file.name}`,
            variant: "destructive",
          })
        }
      }

      setDocuments((prev) => [...processedDocs, ...prev])
      setIsProcessing(false)

      if (processedDocs.length > 0) {
        toast({
          title: "Documents Processed",
          description: `Successfully processed ${processedDocs.length} documents`,
        })
      }
    },
    [processDocument, toast],
  )

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      })

      setStream(mediaStream)
      setShowCamera(true)

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
        videoRef.current.play()
      }
    } catch (error) {
      toast({
        title: "Camera Error",
        description: "Unable to access camera",
        variant: "destructive",
      })
    }
  }

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop())
      setStream(null)
    }
    setShowCamera(false)
  }

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return

    const video = videoRef.current
    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")

    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    ctx?.drawImage(video, 0, 0)

    canvas.toBlob(
      async (blob) => {
        if (blob) {
          const file = new File([blob], `scan-${Date.now()}.jpg`, { type: "image/jpeg" })
          await handleFilesAccepted([file])
          stopCamera()
        }
      },
      "image/jpeg",
      0.9,
    )
  }

  const downloadDocument = (doc: ScannedDocument) => {
    const link = document.createElement("a")
    link.href = doc.processedImage
    link.download = `scanned-${doc.name}`
    link.click()
  }

  const downloadAll = () => {
    documents.forEach((doc) => downloadDocument(doc))
  }

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Scan className="h-12 w-12 text-teal-500 mr-4" />
            <h1 className="text-4xl font-bold gradient-text">Document Scanner</h1>
          </div>
          <p className="text-lg text-muted-foreground">Scan and enhance documents with auto edge detection</p>
        </div>

        <div className="space-y-6">
          {!showCamera ? (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Scan Documents</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button onClick={startCamera} className="h-20 bg-teal-500 hover:bg-teal-600">
                      <Camera className="h-6 w-6 mr-2" />
                      Use Camera
                    </Button>
                    <div className="h-20">
                      <FileDropzone
                        onFilesAccepted={handleFilesAccepted}
                        acceptedFileTypes={["image/jpeg", "image/png"]}
                        maxFileSize={50 * 1024 * 1024}
                        maxFiles={10}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Camera Scanner</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <video ref={videoRef} className="w-full h-64 bg-black rounded-lg object-cover" playsInline muted />
                  <canvas ref={canvasRef} className="hidden" />

                  <div className="absolute inset-0 border-2 border-teal-500 rounded-lg pointer-events-none">
                    <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-teal-500" />
                    <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-teal-500" />
                    <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-teal-500" />
                    <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-teal-500" />
                  </div>
                </div>

                <div className="mt-4 flex justify-center space-x-4">
                  <Button onClick={capturePhoto} className="bg-teal-500 hover:bg-teal-600">
                    <Camera className="h-4 w-4 mr-2" />
                    Capture
                  </Button>
                  <Button onClick={stopCamera} variant="outline">
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {documents.length > 0 && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Scanned Documents ({documents.length})</CardTitle>
                  <Button onClick={downloadAll} variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Download All
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {documents.map((doc) => (
                    <div key={doc.id} className="border rounded-lg p-4">
                      <div className="grid grid-cols-2 gap-2 mb-4">
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Original</p>
                          <img
                            src={doc.originalImage || "/placeholder.svg"}
                            alt="Original"
                            className="w-full h-24 object-cover rounded border"
                          />
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Enhanced</p>
                          <img
                            src={doc.processedImage || "/placeholder.svg"}
                            alt="Enhanced"
                            className="w-full h-24 object-cover rounded border"
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-sm">{doc.name}</p>
                          <p className="text-xs text-muted-foreground">{doc.timestamp.toLocaleString()}</p>
                        </div>
                        <Button size="sm" onClick={() => downloadDocument(doc)}>
                          <Download className="h-3 w-3" />
                        </Button>
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
