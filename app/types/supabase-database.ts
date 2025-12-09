export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          email: string
          username: string | null
          avatar_url: string | null
          full_name: string | null
        }
        Insert: {
          id: string
          created_at?: string
          updated_at?: string
          email: string
          username?: string | null
          avatar_url?: string | null
          full_name?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          email?: string
          username?: string | null
          avatar_url?: string | null
          full_name?: string | null
        }
        Relationships: []
      }
      projects: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          user_id: string
          name: string
          description: string | null
          is_public: boolean
          metadata: Json | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          user_id: string
          name: string
          description?: string | null
          is_public?: boolean
          metadata?: Json | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          user_id?: string
          name?: string
          description?: string | null
          is_public?: boolean
          metadata?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "projects_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      chats: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          project_id: string
          user_id: string
          title: string
          messages: Json
          metadata: Json | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          project_id: string
          user_id: string
          title: string
          messages: Json
          metadata?: Json | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          project_id?: string
          user_id?: string
          title?: string
          messages?: Json
          metadata?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "chats_project_id_fkey"
            columns: ["project_id"]
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chats_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      files: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          project_id: string
          user_id: string
          path: string
          content: string
          size: number
          metadata: Json | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          project_id: string
          user_id: string
          path: string
          content: string
          size: number
          metadata?: Json | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          project_id?: string
          user_id?: string
          path?: string
          content?: string
          size?: number
          metadata?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "files_project_id_fkey"
            columns: ["project_id"]
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "files_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

