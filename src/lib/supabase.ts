import { supabase } from '@/integrations/supabase/client';
import type { PhaseCode, UADField, PhaseMetadata, Inspection, InspectionResponse } from '@/types/inspection';

export { supabase };

export const db = {
  fields: {
    getByPhase: async (phase: PhaseCode): Promise<UADField[]> => {
      const { data, error } = await supabase
        .from('uad_fields')
        .select('*')
        .eq('phase', phase)
        .order('field_num');
      if (error) throw error;
      return data || [];
    },
    getAll: async (): Promise<UADField[]> => {
      const { data, error } = await supabase
        .from('uad_fields')
        .select('*')
        .order('phase, field_num');
      if (error) throw error;
      return data || [];
    },
  },

  phases: {
    getAll: async (): Promise<PhaseMetadata[]> => {
      const { data, error } = await supabase
        .from('uad_phases')
        .select('*')
        .order('display_order');
      if (error) throw error;
      return data || [];
    },
  },

  inspections: {
    getByUser: async (userId: string): Promise<Inspection[]> => {
      const { data, error } = await supabase
        .from('inspections')
        .select('*')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false });
      if (error) throw error;
      return data || [];
    },
    create: async (inspection: Partial<Inspection>): Promise<Inspection> => {
      const { data, error } = await supabase
        .from('inspections')
        .insert(inspection)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    update: async (id: string, updates: Partial<Inspection>): Promise<void> => {
      const { error } = await supabase
        .from('inspections')
        .update(updates)
        .eq('id', id);
      if (error) throw error;
    },
    delete: async (id: string): Promise<void> => {
      const { error } = await supabase
        .from('inspections')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
  },

  responses: {
    getByInspection: async (userId: string, inspectionName: string): Promise<InspectionResponse[]> => {
      const { data, error } = await supabase
        .from('inspection_responses')
        .select('*')
        .eq('user_id', userId)
        .eq('inspection_name', inspectionName);
      if (error) throw error;
      return data || [];
    },
    upsert: async (response: Partial<InspectionResponse>): Promise<void> => {
      const { error } = await supabase
        .from('inspection_responses')
        .upsert(response, {
          onConflict: 'user_id,inspection_name,field_appsheet_column',
        });
      if (error) throw error;
    },
    upsertBatch: async (responses: Partial<InspectionResponse>[]): Promise<void> => {
      const { error } = await supabase
        .from('inspection_responses')
        .upsert(responses, {
          onConflict: 'user_id,inspection_name,field_appsheet_column',
        });
      if (error) throw error;
    },
  },

  storage: {
    uploadPhoto: async (
      userId: string,
      inspectionName: string,
      fieldColumn: string,
      file: File
    ): Promise<string> => {
      const fileName = `${userId}/${inspectionName}/${fieldColumn}/${Date.now()}_${file.name}`;
      const { error } = await supabase.storage
        .from('inspection-photos')
        .upload(fileName, file);
      if (error) throw error;
      const { data } = supabase.storage
        .from('inspection-photos')
        .getPublicUrl(fileName);
      return data.publicUrl;
    },
    deletePhoto: async (filePath: string): Promise<void> => {
      const { error } = await supabase.storage
        .from('inspection-photos')
        .remove([filePath]);
      if (error) throw error;
    },
  },
};
