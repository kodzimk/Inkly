import { BookOpen, ArrowRight, Shield, Zap, Heart } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"

export default function NoteAppMainPage() {
  return (
    <div className="min-h-screen">
      {/* Fixed Background Image */}
      <div
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: "url('/images/japanese-landscape.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundAttachment: "fixed",
        }}
      >
        {/* Overlay for better readability */}
        <div className="absolute inset-0 bg-black/30" />
      </div>

      {/* Sticky Navigation */}
      <header className="sticky top-0 z-50 border-b bg-white/10 backdrop-blur-md supports-[backdrop-filter]:bg-white/10">
        <div className="container flex h-16 items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2 font-bold">
            <BookOpen className="h-6 w-6 text-white" />
            <span className="text-white">Inkly</span>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="ghost" className="text-white hover:bg-white/20" asChild>
              <Link href="/sign-in">Sign In</Link>
            </Button>
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white" asChild>
              <Link href="/sign-up">Sign Up</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 container pt-8">
        {/* Hero Section */}
        <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
          <div className="text-center max-w-4xl">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              Find Peace in
              <span className="block text-4xl md:text-6xl bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent relative z-10 font-bold leading-tight">
                Your Thoughts
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl mx-auto">
              Capture ideas, reflect on experiences, and organize your mind in this tranquil digital space inspired by
              the serenity of nature.
            </p>
            <div className="flex justify-center mb-12">
              <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-lg px-8 py-6" asChild>
                <Link href="/sign-up">
                  Start Your Journey
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>

            {/* Features */}
            <div className="grid md:grid-cols-3 gap-8 mt-16 mb-16">
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                  <Heart className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Mindful Writing</h3>
                <p className="text-white/80">
                  Create notes in a peaceful environment designed to inspire clarity and focus.
                </p>
              </div>
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Secure & Private</h3>
                <p className="text-white/80">
                  Your thoughts are safe with end-to-end encryption and privacy protection.
                </p>
              </div>
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                  <Zap className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Effortless Sync</h3>
                <p className="text-white/80">
                  Access your notes anywhere, anytime with seamless synchronization across devices.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/20 bg-black/20 backdrop-blur-sm">
        <div className="container px-8 py-6">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex items-center gap-2 font-bold">
              <BookOpen className="h-5 w-5 text-white" />
              <span className="text-white">Inkly</span>
            </div>
            <p className="text-sm text-white/70">© 2025 Inkly. Find peace in your thoughts.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
