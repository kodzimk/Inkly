"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Mail, ArrowRight } from "lucide-react"
import { sendVerificationEmail } from "@/lib/email-service"

interface EmailVerificationProps {
  email: string
  verificationToken: string
  onVerified: () => void
}

export function EmailVerification({ email, verificationToken, onVerified }: EmailVerificationProps) {
  const [code, setCode] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [resendDisabled, setResendDisabled] = useState(false)
  const [resendCountdown, setResendCountdown] = useState(0)

  // Get user name from localStorage
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}')
  const userName = currentUser.name || 'User'

  const startResendCountdown = () => {
    setResendDisabled(true)
    setResendCountdown(60)
    const timer = setInterval(() => {
      setResendCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          setResendDisabled(false)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Get the stored verification code from the user object
      const users = JSON.parse(localStorage.getItem('users') || '[]')
      const user = users.find((u: any) => u.email === email)
      
      if (!user) {
        toast.error("User not found")
        return
      }

      // Compare the entered code with the stored verification code
      if (code === user.verificationCode) {
        // Update user verification status
        const userIndex = users.findIndex((u: any) => u.email === email)
        
        if (userIndex !== -1) {
          users[userIndex].verified = true
          localStorage.setItem('users', JSON.stringify(users))
          
          // Update current user
          const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}')
          currentUser.verified = true
          localStorage.setItem('currentUser', JSON.stringify(currentUser))
          
          toast.success("Email verified successfully!")
          onVerified()
        }
      } else {
        console.log('Verification failed:', {
          enteredCode: code,
          expectedCode: user.verificationCode
        })
        toast.error("Invalid verification code")
      }
    } catch (error) {
      console.error('Verification error:', error)
      toast.error("Failed to verify email")
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendCode = async () => {
    if (resendDisabled) return

    setIsLoading(true)
    try {
      const verificationCode = verificationToken.slice(-6)
      const { success, error } = await sendVerificationEmail(
        email,
        userName,
        verificationCode
      )

      if (success) {
        toast.success("Verification code resent!")
        startResendCountdown()
      } else {
        console.error("Failed to resend verification code:", error)
        toast.error("Failed to resend verification code")
      }
    } catch (error) {
      toast.error("Failed to resend verification code")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Verify Your Email</h2>
        <p className="text-white/80">
          We've sent a verification code to <span className="font-medium">{email}</span>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="code" className="text-white">
            Verification Code
          </Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/60" />
            <Input
              id="code"
              type="text"
              placeholder="Enter 6-digit code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
              maxLength={6}
              className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:border-emerald-400 focus:ring-emerald-400"
            />
          </div>
        </div>

        <Button
          type="submit"
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-6 text-lg"
          disabled={isLoading}
        >
          {isLoading ? "Verifying..." : "Verify Email"}
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>

        <div className="text-center">
          <button
            type="button"
            onClick={handleResendCode}
            disabled={isLoading || resendDisabled}
            className={`text-sm font-medium ${
              resendDisabled
                ? "text-white/40 cursor-not-allowed"
                : "text-emerald-300 hover:text-emerald-200"
            }`}
          >
            {resendDisabled
              ? `Resend code in ${resendCountdown}s`
              : "Didn't receive the code? Resend"}
          </button>
        </div>
      </form>
    </div>
  )
} 