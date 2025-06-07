"use client"

import type React from "react"

import { useContext, useState } from "react"
import Link from "next/link"
import { BookOpen, ArrowLeft, Mail, Lock, User, Eye, EyeOff, Check } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"



export default function SignUpPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
  })
  const [agreeTerms, setAgreeTerms] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validate all requirements are met
    if (!user.name || !user.email || !user.password || !agreeTerms) {
      alert("Please fill in all required fields and agree to the terms.")
      return
    }

    if (!hasMinLength || !hasUppercase || !hasNumber || !hasSpecialChar) {
      alert("Please ensure your password meets all security requirements.")
      return
    }

    // Get existing users from localStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]')
    
    // Check if user already exists
    if (users.some((u: any) => u.email === user.email)) {
      alert("User already exists, please sign in")
      return
    }

    // Create new user object
    const newUser = {
      id: crypto.randomUUID(),
      name: user.name,
      email: user.email,
      password: user.password, // In a real app, this should be hashed
      verified: false,
      verificationToken: crypto.randomUUID(),
      createdAt: new Date().toISOString()
    }

    // Add new user to users array
    users.push(newUser)
    localStorage.setItem('users', JSON.stringify(users))

    // Store current user in localStorage
    localStorage.setItem('currentUser', JSON.stringify({
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      verified: newUser.verified
    }))

    // Redirect to notes page
    window.location.href = "/notes"
  }

  // Password strength indicators
  const hasMinLength = user.password.length >= 8
  const hasUppercase = /[A-Z]/.test(user.password)
  const hasNumber = /[0-9]/.test(user.password)
  const hasSpecialChar = /[^A-Za-z0-9]/.test(user.password)

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
              <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 container pt-16 pb-12">
        <div className="flex min-h-[calc(100vh-12rem)] items-center justify-center">
          <div className="w-full max-w-md">
            <div className="rounded-lg border border-white/20 bg-black/30 backdrop-blur-md p-8">
              <div className="mb-8 text-center">
                <h1 className="text-3xl font-bold text-white mb-2">Create Your Account</h1>
                <p className="text-white/80">Begin your journey to mindful note-taking</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-white">
                    Full Name
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/60" />
                    <Input
                      id="name"
                      type="text"
                      placeholder="John Doe"
                      value={user.name}
                      onChange={(e) => setUser({ ...user, name: e.target.value })}
                      required
                      className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:border-emerald-400 focus:ring-emerald-400"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white">
                    Email
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/60" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={user.email}
                      onChange={(e) => setUser({ ...user, email: e.target.value })}
                      required
                      className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:border-emerald-400 focus:ring-emerald-400"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-white">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/60" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={user.password}
                      onChange={(e) => setUser({ ...user, password: e.target.value })}
                      required
                      className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:border-emerald-400 focus:ring-emerald-400"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-1/2 h-7 w-7 -translate-y-1/2 text-white/60 hover:text-white hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
                    </Button>
                  </div>

                  {/* Password strength indicators */}
                  {user. password.length > 0 && (
                    <div className="mt-2 space-y-2">
                      <p className="text-sm text-white/80">Password strength:</p>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <div
                            className={`h-4 w-4 rounded-full flex items-center justify-center ${
                              hasMinLength ? "bg-emerald-500" : "bg-white/20"
                            }`}
                          >
                            {hasMinLength && <Check className="h-3 w-3 text-white" />}
                          </div>
                          <span className="text-xs text-white/80">At least 8 characters</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div
                            className={`h-4 w-4 rounded-full flex items-center justify-center ${
                              hasUppercase ? "bg-emerald-500" : "bg-white/20"
                            }`}
                          >
                            {hasUppercase && <Check className="h-3 w-3 text-white" />}
                          </div>
                          <span className="text-xs text-white/80">At least one uppercase letter</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div
                            className={`h-4 w-4 rounded-full flex items-center justify-center ${
                              hasNumber ? "bg-emerald-500" : "bg-white/20"
                            }`}
                          >
                            {hasNumber && <Check className="h-3 w-3 text-white" />}
                          </div>
                          <span className="text-xs text-white/80">At least one number</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div
                            className={`h-4 w-4 rounded-full flex items-center justify-center ${
                              hasSpecialChar ? "bg-emerald-500" : "bg-white/20"
                            }`}
                          >
                            {hasSpecialChar && <Check className="h-3 w-3 text-white" />}
                          </div>
                          <span className="text-xs text-white/80">At least one special character</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="terms"
                    checked={agreeTerms}
                    onCheckedChange={(checked) => setAgreeTerms(checked === true)}
                    required
                    className="border-white/40 data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500"
                  />
                  <Label htmlFor="terms" className="text-sm text-white/80">
                    I agree to the{" "}
                    <Link href="/terms" className="text-emerald-300 hover:text-emerald-200">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link href="/privacy" className="text-emerald-300 hover:text-emerald-200">
                      Privacy Policy
                    </Link>
                  </Label>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-6 text-lg"
                  disabled={!agreeTerms}
                >
                  Create Account
                </Button>

                <div className="text-center text-white/80">
                  <span>Already have an account? </span>
                  <Link href="/sign-in" className="text-emerald-300 hover:text-emerald-200 font-medium">
                    Sign in
                  </Link>
                </div>
              </form>
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
