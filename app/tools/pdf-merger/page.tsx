"use client"

import { useState, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileDropzone } from "@/components/file-dropzone"
import { Progress } from "@/components/ui/progress"
import { FilePlus, Download, Trash2, ArrowUp, ArrowDown } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { PDFDocument } from "pdf-lib"

interface PDFFile {
  file: File
  name: string
  size: number
  pages?: number
}

export default function PDFMergerPage() {
  const [pdfFiles, setPdfFiles] = useState<PDFFile[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const { toast } = useToast()

  const handleFilesAccepted = useCallback(
    async (files: File[]) => {
      const newPdfFiles: PDFFile[] = []

      for (const file of files) {
        try {
          const arrayBuffer = await file.arrayBuffer()
          const pdfDoc = await PDFDocument.load(arrayBuffer)
          const pageCount = pdfDoc.getPageCount()

          newPdfFiles.push({
            file,
            name: file.name,
            size: file.size,
            pages: pageCount,
          })
        } catch (error) {
          toast({
            title: "Invalid PDF",
            description: `${file.name} is not a valid PDF file`,
            variant: "destructive",
          })
        }
      }

      setPdfFiles((prev) => [...prev, ...newPdfFiles])

      if (newPdfFiles.length > 0) {
        toast({
          title: "PDFs Added",
          description: `Added ${newPdfFiles.length} PDF files`,
        })
      }
    },
    [toast],
  )

  const removePDF = (index: number) => {
    setPdfFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const movePDF = (index: number, direction: "up" | "down") => {
    setPdfFiles((prev) => {
      const newFiles = [...prev]
      const targetIndex = direction === "up" ? index - 1 : index + 1

      if (targetIndex >= 0 && targetIndex < newFiles.length) {
        ;[newFiles[index], newFiles[targetIndex]] = [newFiles[targetIndex], newFiles[index]]
      }

      return newFiles
    })
  }

  const mergePDFs = async () => {
    if (pdfFiles.length < 2) {
      toast({
        title: "Not Enough Files",
        description: "Please add at least 2 PDF files to merge",
        variant: "destructive",
      })
      return
    }

    setIsProcessing(true)
    setProgress(0)

    try {
      const mergedPdf = await PDFDocument.create()

      for (let i = 0; i < pdfFiles.length; i++) {
        const file = pdfFiles[i]
        const arrayBuffer = await file.file.arrayBuffer()
        const pdf = await PDFDocument.load(arrayBuffer)
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices())

        copiedPages.forEach((page) => mergedPdf.addPage(page))
        setProgress(((i + 1) / pdfFiles.length) * 100)
      }

      const pdfBytes = await mergedPdf.save()
      const blob = new Blob([pdfBytes], { type: "application/pdf" })
      const url = URL.createObjectURL(blob)

      const link = document.createElement("a")
      link.href = url
      link.download = `merged-pdf-${Date.now()}.pdf`
      link.click()

      URL.revokeObjectURL(url)

      toast({
        title: "Merge Complete",
        description: "PDFs have been successfully merged and downloaded",
      })
    } catch (error) {
      toast({
        title: "Merge Failed",
        description: "Failed to merge PDF files",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
      setProgress(0)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const totalPages = pdfFiles.reduce((sum, file) => sum + (file.pages || 0), 0)
  const totalSize = pdfFiles.reduce((sum, file) => sum + file.size, 0)

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <FilePlus className="h-12 w-12 text-violet-500 mr-4" />
            <h1 className="text-4xl font-bold gradient-text">PDF Merger</h1>
          </div>
          <p className="text-lg text-muted-foreground">Combine multiple PDF files into a single document</p>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Upload PDF Files</CardTitle>
            </CardHeader>
            <CardContent>
              <FileDropzone
                onFilesAccepted={handleFilesAccepted}
                acceptedFileTypes={["application/pdf"]}
                maxFileSize={100 * 1024 * 1024} // 100MB
                maxFiles={20}
              />
            </CardContent>
          </Card>

          {isProcessing && (
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Merging PDFs...</span>
                  <span className="text-sm text-muted-foreground">{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="w-full" />
              </CardContent>
            </Card>
          )}

          {pdfFiles.length > 0 && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>PDF Files ({pdfFiles.length})</CardTitle>
                  <div className="text-sm text-muted-foreground">
                    {totalPages} pages • {formatFileSize(totalSize)}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {pdfFiles.map((pdf, index) => (
                    <div key={index} className="flex items-center space-x-4 p-4 border rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium">{pdf.name}</h4>
                        <div className="text-sm text-muted-foreground">
                          {pdf.pages} pages • {formatFileSize(pdf.size)}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button size="sm" variant="outline" onClick={() => movePDF(index, "up")} disabled={index === 0}>
                          <ArrowUp className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => movePDF(index, "down")}
                          disabled={index === pdfFiles.length - 1}
                        >
                          <ArrowDown className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => removePDF(index)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 text-center">
                  <Button
                    onClick={mergePDFs}
                    disabled={pdfFiles.length < 2 || isProcessing}
                    className="bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Merge & Download PDF
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Features</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2" />
                    Merge up to 20 PDFs
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-2" />
                    Reorder files easily
                  </li>
                </ul>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mr-2" />
                    No file size limit
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mr-2" />
                    100% client-side
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
