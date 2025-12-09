import { getSupabaseClient } from './client';
import type { User } from '@supabase/supabase-js';

export interface AuthUser {
  id: string;
  email: string;
  username?: string;
  avatar_url?: string;
  full_name?: string;
}

export interface SignUpData {
  email: string;
  password: string;
  username?: string;
  full_name?: string;
}

export interface SignInData {
  email: string;
  password: string;
}

export class AuthService {
  private client = getSupabaseClient();

  async signUp({ email, password, username, full_name }: SignUpData): Promise<{ user: AuthUser | null; error: Error | null }> {
    if (!this.client) {
      return { user: null, error: new Error('Supabase client not initialized') };
    }

    try {
      const { data, error } = await this.client.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
            full_name,
          },
        },
      });

      if (error) {
        return { user: null, error };
      }

      if (!data.user) {
        return { user: null, error: new Error('Failed to create user') };
      }

      // Fetch the profile to get additional data
      const profile = await this.getProfile(data.user.id);

      return {
        user: {
          id: data.user.id,
          email: data.user.email!,
          username: profile?.username ?? undefined,
          avatar_url: profile?.avatar_url ?? undefined,
          full_name: profile?.full_name ?? undefined,
        },
        error: null,
      };
    } catch (error) {
      return { user: null, error: error as Error };
    }
  }

  async signIn({ email, password }: SignInData): Promise<{ user: AuthUser | null; error: Error | null }> {
    if (!this.client) {
      return { user: null, error: new Error('Supabase client not initialized') };
    }

    try {
      const { data, error } = await this.client.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { user: null, error };
      }

      if (!data.user) {
        return { user: null, error: new Error('Failed to sign in') };
      }

      // Fetch the profile
      const profile = await this.getProfile(data.user.id);

      return {
        user: {
          id: data.user.id,
          email: data.user.email!,
          username: profile?.username ?? undefined,
          avatar_url: profile?.avatar_url ?? undefined,
          full_name: profile?.full_name ?? undefined,
        },
        error: null,
      };
    } catch (error) {
      return { user: null, error: error as Error };
    }
  }

  async signOut(): Promise<{ error: Error | null }> {
    if (!this.client) {
      return { error: new Error('Supabase client not initialized') };
    }

    try {
      const { error } = await this.client.auth.signOut();
      return { error };
    } catch (error) {
      return { error: error as Error };
    }
  }

  async getCurrentUser(): Promise<AuthUser | null> {
    if (!this.client) {
      return null;
    }

    try {
      const { data: { user } } = await this.client.auth.getUser();
      
      if (!user) {
        return null;
      }

      // Fetch the profile
      const profile = await this.getProfile(user.id);

      return {
        id: user.id,
        email: user.email!,
        username: profile?.username ?? undefined,
        avatar_url: profile?.avatar_url ?? undefined,
        full_name: profile?.full_name ?? undefined,
      };
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }

  async getSession() {
    if (!this.client) {
      return null;
    }

    try {
      const { data: { session } } = await this.client.auth.getSession();
      return session;
    } catch (error) {
      console.error('Error getting session:', error);
      return null;
    }
  }

  async updateProfile(userId: string, updates: Partial<Pick<AuthUser, 'username' | 'avatar_url' | 'full_name'>>) {
    if (!this.client) {
      return { error: new Error('Supabase client not initialized') };
    }

    try {
      const { error } = await this.client
        .from('profiles')
        .update(updates)
        .eq('id', userId);

      return { error };
    } catch (error) {
      return { error: error as Error };
    }
  }

  async resetPassword(email: string) {
    if (!this.client) {
      return { error: new Error('Supabase client not initialized') };
    }

    try {
      const { error } = await this.client.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/callback`,
      });

      return { error };
    } catch (error) {
      return { error: error as Error };
    }
  }

  private async getProfile(userId: string) {
    if (!this.client) {
      return null;
    }

    try {
      const { data, error } = await this.client
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
  }

  onAuthStateChange(callback: (user: AuthUser | null) => void) {
    if (!this.client) {
      return { data: { subscription: { unsubscribe: () => {} } } };
    }

    return this.client.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const profile = await this.getProfile(session.user.id);
        callback({
          id: session.user.id,
          email: session.user.email!,
          username: profile?.username ?? undefined,
          avatar_url: profile?.avatar_url ?? undefined,
          full_name: profile?.full_name ?? undefined,
        });
      } else {
        callback(null);
      }
    });
  }
}

export const authService = new AuthService();

