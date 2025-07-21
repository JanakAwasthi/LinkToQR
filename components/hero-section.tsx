"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles, Shield, Zap, Infinity } from "lucide-react"
import Link from "next/link"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden py-20 lg:py-32">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-cyan-600/20" />
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />

      <div className="container relative px-4 mx-auto">
        <div className="text-center max-w-4xl mx-auto">
          {/* Main Title */}
          <h1 className="text-6xl lg:text-8xl font-bold mb-8 floating-animation">
            <span className="gradient-text">WEB TOOLS</span>
          </h1>

          {/* Subtitle */}
          <div className="flex flex-wrap justify-center items-center gap-2 mb-6 text-sm lg:text-base text-muted-foreground">
            <div className="flex items-center gap-1">
              <Sparkles className="h-4 w-4 text-yellow-500" />
              <span>Advanced AI-Powered Web Utilities</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1">
              <Shield className="h-4 w-4 text-green-500" />
              <span>Zero-Upload Privacy</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1">
              <Zap className="h-4 w-4 text-blue-500" />
              <span>Real-Time Processing</span>
            </div>
          </div>

          <p className="text-xl text-muted-foreground mb-12">The Future of Digital Tools is Here</p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button
              size="lg"
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-4 text-lg neon-glow"
              asChild
            >
              <Link href="#tools">
                <Sparkles className="mr-2 h-5 w-5" />
                EXPLORE TOOLS
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="bg-gradient-to-r from-green-500 to-cyan-500 hover:from-green-600 hover:to-cyan-600 text-white border-0 px-8 py-4 text-lg"
              asChild
            >
              <Link href="/how-to-use">
                <ArrowRight className="mr-2 h-5 w-5" />
                HOW TO USE
              </Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400 mb-2">18+</div>
              <div className="text-sm text-muted-foreground">Tools Available</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400 mb-2">100%</div>
              <div className="text-sm text-muted-foreground">Privacy Secure</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-400 mb-2">0</div>
              <div className="text-sm text-muted-foreground">Server Uploads</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-cyan-400 mb-2">
                <Infinity className="h-8 w-8 mx-auto" />
              </div>
              <div className="text-sm text-muted-foreground">Usage Limit</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
