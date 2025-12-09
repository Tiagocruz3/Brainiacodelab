import { storageService } from '~/lib/supabase/storage';
import type { Message } from 'ai';
import type { ChatHistoryItem } from './useChatHistory';
import { authStore } from '~/lib/stores/auth';

export interface SyncOptions {
  projectId?: string;
  autoSync?: boolean;
}

export class SupabaseSync {
  private syncInProgress = false;
  private syncQueue: Array<() => Promise<void>> = [];

  /**
   * Save a chat to Supabase
   */
  async saveChat(
    chatId: string,
    messages: Message[],
    description: string,
    projectId?: string
  ): Promise<{ success: boolean; error?: Error }> {
    const { user, isAuthenticated } = authStore.get();

    if (!isAuthenticated || !user) {
      return { success: false, error: new Error('User not authenticated') };
    }

    try {
      // If no projectId provided, create a new project
      let targetProjectId = projectId;

      if (!targetProjectId) {
        const { project, error } = await storageService.createProject({
          user_id: user.id,
          name: description || 'Untitled Project',
          description: `Project created from chat ${chatId}`,
          is_public: false,
          metadata: {
            chatId,
            createdFrom: 'chat',
          },
        });

        if (error || !project) {
          return { success: false, error: error || new Error('Failed to create project') };
        }

        targetProjectId = project.id;
      }

      // Save the chat
      const { chat, error: chatError } = await storageService.createChat({
        project_id: targetProjectId,
        user_id: user.id,
        title: description || 'Untitled Chat',
        messages: messages as any, // Convert Message[] to Json
        metadata: {
          chatId,
          lastUpdated: new Date().toISOString(),
        },
      });

      if (chatError || !chat) {
        return { success: false, error: chatError || new Error('Failed to save chat') };
      }

      return { success: true };
    } catch (error) {
      console.error('Error saving chat to Supabase:', error);
      return { success: false, error: error as Error };
    }
  }

  /**
   * Load chats from Supabase for the current user
   */
  async loadUserChats(): Promise<{ chats: ChatHistoryItem[]; error?: Error }> {
    const { user, isAuthenticated } = authStore.get();

    if (!isAuthenticated || !user) {
      return { chats: [], error: new Error('User not authenticated') };
    }

    try {
      // Get all user projects
      const { projects, error: projectsError } = await storageService.getUserProjects(user.id);

      if (projectsError) {
        return { chats: [], error: projectsError };
      }

      // Get chats for all projects
      const allChats: ChatHistoryItem[] = [];

      for (const project of projects) {
        const { chats, error: chatsError } = await storageService.getProjectChats(project.id);

        if (chatsError) {
          console.error(`Error loading chats for project ${project.id}:`, chatsError);
          continue;
        }

        // Convert Supabase chats to ChatHistoryItem format
        const convertedChats = chats.map((chat) => ({
          id: chat.id,
          urlId: chat.metadata?.chatId as string || chat.id,
          description: chat.title,
          messages: chat.messages as any as Message[],
          timestamp: chat.created_at,
          metadata: {
            projectId: project.id,
            projectName: project.name,
            supabaseId: chat.id,
          },
        }));

        allChats.push(...convertedChats);
      }

      // Sort by timestamp (newest first)
      allChats.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

      return { chats: allChats };
    } catch (error) {
      console.error('Error loading chats from Supabase:', error);
      return { chats: [], error: error as Error };
    }
  }

  /**
   * Sync a chat - update if exists, create if not
   */
  async syncChat(
    chatId: string,
    messages: Message[],
    description: string,
    supabaseId?: string,
    projectId?: string
  ): Promise<{ success: boolean; error?: Error }> {
    const { user, isAuthenticated } = authStore.get();

    if (!isAuthenticated || !user) {
      return { success: false, error: new Error('User not authenticated') };
    }

    try {
      if (supabaseId) {
        // Update existing chat
        const { chat, error } = await storageService.updateChat(supabaseId, {
          title: description || 'Untitled Chat',
          messages: messages as any,
          metadata: {
            chatId,
            lastUpdated: new Date().toISOString(),
          },
        });

        if (error) {
          return { success: false, error };
        }

        return { success: true };
      } else {
        // Create new chat
        return this.saveChat(chatId, messages, description, projectId);
      }
    } catch (error) {
      console.error('Error syncing chat:', error);
      return { success: false, error: error as Error };
    }
  }

  /**
   * Delete a chat from Supabase
   */
  async deleteChat(supabaseId: string): Promise<{ success: boolean; error?: Error }> {
    const { isAuthenticated } = authStore.get();

    if (!isAuthenticated) {
      return { success: false, error: new Error('User not authenticated') };
    }

    try {
      const { error } = await storageService.deleteChat(supabaseId);

      if (error) {
        return { success: false, error };
      }

      return { success: true };
    } catch (error) {
      console.error('Error deleting chat from Supabase:', error);
      return { success: false, error: error as Error };
    }
  }

  /**
   * Queue a sync operation
   */
  private async queueSync(operation: () => Promise<void>) {
    this.syncQueue.push(operation);
    
    if (!this.syncInProgress) {
      await this.processSyncQueue();
    }
  }

  /**
   * Process the sync queue
   */
  private async processSyncQueue() {
    if (this.syncInProgress || this.syncQueue.length === 0) {
      return;
    }

    this.syncInProgress = true;

    while (this.syncQueue.length > 0) {
      const operation = this.syncQueue.shift();
      
      if (operation) {
        try {
          await operation();
        } catch (error) {
          console.error('Sync operation failed:', error);
        }
      }
    }

    this.syncInProgress = false;
  }

  /**
   * Auto-sync helper - queues sync operations
   */
  async autoSync(
    chatId: string,
    messages: Message[],
    description: string,
    metadata?: { supabaseId?: string; projectId?: string }
  ) {
    await this.queueSync(async () => {
      const result = await this.syncChat(
        chatId,
        messages,
        description,
        metadata?.supabaseId,
        metadata?.projectId
      );

      if (!result.success) {
        console.error('Auto-sync failed:', result.error);
      }
    });
  }
}

export const supabaseSync = new SupabaseSync();

