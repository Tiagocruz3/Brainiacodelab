import React, { useState } from 'react';
import { useStore } from '@nanostores/react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { authStore, setAuthUser } from '~/lib/stores/auth';
import { authService } from '~/lib/supabase/auth';
import { classNames } from '~/utils/classNames';

export function ProfileSettings() {
  const { user } = useStore(authStore);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    username: user?.username || '',
    full_name: user?.full_name || '',
    avatar_url: user?.avatar_url || '',
  });

  if (!user) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const { error } = await authService.updateProfile(user.id, {
        username: formData.username || undefined,
        full_name: formData.full_name || undefined,
        avatar_url: formData.avatar_url || undefined,
      });

      if (error) {
        toast.error(error.message || 'Failed to update profile');
        return;
      }

      // Update the auth store with new user data
      setAuthUser({
        ...user,
        ...formData,
      });

      toast.success('Profile updated successfully');
      setIsEditing(false);
    } catch (error) {
      console.error('Profile update error:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      username: user?.username || '',
      full_name: user?.full_name || '',
      avatar_url: user?.avatar_url || '',
    });
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Profile Settings</h2>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className={classNames(
              'px-4 py-2 rounded-lg text-sm font-medium',
              'bg-blue-500 hover:bg-blue-600 text-white',
              'transition-colors'
            )}
          >
            Edit Profile
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Avatar */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Avatar
          </label>
          <div className="flex items-center gap-4">
            {formData.avatar_url ? (
              <img
                src={formData.avatar_url}
                alt="Avatar"
                className="w-16 h-16 rounded-full object-cover"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-blue-500 text-white flex items-center justify-center text-2xl font-bold">
                {(user.full_name || user.email)[0].toUpperCase()}
              </div>
            )}
            {isEditing && (
              <input
                type="url"
                value={formData.avatar_url}
                onChange={(e) => setFormData({ ...formData, avatar_url: e.target.value })}
                className={classNames(
                  'flex-1 px-3 py-2 rounded-lg border bg-white dark:bg-gray-800',
                  'border-gray-300 dark:border-gray-700',
                  'text-gray-900 dark:text-white',
                  'placeholder-gray-500 dark:placeholder-gray-400',
                  'focus:outline-none focus:ring-2 focus:ring-blue-500'
                )}
                placeholder="https://example.com/avatar.jpg"
                disabled={isSaving}
              />
            )}
          </div>
        </div>

        {/* Email (read-only) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Email
          </label>
          <input
            type="email"
            value={user.email}
            disabled
            className={classNames(
              'w-full px-3 py-2 rounded-lg border bg-gray-50 dark:bg-gray-900',
              'border-gray-300 dark:border-gray-700',
              'text-gray-500 dark:text-gray-400',
              'cursor-not-allowed'
            )}
          />
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Email cannot be changed
          </p>
        </div>

        {/* Username */}
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Username
          </label>
          <input
            id="username"
            type="text"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            disabled={!isEditing || isSaving}
            className={classNames(
              'w-full px-3 py-2 rounded-lg border bg-white dark:bg-gray-800',
              'border-gray-300 dark:border-gray-700',
              'text-gray-900 dark:text-white',
              'placeholder-gray-500 dark:placeholder-gray-400',
              'focus:outline-none focus:ring-2 focus:ring-blue-500',
              'disabled:bg-gray-50 dark:disabled:bg-gray-900 disabled:cursor-not-allowed'
            )}
            placeholder="username"
          />
        </div>

        {/* Full Name */}
        <div>
          <label htmlFor="full_name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Full Name
          </label>
          <input
            id="full_name"
            type="text"
            value={formData.full_name}
            onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
            disabled={!isEditing || isSaving}
            className={classNames(
              'w-full px-3 py-2 rounded-lg border bg-white dark:bg-gray-800',
              'border-gray-300 dark:border-gray-700',
              'text-gray-900 dark:text-white',
              'placeholder-gray-500 dark:placeholder-gray-400',
              'focus:outline-none focus:ring-2 focus:ring-blue-500',
              'disabled:bg-gray-50 dark:disabled:bg-gray-900 disabled:cursor-not-allowed'
            )}
            placeholder="John Doe"
          />
        </div>

        {/* Action Buttons */}
        {isEditing && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-3 pt-4"
          >
            <button
              type="submit"
              disabled={isSaving}
              className={classNames(
                'flex-1 py-2.5 px-4 rounded-lg font-medium',
                'bg-blue-500 hover:bg-blue-600 text-white',
                'disabled:opacity-50 disabled:cursor-not-allowed',
                'transition-colors',
                'flex items-center justify-center gap-2'
              )}
            >
              {isSaving ? (
                <>
                  <div className="i-svg-spinners:90-ring-with-bg text-lg" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              disabled={isSaving}
              className={classNames(
                'flex-1 py-2.5 px-4 rounded-lg font-medium',
                'bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600',
                'text-gray-900 dark:text-white',
                'disabled:opacity-50 disabled:cursor-not-allowed',
                'transition-colors'
              )}
            >
              Cancel
            </button>
          </motion.div>
        )}
      </form>

      {/* Account Info */}
      <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
        <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Account Information</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500 dark:text-gray-400">User ID:</span>
            <span className="text-gray-900 dark:text-white font-mono text-xs">{user.id.slice(0, 8)}...</span>
          </div>
        </div>
      </div>
    </div>
  );
}

