"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { toast, Toaster } from "sonner"

export default function ClearDataPage() {
  const [isLoading, setIsLoading] = useState(false)

  const handleClearData = () => {
    setIsLoading(true)
    try {
      // Clear all localStorage data
      localStorage.clear()
      toast.success("All data cleared successfully!")
    } catch (error) {
      console.error("Error clearing data:", error)
      toast.error("Failed to clear data")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-emerald-50 to-teal-50">
      <Toaster position="top-center" />
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-lg">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Clear Local Data</h1>
          <p className="mt-2 text-sm text-gray-600">
            This will clear all data stored in your browser for this application
          </p>
        </div>

        <div className="space-y-4">
          <Button
            onClick={handleClearData}
            disabled={isLoading}
            className="w-full bg-red-600 hover:bg-red-700 text-white"
          >
            {isLoading ? "Clearing..." : "Clear All Data"}
          </Button>

          <div className="text-center text-sm text-gray-500">
            <p>This action cannot be undone</p>
            <p>You will need to sign up again after clearing the data</p>
          </div>
        </div>
      </div>
    </div>
  )
} 