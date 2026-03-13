export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type AccessProfileName = 'Admin' | 'Editor' | 'Viewer'
export type ContactImportStatus = 'ativo' | 'orphaned'
export type ContactSource = 'vendas' | 'email' | 'whatsapp'
export type ContactStatus = 'ativo' | 'inativo' | 'pendente'
export type ImportJobStatus = 'processando' | 'ativa' | 'revertida' | 'erro'
export type InconsistencyType = 'Duplicata' | 'Tag ausente' | 'Inadimplente' | 'Órfão'
export type MemberStatus = 'ativo' | 'inativo'

export interface Database {
  public: {
    Tables: {
      workspaces: {
        Row: {
          id: string
          name: string
          slug: string
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          id: string
          full_name: string | null
          avatar_url: string | null
          avatar_fallback: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          full_name?: string | null
          avatar_url?: string | null
          avatar_fallback?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string | null
          avatar_url?: string | null
          avatar_fallback?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      access_profiles: {
        Row: {
          id: string
          workspace_id: string
          name: AccessProfileName
          description: string
          is_system: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          workspace_id: string
          name: AccessProfileName
          description: string
          is_system?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          workspace_id?: string
          name?: AccessProfileName
          description?: string
          is_system?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      access_profile_permissions: {
        Row: {
          id: string
          access_profile_id: string
          category: string
          action_name: string
          allowed: boolean
          created_at: string
        }
        Insert: {
          id?: string
          access_profile_id: string
          category: string
          action_name: string
          allowed?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          access_profile_id?: string
          category?: string
          action_name?: string
          allowed?: boolean
          created_at?: string
        }
        Relationships: []
      }
      workspace_members: {
        Row: {
          workspace_id: string
          user_id: string
          access_profile_id: string
          status: MemberStatus
          last_access_at: string | null
          invited_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          workspace_id: string
          user_id: string
          access_profile_id: string
          status?: MemberStatus
          last_access_at?: string | null
          invited_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          workspace_id?: string
          user_id?: string
          access_profile_id?: string
          status?: MemberStatus
          last_access_at?: string | null
          invited_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      tags: {
        Row: {
          id: string
          workspace_id: string
          name: string
          description: string
          color: string
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          workspace_id: string
          name: string
          description?: string
          color?: string
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          workspace_id?: string
          name?: string
          description?: string
          color?: string
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      contacts: {
        Row: {
          id: string
          workspace_id: string
          avatar_url: string | null
          avatar_fallback: string | null
          name: string
          email: string
          phone: string
          canonical_source: ContactSource
          status: ContactStatus
          import_status: ContactImportStatus
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          workspace_id: string
          avatar_url?: string | null
          avatar_fallback?: string | null
          name: string
          email: string
          phone: string
          canonical_source: ContactSource
          status?: ContactStatus
          import_status?: ContactImportStatus
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          workspace_id?: string
          avatar_url?: string | null
          avatar_fallback?: string | null
          name?: string
          email?: string
          phone?: string
          canonical_source?: ContactSource
          status?: ContactStatus
          import_status?: ContactImportStatus
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      contact_tags: {
        Row: {
          contact_id: string
          tag_id: string
          assigned_by: string | null
          assigned_at: string
        }
        Insert: {
          contact_id: string
          tag_id: string
          assigned_by?: string | null
          assigned_at?: string
        }
        Update: {
          contact_id?: string
          tag_id?: string
          assigned_by?: string | null
          assigned_at?: string
        }
        Relationships: []
      }
      imports: {
        Row: {
          id: string
          workspace_id: string
          file_name: string
          file_size: number
          source: ContactSource
          imported_at: string
          status: ImportJobStatus
          created_by: string | null
          created_at: string
        }
        Insert: {
          id?: string
          workspace_id: string
          file_name: string
          file_size: number
          source: ContactSource
          imported_at?: string
          status?: ImportJobStatus
          created_by?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          workspace_id?: string
          file_name?: string
          file_size?: number
          source?: ContactSource
          imported_at?: string
          status?: ImportJobStatus
          created_by?: string | null
          created_at?: string
        }
        Relationships: []
      }
      import_contacts: {
        Row: {
          import_id: string
          contact_id: string
          source: ContactSource
          added_at: string
          is_primary: boolean
        }
        Insert: {
          import_id: string
          contact_id: string
          source: ContactSource
          added_at?: string
          is_primary?: boolean
        }
        Update: {
          import_id?: string
          contact_id?: string
          source?: ContactSource
          added_at?: string
          is_primary?: boolean
        }
        Relationships: []
      }
      inconsistency_cases: {
        Row: {
          id: string
          workspace_id: string
          contact_id: string
          type: InconsistencyType
          primary_source: ContactSource
          source_list: ContactSource[]
          occurrences: number
          first_purchase_label: string | null
          current_tags_snapshot: string[]
          suggested_tags_snapshot: string[]
          conflict_label: string | null
          resolved: boolean
          resolved_with: ContactSource | null
          resolved_at: string | null
          resolved_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          workspace_id: string
          contact_id: string
          type: InconsistencyType
          primary_source: ContactSource
          source_list: ContactSource[]
          occurrences?: number
          first_purchase_label?: string | null
          current_tags_snapshot?: string[]
          suggested_tags_snapshot?: string[]
          conflict_label?: string | null
          resolved?: boolean
          resolved_with?: ContactSource | null
          resolved_at?: string | null
          resolved_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          workspace_id?: string
          contact_id?: string
          type?: InconsistencyType
          primary_source?: ContactSource
          source_list?: ContactSource[]
          occurrences?: number
          first_purchase_label?: string | null
          current_tags_snapshot?: string[]
          suggested_tags_snapshot?: string[]
          conflict_label?: string | null
          resolved?: boolean
          resolved_with?: ContactSource | null
          resolved_at?: string | null
          resolved_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      inconsistency_conflict_entries: {
        Row: {
          id: string
          inconsistency_id: string
          source: ContactSource
          value: string
          created_at: string
        }
        Insert: {
          id?: string
          inconsistency_id: string
          source: ContactSource
          value: string
          created_at?: string
        }
        Update: {
          id?: string
          inconsistency_id?: string
          source?: ContactSource
          value?: string
          created_at?: string
        }
        Relationships: []
      }
    }
    Views: {}
    Functions: {
      create_workspace_with_defaults: {
        Args: { p_name: string; p_slug: string }
        Returns: Database['public']['Tables']['workspaces']['Row']
      }
      resolve_inconsistency_case: {
        Args: { p_case_id: string; p_choice: ContactSource }
        Returns: undefined
      }
      revert_import: {
        Args: { p_import_id: string }
        Returns: undefined
      }
    }
    Enums: {
      access_profile_name: AccessProfileName
      contact_import_status: ContactImportStatus
      contact_source: ContactSource
      contact_status: ContactStatus
      import_job_status: ImportJobStatus
      inconsistency_type: InconsistencyType
      member_status: MemberStatus
    }
    CompositeTypes: {}
  }
}

export type PublicSchema = Database['public']
export type TableName = keyof PublicSchema['Tables']
export type TableRow<T extends TableName> = PublicSchema['Tables'][T]['Row']
