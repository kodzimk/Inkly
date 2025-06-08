"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, Mail, Lock, User, Check } from "lucide-react"

export function SignUpForm() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  })

  // Password strength indicators
  const hasMinLength = formData.password.length >= 8
  const hasUppercase = /[A-Z]/.test(formData.password)
  const hasNumber = /[0-9]/.test(formData.password)
  const hasSpecialChar = /[^A-Za-z0-9]/.test(formData.password)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }))
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Something went wrong")
      }

      // Redirect to verification page with email
      router.push(`/verify?email=${encodeURIComponent(formData.email)}`)
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message)
      } else {
        setError("Something went wrong")
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {error && (
        <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md">
          {error}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="name">Full Name</Label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            id="name"
            name="name"
            type="text"
            placeholder="John Doe"
            value={formData.name}
            onChange={handleChange}
            required
            className="pl-10"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="you@example.com"
            value={formData.email}
            onChange={handleChange}
            required
            className="pl-10"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            required
            className="pl-10"
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-2 top-1/2 h-7 w-7 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
          </Button>
        </div>

        {/* Password strength indicators */}
        {formData.password.length > 0 && (
          <div className="mt-2 space-y-2">
            <p className="text-sm text-gray-600">Password strength:</p>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div
                  className={`h-4 w-4 rounded-full flex items-center justify-center ${
                    hasMinLength ? "bg-emerald-500" : "bg-gray-200"
                  }`}
                >
                  {hasMinLength && <Check className="h-3 w-3 text-white" />}
                </div>
                <span className="text-xs text-gray-600">At least 8 characters</span>
              </div>
              <div className="flex items-center gap-2">
                <div
                  className={`h-4 w-4 rounded-full flex items-center justify-center ${
                    hasUppercase ? "bg-emerald-500" : "bg-gray-200"
                  }`}
                >
                  {hasUppercase && <Check className="h-3 w-3 text-white" />}
                </div>
                <span className="text-xs text-gray-600">At least one uppercase letter</span>
              </div>
              <div className="flex items-center gap-2">
                <div
                  className={`h-4 w-4 rounded-full flex items-center justify-center ${
                    hasNumber ? "bg-emerald-500" : "bg-gray-200"
                  }`}
                >
                  {hasNumber && <Check className="h-3 w-3 text-white" />}
                </div>
                <span className="text-xs text-gray-600">At least one number</span>
              </div>
              <div className="flex items-center gap-2">
                <div
                  className={`h-4 w-4 rounded-full flex items-center justify-center ${
                    hasSpecialChar ? "bg-emerald-500" : "bg-gray-200"
                  }`}
                >
                  {hasSpecialChar && <Check className="h-3 w-3 text-white" />}
                </div>
                <span className="text-xs text-gray-600">At least one special character</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Creating account..." : "Create account"}
      </Button>

      <div className="text-center text-sm text-gray-600">
        <span>Already have an account? </span>
        <Link href="/sign-in" className="text-emerald-600 hover:text-emerald-500 font-medium">
          Sign in
        </Link>
      </div>
    </form>
  )
} 