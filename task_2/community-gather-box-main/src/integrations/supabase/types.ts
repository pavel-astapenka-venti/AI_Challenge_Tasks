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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      event_feedback: {
        Row: {
          comment: string | null
          created_at: string
          event_id: string
          id: string
          rating: number
          updated_at: string
          user_id: string
        }
        Insert: {
          comment?: string | null
          created_at?: string
          event_id: string
          id?: string
          rating: number
          updated_at?: string
          user_id: string
        }
        Update: {
          comment?: string | null
          created_at?: string
          event_id?: string
          id?: string
          rating?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_feedback_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      event_photos: {
        Row: {
          caption: string | null
          created_at: string
          event_id: string
          hidden_at: string | null
          id: string
          reviewed_at: string | null
          reviewed_by: string | null
          status: Database["public"]["Enums"]["photo_status"]
          storage_path: string
          user_id: string
        }
        Insert: {
          caption?: string | null
          created_at?: string
          event_id: string
          hidden_at?: string | null
          id?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: Database["public"]["Enums"]["photo_status"]
          storage_path: string
          user_id: string
        }
        Update: {
          caption?: string | null
          created_at?: string
          event_id?: string
          hidden_at?: string | null
          id?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: Database["public"]["Enums"]["photo_status"]
          storage_path?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_photos_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          capacity: number | null
          cover_image_url: string | null
          created_at: string
          description: string | null
          end_at: string
          hidden_at: string | null
          host_id: string
          id: string
          is_online: boolean
          is_paid: boolean
          location: string | null
          online_url: string | null
          slug: string
          start_at: string
          status: Database["public"]["Enums"]["event_status"]
          time_zone: string
          title: string
          updated_at: string
          visibility: Database["public"]["Enums"]["event_visibility"]
        }
        Insert: {
          capacity?: number | null
          cover_image_url?: string | null
          created_at?: string
          description?: string | null
          end_at: string
          hidden_at?: string | null
          host_id: string
          id?: string
          is_online?: boolean
          is_paid?: boolean
          location?: string | null
          online_url?: string | null
          slug: string
          start_at: string
          status?: Database["public"]["Enums"]["event_status"]
          time_zone?: string
          title: string
          updated_at?: string
          visibility?: Database["public"]["Enums"]["event_visibility"]
        }
        Update: {
          capacity?: number | null
          cover_image_url?: string | null
          created_at?: string
          description?: string | null
          end_at?: string
          hidden_at?: string | null
          host_id?: string
          id?: string
          is_online?: boolean
          is_paid?: boolean
          location?: string | null
          online_url?: string | null
          slug?: string
          start_at?: string
          status?: Database["public"]["Enums"]["event_status"]
          time_zone?: string
          title?: string
          updated_at?: string
          visibility?: Database["public"]["Enums"]["event_visibility"]
        }
        Relationships: [
          {
            foreignKeyName: "events_host_id_fkey"
            columns: ["host_id"]
            isOneToOne: false
            referencedRelation: "host_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      host_invites: {
        Row: {
          created_at: string
          created_by: string
          expires_at: string
          host_id: string
          id: string
          revoked_at: string | null
          role: Database["public"]["Enums"]["host_member_role"]
          token: string
        }
        Insert: {
          created_at?: string
          created_by: string
          expires_at?: string
          host_id: string
          id?: string
          revoked_at?: string | null
          role: Database["public"]["Enums"]["host_member_role"]
          token?: string
        }
        Update: {
          created_at?: string
          created_by?: string
          expires_at?: string
          host_id?: string
          id?: string
          revoked_at?: string | null
          role?: Database["public"]["Enums"]["host_member_role"]
          token?: string
        }
        Relationships: [
          {
            foreignKeyName: "host_invites_host_id_fkey"
            columns: ["host_id"]
            isOneToOne: false
            referencedRelation: "host_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      host_members: {
        Row: {
          created_at: string
          host_id: string
          id: string
          role: Database["public"]["Enums"]["host_member_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          host_id: string
          id?: string
          role: Database["public"]["Enums"]["host_member_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          host_id?: string
          id?: string
          role?: Database["public"]["Enums"]["host_member_role"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "host_members_host_id_fkey"
            columns: ["host_id"]
            isOneToOne: false
            referencedRelation: "host_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      host_profiles: {
        Row: {
          bio: string | null
          contact_email: string
          created_at: string
          id: string
          logo_url: string | null
          name: string
          slug: string
          updated_at: string
          user_id: string
        }
        Insert: {
          bio?: string | null
          contact_email: string
          created_at?: string
          id?: string
          logo_url?: string | null
          name: string
          slug: string
          updated_at?: string
          user_id: string
        }
        Update: {
          bio?: string | null
          contact_email?: string
          created_at?: string
          id?: string
          logo_url?: string | null
          name?: string
          slug?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          display_name: string | null
          email: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          display_name?: string | null
          email: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          display_name?: string | null
          email?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      reports: {
        Row: {
          created_at: string
          id: string
          reason: string
          reporter_id: string
          resolved_at: string | null
          resolved_by: string | null
          status: Database["public"]["Enums"]["report_status"]
          target_id: string
          target_type: Database["public"]["Enums"]["report_target"]
        }
        Insert: {
          created_at?: string
          id?: string
          reason: string
          reporter_id: string
          resolved_at?: string | null
          resolved_by?: string | null
          status?: Database["public"]["Enums"]["report_status"]
          target_id: string
          target_type: Database["public"]["Enums"]["report_target"]
        }
        Update: {
          created_at?: string
          id?: string
          reason?: string
          reporter_id?: string
          resolved_at?: string | null
          resolved_by?: string | null
          status?: Database["public"]["Enums"]["report_status"]
          target_id?: string
          target_type?: Database["public"]["Enums"]["report_target"]
        }
        Relationships: []
      }
      rsvps: {
        Row: {
          acknowledged_promotion_at: string | null
          checked_in_at: string | null
          created_at: string
          event_id: string
          id: string
          promoted_at: string | null
          status: Database["public"]["Enums"]["rsvp_status"]
          ticket_code: string
          updated_at: string
          user_id: string
        }
        Insert: {
          acknowledged_promotion_at?: string | null
          checked_in_at?: string | null
          created_at?: string
          event_id: string
          id?: string
          promoted_at?: string | null
          status?: Database["public"]["Enums"]["rsvp_status"]
          ticket_code?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          acknowledged_promotion_at?: string | null
          checked_in_at?: string | null
          created_at?: string
          event_id?: string
          id?: string
          promoted_at?: string | null
          status?: Database["public"]["Enums"]["rsvp_status"]
          ticket_code?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "rsvps_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      accept_host_invite: {
        Args: { _token: string }
        Returns: {
          created_at: string
          host_id: string
          id: string
          role: Database["public"]["Enums"]["host_member_role"]
          user_id: string
        }
        SetofOptions: {
          from: "*"
          to: "host_members"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      acknowledge_promotion: { Args: { _rsvp_id: string }; Returns: undefined }
      can_moderate_report: {
        Args: {
          _target_id: string
          _target_type: Database["public"]["Enums"]["report_target"]
        }
        Returns: boolean
      }
      cancel_rsvp: { Args: { _event_id: string }; Returns: undefined }
      check_in_rsvp: {
        Args: { _rsvp_id: string; _undo?: boolean }
        Returns: {
          acknowledged_promotion_at: string | null
          checked_in_at: string | null
          created_at: string
          event_id: string
          id: string
          promoted_at: string | null
          status: Database["public"]["Enums"]["rsvp_status"]
          ticket_code: string
          updated_at: string
          user_id: string
        }
        SetofOptions: {
          from: "*"
          to: "rsvps"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      create_rsvp: {
        Args: { _event_id: string }
        Returns: {
          acknowledged_promotion_at: string | null
          checked_in_at: string | null
          created_at: string
          event_id: string
          id: string
          promoted_at: string | null
          status: Database["public"]["Enums"]["rsvp_status"]
          ticket_code: string
          updated_at: string
          user_id: string
        }
        SetofOptions: {
          from: "*"
          to: "rsvps"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      get_event_confirmed_count: {
        Args: { _event_id: string }
        Returns: number
      }
      get_my_host_contact_email: { Args: { _host_id: string }; Returns: string }
      has_host_role: {
        Args: {
          _host_id: string
          _role: Database["public"]["Enums"]["host_member_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_host_member: {
        Args: { _host_id: string; _user_id: string }
        Returns: boolean
      }
      preview_host_invite: {
        Args: { _token: string }
        Returns: {
          expires_at: string
          host_id: string
          host_name: string
          host_slug: string
          revoked: boolean
          role: Database["public"]["Enums"]["host_member_role"]
        }[]
      }
    }
    Enums: {
      event_status: "draft" | "published"
      event_visibility: "public" | "unlisted"
      host_member_role: "host" | "checker"
      photo_status: "pending" | "approved" | "rejected"
      report_status: "open" | "actioned" | "dismissed"
      report_target: "event" | "photo"
      rsvp_status: "confirmed" | "waitlist" | "cancelled"
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
      event_status: ["draft", "published"],
      event_visibility: ["public", "unlisted"],
      host_member_role: ["host", "checker"],
      photo_status: ["pending", "approved", "rejected"],
      report_status: ["open", "actioned", "dismissed"],
      report_target: ["event", "photo"],
      rsvp_status: ["confirmed", "waitlist", "cancelled"],
    },
  },
} as const
