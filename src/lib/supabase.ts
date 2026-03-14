import { supabase } from '@/integrations/supabase/client';
import type { PhaseCode, UADField, PhaseMetadata, Inspection, InspectionResponse } from '@/types/inspection';
import { getFieldsByPhase, getFieldsFromSchema, getAllPhases } from '@/data/schemaAdapter';

export { supabase };

export const db = {
  fields: {
    getByPhase: async (phase: PhaseCode): Promise<UADField[]> => {
      // Use local schema data instead of Supabase
      return Promise.resolve(getFieldsByPhase(phase));
    },
    getAll: async (): Promise<UADField[]> => {
      // Use local schema data instead of Supabase
      return Promise.resolve(getFieldsFromSchema());
    },
  },

  phases: {
    getAll: async (): Promise<PhaseMetadata[]> => {
      // Use local schema data instead of Supabase
      return Promise.resolve(getAllPhases());
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
      return (data || []) as unknown as Inspection[];
    },
    getByUserAndName: async (userId: string, name: string): Promise<Inspection | null> => {
      const { data, error } = await supabase
        .from('inspections')
        .select('*')
        .eq('user_id', userId)
        .eq('name', name)
        .single();
      if (error && error.code !== 'PGRST116') throw error; // PGRST116 = not found
      return data as unknown as Inspection | null;
    },
    create: async (inspection: Partial<Inspection>): Promise<Inspection> => {
      const { data, error } = await supabase
        .from('inspections')
        .insert(inspection as any)
        .select()
        .single();
      if (error) throw error;
      return data as unknown as Inspection;
    },
    update: async (id: string, updates: Partial<Inspection>): Promise<void> => {
      const { error } = await supabase
        .from('inspections')
        .update(updates as any)
        .eq('id', id);
      if (error) throw error;
    },
    updateFormData: async (userId: string, name: string, formData: any): Promise<void> => {
      const { error } = await supabase
        .from('inspections')
        .update({
          form_data: formData,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId)
        .eq('name', name);
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
      return (data || []) as unknown as InspectionResponse[];
    },
    upsert: async (response: Partial<InspectionResponse>): Promise<void> => {
      const { error } = await supabase
        .from('inspection_responses')
        .upsert(response as any, {
          onConflict: 'user_id,inspection_name,field_appsheet_column',
        });
      if (error) throw error;
    },
    upsertBatch: async (responses: Partial<InspectionResponse>[]): Promise<void> => {
      const { error } = await supabase
        .from('inspection_responses')
        .upsert(responses as any, {
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
