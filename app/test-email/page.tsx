"use client"

import { useState } from "react"
import { toast, Toaster } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { testEmailService } from "@/lib/email-service"
import { Mail } from "lucide-react"

export default function TestEmailPage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleTest = async () => {
    if (!email) {
      toast.error("Please enter your email address")
      return
    }

    setIsLoading(true)
    
    try {
      const result = await testEmailService(email)
      
      if (result.success) {
        toast.success("Verification code has been sent to your email!")
      } else {
        toast.error(`Failed to send verification code: ${result.error}`)
      }
    } catch (error) {
      toast.error("An error occurred while sending verification code")
      console.error("Test error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-emerald-50 to-teal-50">
      <Toaster position="top-center" />
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-lg">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Email Verification</h1>
          <p className="mt-2 text-sm text-gray-600">
            Enter your email to receive a verification code
          </p>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Your Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10"
                required
              />
            </div>
            <p className="text-sm text-gray-500">
              A 6-digit verification code will be sent to this address
            </p>
          </div>

          <Button
            onClick={handleTest}
            disabled={isLoading || !email}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            {isLoading ? "Sending..." : "Send Verification Code"}
          </Button>

          <div className="text-center text-sm text-gray-500 space-y-1">
            <p>Check your email inbox and spam folder</p>
            <p>The verification code will be sent to your email address</p>
            <p className="text-xs text-gray-400 mt-2">
              Please wait a few moments for the email to arrive
            </p>
          </div>
        </div>
      </div>
    </div>
  )
} 