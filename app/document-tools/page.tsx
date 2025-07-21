import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileImage, Scan, FilePlus, PenTool, Droplets, Search, Sparkles } from "lucide-react"
import Link from "next/link"

const documentTools = [
  {
    name: "Photo to PDF",
    description: "Convert multiple images to a single PDF document with custom page sizes",
    icon: FileImage,
    href: "/tools/photo-to-pdf",
    color: "from-emerald-500 to-green-600",
    badge: "Batch Processing",
    features: ["Multiple page sizes", "Drag & drop reordering", "Auto-fitting"],
  },
  {
    name: "Document Scanner",
    description: "Scan documents with camera integration and auto edge detection",
    icon: Scan,
    href: "/tools/document-scanner",
    color: "from-teal-500 to-cyan-600",
    badge: "Camera Ready",
    features: ["Live camera preview", "Auto enhancement", "Edge detection"],
  },
  {
    name: "PDF Merger",
    description: "Combine multiple PDF files into a single document with reordering",
    icon: FilePlus,
    href: "/tools/pdf-merger",
    color: "from-violet-500 to-purple-600",
    badge: "Essential",
    features: ["Drag & drop reorder", "Page count display", "Large file support"],
  },
  {
    name: "Digital Signature",
    description: "Add digital signatures to PDF documents with drawing canvas",
    icon: PenTool,
    href: "/tools/digital-signature",
    color: "from-rose-500 to-pink-600",
    badge: "Legal Ready",
    features: ["Canvas drawing", "Name stamping", "Date embedding"],
  },
  {
    name: "Watermark Tools",
    description: "Add or remove watermarks from documents and images",
    icon: Droplets,
    href: "/tools/watermark-tools",
    color: "from-sky-500 to-blue-600",
    badge: "Protection",
    features: ["Text watermarks", "Image watermarks", "Batch processing"],
  },
  {
    name: "Text Extractor (OCR)",
    description: "Extract text from images using advanced OCR technology",
    icon: Search,
    href: "/tools/text-extractor",
    color: "from-amber-500 to-orange-600",
    badge: "AI Powered",
    features: ["High accuracy OCR", "Multiple formats", "Confidence scoring"],
  },
  {
    name: "AI Summarizer",
    description: "Summarize long documents and text using AI algorithms",
    icon: Sparkles,
    href: "/tools/ai-summarizer",
    color: "from-fuchsia-500 to-purple-600",
    badge: "AI Enhanced",
    features: ["Smart summarization", "Key points extraction", "Multiple lengths"],
  },
]

export default function DocumentToolsPage() {
  return (
    <div className="min-h-screen py-20 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl lg:text-6xl font-bold mb-4">
            <span className="gradient-text">Document Tools</span>
          </h1>
          <p className="text-xl text-muted-foreground">Professional document processing and management tools</p>
          <div className="flex justify-center items-center gap-4 mt-6">
            <Badge variant="outline" className="text-green-600 border-green-600">
              7 Tools Available
            </Badge>
            <Badge variant="outline" className="text-blue-600 border-blue-600">
              100% Privacy Secure
            </Badge>
            <Badge variant="outline" className="text-purple-600 border-purple-600">
              No Server Upload
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {documentTools.map((tool) => {
            const Icon = tool.icon
            return (
              <Link key={tool.name} href={tool.href}>
                <Card className="tool-card group h-full">
                  <CardContent className="p-0">
                    <div className={`h-40 bg-gradient-to-r ${tool.color} relative overflow-hidden`}>
                      <div className="absolute inset-0 bg-black/20" />
                      <div className="absolute top-4 right-4">
                        <Badge variant="secondary" className="bg-white/20 text-white border-0 text-xs">
                          {tool.badge}
                        </Badge>
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Icon className="h-20 w-20 text-white" />
                      </div>
                    </div>

                    <div className="p-6">
                      <h3 className="text-xl font-bold mb-3">{tool.name}</h3>
                      <p className="text-muted-foreground text-sm mb-4">{tool.description}</p>

                      <div className="space-y-2">
                        <h4 className="text-sm font-semibold">Key Features:</h4>
                        <ul className="space-y-1">
                          {tool.features.map((feature, index) => (
                            <li key={index} className="text-xs text-muted-foreground flex items-center">
                              <div className="w-1.5 h-1.5 bg-current rounded-full mr-2" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>

        <div className="mt-16 text-center">
          <Card className="max-w-2xl mx-auto">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-4">Why Choose Our Document Tools?</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                <div>
                  <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Scan className="h-6 w-6 text-green-500" />
                  </div>
                  <h3 className="font-semibold mb-2">Professional Quality</h3>
                  <p className="text-muted-foreground">Enterprise-grade document processing with high accuracy</p>
                </div>
                <div>
                  <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <FilePlus className="h-6 w-6 text-blue-500" />
                  </div>
                  <h3 className="font-semibold mb-2">Batch Processing</h3>
                  <p className="text-muted-foreground">Handle multiple documents simultaneously for efficiency</p>
                </div>
                <div>
                  <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <PenTool className="h-6 w-6 text-purple-500" />
                  </div>
                  <h3 className="font-semibold mb-2">Legal Ready</h3>
                  <p className="text-muted-foreground">Digital signatures and watermarks for official documents</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
