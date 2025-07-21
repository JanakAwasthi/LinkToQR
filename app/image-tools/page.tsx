import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileArchiveIcon as Compress, Wand2, Crop, RefreshCw, Layers, Camera, Palette } from "lucide-react"
import Link from "next/link"

const imageTools = [
  {
    name: "Image Compressor",
    description: "Reduce image file size while maintaining quality with adjustable compression",
    icon: Compress,
    href: "/tools/image-compressor",
    color: "from-orange-500 to-red-600",
    badge: "Most Popular",
    features: ["Quality control", "Batch processing", "90% size reduction"],
  },
  {
    name: "Image Enhancer AI",
    description: "Enhance image quality with AI-powered brightness, contrast, and saturation controls",
    icon: Wand2,
    href: "/tools/image-enhancer",
    color: "from-purple-500 to-pink-600",
    badge: "AI Powered",
    features: ["Real-time preview", "Advanced filters", "Before/after comparison"],
  },
  {
    name: "Image Resizer",
    description: "Resize images while maintaining aspect ratio with custom dimensions",
    icon: Crop,
    href: "/tools/image-resizer",
    color: "from-blue-500 to-indigo-600",
    badge: "Fast Processing",
    features: ["Aspect ratio lock", "Custom dimensions", "Batch resize"],
  },
  {
    name: "Format Converter",
    description: "Convert between JPG, PNG, and WebP formats with quality preservation",
    icon: RefreshCw,
    href: "/tools/format-converter",
    color: "from-cyan-500 to-blue-600",
    badge: "Multi-Format",
    features: ["3 formats supported", "Quality preservation", "Transparency handling"],
  },
  {
    name: "Background Merger",
    description: "Merge foreground and background images with advanced blending",
    icon: Layers,
    href: "/tools/background-merger",
    color: "from-pink-500 to-rose-600",
    badge: "Creative",
    features: ["Layer blending", "Transparency support", "Custom positioning"],
  },
  {
    name: "ID Photo Maker",
    description: "Create professional ID photos with custom backgrounds and sizing",
    icon: Camera,
    href: "/tools/id-photo-maker",
    color: "from-indigo-500 to-purple-600",
    badge: "Professional",
    features: ["Standard sizes", "Background removal", "Print ready"],
  },
  {
    name: "AI Art Stylizer",
    description: "Apply artistic styles to your images using AI transformation",
    icon: Palette,
    href: "/tools/art-stylizer",
    color: "from-red-500 to-pink-600",
    badge: "Artistic",
    features: ["Multiple styles", "AI transformation", "High resolution"],
  },
]

export default function ImageToolsPage() {
  return (
    <div className="min-h-screen py-20 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl lg:text-6xl font-bold mb-4">
            <span className="gradient-text">Image Tools</span>
          </h1>
          <p className="text-xl text-muted-foreground">Professional image processing and enhancement tools</p>
          <div className="flex justify-center items-center gap-4 mt-6">
            <Badge variant="outline" className="text-blue-600 border-blue-600">
              7 Tools Available
            </Badge>
            <Badge variant="outline" className="text-green-600 border-green-600">
              AI Enhanced
            </Badge>
            <Badge variant="outline" className="text-purple-600 border-purple-600">
              Batch Processing
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {imageTools.map((tool) => {
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
              <h2 className="text-2xl font-bold mb-4">Why Choose Our Image Tools?</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                <div>
                  <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Wand2 className="h-6 w-6 text-blue-500" />
                  </div>
                  <h3 className="font-semibold mb-2">AI Enhanced</h3>
                  <p className="text-muted-foreground">Advanced AI algorithms for superior image processing</p>
                </div>
                <div>
                  <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Compress className="h-6 w-6 text-green-500" />
                  </div>
                  <h3 className="font-semibold mb-2">Quality Preservation</h3>
                  <p className="text-muted-foreground">Maintain image quality while optimizing file size</p>
                </div>
                <div>
                  <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Layers className="h-6 w-6 text-purple-500" />
                  </div>
                  <h3 className="font-semibold mb-2">Creative Freedom</h3>
                  <p className="text-muted-foreground">Professional tools for creative image manipulation</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
