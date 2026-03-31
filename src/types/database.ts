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
          full_name: string | null
          role: 'pharmacist' | 'verifier' | 'admin'
          sipa_number: string | null
          institution: string | null
          is_active: boolean
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          full_name?: string | null
          role?: 'pharmacist' | 'verifier' | 'admin'
          sipa_number?: string | null
          institution?: string | null
          is_active?: boolean
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string | null
          role?: 'pharmacist' | 'verifier' | 'admin'
          sipa_number?: string | null
          institution?: string | null
          is_active?: boolean
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      drug_categories: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          created_at?: string
        }
      }
      drugs: {
        Row: {
          id: string
          name: string
          brand_names: string[]
          slug: string
          category_id: string | null
          drug_class: string | null
          summary: string | null
          status: 'draft' | 'review' | 'published' | 'archived'
          submitted_by: string | null
          verified_by: string | null
          published_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          brand_names?: string[]
          slug: string
          category_id?: string | null
          drug_class?: string | null
          summary?: string | null
          status?: 'draft' | 'review' | 'published' | 'archived'
          submitted_by?: string | null
          verified_by?: string | null
          published_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          brand_names?: string[]
          slug?: string
          category_id?: string | null
          drug_class?: string | null
          summary?: string | null
          status?: 'draft' | 'review' | 'published' | 'archived'
          submitted_by?: string | null
          verified_by?: string | null
          published_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      drug_monograph_sections: {
        Row: {
          id: string
          drug_id: string
          section_type:
            | 'indication'
            | 'contraindication'
            | 'dosage'
            | 'side_effects'
            | 'drug_interactions'
            | 'mechanism'
            | 'pharmacokinetics'
            | 'storage'
            | 'warnings'
            | 'pregnancy_category'
            | 'references'
          content: string
          version: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          drug_id: string
          section_type:
            | 'indication'
            | 'contraindication'
            | 'dosage'
            | 'side_effects'
            | 'drug_interactions'
            | 'mechanism'
            | 'pharmacokinetics'
            | 'storage'
            | 'warnings'
            | 'pregnancy_category'
            | 'references'
          content: string
          version?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          drug_id?: string
          section_type?:
            | 'indication'
            | 'contraindication'
            | 'dosage'
            | 'side_effects'
            | 'drug_interactions'
            | 'mechanism'
            | 'pharmacokinetics'
            | 'storage'
            | 'warnings'
            | 'pregnancy_category'
            | 'references'
          content?: string
          version?: number
          created_at?: string
          updated_at?: string
        }
      }
      public_questions: {
        Row: {
          id: string
          question_text: string
          asker_name: string | null
          asker_email: string | null
          drug_id: string | null
          status: 'pending' | 'answered' | 'closed'
          answered_by: string | null
          answer_text: string | null
          answered_at: string | null
          is_published: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          question_text: string
          asker_name?: string | null
          asker_email?: string | null
          drug_id?: string | null
          status?: 'pending' | 'answered' | 'closed'
          answered_by?: string | null
          answer_text?: string | null
          answered_at?: string | null
          is_published?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          question_text?: string
          asker_name?: string | null
          asker_email?: string | null
          drug_id?: string | null
          status?: 'pending' | 'answered' | 'closed'
          answered_by?: string | null
          answer_text?: string | null
          answered_at?: string | null
          is_published?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      audit_logs: {
        Row: {
          id: string
          user_id: string | null
          action: string
          resource_type: string | null
          resource_id: string | null
          metadata: Json
          ip_address: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          action: string
          resource_type?: string | null
          resource_id?: string | null
          metadata?: Json
          ip_address?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          action?: string
          resource_type?: string | null
          resource_id?: string | null
          metadata?: Json
          ip_address?: string | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_my_role: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      is_active_user: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      has_role: {
        Args: {
          _roles: string[]
        }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
  }
}
