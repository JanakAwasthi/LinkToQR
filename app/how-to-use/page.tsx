import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, Settings, Download, Shield, Zap, FileText, ImageIcon, QrCode, ArrowRight } from "lucide-react"

const steps = [
  {
    icon: Upload,
    title: "Upload Your Files",
    description:
      "Drag and drop files or click to select from your device. All processing happens locally in your browser.",
    color: "text-blue-500",
  },
  {
    icon: Settings,
    title: "Customize Settings",
    description: "Adjust quality, size, format, or other tool-specific settings to meet your needs.",
    color: "text-purple-500",
  },
  {
    icon: Zap,
    title: "Process Instantly",
    description: "Our tools process your files in real-time with progress indicators and live previews.",
    color: "text-orange-500",
  },
  {
    icon: Download,
    title: "Download Results",
    description: "Download individual files or use bulk download for multiple processed files.",
    color: "text-green-500",
  },
]

const toolCategories = [
  {
    icon: ImageIcon,
    title: "Image Tools",
    description: "Compress, resize, enhance, and convert images with AI-powered processing",
    tools: ["Image Compressor", "Format Converter", "Image Enhancer", "Image Resizer"],
    color: "from-blue-500 to-cyan-600",
  },
  {
    icon: FileText,
    title: "Document Tools",
    description: "Scan, merge, sign, and extract text from documents with professional quality",
    tools: ["PDF Merger", "Document Scanner", "Digital Signature", "OCR Text Extractor"],
    color: "from-purple-500 to-pink-600",
  },
  {
    icon: QrCode,
    title: "QR Utilities",
    description: "Generate, scan, and customize QR codes for various use cases",
    tools: ["QR Generator", "QR Scanner", "QR Designer", "QR Decoder"],
    color: "from-green-500 to-emerald-600",
  },
]

export default function HowToUsePage() {
  return (
    <div className="min-h-screen py-20 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-16">
          <h1 className="text-4xl lg:text-6xl font-bold mb-4">
            <span className="gradient-text">How to Use</span>
          </h1>
          <p className="text-xl text-muted-foreground">
            Get started with our powerful web tools in just a few simple steps
          </p>
        </div>

        {/* Steps Section */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-12">Simple 4-Step Process</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => {
              const Icon = step.icon
              return (
                <div key={index} className="text-center">
                  <div className="relative mb-6">
                    <div
                      className={`w-16 h-16 rounded-full bg-gradient-to-r ${step.color === "text-blue-500" ? "from-blue-500 to-cyan-600" : step.color === "text-purple-500" ? "from-purple-500 to-pink-600" : step.color === "text-orange-500" ? "from-orange-500 to-red-600" : "from-green-500 to-emerald-600"} flex items-center justify-center mx-auto`}
                    >
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-background border-2 border-primary rounded-full flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                    {index < steps.length - 1 && (
                      <ArrowRight className="hidden lg:block absolute top-6 -right-12 h-6 w-6 text-muted-foreground" />
                    )}
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </div>
              )
            })}
          </div>
        </div>

        {/* Tool Categories */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-12">Tool Categories</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {toolCategories.map((category) => {
              const Icon = category.icon
              return (
                <Card key={category.title} className="tool-card">
                  <CardContent className="p-0">
                    <div className={`h-32 bg-gradient-to-r ${category.color} relative overflow-hidden`}>
                      <div className="absolute inset-0 bg-black/20" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Icon className="h-16 w-16 text-white" />
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold mb-2">{category.title}</h3>
                      <p className="text-muted-foreground text-sm mb-4">{category.description}</p>
                      <div className="space-y-1">
                        {category.tools.map((tool, index) => (
                          <div key={index} className="flex items-center text-xs text-muted-foreground">
                            <div className="w-1.5 h-1.5 bg-current rounded-full mr-2" />
                            {tool}
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Privacy & Security */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="h-6 w-6 mr-2 text-green-500" />
              Privacy & Security
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2 text-green-600">100% Client-Side Processing</h3>
                <p className="text-sm text-muted-foreground">
                  All file processing happens directly in your browser. Your files never leave your device or get
                  uploaded to our servers.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2 text-blue-600">No Data Collection</h3>
                <p className="text-sm text-muted-foreground">
                  We don't collect, store, or analyze your files or personal data. Your privacy is completely protected.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2 text-purple-600">Secure Processing</h3>
                <p className="text-sm text-muted-foreground">
                  All operations use secure browser APIs and modern encryption standards for maximum security.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2 text-orange-600">No Registration Required</h3>
                <p className="text-sm text-muted-foreground">
                  Start using our tools immediately without creating accounts or providing personal information.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tips & Best Practices */}
        <Card>
          <CardHeader>
            <CardTitle>Tips & Best Practices</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">📁 File Management</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Use descriptive file names for better organization</li>
                  <li>• Process files in batches for efficiency</li>
                  <li>• Keep original files as backups before processing</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">⚡ Performance Tips</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Close other browser tabs for better performance</li>
                  <li>• Use modern browsers (Chrome, Firefox, Safari, Edge)</li>
                  <li>• Ensure stable internet connection for tool loading</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">🎯 Quality Settings</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Start with default settings and adjust as needed</li>
                  <li>• Preview results before downloading</li>
                  <li>• Higher quality settings = larger file sizes</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
