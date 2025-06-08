"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { BookOpen, ArrowLeft, Mail, Lock, User, Eye, EyeOff } from "lucide-react"
import { SignInForm } from "@/components/auth/sign-in-form"
import { GoogleLogin } from "@react-oauth/google"
import { toast, Toaster } from "sonner"
import { useRouter } from "next/navigation"
import { jwtDecode } from "jwt-decode"
import { sendVerificationEmail } from "@/lib/email-service"
import { EmailVerification } from "@/components/auth/email-verification"
import { Button } from "@/components/ui/button"

export default function SignInPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [showVerification, setShowVerification] = useState(false)
  const [verificationData, setVerificationData] = useState<{
    email: string
    token: string
    name: string
  } | null>(null)

  const handleGoogleSuccess = async (credentialResponse: any) => {
    setIsLoading(true)

    try {
      const decoded = jwtDecode(credentialResponse.credential) as { email: string, name: string, picture: string }
      const users = JSON.parse(localStorage.getItem('users') || '[]')

      // Find user
      const foundUser = users.find((u: any) => u.email === decoded.email)

      if (foundUser) {
        // User exists, proceed with sign in
        localStorage.setItem('currentUser', JSON.stringify({
          id: foundUser.id,
          email: foundUser.email,
          name: foundUser.name,
          picture: foundUser.picture,
          verified: foundUser.verified
        }))

        if (!foundUser.verified) {
          // If user is not verified, show verification UI
          setVerificationData({
            email: foundUser.email,
            token: foundUser.verificationToken,
            name: foundUser.name
          })
          setShowVerification(true)
          toast.info("Please verify your email to continue")
        } else {
          toast.success("Signed in successfully!")
          router.push("/dashboard")
        }
      } else {
        // User doesn't exist, proceed with sign up
        const verificationToken = crypto.randomUUID()
        const verificationResult = await sendVerificationEmail(
          decoded.email,
          decoded.name
        )

        if (!verificationResult.success) {
          toast.error(`Failed to send verification email: ${verificationResult.error}`)
          return
        }

        // Create new user from Google data
        const newUser = {
          id: crypto.randomUUID(),
          name: decoded.name,
          email: decoded.email,
          picture: decoded.picture,
          verified: false,
          verificationToken,
          verificationCode: verificationResult.code,
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
          picture: newUser.picture,
          verified: newUser.verified
        }))

        // Show verification UI
        setVerificationData({
          email: decoded.email,
          token: verificationToken,
          name: decoded.name
        })
        setShowVerification(true)
        toast.success("Account created! Please verify your email.")
      }
    } catch (error) {
      console.error("Google sign in/up error:", error)
      toast.error("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerified = () => {
    // Update user verification status
    const users = JSON.parse(localStorage.getItem('users') || '[]')
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}')
    
    const userIndex = users.findIndex((u: any) => u.email === currentUser.email)
    if (userIndex !== -1) {
      users[userIndex].verified = true
      localStorage.setItem('users', JSON.stringify(users))
      
      currentUser.verified = true
      localStorage.setItem('currentUser', JSON.stringify(currentUser))
    }

    toast.success("Email verified successfully! Redirecting to dashboard...")
    router.push("/dashboard")
  }

  const handleGoogleError = () => {
    toast.error("Failed to sign in with Google")
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
                  verificationToken={verificationData.token}
                  onVerified={handleVerified}
                />
              ) : (
                <>
                  <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">Welcome back</h1>
                    <p className="text-white/80">
                      Sign in to your account to continue
                    </p>
                  </div>
                  
                  <div className="mb-6">
                    <div className="mt-4 max-w-100%">
                      <GoogleLogin
                        onSuccess={handleGoogleSuccess}
                        onError={handleGoogleError}
                        theme="filled_black"
                        shape="rectangular"
                        text="signin_with"
                        locale="en"
                        width="100%"
                        useOneTap
                        context="signin"
                      />
                    </div>
                  </div>
                  <SignInForm />
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
