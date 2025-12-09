import React from 'react';
import { useStore } from '@nanostores/react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { toast } from 'react-toastify';
import { authStore, clearAuth, setAuthLoading } from '~/lib/stores/auth';
import { authService } from '~/lib/supabase/auth';
import { classNames } from '~/utils/classNames';

export function UserMenu() {
  const { user, isAuthenticated } = useStore(authStore);

  if (!isAuthenticated || !user) {
    return null;
  }

  const handleSignOut = async () => {
    setAuthLoading(true);
    
    try {
      const { error } = await authService.signOut();
      
      if (error) {
        toast.error('Failed to sign out');
        return;
      }

      clearAuth();
      toast.success('Signed out successfully');
    } catch (error) {
      console.error('Sign out error:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setAuthLoading(false);
    }
  };

  const displayName = user.full_name || user.username || user.email.split('@')[0];
  const initials = displayName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          className={classNames(
            'flex items-center gap-2 px-3 py-2 rounded-lg',
            'hover:bg-gray-100 dark:hover:bg-gray-800',
            'transition-colors',
            'focus:outline-none focus:ring-2 focus:ring-blue-500'
          )}
        >
          {user.avatar_url ? (
            <img
              src={user.avatar_url}
              alt={displayName}
              className="w-8 h-8 rounded-full object-cover"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-medium text-sm">
              {initials}
            </div>
          )}
          <span className="text-sm font-medium text-gray-900 dark:text-white hidden md:block">
            {displayName}
          </span>
          <div className="i-ph:caret-down text-gray-500 dark:text-gray-400 hidden md:block" />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className={classNames(
            'min-w-[220px] bg-white dark:bg-gray-900',
            'rounded-lg shadow-lg border border-gray-200 dark:border-gray-700',
            'p-1 z-50'
          )}
          sideOffset={5}
          align="end"
        >
          <div className="px-3 py-2 border-b border-gray-200 dark:border-gray-700">
            <div className="text-sm font-medium text-gray-900 dark:text-white">
              {displayName}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
              {user.email}
            </div>
          </div>

          <DropdownMenu.Item
            className={classNames(
              'flex items-center gap-2 px-3 py-2 rounded-md',
              'text-sm text-gray-700 dark:text-gray-300',
              'hover:bg-gray-100 dark:hover:bg-gray-800',
              'cursor-pointer outline-none',
              'transition-colors'
            )}
          >
            <div className="i-ph:user text-lg" />
            Profile
          </DropdownMenu.Item>

          <DropdownMenu.Item
            className={classNames(
              'flex items-center gap-2 px-3 py-2 rounded-md',
              'text-sm text-gray-700 dark:text-gray-300',
              'hover:bg-gray-100 dark:hover:bg-gray-800',
              'cursor-pointer outline-none',
              'transition-colors'
            )}
          >
            <div className="i-ph:folder text-lg" />
            My Projects
          </DropdownMenu.Item>

          <DropdownMenu.Separator className="h-px bg-gray-200 dark:bg-gray-700 my-1" />

          <DropdownMenu.Item
            onSelect={handleSignOut}
            className={classNames(
              'flex items-center gap-2 px-3 py-2 rounded-md',
              'text-sm text-red-600 dark:text-red-400',
              'hover:bg-red-50 dark:hover:bg-red-900/20',
              'cursor-pointer outline-none',
              'transition-colors'
            )}
          >
            <div className="i-ph:sign-out text-lg" />
            Sign out
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}

