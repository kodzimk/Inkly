"use client"

import { useState, useRef, useEffect } from "react"
import { ArrowLeft, Send, BookOpen } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

interface Message {
  id: number
  content: string
  timestamp: string
  sender: "user" | "system"
}

interface Note {
  id: number
  title: string
  content: string
  category: string
  tags: string[]
  createdAt: string
  isFavorite: boolean
}

const systemResponses = [
  "I understand. Tell me more about that.",
  "That's interesting. What else?",
  "I see. How do you feel about that?",
  "That's a good point. Would you like to elaborate?",
  "I appreciate you sharing that. What's on your mind?",
  "That's fascinating. Can you explain further?",
  "I hear you. What are your thoughts?",
  "That's a valid perspective. How did you come to that conclusion?",
  "I understand. What's the most important aspect of this for you?",
  "That's insightful. How does this relate to your goals?",
]

const categories = ["Personal", "Work", "Learning", "Ideas", "Tasks"]

export default function QuickNotesPage() {
  const router = useRouter()
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Get user-specific storage key
  const getStorageKey = (key: string) => {
    return currentUser?.email ? `${currentUser.email}_${key}` : key
  }

  // Load current user on mount
  useEffect(() => {
    try {
      const user = JSON.parse(localStorage.getItem("currentUser") || "null")
      if (!user) {
        router.push("/")
        return
      }
      setCurrentUser(user)
    } catch (error) {
      console.error("Error loading user:", error)
      router.push("/")
    }
  }, [router])

  // Load messages from localStorage when component mounts
  useEffect(() => {
    if (!currentUser) return
    try {
      const savedMessages = localStorage.getItem(getStorageKey("chat-messages"))
      if (savedMessages) {
        setMessages(JSON.parse(savedMessages))
      }
    } catch (error) {
      console.error("Error loading messages:", error)
    }
  }, [currentUser])

  // Save messages to localStorage whenever they change
  useEffect(() => {
    if (!currentUser) return
    try {
      localStorage.setItem(getStorageKey("chat-messages"), JSON.stringify(messages))
    } catch (error) {
      console.error("Error saving messages:", error)
    }
  }, [messages, currentUser])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const getRandomSystemResponse = () => {
    return systemResponses[Math.floor(Math.random() * systemResponses.length)]
  }

  const generateNoteTitle = (content: string) => {
    // Take first 30 characters or first sentence, whichever is shorter
    const firstSentence = content.split(/[.!?]/)[0].trim()
    const title = firstSentence.length > 30 ? firstSentence.substring(0, 30) + "..." : firstSentence
    return title
  }

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return

    const userMessage: Message = {
      id: Date.now(),
      content: inputMessage.trim(),
      sender: "user",
      timestamp: new Date().toISOString(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputMessage("")

    // Simulate system response
    setTimeout(() => {
      const systemMessage: Message = {
        id: Date.now() + 1,
        content: getRandomSystemResponse(),
        sender: "system",
        timestamp: new Date().toISOString(),
      }
      setMessages((prev) => [...prev, systemMessage])
    }, 1000)
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 relative">
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
        <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]" />
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-white/20 bg-black/20 backdrop-blur-md">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/20"
            onClick={() => router.push("/dashboard")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <div className="w-24" /> {/* Spacer for alignment */}
        </div>
      </header>

      {/* Messages Container */}
      <div className="relative z-10 flex-1 overflow-y-auto pb-24">
        <div className="container mx-auto max-w-2xl px-4 py-6 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] rounded-lg px-4 py-2 ${
                  message.sender === "user"
                    ? "bg-emerald-600/90 backdrop-blur-sm text-white shadow-lg"
                    : "bg-white/10 backdrop-blur-sm border border-white/20 text-white shadow-lg"
                }`}
              >
                <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
                <p className="text-xs mt-1 opacity-70">
                  {new Date(message.timestamp).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Sticky Input */}
      <div className="fixed bottom-0 left-0 right-0 z-20 border-t border-white/20 bg-white/5 backdrop-blur-md">
        <div className="container mx-auto max-w-2xl px-4 py-3">
          <div className="relative bg-white/5 backdrop-blur-sm rounded-2xl p-2 border border-white/20 shadow-lg">
            <Textarea
              placeholder="Type a message..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  handleSendMessage()
                }
              }}
              className="pr-12 resize-none bg-transparent border-0 text-white placeholder:text-white/60 focus-visible:ring-0 focus-visible:ring-offset-0"
              rows={1}
            />
            <Button
              size="icon"
              className="absolute right-2 bottom-2 bg-emerald-600 hover:bg-emerald-700 rounded-full h-8 w-8 shadow-md"
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isSaving}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
} 