"use client"

import { Card, CardContent } from "@/components/ui/card"
import {
  ImageIcon,
  FileText,
  QrCode,
  Type,
  FileArchiveIcon as Compress,
  Sparkles,
  Crop,
  RefreshCw,
  Layers,
  Camera,
  Scan,
  FilePlus,
  PenTool,
  Droplets,
  Search,
  FileImage,
  ScanLine,
  Palette,
  Eye,
} from "lucide-react"
import Link from "next/link"

const toolCategories = [
  {
    title: "Smart Text Tools",
    icon: Type,
    color: "from-green-500 to-emerald-600",
    tools: [
      { name: "Secure Text Locker", icon: Type, href: "/tools/secure-text" },
      { name: "AI Smart Notes", icon: Sparkles, href: "/tools/ai-notes" },
    ],
  },
  {
    title: "Image Tools",
    icon: ImageIcon,
    color: "from-blue-500 to-cyan-600",
    tools: [
      { name: "Image Compressor", icon: Compress, href: "/tools/image-compressor" },
      { name: "Image Enhancer AI", icon: Sparkles, href: "/tools/image-enhancer" },
      { name: "Image Resizer", icon: Crop, href: "/tools/image-resizer" },
      { name: "Format Converter", icon: RefreshCw, href: "/tools/format-converter" },
      { name: "Background Merger", icon: Layers, href: "/tools/background-merger" },
      { name: "ID Photo Maker", icon: Camera, href: "/tools/id-photo-maker" },
      { name: "AI Art Stylizer", icon: Palette, href: "/tools/art-stylizer" },
    ],
  },
  {
    title: "Document Tools",
    icon: FileText,
    color: "from-purple-500 to-pink-600",
    tools: [
      { name: "Photo to PDF", icon: FileImage, href: "/tools/photo-to-pdf" },
      { name: "CamScanner Clone", icon: Scan, href: "/tools/cam-scanner" },
      { name: "PDF Merger", icon: FilePlus, href: "/tools/pdf-merger" },
      { name: "Digital Signature", icon: PenTool, href: "/tools/digital-signature" },
      { name: "Watermark Tools", icon: Droplets, href: "/tools/watermark-tools" },
      { name: "Text Extractor (OCR)", icon: Search, href: "/tools/text-extractor" },
      { name: "AI Summarizer", icon: Sparkles, href: "/tools/ai-summarizer" },
    ],
  },
  {
    title: "QR Code Tools",
    icon: QrCode,
    color: "from-orange-500 to-red-600",
    tools: [
      { name: "QR Generator", icon: QrCode, href: "/tools/qr-generator" },
      { name: "Real-Time QR Scanner", icon: ScanLine, href: "/tools/qr-scanner" },
      { name: "Custom QR Designer", icon: Palette, href: "/tools/qr-designer" },
      { name: "QR Decoder AI", icon: Eye, href: "/tools/qr-decoder" },
    ],
  },
]

export function AllToolsSection() {
  return (
    <section id="tools" className="py-20 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-6xl font-bold mb-4">
            <span className="gradient-text">ALL TOOLS</span>
          </h2>
          <p className="text-xl text-muted-foreground">Choose from our comprehensive collection of web tools</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-8">
          {toolCategories.map((category) => {
            const CategoryIcon = category.icon
            return (
              <Card key={category.title} className="tool-card group">
                <CardContent className="p-6">
                  <div className="text-center mb-6">
                    <div className={`inline-flex p-4 rounded-full bg-gradient-to-r ${category.color} mb-4`}>
                      <CategoryIcon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">{category.title}</h3>
                  </div>

                  <div className="space-y-3">
                    {category.tools.map((tool) => {
                      const ToolIcon = tool.icon
                      return (
                        <Link
                          key={tool.name}
                          href={tool.href}
                          className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors group/tool"
                        >
                          <ToolIcon className="h-4 w-4 text-muted-foreground group-hover/tool:text-foreground" />
                          <span className="text-sm font-medium group-hover/tool:text-foreground">{tool.name}</span>
                        </Link>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
