export interface TreeHolePost {
  id: string
  user_id: string
  title: string
  content: string
  category: Category
  is_anonymous: boolean
  likes_count: number
  comments_count: number
  created_at: string
  profiles?: Profile
}

export interface Comment {
  id: string
  post_id: string
  user_id: string
  content: string
  is_anonymous: boolean
  likes_count: number
  created_at: string
  profiles?: Profile
}

export interface Profile {
  id: string
  nickname: string
  avatar_color: string
  created_at: string
}

export type Category = '情感' | '生活' | '学习' | '工作' | '其他'

export const CATEGORIES: Category[] = ['情感', '生活', '学习', '工作', '其他']

export const AVATAR_COLORS = [
  '#FFB6C1', '#87CEEB', '#FFDAB9', '#A8E6CF', '#E6E6FA',
  '#FFE5B4', '#DDA0DD', '#98D8C8', '#F7DC6F', '#AED6F1',
]

export const AVATAR_EMOJIS = ['🌸', '⭐', '🐱', '🌙', '☀️', '🌈', '🍀', '🦋', '🎵', '🎈']
