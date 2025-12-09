import { getSupabaseClient } from './client';
import type { Database } from '~/types/supabase-database';

type Project = Database['public']['Tables']['projects']['Row'];
type ProjectInsert = Database['public']['Tables']['projects']['Insert'];
type ProjectUpdate = Database['public']['Tables']['projects']['Update'];

type Chat = Database['public']['Tables']['chats']['Row'];
type ChatInsert = Database['public']['Tables']['chats']['Insert'];
type ChatUpdate = Database['public']['Tables']['chats']['Update'];

type File = Database['public']['Tables']['files']['Row'];
type FileInsert = Database['public']['Tables']['files']['Insert'];
type FileUpdate = Database['public']['Tables']['files']['Update'];

export class StorageService {
  private client = getSupabaseClient();

  // ============= Projects =============

  async createProject(data: Omit<ProjectInsert, 'id' | 'created_at' | 'updated_at'>): Promise<{ project: Project | null; error: Error | null }> {
    if (!this.client) {
      return { project: null, error: new Error('Supabase client not initialized') };
    }

    try {
      const { data: project, error } = await this.client
        .from('projects')
        .insert(data)
        .select()
        .single();

      if (error) {
        return { project: null, error };
      }

      return { project, error: null };
    } catch (error) {
      return { project: null, error: error as Error };
    }
  }

  async getProject(projectId: string): Promise<{ project: Project | null; error: Error | null }> {
    if (!this.client) {
      return { project: null, error: new Error('Supabase client not initialized') };
    }

    try {
      const { data: project, error } = await this.client
        .from('projects')
        .select('*')
        .eq('id', projectId)
        .single();

      if (error) {
        return { project: null, error };
      }

      return { project, error: null };
    } catch (error) {
      return { project: null, error: error as Error };
    }
  }

  async getUserProjects(userId: string): Promise<{ projects: Project[]; error: Error | null }> {
    if (!this.client) {
      return { projects: [], error: new Error('Supabase client not initialized') };
    }

    try {
      const { data: projects, error } = await this.client
        .from('projects')
        .select('*')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false });

      if (error) {
        return { projects: [], error };
      }

      return { projects: projects || [], error: null };
    } catch (error) {
      return { projects: [], error: error as Error };
    }
  }

  async updateProject(projectId: string, updates: ProjectUpdate): Promise<{ project: Project | null; error: Error | null }> {
    if (!this.client) {
      return { project: null, error: new Error('Supabase client not initialized') };
    }

    try {
      const { data: project, error } = await this.client
        .from('projects')
        .update(updates)
        .eq('id', projectId)
        .select()
        .single();

      if (error) {
        return { project: null, error };
      }

      return { project, error: null };
    } catch (error) {
      return { project: null, error: error as Error };
    }
  }

  async deleteProject(projectId: string): Promise<{ error: Error | null }> {
    if (!this.client) {
      return { error: new Error('Supabase client not initialized') };
    }

    try {
      const { error } = await this.client
        .from('projects')
        .delete()
        .eq('id', projectId);

      return { error };
    } catch (error) {
      return { error: error as Error };
    }
  }

  // ============= Chats =============

  async createChat(data: Omit<ChatInsert, 'id' | 'created_at' | 'updated_at'>): Promise<{ chat: Chat | null; error: Error | null }> {
    if (!this.client) {
      return { chat: null, error: new Error('Supabase client not initialized') };
    }

    try {
      const { data: chat, error } = await this.client
        .from('chats')
        .insert(data)
        .select()
        .single();

      if (error) {
        return { chat: null, error };
      }

      return { chat, error: null };
    } catch (error) {
      return { chat: null, error: error as Error };
    }
  }

  async getChat(chatId: string): Promise<{ chat: Chat | null; error: Error | null }> {
    if (!this.client) {
      return { chat: null, error: new Error('Supabase client not initialized') };
    }

    try {
      const { data: chat, error } = await this.client
        .from('chats')
        .select('*')
        .eq('id', chatId)
        .single();

      if (error) {
        return { chat: null, error };
      }

      return { chat, error: null };
    } catch (error) {
      return { chat: null, error: error as Error };
    }
  }

  async getProjectChats(projectId: string): Promise<{ chats: Chat[]; error: Error | null }> {
    if (!this.client) {
      return { chats: [], error: new Error('Supabase client not initialized') };
    }

    try {
      const { data: chats, error } = await this.client
        .from('chats')
        .select('*')
        .eq('project_id', projectId)
        .order('updated_at', { ascending: false });

      if (error) {
        return { chats: [], error };
      }

      return { chats: chats || [], error: null };
    } catch (error) {
      return { chats: [], error: error as Error };
    }
  }

  async updateChat(chatId: string, updates: ChatUpdate): Promise<{ chat: Chat | null; error: Error | null }> {
    if (!this.client) {
      return { chat: null, error: new Error('Supabase client not initialized') };
    }

    try {
      const { data: chat, error } = await this.client
        .from('chats')
        .update(updates)
        .eq('id', chatId)
        .select()
        .single();

      if (error) {
        return { chat: null, error };
      }

      return { chat, error: null };
    } catch (error) {
      return { chat: null, error: error as Error };
    }
  }

  async deleteChat(chatId: string): Promise<{ error: Error | null }> {
    if (!this.client) {
      return { error: new Error('Supabase client not initialized') };
    }

    try {
      const { error } = await this.client
        .from('chats')
        .delete()
        .eq('id', chatId);

      return { error };
    } catch (error) {
      return { error: error as Error };
    }
  }

  // ============= Files =============

  async saveFile(data: Omit<FileInsert, 'id' | 'created_at' | 'updated_at'>): Promise<{ file: File | null; error: Error | null }> {
    if (!this.client) {
      return { file: null, error: new Error('Supabase client not initialized') };
    }

    try {
      // Upsert file (insert or update if exists)
      const { data: file, error } = await this.client
        .from('files')
        .upsert(data, {
          onConflict: 'project_id,path',
        })
        .select()
        .single();

      if (error) {
        return { file: null, error };
      }

      return { file, error: null };
    } catch (error) {
      return { file: null, error: error as Error };
    }
  }

  async getProjectFiles(projectId: string): Promise<{ files: File[]; error: Error | null }> {
    if (!this.client) {
      return { files: [], error: new Error('Supabase client not initialized') };
    }

    try {
      const { data: files, error } = await this.client
        .from('files')
        .select('*')
        .eq('project_id', projectId);

      if (error) {
        return { files: [], error };
      }

      return { files: files || [], error: null };
    } catch (error) {
      return { files: [], error: error as Error };
    }
  }

  async deleteFile(fileId: string): Promise<{ error: Error | null }> {
    if (!this.client) {
      return { error: new Error('Supabase client not initialized') };
    }

    try {
      const { error } = await this.client
        .from('files')
        .delete()
        .eq('id', fileId);

      return { error };
    } catch (error) {
      return { error: error as Error };
    }
  }

  async deleteProjectFiles(projectId: string): Promise<{ error: Error | null }> {
    if (!this.client) {
      return { error: new Error('Supabase client not initialized') };
    }

    try {
      const { error } = await this.client
        .from('files')
        .delete()
        .eq('project_id', projectId);

      return { error };
    } catch (error) {
      return { error: error as Error };
    }
  }
}

export const storageService = new StorageService();

