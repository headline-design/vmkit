import ConnectSection from "@/components/home/connect-section"
import HeroSection from "@/components/home/hero-section"
import { Suspense } from "react"

export default function Home() {
  return (
    <>
      <HeroSection />
      <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-24" >
        <Suspense fallback={<div>Loading...</div>}>
          <div id="connect" className="py-12">
            <ConnectSection />
          </div>
        </Suspense>
      </main>
    </>
  )
}

