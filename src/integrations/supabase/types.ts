export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      ambassador_applications: {
        Row: {
          approved_at: string | null
          arxon_account_id: string
          country: string | null
          created_at: string
          estimated_new_users: number
          follower_count: number
          full_name: string
          id: string
          motivation: string
          previous_experience: string | null
          recent_post_links: string[]
          status: string
          x_handle: string
        }
        Insert: {
          approved_at?: string | null
          arxon_account_id: string
          country?: string | null
          created_at?: string
          estimated_new_users?: number
          follower_count?: number
          full_name: string
          id?: string
          motivation: string
          previous_experience?: string | null
          recent_post_links?: string[]
          status?: string
          x_handle: string
        }
        Update: {
          approved_at?: string | null
          arxon_account_id?: string
          country?: string | null
          created_at?: string
          estimated_new_users?: number
          follower_count?: number
          full_name?: string
          id?: string
          motivation?: string
          previous_experience?: string | null
          recent_post_links?: string[]
          status?: string
          x_handle?: string
        }
        Relationships: []
      }
      ambassador_report_items: {
        Row: {
          caption: string | null
          created_at: string
          id: string
          item_type: string
          report_id: string
          sort_order: number
          storage_path: string | null
          url: string | null
        }
        Insert: {
          caption?: string | null
          created_at?: string
          id?: string
          item_type: string
          report_id: string
          sort_order?: number
          storage_path?: string | null
          url?: string | null
        }
        Update: {
          caption?: string | null
          created_at?: string
          id?: string
          item_type?: string
          report_id?: string
          sort_order?: number
          storage_path?: string | null
          url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ambassador_report_items_report_id_fkey"
            columns: ["report_id"]
            isOneToOne: false
            referencedRelation: "ambassador_weekly_reports"
            referencedColumns: ["id"]
          },
        ]
      }
      ambassador_weekly_reports: {
        Row: {
          admin_points: number | null
          admin_points_assigned_at: string | null
          admin_points_assigned_by: string | null
          admin_points_note: string | null
          application_id: string
          arxon_account_id: string
          created_at: string
          id: string
          status: string
          submitted_at: string | null
          summary: string | null
          updated_at: string
          week_start: string
        }
        Insert: {
          admin_points?: number | null
          admin_points_assigned_at?: string | null
          admin_points_assigned_by?: string | null
          admin_points_note?: string | null
          application_id: string
          arxon_account_id: string
          created_at?: string
          id?: string
          status?: string
          submitted_at?: string | null
          summary?: string | null
          updated_at?: string
          week_start: string
        }
        Update: {
          admin_points?: number | null
          admin_points_assigned_at?: string | null
          admin_points_assigned_by?: string | null
          admin_points_note?: string | null
          application_id?: string
          arxon_account_id?: string
          created_at?: string
          id?: string
          status?: string
          submitted_at?: string | null
          summary?: string | null
          updated_at?: string
          week_start?: string
        }
        Relationships: [
          {
            foreignKeyName: "ambassador_weekly_reports_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "ambassador_applications"
            referencedColumns: ["id"]
          },
        ]
      }
      ambassador_submissions: {
        Row: {
          arxon_account_id: string
          created_at: string
          id: string
          notes: string | null
          submission_type: string
          submission_url: string
        }
        Insert: {
          arxon_account_id: string
          created_at?: string
          id?: string
          notes?: string | null
          submission_type?: string
          submission_url: string
        }
        Update: {
          arxon_account_id?: string
          created_at?: string
          id?: string
          notes?: string | null
          submission_type?: string
          submission_url?: string
        }
        Relationships: []
      }
      admin_access_requests: {
        Row: {
          approval_token: string
          created_at: string
          email: string
          full_name: string
          id: string
          organization: string | null
          reason: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          status: string
          user_id: string
        }
        Insert: {
          approval_token?: string
          created_at?: string
          email: string
          full_name: string
          id?: string
          organization?: string | null
          reason?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          user_id: string
        }
        Update: {
          approval_token?: string
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          organization?: string | null
          reason?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          user_id?: string
        }
        Relationships: []
      }
      investor_submissions: {
        Row: {
          additional_notes: string | null
          area_of_interest: string
          company: string | null
          country: string
          created_at: string
          email: string
          full_name: string
          id: string
          investment_range: string
          investment_timeline: string
          linkedin_profile: string | null
          x_username: string
        }
        Insert: {
          additional_notes?: string | null
          area_of_interest: string
          company?: string | null
          country: string
          created_at?: string
          email: string
          full_name: string
          id?: string
          investment_range: string
          investment_timeline: string
          linkedin_profile?: string | null
          x_username: string
        }
        Update: {
          additional_notes?: string | null
          area_of_interest?: string
          company?: string | null
          country?: string
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          investment_range?: string
          investment_timeline?: string
          linkedin_profile?: string | null
          x_username?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      waitlist: {
        Row: {
          created_at: string
          email: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      review_admin_access_request: {
        Args: {
          _action: string
          _reviewed_by?: string
          _token: string
        }
        Returns: Json
      }
    }
    Enums: {
      app_role: "admin" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
    },
  },
} as const
