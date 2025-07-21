"use client"

import { useCallback, useState } from "react"
import { useDropzone } from "react-dropzone"
import { Card, CardContent } from "@/components/ui/card"
import { Upload, File, X, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface FileDropzoneProps {
  onFilesAccepted: (files: File[]) => void
  acceptedFileTypes?: string[]
  maxFileSize?: number
  maxFiles?: number
  multiple?: boolean
}

export function FileDropzone({
  onFilesAccepted,
  acceptedFileTypes = ["image/*"],
  maxFileSize = 10 * 1024 * 1024, // 10MB
  maxFiles = 5,
  multiple = true,
}: FileDropzoneProps) {
  const [files, setFiles] = useState<File[]>([])
  const [errors, setErrors] = useState<string[]>([])

  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: any[]) => {
      setErrors([])

      if (rejectedFiles.length > 0) {
        const newErrors = rejectedFiles.map(
          ({ file, errors }) => `${file.name}: ${errors.map((e: any) => e.message).join(", ")}`,
        )
        setErrors(newErrors)
      }

      if (acceptedFiles.length > 0) {
        setFiles((prev) => [...prev, ...acceptedFiles])
        onFilesAccepted(acceptedFiles)
      }
    },
    [onFilesAccepted],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedFileTypes.reduce((acc, type) => ({ ...acc, [type]: [] }), {}),
    maxSize: maxFileSize,
    maxFiles,
    multiple,
  })

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  return (
    <div className="space-y-4">
      <Card
        className={`border-2 border-dashed transition-colors ${
          isDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25"
        }`}
      >
        <CardContent className="p-8">
          <div {...getRootProps()} className="cursor-pointer text-center">
            <input {...getInputProps()} />
            <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              {isDragActive ? "Drop files here" : "Drag & drop files here"}
            </h3>
            <p className="text-muted-foreground mb-4">or click to select files from your device</p>
            <div className="flex flex-wrap justify-center gap-2">
              {acceptedFileTypes.map((type) => (
                <Badge key={type} variant="outline">
                  {type.replace("/*", "").toUpperCase()}
                </Badge>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Max {formatFileSize(maxFileSize)} per file, up to {maxFiles} files
            </p>
          </div>
        </CardContent>
      </Card>

      {errors.length > 0 && (
        <Card className="border-destructive">
          <CardContent className="p-4">
            <div className="flex items-start space-x-2">
              <AlertCircle className="h-5 w-5 text-destructive mt-0.5" />
              <div>
                <h4 className="font-semibold text-destructive mb-1">Upload Errors</h4>
                <ul className="text-sm text-destructive space-y-1">
                  {errors.map((error, index) => (
                    <li key={index}>• {error}</li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {files.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <h4 className="font-semibold mb-3">Selected Files ({files.length})</h4>
            <div className="space-y-2">
              {files.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-muted rounded-lg">
                  <div className="flex items-center space-x-2">
                    <File className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">{file.name}</p>
                      <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => removeFile(index)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
