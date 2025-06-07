"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { BookOpen, ArrowLeft, User, Mail, Calendar, MapPin, Edit, Camera, Save, X, Upload, Check, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"

interface ProfileData {
  name: string
  email: string
  bio: string
  location: string
  joinedDate: string
  avatar: string
  favoriteCategories: string[]
  totalNotes: number
  favoriteNotes: number
  streakDays: number
}

export default function ProfilePage() {
  const { toast } = useToast()
  const [isEditing, setIsEditing] = useState(false)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isUploading, setIsUploading] = useState(false)
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Load profile data from localStorage
  const loadProfileData = () => {
    try {
      const user = JSON.parse(localStorage.getItem('currentUser') || 'null')
      if (!user) {
        window.location.href = '/sign-in'
        return
      }

      // Get user's profile data from localStorage
      const users = JSON.parse(localStorage.getItem('users') || '[]')
      const userData = users.find((u: any) => u.email === user.email)

      if (userData) {
        setProfile({
          name: userData.name || user.name,
          email: user.email,
          bio: userData.bio || "A mindful writer who finds peace in capturing thoughts and reflections. Passionate about personal growth and zen philosophy.",
          location: userData.location || "Location not set",
          joinedDate: userData.joinedDate || new Date().toISOString().split("T")[0],
          avatar: userData.avatar || "/placeholder.svg?height=100&width=100",
          favoriteCategories: userData.favoriteCategories || ["Personal", "Learning"],
          totalNotes: userData.totalNotes || 0,
          favoriteNotes: userData.favoriteNotes || 0,
          streakDays: userData.streakDays || 1,
        })
        setCurrentUser(user)
      }
    } catch (error) {
      toast({
        title: "Error loading profile",
        description: "Could not load your profile data. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadProfileData()
  }, [])

  const [profile, setProfile] = useState<ProfileData>({
    name: "",
    email: "",
    bio: "A mindful writer who finds peace in capturing thoughts and reflections. Passionate about personal growth and zen philosophy.",
    location: "Location not set",
    joinedDate: new Date().toISOString().split("T")[0],
    avatar: "/placeholder.svg?height=100&width=100",
    favoriteCategories: ["Personal", "Learning"],
    totalNotes: 0,
    favoriteNotes: 0,
    streakDays: 1,
  })

  const [editedProfile, setEditedProfile] = useState<ProfileData>(profile)

  // Update editedProfile when profile changes
  useEffect(() => {
    setEditedProfile(profile)
  }, [profile])

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Check file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file.",
        variant: "destructive"
      })
      return
    }

    // Check file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 2MB.",
        variant: "destructive"
      })
      return
    }

    setIsUploading(true)

    try {
      // Convert image to base64
      const reader = new FileReader()
      reader.onload = (e) => {
        const base64Image = e.target?.result as string
        setPreviewImage(base64Image)
        toast({
          title: "Image preview ready",
          description: "Click Save Changes to update your profile image.",
        })
      }
      reader.readAsDataURL(file)
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "Could not upload the image. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsUploading(false)
    }
  }

  const removePreviewImage = () => {
    setPreviewImage(null)
    toast({
      title: "Preview removed",
      description: "The image preview has been removed.",
    })
  }

  const handleImageSave = async () => {
    if (!previewImage || !currentUser) return

    try {
      // Update profile with new image
      const updatedProfile = {
        ...profile,
        avatar: previewImage
      }

      // Save to localStorage
      const users = JSON.parse(localStorage.getItem('users') || '[]')
      const updatedUsers = users.map((user: any) =>
        user.email === currentUser.email ? { ...user, ...updatedProfile } : user
      )
      localStorage.setItem('users', JSON.stringify(updatedUsers))

      // Update current user and profile state
      setCurrentUser({ ...currentUser, ...updatedProfile })
      setProfile(updatedProfile)
      setEditedProfile(updatedProfile)
      setPreviewImage(null)

      toast({
        title: "Profile image updated",
        description: "Your profile image has been successfully updated.",
      })
    } catch (error) {
      toast({
        title: "Update failed",
        description: "Could not update your profile image. Please try again.",
        variant: "destructive"
      })
    }
  }

  const handleSave = async () => {
    try {
      // Update profile without the image (since it's already saved)
      const updatedProfile = {
        ...editedProfile,
        avatar: profile.avatar // Use the already saved avatar
      }

      // Save to localStorage
      const users = JSON.parse(localStorage.getItem('users') || '[]')
      const updatedUsers = users.map((user: any) =>
        user.email === currentUser.email ? { ...user, ...updatedProfile } : user
      )
      localStorage.setItem('users', JSON.stringify(updatedUsers))

      // Update current user
      setCurrentUser({ ...currentUser, ...updatedProfile })
      setProfile(updatedProfile)
      setEditedProfile(updatedProfile)
      setIsEditing(false)

      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      })
    } catch (error) {
      toast({
        title: "Update failed",
        description: "Could not update your profile. Please try again.",
        variant: "destructive"
      })
    }
  }

  const handleCancel = () => {
    setEditedProfile(profile)
    setPreviewImage(null)
    setIsEditing(false)
  }

  const triggerImageUpload = () => {
    fileInputRef.current?.click()
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-emerald-950 to-black">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto"></div>
          <p className="mt-4 text-white/80">Loading profile...</p>
        </div>
      </div>
    )
  }

  if (!currentUser) {
    return null
  }

  const stats = [
    { label: "Total Notes", value: profile.totalNotes || 0, icon: BookOpen },
    { label: "Favorite Notes", value: profile.favoriteNotes || 0, icon: User },
    {
      label: "Writing Streak",
      value: `${profile.streakDays || 1} day${profile.streakDays === 1 ? "" : "s"}`,
      icon: Calendar,
    },
  ]

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

      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-white/10 backdrop-blur-md supports-[backdrop-filter]:bg-white/10">
        <div className="container flex h-16 items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2 font-bold">
            <BookOpen className="h-6 w-6 text-white" />
            <span className="text-white">Inkly</span>
          </div>
          <Button variant="ghost" className="text-white hover:bg-white/20" asChild>
            <Link href="/dashboard">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 container pt-8 pb-12">
        <div className="grid gap-8 md:grid-cols-[300px_1fr]">
          {/* Profile Sidebar */}
          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardContent className="p-6">
              <div className="flex flex-col items-center space-y-4">
                <div className="relative group">
                  <Avatar className="h-24 w-24 border-2 border-white/20">
                    <AvatarImage src={previewImage || profile.avatar} alt={profile.name} />
                    <AvatarFallback className="bg-emerald-600/20 text-emerald-300">
                      {profile.name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  {isEditing && (
                    <div className="absolute -bottom-2 -right-2 flex space-x-1">
                      <Button
                        size="icon"
                        className="h-8 w-8 rounded-full bg-emerald-600 hover:bg-emerald-700"
                        onClick={triggerImageUpload}
                        disabled={isUploading}
                      >
                        {isUploading ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                        ) : (
                          <Upload className="h-4 w-4" />
                        )}
                        <span className="sr-only">Upload image</span>
                      </Button>
                      {previewImage && (
                        <>
                          <Button
                            size="icon"
                            className="h-8 w-8 rounded-full bg-emerald-600 hover:bg-emerald-700"
                            onClick={() => setPreviewImage(null)}
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Remove preview</span>
                          </Button>
                          <Button
                            size="icon"
                            className="h-8 w-8 rounded-full bg-emerald-600 hover:bg-emerald-700"
                            onClick={handleImageSave}
                          >
                            <Check className="h-4 w-4" />
                            <span className="sr-only">Save image</span>
                          </Button>
                        </>
                      )}
                    </div>
                  )}
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    accept="image/*"
                    className="hidden"
                  />
                </div>
                <div className="text-center">
                  <h2 className="text-xl font-semibold text-white">{profile.name}</h2>
                  <p className="text-sm text-white/70">{profile.email}</p>
                </div>
                {!isEditing && (
                  <Button
                    variant="outline"
                    className="w-full bg-emerald-600/20 text-emerald-300 border-emerald-600/30 hover:bg-emerald-600/30 hover:text-emerald-200"
                    onClick={() => setIsEditing(true)}
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Profile
                  </Button>
                )}
              </div>

              <div className="mt-6 space-y-4">
                
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4 text-white/60" />
                  <span className="text-sm text-white/80">
                    Joined {new Date(profile.joinedDate).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="font-medium mb-2 text-white">Stats</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-lg bg-white/10 p-3 text-center">
                    <div className="text-2xl font-bold text-white">{profile.totalNotes}</div>
                    <div className="text-sm text-white/70">Total Notes</div>
                  </div>
                  <div className="rounded-lg bg-white/10 p-3 text-center">
                    <div className="text-2xl font-bold text-white">{profile.favoriteNotes}</div>
                    <div className="text-sm text-white/70">Favorites</div>
                  </div>
                  <div className="rounded-lg bg-white/10 p-3 text-center">
                    <div className="text-2xl font-bold text-white">{profile.streakDays}</div>
                    <div className="text-sm text-white/70">Day Streak</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Profile Form */}
          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Profile Information</CardTitle>
              <CardDescription className="text-white/70">
                Update your profile information and preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-white">Full Name</Label>
                    <Input
                      id="name"
                      value={editedProfile.name}
                      onChange={(e) => setEditedProfile(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Your name"
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:border-emerald-400 focus:ring-emerald-400"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-white">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={editedProfile.email}
                      disabled
                      className="bg-white/10 border-white/20 text-white/50"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio" className="text-white">Bio</Label>
                    <Textarea
                      id="bio"
                      value={editedProfile.bio}
                      onChange={(e) => setEditedProfile(prev => ({ ...prev, bio: e.target.value }))}
                      placeholder="Tell us about yourself"
                      rows={4}
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:border-emerald-400 focus:ring-emerald-400"
                    />
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button 
                      variant="outline" 
                      onClick={handleCancel}
                      className="bg-white/10 text-white border-white/20 hover:bg-white/20 hover:text-emerald-300"
                    >
                      Cancel
                    </Button>
                    <Button 
                      onClick={handleSave}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white"
                    >
                      Save Changes
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-medium mb-2 text-white">About</h3>
                    <p className="text-white/80">{profile.bio}</p>
                  </div>

                  <div>
                    <h3 className="font-medium mb-2 text-white">Favorite Categories</h3>
                    <div className="flex flex-wrap gap-2">
                      {profile.favoriteCategories.map((category) => (
                        <Badge 
                          key={category} 
                          className="bg-emerald-600/20 text-emerald-300 border-emerald-600/30"
                        >
                          {category}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
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
