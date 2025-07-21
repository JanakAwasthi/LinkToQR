import Link from "next/link"
import { Zap, Github, Twitter, Mail } from "lucide-react"

export function Footer() {
  const toolCategories = [
    {
      title: "Image Tools",
      links: [
        { name: "Image Compressor", href: "/tools/image-compressor" },
        { name: "Format Converter", href: "/tools/format-converter" },
        { name: "Image Resizer", href: "/tools/image-resizer" },
        { name: "AI Enhancer", href: "/tools/image-enhancer" },
      ],
    },
    {
      title: "Document Tools",
      links: [
        { name: "PDF Merger", href: "/tools/pdf-merger" },
        { name: "Photo to PDF", href: "/tools/photo-to-pdf" },
        { name: "Digital Signature", href: "/tools/digital-signature" },
        { name: "OCR Scanner", href: "/tools/text-extractor" },
      ],
    },
    {
      title: "QR Tools",
      links: [
        { name: "QR Generator", href: "/tools/qr-generator" },
        { name: "QR Scanner", href: "/tools/qr-scanner" },
        { name: "Custom Designer", href: "/tools/qr-designer" },
        { name: "Bulk QR Codes", href: "/tools/bulk-qr" },
      ],
    },
    {
      title: "Smart Tools",
      links: [
        { name: "Secure Notes", href: "/tools/secure-text" },
        { name: "AI Summarizer", href: "/tools/ai-summarizer" },
        { name: "Text Analyzer", href: "/tools/text-analyzer" },
        { name: "Smart Storage", href: "/tools/smart-storage" },
      ],
    },
  ]

  return (
    <footer className="border-t border-border/40 bg-background/95 backdrop-blur">
      <div className="container px-4 py-12 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <Zap className="h-8 w-8 text-blue-500" />
              <span className="text-xl font-bold gradient-text">LinkToQR.me</span>
            </Link>
            <p className="text-muted-foreground mb-4 max-w-sm">
              Privacy-first web toolkit with AI-powered utilities. Process files locally, no uploads required. The
              future of digital tools.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-muted-foreground hover:text-foreground">
                <Github className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground">
                <Twitter className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground">
                <Mail className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Tool Categories */}
          {toolCategories.map((category) => (
            <div key={category.title}>
              <h3 className="font-semibold mb-3">{category.title}</h3>
              <ul className="space-y-2">
                {category.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-border/40 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            © 2024 LinkToQR.me. All rights reserved. Built with privacy in mind.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground">
              Terms of Service
            </Link>
            <Link href="/contact" className="text-sm text-muted-foreground hover:text-foreground">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
