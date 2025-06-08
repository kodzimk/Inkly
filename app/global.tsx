export interface Note {
  id: number
  title: string
  content: string
  category: string
  tags: string[]
  createdAt: string
  isFavorite: boolean
}