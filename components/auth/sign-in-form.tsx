"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "@/components/ui/use-toast"

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

export function SignInForm() {
  const router = useRouter()
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      // Get users from localStorage
      const users = JSON.parse(localStorage.getItem('users') || '[]')
      const foundUser = users.find((u: User) => u.email === formData.email && u.password === formData.password)

      if (!foundUser) {
        toast({
          description: "Invalid email or password",
          variant: "destructive"
        })
        return
      }

      // User exists, sign them in
      localStorage.setItem('currentUser', JSON.stringify(foundUser))
      toast({
        description: "Welcome back! You have been signed in successfully."
      })
      router.push('/dashboard')
    } catch {
      toast({
        description: "Could not sign in. Please try again.",
        variant: "destructive"
      })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium text-white">
          Email
        </label>
        <input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
          className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-emerald-400"
          placeholder="you@example.com"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="password" className="text-sm font-medium text-white">
          Password
        </label>
        <input
          id="password"
          type="password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          required
          className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-emerald-400"
          placeholder="••••••••"
        />
      </div>

      <button
        type="submit"
        className="w-full py-2 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-md transition-colors"
      >
        Sign in
      </button>
    </form>
  )
} 