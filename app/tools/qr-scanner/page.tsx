"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScanLine, Camera, Copy, ExternalLink, Wifi, Mail, Phone, MessageSquare } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import jsQR from "jsqr"

interface QRResult {
  data: string
  type: "url" | "text" | "wifi" | "email" | "phone" | "sms" | "unknown"
  timestamp: Date
}

export default function QRScannerPage() {
  const [isScanning, setIsScanning] = useState(false)
  const [results, setResults] = useState<QRResult[]>([])
  const [stream, setStream] = useState<MediaStream | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { toast } = useToast()

  const detectQRType = (data: string): QRResult["type"] => {
    if (data.startsWith("http://") || data.startsWith("https://")) return "url"
    if (data.startsWith("WIFI:")) return "wifi"
    if (data.startsWith("mailto:")) return "email"
    if (data.startsWith("tel:")) return "phone"
    if (data.startsWith("sms:")) return "sms"
    return "text"
  }

  const startScanning = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      })

      setStream(mediaStream)
      setIsScanning(true)

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
        videoRef.current.play()
      }

      toast({
        title: "Camera Started",
        description: "Point your camera at a QR code to scan",
      })
    } catch (error) {
      toast({
        title: "Camera Error",
        description: "Unable to access camera. Please check permissions.",
        variant: "destructive",
      })
    }
  }

  const stopScanning = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop())
      setStream(null)
    }
    setIsScanning(false)
  }

  const scanFrame = () => {
    if (!videoRef.current || !canvasRef.current || !isScanning) return

    const video = videoRef.current
    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")

    if (video.readyState === video.HAVE_ENOUGH_DATA) {
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight

      ctx?.drawImage(video, 0, 0, canvas.width, canvas.height)

      const imageData = ctx?.getImageData(0, 0, canvas.width, canvas.height)

      if (imageData) {
        const code = jsQR(imageData.data, imageData.width, imageData.height)

        if (code) {
          const newResult: QRResult = {
            data: code.data,
            type: detectQRType(code.data),
            timestamp: new Date(),
          }

          // Avoid duplicate results
          if (!results.some((r) => r.data === code.data)) {
            setResults((prev) => [newResult, ...prev])
            toast({
              title: "QR Code Detected",
              description: `Found ${newResult.type} QR code`,
            })
          }
        }
      }
    }

    requestAnimationFrame(scanFrame)
  }

  useEffect(() => {
    if (isScanning) {
      scanFrame()
    }
  }, [isScanning])

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast({
        title: "Copied",
        description: "QR code content copied to clipboard",
      })
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Failed to copy to clipboard",
        variant: "destructive",
      })
    }
  }

  const openLink = (url: string) => {
    window.open(url, "_blank")
  }

  const getTypeIcon = (type: QRResult["type"]) => {
    switch (type) {
      case "url":
        return <ExternalLink className="h-4 w-4" />
      case "wifi":
        return <Wifi className="h-4 w-4" />
      case "email":
        return <Mail className="h-4 w-4" />
      case "phone":
        return <Phone className="h-4 w-4" />
      case "sms":
        return <MessageSquare className="h-4 w-4" />
      default:
        return <ScanLine className="h-4 w-4" />
    }
  }

  const getTypeColor = (type: QRResult["type"]) => {
    switch (type) {
      case "url":
        return "bg-blue-500"
      case "wifi":
        return "bg-green-500"
      case "email":
        return "bg-purple-500"
      case "phone":
        return "bg-orange-500"
      case "sms":
        return "bg-cyan-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <ScanLine className="h-12 w-12 text-orange-500 mr-4" />
            <h1 className="text-4xl font-bold gradient-text">QR Scanner</h1>
          </div>
          <p className="text-lg text-muted-foreground">Scan QR codes in real-time using your camera</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Camera className="h-5 w-5 mr-2" />
                  Camera Scanner
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <video ref={videoRef} className="w-full h-64 bg-black rounded-lg object-cover" playsInline muted />
                  <canvas ref={canvasRef} className="hidden" />

                  {isScanning && (
                    <div className="absolute inset-0 border-2 border-orange-500 rounded-lg">
                      <div className="absolute top-4 left-4 right-4 h-0.5 bg-orange-500 animate-pulse" />
                      <div className="absolute bottom-4 left-4 right-4 h-0.5 bg-orange-500 animate-pulse" />
                    </div>
                  )}
                </div>

                <div className="mt-4 text-center">
                  {!isScanning ? (
                    <Button onClick={startScanning} className="bg-orange-500 hover:bg-orange-600">
                      <Camera className="h-4 w-4 mr-2" />
                      Start Scanning
                    </Button>
                  ) : (
                    <Button onClick={stopScanning} variant="outline">
                      Stop Scanning
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Scan Results ({results.length})</CardTitle>
              </CardHeader>
              <CardContent>
                {results.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <ScanLine className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No QR codes scanned yet</p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {results.map((result, index) => (
                      <div key={index} className="border rounded-lg p-3">
                        <div className="flex items-start justify-between mb-2">
                          <Badge variant="outline" className={`${getTypeColor(result.type)} text-white border-0`}>
                            {getTypeIcon(result.type)}
                            <span className="ml-1">{result.type.toUpperCase()}</span>
                          </Badge>
                          <span className="text-xs text-muted-foreground">{result.timestamp.toLocaleTimeString()}</span>
                        </div>

                        <p className="text-sm font-mono bg-muted p-2 rounded break-all mb-2">{result.data}</p>

                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline" onClick={() => copyToClipboard(result.data)}>
                            <Copy className="h-3 w-3 mr-1" />
                            Copy
                          </Button>
                          {result.type === "url" && (
                            <Button size="sm" variant="outline" onClick={() => openLink(result.data)}>
                              <ExternalLink className="h-3 w-3 mr-1" />
                              Open
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
