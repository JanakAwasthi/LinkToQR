import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { QrCode, ScanLine, Palette, Eye } from "lucide-react"
import Link from "next/link"

const qrTools = [
  {
    name: "QR Generator",
    description: "Create custom QR codes for text, URLs, WiFi, email, and more with styling options",
    icon: QrCode,
    href: "/tools/qr-generator",
    color: "from-lime-500 to-green-600",
    badge: "Customizable",
    features: ["Multiple QR types", "Custom colors", "Size adjustment", "Real-time preview"],
  },
  {
    name: "QR Scanner",
    description: "Scan QR codes in real-time using your camera with type detection",
    icon: ScanLine,
    href: "/tools/qr-scanner",
    color: "from-orange-500 to-red-600",
    badge: "Real-time",
    features: ["Live camera scanning", "Type detection", "Scan history", "Copy & open links"],
  },
  {
    name: "QR Designer",
    description: "Design professional QR codes with logos, colors, and advanced styling",
    icon: Palette,
    href: "/tools/qr-designer",
    color: "from-purple-500 to-pink-600",
    badge: "Designer",
    features: ["Logo embedding", "Color gradients", "Pattern styles", "Brand customization"],
  },
  {
    name: "QR Decoder AI",
    description: "Decode damaged or low-quality QR codes using AI enhancement",
    icon: Eye,
    href: "/tools/qr-decoder",
    color: "from-cyan-500 to-blue-600",
    badge: "AI Enhanced",
    features: ["Damage recovery", "Quality enhancement", "Batch decoding", "Error correction"],
  },
]

export default function QRUtilitiesPage() {
  return (
    <div className="min-h-screen py-20 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl lg:text-6xl font-bold mb-4">
            <span className="gradient-text">QR Utilities</span>
          </h1>
          <p className="text-xl text-muted-foreground">
            Complete QR code generation, scanning, and customization toolkit
          </p>
          <div className="flex justify-center items-center gap-4 mt-6">
            <Badge variant="outline" className="text-green-600 border-green-600">
              4 Tools Available
            </Badge>
            <Badge variant="outline" className="text-blue-600 border-blue-600">
              Real-time Processing
            </Badge>
            <Badge variant="outline" className="text-purple-600 border-purple-600">
              Custom Design
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {qrTools.map((tool) => {
            const Icon = tool.icon
            return (
              <Link key={tool.name} href={tool.href}>
                <Card className="tool-card group h-full">
                  <CardContent className="p-0">
                    <div className={`h-48 bg-gradient-to-r ${tool.color} relative overflow-hidden`}>
                      <div className="absolute inset-0 bg-black/20" />
                      <div className="absolute top-4 right-4">
                        <Badge variant="secondary" className="bg-white/20 text-white border-0 text-xs">
                          {tool.badge}
                        </Badge>
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Icon className="h-24 w-24 text-white" />
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
              <h2 className="text-2xl font-bold mb-4">QR Code Use Cases</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                <div>
                  <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <QrCode className="h-6 w-6 text-green-500" />
                  </div>
                  <h3 className="font-semibold mb-2">Business & Marketing</h3>
                  <p className="text-muted-foreground">
                    Contact info, websites, social media, and promotional campaigns
                  </p>
                </div>
                <div>
                  <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <ScanLine className="h-6 w-6 text-blue-500" />
                  </div>
                  <h3 className="font-semibold mb-2">Personal Use</h3>
                  <p className="text-muted-foreground">
                    WiFi sharing, event invites, personal websites, and quick messaging
                  </p>
                </div>
              </div>

              <div className="mt-8 p-4 bg-muted rounded-lg">
                <h3 className="font-semibold mb-2">Supported QR Types</h3>
                <div className="flex flex-wrap justify-center gap-2 text-xs">
                  <Badge variant="outline">URL/Website</Badge>
                  <Badge variant="outline">Plain Text</Badge>
                  <Badge variant="outline">WiFi Network</Badge>
                  <Badge variant="outline">Email</Badge>
                  <Badge variant="outline">Phone Number</Badge>
                  <Badge variant="outline">SMS Message</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
