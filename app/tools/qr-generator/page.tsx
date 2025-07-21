"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { QrCode, Download, Copy, Palette } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import QRCodeLib from "qrcode"

type QRType = "text" | "url" | "wifi" | "email" | "phone" | "sms"

interface QRData {
  type: QRType
  text: string
  url: string
  wifi: {
    ssid: string
    password: string
    security: string
  }
  email: {
    email: string
    subject: string
    body: string
  }
  phone: string
  sms: {
    phone: string
    message: string
  }
}

export default function QRGeneratorPage() {
  const [qrType, setQRType] = useState<QRType>("text")
  const [qrData, setQRData] = useState<QRData>({
    type: "text",
    text: "",
    url: "",
    wifi: { ssid: "", password: "", security: "WPA" },
    email: { email: "", subject: "", body: "" },
    phone: "",
    sms: { phone: "", message: "" },
  })
  const [qrCode, setQRCode] = useState("")
  const [size, setSize] = useState([256])
  const [foregroundColor, setForegroundColor] = useState("#000000")
  const [backgroundColor, setBackgroundColor] = useState("#ffffff")
  const { toast } = useToast()

  const generateQRString = () => {
    switch (qrType) {
      case "text":
        return qrData.text
      case "url":
        return qrData.url
      case "wifi":
        return `WIFI:T:${qrData.wifi.security};S:${qrData.wifi.ssid};P:${qrData.wifi.password};;`
      case "email":
        return `mailto:${qrData.email.email}?subject=${encodeURIComponent(qrData.email.subject)}&body=${encodeURIComponent(qrData.email.body)}`
      case "phone":
        return `tel:${qrData.phone}`
      case "sms":
        return `sms:${qrData.sms.phone}?body=${encodeURIComponent(qrData.sms.message)}`
      default:
        return ""
    }
  }

  const generateQR = async () => {
    const qrString = generateQRString()
    if (!qrString.trim()) {
      toast({
        title: "Error",
        description: "Please fill in the required fields",
        variant: "destructive",
      })
      return
    }

    try {
      const qrCodeDataURL = await QRCodeLib.toDataURL(qrString, {
        width: size[0],
        color: {
          dark: foregroundColor,
          light: backgroundColor,
        },
        errorCorrectionLevel: "M",
      })
      setQRCode(qrCodeDataURL)
      toast({
        title: "QR Code Generated",
        description: "Your QR code has been generated successfully",
      })
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "Failed to generate QR code",
        variant: "destructive",
      })
    }
  }

  const downloadQR = () => {
    if (!qrCode) return
    const link = document.createElement("a")
    link.href = qrCode
    link.download = `qr-code-${Date.now()}.png`
    link.click()
  }

  const copyQR = async () => {
    if (!qrCode) return
    try {
      const response = await fetch(qrCode)
      const blob = await response.blob()
      await navigator.clipboard.write([
        new ClipboardItem({
          [blob.type]: blob,
        }),
      ])
      toast({
        title: "Copied",
        description: "QR code copied to clipboard",
      })
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Failed to copy QR code",
        variant: "destructive",
      })
    }
  }

  useEffect(() => {
    if (generateQRString().trim()) {
      generateQR()
    }
  }, [qrType, qrData, size, foregroundColor, backgroundColor])

  const renderInputFields = () => {
    switch (qrType) {
      case "text":
        return (
          <div>
            <Label htmlFor="text">Text Content</Label>
            <Textarea
              id="text"
              placeholder="Enter your text here..."
              value={qrData.text}
              onChange={(e) => setQRData({ ...qrData, text: e.target.value })}
              className="mt-1"
            />
          </div>
        )
      case "url":
        return (
          <div>
            <Label htmlFor="url">Website URL</Label>
            <Input
              id="url"
              type="url"
              placeholder="https://example.com"
              value={qrData.url}
              onChange={(e) => setQRData({ ...qrData, url: e.target.value })}
              className="mt-1"
            />
          </div>
        )
      case "wifi":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="ssid">Network Name (SSID)</Label>
              <Input
                id="ssid"
                placeholder="WiFi Network Name"
                value={qrData.wifi.ssid}
                onChange={(e) => setQRData({ ...qrData, wifi: { ...qrData.wifi, ssid: e.target.value } })}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="WiFi Password"
                value={qrData.wifi.password}
                onChange={(e) => setQRData({ ...qrData, wifi: { ...qrData.wifi, password: e.target.value } })}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="security">Security Type</Label>
              <Select
                value={qrData.wifi.security}
                onValueChange={(value) => setQRData({ ...qrData, wifi: { ...qrData.wifi, security: value } })}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="WPA">WPA/WPA2</SelectItem>
                  <SelectItem value="WEP">WEP</SelectItem>
                  <SelectItem value="nopass">No Password</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )
      case "email":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="example@email.com"
                value={qrData.email.email}
                onChange={(e) => setQRData({ ...qrData, email: { ...qrData.email, email: e.target.value } })}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                placeholder="Email subject"
                value={qrData.email.subject}
                onChange={(e) => setQRData({ ...qrData, email: { ...qrData.email, subject: e.target.value } })}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="body">Message</Label>
              <Textarea
                id="body"
                placeholder="Email message"
                value={qrData.email.body}
                onChange={(e) => setQRData({ ...qrData, email: { ...qrData.email, body: e.target.value } })}
                className="mt-1"
              />
            </div>
          </div>
        )
      case "phone":
        return (
          <div>
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+1234567890"
              value={qrData.phone}
              onChange={(e) => setQRData({ ...qrData, phone: e.target.value })}
              className="mt-1"
            />
          </div>
        )
      case "sms":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="smsPhone">Phone Number</Label>
              <Input
                id="smsPhone"
                type="tel"
                placeholder="+1234567890"
                value={qrData.sms.phone}
                onChange={(e) => setQRData({ ...qrData, sms: { ...qrData.sms, phone: e.target.value } })}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="smsMessage">Message</Label>
              <Textarea
                id="smsMessage"
                placeholder="SMS message"
                value={qrData.sms.message}
                onChange={(e) => setQRData({ ...qrData, sms: { ...qrData.sms, message: e.target.value } })}
                className="mt-1"
              />
            </div>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <QrCode className="h-12 w-12 text-lime-500 mr-4" />
            <h1 className="text-4xl font-bold gradient-text">QR Code Generator</h1>
          </div>
          <p className="text-lg text-muted-foreground">Create custom QR codes for text, URLs, WiFi, and more</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>QR Code Type</CardTitle>
              </CardHeader>
              <CardContent>
                <Select value={qrType} onValueChange={(value: QRType) => setQRType(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="text">Plain Text</SelectItem>
                    <SelectItem value="url">Website URL</SelectItem>
                    <SelectItem value="wifi">WiFi Network</SelectItem>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="phone">Phone Number</SelectItem>
                    <SelectItem value="sms">SMS Message</SelectItem>
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Content</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">{renderInputFields()}</CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Palette className="h-5 w-5 mr-2" />
                  Customization
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Size: {size[0]}px</Label>
                  <Slider value={size} onValueChange={setSize} max={512} min={128} step={32} className="mt-2" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="foreground">Foreground Color</Label>
                    <Input
                      id="foreground"
                      type="color"
                      value={foregroundColor}
                      onChange={(e) => setForegroundColor(e.target.value)}
                      className="mt-1 h-10"
                    />
                  </div>
                  <div>
                    <Label htmlFor="background">Background Color</Label>
                    <Input
                      id="background"
                      type="color"
                      value={backgroundColor}
                      onChange={(e) => setBackgroundColor(e.target.value)}
                      className="mt-1 h-10"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Generated QR Code</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  {qrCode ? (
                    <div className="space-y-4">
                      <img
                        src={qrCode || "/placeholder.svg"}
                        alt="Generated QR Code"
                        className="mx-auto border rounded-lg"
                      />
                      <div className="flex gap-2 justify-center">
                        <Button onClick={downloadQR} className="flex items-center">
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                        <Button variant="outline" onClick={copyQR} className="flex items-center bg-transparent">
                          <Copy className="h-4 w-4 mr-2" />
                          Copy
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="py-12 text-muted-foreground">
                      <QrCode className="h-16 w-16 mx-auto mb-4 opacity-50" />
                      <p>Fill in the content to generate QR code</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Features</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2" />
                    Multiple QR types
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-2" />
                    Custom colors
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mr-2" />
                    Adjustable size
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mr-2" />
                    Instant generation
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
