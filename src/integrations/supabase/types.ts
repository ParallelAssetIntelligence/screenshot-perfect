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
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      inspection_responses: {
        Row: {
          created_at: string | null
          field_appsheet_column: string
          field_included: boolean | null
          field_value: Json | null
          id: string
          inspection_name: string
          phase: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          field_appsheet_column: string
          field_included?: boolean | null
          field_value?: Json | null
          id?: string
          inspection_name: string
          phase: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          field_appsheet_column?: string
          field_included?: boolean | null
          field_value?: Json | null
          id?: string
          inspection_name?: string
          phase?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      inspections: {
        Row: {
          created_at: string | null
          current_field_index: number | null
          current_phase: string | null
          form_data: Json | null
          id: string
          name: string
          status: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          current_field_index?: number | null
          current_phase?: string | null
          form_data?: Json | null
          id?: string
          name: string
          status?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          current_field_index?: number | null
          current_phase?: string | null
          form_data?: Json | null
          id?: string
          name?: string
          status?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      uad_fields: {
        Row: {
          allowable_answers_format: string | null
          appsheet_column: string
          created_at: string | null
          data_source: string | null
          definition_guidance: string | null
          dev_notes: string | null
          dev_status: string | null
          field_num: string
          help_text: string | null
          help_text_priority: string | null
          id: string
          in_questionnaire: string | null
          input_type: string
          phase: string
          possible_answers: string | null
          report_field_id: string | null
          report_label: string
          required: string | null
          section_num: number | null
          show_if: string | null
          uad_conditionality: string | null
          uad_section: string | null
          updated_at: string | null
          when_to_include: string | null
        }
        Insert: {
          allowable_answers_format?: string | null
          appsheet_column: string
          created_at?: string | null
          data_source?: string | null
          definition_guidance?: string | null
          dev_notes?: string | null
          dev_status?: string | null
          field_num: string
          help_text?: string | null
          help_text_priority?: string | null
          id?: string
          in_questionnaire?: string | null
          input_type: string
          phase: string
          possible_answers?: string | null
          report_field_id?: string | null
          report_label: string
          required?: string | null
          section_num?: number | null
          show_if?: string | null
          uad_conditionality?: string | null
          uad_section?: string | null
          updated_at?: string | null
          when_to_include?: string | null
        }
        Update: {
          allowable_answers_format?: string | null
          appsheet_column?: string
          created_at?: string | null
          data_source?: string | null
          definition_guidance?: string | null
          dev_notes?: string | null
          dev_status?: string | null
          field_num?: string
          help_text?: string | null
          help_text_priority?: string | null
          id?: string
          in_questionnaire?: string | null
          input_type?: string
          phase?: string
          possible_answers?: string | null
          report_field_id?: string | null
          report_label?: string
          required?: string | null
          section_num?: number | null
          show_if?: string | null
          uad_conditionality?: string | null
          uad_section?: string | null
          updated_at?: string | null
          when_to_include?: string | null
        }
        Relationships: []
      }
      uad_phases: {
        Row: {
          code: string
          created_at: string | null
          display_order: number
          icon: string | null
          id: string
          name: string
          subtitle: string | null
        }
        Insert: {
          code: string
          created_at?: string | null
          display_order: number
          icon?: string | null
          id?: string
          name: string
          subtitle?: string | null
        }
        Update: {
          code?: string
          created_at?: string | null
          display_order?: number
          icon?: string | null
          id?: string
          name?: string
          subtitle?: string | null
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id: string
        }
        Update: {
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
        }
        Relationships: []
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
    Enums: {},
  },
} as const
