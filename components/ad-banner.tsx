"use client"

import { useEffect, useRef, useState } from "react"

interface AdBannerProps {
  slot: "auto" | "fluid" | "in-article" | "multiplex" | "homepage-top" | "homepage-bottom"
  format?: "auto" | "fluid" | "autorelaxed" | "rspv"
  layout?: "in-article" | "fluid" | "-fb+5w+4e-db+86"
  responsive?: boolean
  className?: string
}

const adSlotMap = {
  auto: "7107066847",
  fluid: "3379305321",
  "in-article": "9753141982",
  multiplex: "5813896973",
  "homepage-top": "7107066847",
  "homepage-bottom": "5813896973",
}

export function AdBanner({ slot, format = "auto", layout, responsive = true, className = "" }: AdBannerProps) {
  const adRef = useRef<HTMLDivElement | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const adSlot = adSlotMap[slot]

  useEffect(() => {
    const loadAd = () => {
      if (!adRef.current || isLoaded) return

      // Check if the container has proper dimensions
      const rect = adRef.current.getBoundingClientRect()
      if (rect.width === 0 || rect.height === 0) {
        // Retry after a short delay
        setTimeout(loadAd, 100)
        return
      }

      try {
        // @ts-ignore
        ;(window.adsbygoogle = window.adsbygoogle || []).push({})
        setIsLoaded(true)
      } catch (err) {
        console.error("AdSense error:", err)
      }
    }

    // Wait for next tick to ensure DOM is ready
    const timer = setTimeout(loadAd, 100)
    return () => clearTimeout(timer)
  }, [isLoaded])

  // Render different ad formats based on slot type
  if (slot === "fluid") {
    return (
      <div className={`flex justify-center py-8 w-full min-h-[100px] ${className}`}>
        <div ref={adRef} className="w-full max-w-4xl">
          <ins
            className="adsbygoogle"
            style={{
              display: "block",
              width: "100%",
              minHeight: "90px",
            }}
            data-ad-client="ca-pub-6126558809611102"
            data-ad-slot={adSlot}
            data-ad-format="fluid"
            data-ad-layout-key="-fb+5w+4e-db+86"
          />
        </div>
      </div>
    )
  }

  if (slot === "in-article") {
    return (
      <div className={`flex justify-center py-8 w-full min-h-[100px] ${className}`}>
        <div ref={adRef} className="w-full max-w-4xl text-center">
          <ins
            className="adsbygoogle"
            style={{
              display: "block",
              textAlign: "center",
              width: "100%",
              minHeight: "90px",
            }}
            data-ad-layout="in-article"
            data-ad-format="fluid"
            data-ad-client="ca-pub-6126558809611102"
            data-ad-slot={adSlot}
          />
        </div>
      </div>
    )
  }

  if (slot === "multiplex") {
    return (
      <div className={`flex justify-center py-8 w-full min-h-[100px] ${className}`}>
        <div ref={adRef} className="w-full max-w-4xl">
          <ins
            className="adsbygoogle"
            style={{
              display: "block",
              width: "100%",
              minHeight: "90px",
            }}
            data-ad-client="ca-pub-6126558809611102"
            data-ad-slot={adSlot}
            data-ad-format="autorelaxed"
          />
        </div>
      </div>
    )
  }

  // Default auto ads
  return (
    <div className={`flex justify-center py-8 w-full min-h-[100px] ${className}`}>
      <div ref={adRef} className="w-full max-w-4xl">
        <ins
          className="adsbygoogle"
          style={{
            display: "block",
            width: "100%",
            minHeight: "90px",
          }}
          data-ad-client="ca-pub-6126558809611102"
          data-ad-slot={adSlot}
          data-ad-format="auto"
          data-full-width-responsive={responsive.toString()}
        />
      </div>
    </div>
  )
}
