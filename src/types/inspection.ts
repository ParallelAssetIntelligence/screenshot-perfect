export type PhaseCode = 'P1' | 'P2' | 'P3' | 'P4' | 'P5' | 'P6' | 'P7' | 'P8';

export type InputType = 'Text' | 'LongText' | 'Number' | 'Enum' | 'EnumList' | 'Photo' | 'Rating';

export type RequiredType = 'Yes' | 'No' | 'Conditional';

export type InspectionStatus = 'in_progress' | 'completed' | 'archived';

export interface UADField {
  id: string;
  field_num: string;
  phase: PhaseCode;
  uad_section?: string;
  section_num?: number;
  report_field_id?: string;
  report_label: string;
  appsheet_column: string;
  input_type: InputType;
  possible_answers?: string;
  required: RequiredType;
  show_if?: string;
  data_source?: string;
  in_questionnaire?: string;
  when_to_include?: string;
  allowable_answers_format?: string;
  definition_guidance?: string;
  dev_status?: string;
  dev_notes?: string;
  help_text?: string;
  help_text_priority?: string;
  uad_conditionality?: string;
}

export interface PhaseMetadata {
  id: string;
  code: PhaseCode;
  name: string;
  subtitle: string;
  icon: string;
  display_order: number;
}

export interface FormState {
  store: Record<PhaseCode, Record<string, any>>;
  inclusion: Record<PhaseCode, Record<string, boolean>>;
}

export interface Inspection {
  id: string;
  user_id: string;
  name: string;
  current_phase: PhaseCode;
  current_field_index: number;
  status: InspectionStatus;
  form_data?: any; // Raw JSON data in label-value format
  created_at?: string;
  updated_at?: string;
}

export interface InspectionResponse {
  id: string;
  user_id: string;
  inspection_name: string;
  phase: PhaseCode;
  field_appsheet_column: string;
  field_value: any;
  field_included: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface PhotoUpload {
  url: string;
  path: string;
  inspectionName: string;
  fieldColumn: string;
}
