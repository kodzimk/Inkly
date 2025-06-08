"use client"

import Link from "next/link"
import { Note } from "../../app/global"
import { Button } from "@/components/ui/button"
import { Plus, FileText, Calendar } from "lucide-react"

interface NotesListProps {
  notes: Note[]
}

export function NotesList({ notes }: NotesListProps) {
  if (notes.length === 0) {
    return (
      <div className="text-center py-12">
        <FileText className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No notes</h3>
        <p className="mt-1 text-sm text-gray-500">Get started by creating a new note.</p>
        <div className="mt-6">
          <Button asChild>
            <Link href="/notes/new">
              <Plus className="mr-2 h-4 w-4" />
              New note
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button asChild>
          <Link href="/notes/new">
            <Plus className="mr-2 h-4 w-4" />
            New note
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {notes.map((note) => (
          <Link
            key={note.id}
            href={`/notes/${note.id}`}
            className="block rounded-lg border bg-white p-4 hover:border-emerald-500 transition-colors"
          >
            <h3 className="font-medium text-gray-900 truncate">{note.title}</h3>
            <p className="mt-1 text-sm text-gray-500 line-clamp-2">{note.content}</p>
              <div className="mt-4 flex items-center text-sm text-gray-500">
                <Calendar className="mr-1 h-4 w-4" />
                {new Date(note.createdAt).toLocaleDateString()}
              </div>
          </Link>
        ))}
      </div>
    </div>
  )
} 