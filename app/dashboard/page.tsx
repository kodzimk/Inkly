"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import {
  BookOpen,
  Plus,
  Search,
  User,
  LogOut,
  FileText,
  MoreHorizontal,
  X,
  Trash2,
  Star,
  Grid,
  List,
  PenLine,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import Link from "next/link"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"    
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Note } from "../../app/global"

interface User {
  email: string;
  totalNotes?: number;
}

export default function DashboardPage() {
  const router = useRouter()
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [notes, setNotes] = useState<Note[]>([])
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingNote, setEditingNote] = useState<Note | null>(null)
  const [newNote, setNewNote] = useState<Omit<Note, "id" | "createdAt">>({
    title: "",
    content: "",
    category: "Personal",
    tags: [],
    isFavorite: false,
  })
  
  // Get user-specific storage key
  const getStorageKey = useCallback((key: string) => {
    return currentUser?.email ? `${currentUser.email}_${key}` : key
  }, [currentUser?.email])

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

  // Load view mode from localStorage on mount
  useEffect(() => {
    if (!currentUser) return
    try {
      const savedViewMode = localStorage.getItem(getStorageKey("dashboard-view-mode"))
      if (savedViewMode === "grid" || savedViewMode === "list") {
        setViewMode(savedViewMode)
      }
    } catch (error) {
      console.error("Error loading view mode:", error)
    }
  }, [currentUser, getStorageKey])

  // Save view mode to localStorage whenever it changes
  useEffect(() => {
    if (!currentUser) return
    try {
      localStorage.setItem(getStorageKey("dashboard-view-mode"), viewMode)
    } catch (error) {
      console.error("Error saving view mode:", error)
    }
  }, [viewMode, currentUser, getStorageKey])

  // Load notes from localStorage when component mounts
  useEffect(() => {
    if (!currentUser) return
    try {
      const savedNotes = localStorage.getItem(getStorageKey("dashboard-notes"))
      if (savedNotes) {
        setNotes(JSON.parse(savedNotes))
      }
    } catch (error) {
      console.error("Error loading notes:", error)
    }
  }, [currentUser, getStorageKey])

  // Save notes to localStorage whenever they change
  useEffect(() => {
    if (!currentUser) return
    try {
      localStorage.setItem(getStorageKey("dashboard-notes"), JSON.stringify(notes))
    } catch (error) {
      console.error("Error saving notes:", error)
    }
  }, [notes, currentUser, getStorageKey])

  // Handle view mode change with explicit function
  const handleViewModeChange = (mode: "grid" | "list") => {
    console.log("Changing view mode to:", mode)
    setViewMode(mode)
  }

  const [newTag, setNewTag] = useState("")
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [noteToDelete, setNoteToDelete] = useState<Note | null>(null)

  const categories = ["All", "Personal", "Work", "Learning", "Ideas", "Tasks"]

  const filteredNotes = notes.filter((note) => {
    const matchesSearch =
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "All" || note.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  // Handle opening the edit modal
  const handleNoteClick = (note: Note) => {
    setEditingNote(note)
    setIsEditModalOpen(true)
  }

  // Handle saving the edited note
  const handleSaveNote = () => {
    if (!editingNote) return

    setNotes((prevNotes) => prevNotes.map((note) => (note.id === editingNote.id ? { ...editingNote } : note)))
    setIsEditModalOpen(false)
  }

  // Handle creating a new note
  const handleCreateNote = () => {
    const createdNote: Note = {
      ...newNote,
      id: Math.max(0, ...notes.map((n) => n.id)) + 1,
      createdAt: new Date().toISOString().split("T")[0],
    }

    setNotes([createdNote, ...notes])
    setIsCreateModalOpen(false)
    setNewNote({
      title: "",
      content: "",
      category: "Personal",
      tags: [],
      isFavorite: false,
    })

    // Update user's total notes count
    if (currentUser) {
      const users = JSON.parse(localStorage.getItem("users") || "[]")
      const userIndex = users.findIndex((u: User) => u.email === currentUser.email)
      if (userIndex !== -1) {
        users[userIndex] = {
          ...users[userIndex],
          totalNotes: (users[userIndex].totalNotes || 0) + 1
        }
        localStorage.setItem("users", JSON.stringify(users))
      }
    }
  }

  // Handle delete note confirmation
  const handleDeleteNote = (note: Note) => {
    setNoteToDelete(note)
    setIsDeleteDialogOpen(true)
  }

  // Handle confirming delete
  const confirmDeleteNote = () => {
    if (!noteToDelete) return

    setNotes((prevNotes) => prevNotes.filter((note) => note.id !== noteToDelete.id))
    setIsDeleteDialogOpen(false)
    setNoteToDelete(null)
  }

  const handleSignOut = () => {
    router.push("/")
  }

  return (
    <div className="min-h-screen flex flex-col">
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
        <div className="absolute inset-0 bg-black/30" />
      </div>

      {/* Sticky Navigation */}
      <header className="sticky top-0 z-50 border-b bg-white/10 backdrop-blur-md supports-[backdrop-filter]:bg-white/10">
        <div className="container flex h-16 items-center justify-between px-6 md:px-8 lg:px-12 py-4">
          <div className="flex items-center gap-2 font-bold">
            <BookOpen className="h-6 w-6 text-white" />
            <span className="text-white">Inkly</span>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/quick-notes">
              <Button variant="ghost" className="text-white hover:bg-white/20">
                <PenLine className="mr-2 h-4 w-4" />
                Quick Notes
              </Button>
            </Link>
            <Button
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
              onClick={() => setIsCreateModalOpen(true)}
            >
              <Plus className="mr-2 h-4 w-4" />
              New Note
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-white hover:bg-white/20" size="icon">
                  <User className="h-5 w-5" />
                  <span className="sr-only">User menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem asChild>
                  <Link href="/profile">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className="text-red-600 cursor-pointer"
                  onClick={handleSignOut}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Main Content - Add flex-1 to push footer down */}
      <main className="relative z-10 flex-1 container pt-8 pb-12 px-6 md:px-8 lg:px-12">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Welcome back</h1>
          <p className="text-white/80 text-lg">Continue your mindful journey with your thoughts and reflections.</p>
        </div>

        {/* Quick Stats */}


        {/* Search and Filters */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/60" />
              <Input
                placeholder="Search your notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:border-emerald-400 focus:ring-emerald-400"
              />
            </div>

            <div className="flex items-center gap-2">
              <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
                <TabsList className="bg-white/10 border-white/20">
                  {categories.map((category) => (
                    <TabsTrigger
                      key={category}
                      value={category}
                      className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white text-white/70"
                    >
                      {category}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>

              <div className="flex items-center gap-1 ml-4">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="icon"
                  onClick={() => handleViewModeChange("grid")}
                  className={`transition-colors ${
                    viewMode === "grid" 
                      ? "bg-emerald-600 hover:bg-emerald-700" 
                      : "text-white hover:bg-white/20"
                  }`}
                  title="Grid View"
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="icon"
                  onClick={() => handleViewModeChange("list")}
                  className={`transition-colors ${
                    viewMode === "list" 
                      ? "bg-emerald-600 hover:bg-emerald-700" 
                      : "text-white hover:bg-white/20"
                  }`}
                  title="List View"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Notes Grid/List */}
        <div 
          className={`transition-all duration-300 ${
            viewMode === "grid" 
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
              : "space-y-4"
          }`}
        >
          {filteredNotes.map((note) => (
            <Card
              key={note.id}
              className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/15 transition-colors cursor-pointer"
              onClick={() => handleNoteClick(note)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-white text-lg mb-1">{note.title}</CardTitle>
                    <CardDescription className="text-white/70 text-sm">
                      {new Date(note.createdAt).toLocaleDateString()}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    {note.isFavorite && <Star className="h-4 w-4 text-yellow-400 fill-current" />}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-white/60 hover:text-white hover:bg-white/20"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation()
                            handleNoteClick(note)
                          }}
                        >
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={(e) => e.stopPropagation()}>Duplicate</DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation()
                            const updatedNote = { ...note, isFavorite: !note.isFavorite }
                            setNotes(notes.map((n) => (n.id === note.id ? updatedNote : n)))
                          }}
                        >
                          {note.isFavorite ? "Remove from Favorites" : "Add to Favorites"}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDeleteNote(note)
                          }}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p
                  className="text-white/80 text-sm mb-4 overflow-hidden"
                  style={{
                    display: "-webkit-box",
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: "vertical",
                  }}
                >
                  {note.content}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap gap-1">
                    {note.tags.slice(0, 2).map((tag) => (
                      <Badge key={tag} variant="secondary" className="bg-white/20 text-white/90 text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {note.tags.length > 2 && (
                      <Badge variant="secondary" className="bg-white/20 text-white/90 text-xs">
                        +{note.tags.length - 2}
                      </Badge>
                    )}
                  </div>
                  <Badge className="bg-emerald-600/20 text-emerald-300 border-emerald-600/30">{note.category}</Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredNotes.length === 0 && (
          <div className="text-center py-12">
            <FileText className="h-16 w-16 text-white/40 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No notes found</h3>
            <p className="text-white/70 mb-6">
              {searchQuery
                ? "Try adjusting your search terms"
                : "Start your mindful journey by creating your first note"}
            </p>
            <Button
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
              onClick={() => setIsCreateModalOpen(true)}
            >
              <Plus className="mr-2 h-4 w-4" />
              Create Your First Note
            </Button>
          </div>
        )}
      </main>

      {/* Footer - Add mt-auto to ensure it stays at bottom */}
      <footer className="relative z-10 mt-auto border-t border-white/20 bg-black/20 backdrop-blur-sm">
        <div className="container px-6 md:px-8 lg:px-12 py-4">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex items-center gap-2 font-bold">
              <BookOpen className="h-5 w-5 text-white" />
              <span className="text-white">Inkly</span>
            </div>
            <div className="flex items-center gap-4 text-sm text-white/70">
              <span>© 2025 Inkly</span>
              <span>•</span>
              <span>Find peace in your thoughts</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Edit Note Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[600px] bg-white/95 backdrop-blur-md">
          <DialogHeader>
            <DialogTitle>Edit Note</DialogTitle>
            <DialogDescription>Make changes to your note here.</DialogDescription>
          </DialogHeader>
          {editingNote && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={editingNote.title}
                  onChange={(e) => setEditingNote({ ...editingNote, title: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  rows={6}
                  value={editingNote.content}
                  onChange={(e) => setEditingNote({ ...editingNote, content: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={editingNote.category}
                  onValueChange={(value) => setEditingNote({ ...editingNote, category: value })}
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories
                      .filter((c) => c !== "All")
                      .map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="tags">Tags</Label>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center gap-1"
                    onClick={() => setEditingNote({ ...editingNote, isFavorite: !editingNote.isFavorite })}
                  >
                    <Star
                      className={`h-4 w-4 ${editingNote.isFavorite ? "text-yellow-500 fill-current" : "text-gray-400"}`}
                    />
                    {editingNote.isFavorite ? "Remove from favorites" : "Add to favorites"}
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mb-2">
                  {editingNote.tags.map((tag) => (
                    <Badge key={tag} className="bg-emerald-100 text-emerald-800 flex items-center gap-1">
                      {tag}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-4 w-4 p-0 hover:bg-transparent"
                        onClick={() =>
                          setEditingNote({
                            ...editingNote,
                            tags: editingNote.tags.filter((t) => t !== tag),
                          })
                        }
                      >
                        <X className="h-3 w-3" />
                        <span className="sr-only">Remove {tag} tag</span>
                      </Button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    id="new-tag"
                    placeholder="Add a tag..."
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault()
                        if (newTag.trim() && !editingNote.tags.includes(newTag.trim())) {
                          setEditingNote({
                            ...editingNote,
                            tags: [...editingNote.tags, newTag.trim()],
                          })
                          setNewTag("")
                        }
                      }
                    }}
                  />
                  <Button type="button" onClick={() => {
                    if (newTag.trim() && !editingNote.tags.includes(newTag.trim())) {
                      setEditingNote({
                        ...editingNote,
                        tags: [...editingNote.tags, newTag.trim()],
                      })
                      setNewTag("")
                    }
                  }}>
                    Add
                  </Button>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveNote}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Note Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="sm:max-w-[600px] bg-white/95 backdrop-blur-md">
          <DialogHeader>
            <DialogTitle>Create New Note</DialogTitle>
            <DialogDescription>Capture your thoughts, ideas, and reflections.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="new-title">Title</Label>
              <Input
                id="new-title"
                placeholder="Enter a title for your note"
                value={newNote.title}
                onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-content">Content</Label>
              <Textarea
                id="new-content"
                rows={6}
                placeholder="Write your thoughts here..."
                value={newNote.content}
                onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-category">Category</Label>
              <Select value={newNote.category} onValueChange={(value) => setNewNote({ ...newNote, category: value })}>
                <SelectTrigger id="new-category">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories
                    .filter((c) => c !== "All")
                    .map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="new-tags">Tags</Label>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-1"
                  onClick={() => setNewNote({ ...newNote, isFavorite: !newNote.isFavorite })}
                >
                  <Star
                    className={`h-4 w-4 ${newNote.isFavorite ? "text-yellow-500 fill-current" : "text-gray-400"}`}
                  />
                  {newNote.isFavorite ? "Remove from favorites" : "Add to favorites"}
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mb-2">
                {newNote.tags.map((tag) => (
                  <Badge key={tag} className="bg-emerald-100 text-emerald-800 flex items-center gap-1">
                    {tag}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-4 w-4 p-0 hover:bg-transparent"
                      onClick={() =>
                        setNewNote({
                          ...newNote,
                          tags: newNote.tags.filter((t) => t !== tag),
                        })
                      }
                    >
                      <X className="h-3 w-3" />
                      <span className="sr-only">Remove {tag} tag</span>
                    </Button>
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  id="new-note-tag"
                  placeholder="Add a tag..."
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      if (newTag.trim() && !newNote.tags.includes(newTag.trim())) {
                        setNewNote({
                          ...newNote,
                          tags: [...newNote.tags, newTag.trim()],
                        })
                        setNewTag("")
                      }
                    }
                  }}
                />
                <Button
                  type="button"
                  onClick={() => {
                    if (newTag.trim() && !newNote.tags.includes(newTag.trim())) {
                      setNewNote({
                        ...newNote,
                        tags: [...newNote.tags, newTag.trim()],
                      })
                      setNewTag("")
                    }
                  }}
                >
                  Add
                </Button>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateNote} disabled={!newNote.title.trim() || !newNote.content.trim()}>
              Create Note
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="bg-white/95 backdrop-blur-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <Trash2 className="h-5 w-5 text-red-600" />
              Delete Note
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{noteToDelete?.title}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsDeleteDialogOpen(false)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteNote} className="bg-red-600 hover:bg-red-700 text-white">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="text-center text-white/60">
        Don&apos;t have an account?{" "}
        <Link href="/sign-up" className="text-emerald-400 hover:text-emerald-300">
          Sign up
        </Link>
      </div>
    </div>
  )
}
