"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileArchiveIcon as Compress, QrCode, FileImage, ArrowRight, Zap } from "lucide-react"
import Link from "next/link"

const featuredTools = [
  {
    name: "AI Image Compressor",
    description: "Compress images up to 90% while maintaining quality using advanced AI algorithms",
    icon: Compress,
    color: "from-blue-500 to-cyan-600",
    href: "/tools/image-compressor",
    badge: "Most Popular",
    features: ["Batch Processing", "Quality Control", "Multiple Formats"],
  },
  {
    name: "Smart QR Generator",
    description: "Create custom QR codes with logos, colors, and advanced styling options",
    icon: QrCode,
    color: "from-purple-500 to-pink-600",
    href: "/tools/qr-generator",
    badge: "AI Powered",
    features: ["Custom Design", "Bulk Generation", "Analytics"],
  },
  {
    name: "PDF Toolkit",
    description: "Merge, split, compress, and edit PDFs with our comprehensive toolkit",
    icon: FileImage,
    color: "from-green-500 to-emerald-600",
    href: "/tools/pdf-merger",
    badge: "New",
    features: ["Merge PDFs", "Digital Signature", "OCR Text"],
  },
]

export function FeaturedTools() {
  return (
    <section className="py-20 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-5xl font-bold mb-4">
            <span className="gradient-text">Featured Tools</span>
          </h2>
          <p className="text-lg text-muted-foreground">Our most powerful and popular utilities</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredTools.map((tool) => {
            const Icon = tool.icon
            return (
              <Card key={tool.name} className="tool-card group overflow-hidden">
                <CardContent className="p-0">
                  <div className={`h-32 bg-gradient-to-r ${tool.color} relative overflow-hidden`}>
                    <div className="absolute inset-0 bg-black/20" />
                    <div className="absolute top-4 right-4">
                      <Badge variant="secondary" className="bg-white/20 text-white border-0">
                        {tool.badge}
                      </Badge>
                    </div>
                    <div className="absolute bottom-4 left-4">
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2">{tool.name}</h3>
                    <p className="text-muted-foreground mb-4 text-sm">{tool.description}</p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {tool.features.map((feature) => (
                        <Badge key={feature} variant="outline" className="text-xs">
                          <Zap className="h-3 w-3 mr-1" />
                          {feature}
                        </Badge>
                      ))}
                    </div>

                    <Button asChild className="w-full group/btn">
                      <Link href={tool.href}>
                        Try Now
                        <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                      </Link>
                    </Button>
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
