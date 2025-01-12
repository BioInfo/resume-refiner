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
      users: {
        Row: {
          id: string
          email: string
          created_at: string
        }
        Insert: {
          id?: string
          email: string
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          created_at?: string
        }
      }
      resume_data: {
        Row: {
          id: string
          user_id: string
          resume_text: string
          resume_json: Json
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          resume_text: string
          resume_json: Json
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          resume_text?: string
          resume_json?: Json
          created_at?: string
        }
      }
      job_data: {
        Row: {
          id: string
          user_id: string
          job_description: string
          extracted_details: Json
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          job_description: string
          extracted_details: Json
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          job_description?: string
          extracted_details?: Json
          created_at?: string
        }
      }
      refined_resume_data: {
        Row: {
          id: string
          user_id: string
          resume_json: Json
          job_id: string
          refined_json: Json
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          resume_json: Json
          job_id: string
          refined_json: Json
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          resume_json?: Json
          job_id?: string
          refined_json?: Json
          created_at?: string
        }
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