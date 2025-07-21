"use client"

import type React from "react"

import { useState, useRef, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FileDropzone } from "@/components/file-dropzone"
import { PenTool, Download, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { PDFDocument, rgb } from "pdf-lib"

interface SignedDocument {
  id: string
  originalFile: File
  signedPdfUrl: string
  signatureName: string
  timestamp: Date
}

export default function DigitalSignaturePage() {
  const [documents, setDocuments] = useState<SignedDocument[]>([])
  const [signatureName, setSignatureName] = useState("")
  const [isDrawing, setIsDrawing] = useState(false)
  const [signatureData, setSignatureData] = useState("")
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { toast } = useToast()

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true)
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    ctx.beginPath()
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top)
  }

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return

    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top)
    ctx.stroke()
  }

  const stopDrawing = () => {
    setIsDrawing(false)
    const canvas = canvasRef.current
    if (!canvas) return

    setSignatureData(canvas.toDataURL())
  }

  const clearSignature = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    setSignatureData("")
  }

  const signDocument = async (file: File) => {
    if (!signatureData || !signatureName.trim()) {
      toast({
        title: "Missing Information",
        description: "Please draw a signature and enter your name",
        variant: "destructive",
      })
      return
    }

    try {
      const arrayBuffer = await file.arrayBuffer()
      const pdfDoc = await PDFDocument.load(arrayBuffer)

      // Get the first page
      const pages = pdfDoc.getPages()
      const firstPage = pages[0]
      const { width, height } = firstPage.getSize()

      // Add signature image
      const signatureImage = await pdfDoc.embedPng(signatureData)
      const signatureWidth = 150
      const signatureHeight = 75

      firstPage.drawImage(signatureImage, {
        x: width - signatureWidth - 50,
        y: 50,
        width: signatureWidth,
        height: signatureHeight,
      })

      // Add signature text
      firstPage.drawText(`Digitally signed by: ${signatureName}`, {
        x: width - signatureWidth - 50,
        y: 30,
        size: 10,
        color: rgb(0, 0, 0),
      })

      firstPage.drawText(`Date: ${new Date().toLocaleDateString()}`, {
        x: width - signatureWidth - 50,
        y: 15,
        size: 8,
        color: rgb(0.5, 0.5, 0.5),
      })

      const pdfBytes = await pdfDoc.save()
      const blob = new Blob([pdfBytes], { type: "application/pdf" })
      const signedPdfUrl = URL.createObjectURL(blob)

      const signedDoc: SignedDocument = {
        id: Date.now().toString(),
        originalFile: file,
        signedPdfUrl,
        signatureName,
        timestamp: new Date(),
      }

      setDocuments((prev) => [signedDoc, ...prev])

      toast({
        title: "Document Signed",
        description: "Digital signature has been added successfully",
      })
    } catch (error) {
      toast({
        title: "Signing Failed",
        description: "Failed to add digital signature",
        variant: "destructive",
      })
    }
  }

  const handleFilesAccepted = useCallback(
    async (files: File[]) => {
      for (const file of files) {
        await signDocument(file)
      }
    },
    [signatureData, signatureName],
  )

  const downloadDocument = (doc: SignedDocument) => {
    const link = document.createElement("a")
    link.href = doc.signedPdfUrl
    link.download = `signed-${doc.originalFile.name}`
    link.click()
  }

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <PenTool className="h-12 w-12 text-rose-500 mr-4" />
            <h1 className="text-4xl font-bold gradient-text">Digital Signature</h1>
          </div>
          <p className="text-lg text-muted-foreground">Add digital signatures to your PDF documents</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Create Signature</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    placeholder="Enter your full name"
                    value={signatureName}
                    onChange={(e) => setSignatureName(e.target.value)}
                  />
                </div>

                <div>
                  <Label>Draw Your Signature</Label>
                  <canvas
                    ref={canvasRef}
                    width={400}
                    height={150}
                    className="border rounded-lg cursor-crosshair bg-white w-full"
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                  />
                  <Button onClick={clearSignature} variant="outline" size="sm" className="mt-2 bg-transparent">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Clear Signature
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Upload PDF Documents</CardTitle>
              </CardHeader>
              <CardContent>
                <FileDropzone
                  onFilesAccepted={handleFilesAccepted}
                  acceptedFileTypes={["application/pdf"]}
                  maxFileSize={100 * 1024 * 1024}
                  maxFiles={10}
                />
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Signed Documents ({documents.length})</CardTitle>
              </CardHeader>
              <CardContent>
                {documents.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <PenTool className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No signed documents yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {documents.map((doc) => (
                      <div key={doc.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">{doc.originalFile.name}</h4>
                            <p className="text-sm text-muted-foreground">Signed by: {doc.signatureName}</p>
                            <p className="text-xs text-muted-foreground">{doc.timestamp.toLocaleString()}</p>
                          </div>
                          <Button size="sm" onClick={() => downloadDocument(doc)}>
                            <Download className="h-4 w-4" />
                          </Button>
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
