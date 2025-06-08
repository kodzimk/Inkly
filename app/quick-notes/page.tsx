"use client"

import { useState, useRef, useEffect } from "react"
import { ArrowLeft, Send } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

interface Message {
  id: string
  content: string
  role: 'user' | 'assistant'
  timestamp: Date
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

export default function QuickNotes() {
  const router = useRouter()
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Get user-specific storage key
  const getStorageKey = (key: string) => {
    const user = JSON.parse(localStorage.getItem("currentUser") || "null")
    return user?.email ? `${user.email}_${key}` : key
  }

  // Load messages from localStorage when component mounts
  useEffect(() => {
    try {
      const savedMessages = localStorage.getItem(getStorageKey("chat-messages"))
      if (savedMessages) {
        setMessages(JSON.parse(savedMessages))
      }
    } catch {
      console.error("Error loading messages")
    }
  }, [])

  // Save messages to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(getStorageKey("chat-messages"), JSON.stringify(messages))
    } catch {
      console.error("Error saving messages")
    }
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const getRandomSystemResponse = () => {
    return systemResponses[Math.floor(Math.random() * systemResponses.length)]
  }

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputMessage.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage.trim(),
      role: 'user',
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputMessage("")

    // Simulate AI response
    setTimeout(() => {
      const systemMessage: Message = {
        id: Date.now().toString(),
        content: getRandomSystemResponse(),
        role: 'assistant',
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, systemMessage])
    }, 1000)
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage(e)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-white/10 backdrop-blur-md supports-[backdrop-filter]:bg-white/10">
        <div className="container flex h-16 items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2 font-bold">
            <span className="text-white">Quick Notes</span>
          </div>
          <Button variant="ghost" className="text-white hover:bg-white/20" onClick={() => router.push('/dashboard')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Messages */}
          <div className="space-y-4 mb-8">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-lg px-4 py-2 ${
                    message.role === "user"
                      ? "bg-emerald-600/90 backdrop-blur-sm text-white shadow-lg"
                      : "bg-white/10 backdrop-blur-sm border border-white/20 text-white shadow-lg"
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  <p className="text-xs opacity-50 mt-1">
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Form */}
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <Textarea
              value={inputMessage}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:border-emerald-400 focus:ring-emerald-400"
              rows={1}
            />
            <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700">
              <Send className="h-4 w-4" />
              <span className="sr-only">Send message</span>
            </Button>
          </form>
        </div>
      </main>
    </div>
  )
} 