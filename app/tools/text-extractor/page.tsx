"use client"

import { useState, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { FileDropzone } from "@/components/file-dropzone"
import { Progress } from "@/components/ui/progress"
import { Search, Copy, Download, FileText } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Tesseract from "tesseract.js"

interface ExtractedText {
  fileName: string
  text: string
  confidence: number
}

export default function TextExtractorPage() {
  const [extractedTexts, setExtractedTexts] = useState<ExtractedText[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentFile, setCurrentFile] = useState("")
  const { toast } = useToast()

  const extractTextFromImage = useCallback(async (file: File): Promise<ExtractedText> => {
    return new Promise((resolve, reject) => {
      Tesseract.recognize(file, "eng", {
        logger: (m) => {
          if (m.status === "recognizing text") {
            setProgress(m.progress * 100)
          }
        },
      })
        .then(({ data: { text, confidence } }) => {
          resolve({
            fileName: file.name,
            text: text.trim(),
            confidence: Math.round(confidence),
          })
        })
        .catch(reject)
    })
  }, [])

  const handleFilesAccepted = useCallback(
    async (files: File[]) => {
      setIsProcessing(true)
      setProgress(0)
      const results: ExtractedText[] = []

      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        setCurrentFile(file.name)

        try {
          const result = await extractTextFromImage(file)
          results.push(result)

          toast({
            title: "Text Extracted",
            description: `Extracted text from ${file.name} (${result.confidence}% confidence)`,
          })
        } catch (error) {
          toast({
            title: "Extraction Failed",
            description: `Failed to extract text from ${file.name}`,
            variant: "destructive",
          })
        }
      }

      setExtractedTexts((prev) => [...prev, ...results])
      setIsProcessing(false)
      setProgress(0)
      setCurrentFile("")
    },
    [extractTextFromImage, toast],
  )

  const copyText = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast({
        title: "Copied",
        description: "Text copied to clipboard",
      })
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Failed to copy text",
        variant: "destructive",
      })
    }
  }

  const downloadText = (text: string, fileName: string) => {
    const blob = new Blob([text], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `extracted-${fileName}.txt`
    link.click()
    URL.revokeObjectURL(url)
  }

  const downloadAllText = () => {
    const allText = extractedTexts
      .map((item) => `=== ${item.fileName} (${item.confidence}% confidence) ===\n${item.text}\n\n`)
      .join("")

    const blob = new Blob([allText], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `all-extracted-text-${Date.now()}.txt`
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Search className="h-12 w-12 text-amber-500 mr-4" />
            <h1 className="text-4xl font-bold gradient-text">Text Extractor (OCR)</h1>
          </div>
          <p className="text-lg text-muted-foreground">Extract text from images using advanced OCR technology</p>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Upload Images</CardTitle>
            </CardHeader>
            <CardContent>
              <FileDropzone
                onFilesAccepted={handleFilesAccepted}
                acceptedFileTypes={["image/jpeg", "image/png", "image/webp", "image/bmp", "image/tiff"]}
                maxFileSize={50 * 1024 * 1024} // 50MB
                maxFiles={10}
              />
            </CardContent>
          </Card>

          {isProcessing && (
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Processing: {currentFile}</span>
                  <span className="text-sm text-muted-foreground">{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="w-full" />
              </CardContent>
            </Card>
          )}

          {extractedTexts.length > 0 && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Extracted Text ({extractedTexts.length})</CardTitle>
                  <Button onClick={downloadAllText} variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Download All
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {extractedTexts.map((item, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="font-medium">{item.fileName}</h4>
                          <p className="text-sm text-muted-foreground">Confidence: {item.confidence}%</p>
                        </div>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline" onClick={() => copyText(item.text)}>
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => downloadText(item.text, item.fileName)}>
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <Textarea
                        value={item.text}
                        readOnly
                        className="min-h-[200px] font-mono text-sm"
                        placeholder="No text extracted"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                OCR Features
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2" />
                    High accuracy OCR
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-2" />
                    Multiple image formats
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mr-2" />
                    Batch processing
                  </li>
                </ul>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mr-2" />
                    Confidence scoring
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-red-500 rounded-full mr-2" />
                    Copy & download text
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-cyan-500 rounded-full mr-2" />
                    Privacy-first processing
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
