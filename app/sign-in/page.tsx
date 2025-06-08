"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { BookOpen, ArrowLeft, Mail, Lock, Eye, EyeOff } from "lucide-react"
import { toast, Toaster } from "sonner"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { GoogleLogin, CredentialResponse } from "@react-oauth/google"
import { EmailVerification } from "@/components/auth/email-verification"

interface FormData {
  email: string
  password: string
}

interface User {
  email: string
  name: string
  avatar: string
  createdAt: string
  isVerified: boolean
  password?: string // Optional for Google sign-in users
}


export default function SignInPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showVerification, setShowVerification] = useState(false)
  const [verificationData, setVerificationData] = useState<{
    email: string
    token: string
    name: string
  } | null>(null)
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Get users from localStorage
      const users = JSON.parse(localStorage.getItem('users') || '[]')
      const foundUser = users.find((u: User) => u.email === formData.email && u.password === formData.password)

      if (!foundUser) {
        toast.error("Invalid email or password")
        return
      }

      // Store current user in localStorage
      localStorage.setItem('currentUser', JSON.stringify({
        email: foundUser.email,
        name: foundUser.name,
        avatar: foundUser.avatar,
        isVerified: foundUser.isVerified
      }))

      if (!foundUser.isVerified) {
        // If user is not verified, show verification UI
        setVerificationData({
          email: foundUser.email,
          token: foundUser.verificationToken || "",
          name: foundUser.name
        })
        setShowVerification(true)
        toast.info("Please verify your email to continue")
      } else {
        toast.success("Signed in successfully!")
        router.push("/dashboard")
      }
    } catch (error) {
      console.error("Sign in error:", error)
      toast.error("An error occurred during sign in. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSuccess = async (response: CredentialResponse) => {
    try {
      const credential = response.credential
      if (!credential) {
        throw new Error('No credential received from Google')
      }

      // Decode the credential to get user info
      const decodedToken = JSON.parse(atob(credential.split('.')[1]))
      const { email, name, picture } = decodedToken

      // Check if user exists
      const users = JSON.parse(localStorage.getItem('users') || '[]')
      const existingUser = users.find((user: User) => user.email === email)

      if (existingUser) {
        // User exists, sign them in
        localStorage.setItem('currentUser', JSON.stringify(existingUser))
        toast.success("Welcome back! You have been signed in successfully.")
        router.push('/dashboard')
      } else {
        // Create new user
        const newUser: User = {
          email,
          name,
          avatar: picture,
          createdAt: new Date().toISOString(),
          isVerified: true // Google accounts are pre-verified
        }

        // Save to localStorage
        localStorage.setItem('users', JSON.stringify([...users, newUser]))
        localStorage.setItem('currentUser', JSON.stringify(newUser))

        toast.success("Welcome to Inkly! Your account has been created successfully.")
        router.push('/dashboard')
      }
    } catch {
      toast.error("Could not sign in with Google. Please try again.")
    }
  }

  const handleGoogleError = () => {
    toast.error("Failed to sign in with Google")
  }

  const handleVerified = () => {
    // Update user verification status
    const users = JSON.parse(localStorage.getItem('users') || '[]')
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}')
    
    const userIndex = users.findIndex((u: User) => u.email === currentUser.email)
    if (userIndex !== -1) {
      users[userIndex].isVerified = true
      localStorage.setItem('users', JSON.stringify(users))
      
      currentUser.isVerified = true
      localStorage.setItem('currentUser', JSON.stringify(currentUser))
    }

    toast.success("Email verified successfully! Redirecting to dashboard...")
    router.push("/dashboard")
  }

  return (
    <div className="min-h-screen">
      <Toaster 
        position="top-center"
        toastOptions={{
          style: {
            background: 'rgba(0, 0, 0, 0.8)',
            color: 'white',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(8px)',
          },
          className: 'dark',
        }}
      />
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
              {showVerification && verificationData ? (
                <EmailVerification
                  email={verificationData.email}

                  onVerified={handleVerified}
                />
              ) : (
                <>
                  <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
                    <p className="text-white/80">Sign in to continue your journey</p>
                  </div>
                  
                  <div className="mb-6">
                    <div className="mt-4 max-w-100%">
                      <GoogleLogin
                        onSuccess={handleGoogleSuccess}
                        onError={handleGoogleError}
                        theme="outline"
                        shape="rectangular"
                        text="signin_with"
                        locale="en"
                        width="100%"
                        useOneTap
                        context="signin"
                      />
                    </div>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
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
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          required
                          className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:border-emerald-400 focus:ring-emerald-400"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="password" className="text-white">
                          Password
                        </Label>
                        <Link href="/forgot-password" className="text-sm text-emerald-300 hover:text-emerald-200">
                          Forgot password?
                        </Link>
                      </div>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/60" />
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          value={formData.password}
                          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
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
                    </div>

                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-6 text-lg"
                    >
                      {isLoading ? "Signing in..." : "Sign in"}
                    </Button>

                    <div className="text-center text-white/80">
                      <span>Don&apos;t have an account? </span>
                      <Link href="/sign-up" className="text-emerald-300 hover:text-emerald-200 font-medium">
                        Sign up
                      </Link>
                    </div>
                  </form>
                </>
              )}
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
