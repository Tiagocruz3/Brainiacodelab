import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { authService } from '~/lib/supabase/auth';
import { setAuthUser, setAuthLoading } from '~/lib/stores/auth';
import { classNames } from '~/utils/classNames';

interface SignUpFormProps {
  onSuccess: () => void;
  onSwitchToLogin: () => void;
}

export function SignUpForm({ onSuccess, onSwitchToLogin }: SignUpFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password || !confirmPassword) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);
    setAuthLoading(true);

    try {
      const { user, error } = await authService.signUp({
        email,
        password,
        username: username || undefined,
        full_name: fullName || undefined,
      });

      if (error) {
        toast.error(error.message || 'Failed to create account');
        return;
      }

      if (user) {
        setAuthUser(user);
        toast.success('Account created successfully! Welcome to Syntax Stage!');
        onSuccess();
      }
    } catch (error) {
      console.error('Sign up error:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setIsLoading(false);
      setAuthLoading(false);
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      onSubmit={handleSubmit}
      className="space-y-4"
    >
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Email *
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={classNames(
            'w-full px-4 py-2 rounded-lg border bg-white dark:bg-gray-800',
            'border-gray-300 dark:border-gray-700',
            'text-gray-900 dark:text-white',
            'placeholder-gray-500 dark:placeholder-gray-400',
            'focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400',
            'transition-colors'
          )}
          placeholder="your@email.com"
          disabled={isLoading}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Username
          </label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className={classNames(
              'w-full px-4 py-2 rounded-lg border bg-white dark:bg-gray-800',
              'border-gray-300 dark:border-gray-700',
              'text-gray-900 dark:text-white',
              'placeholder-gray-500 dark:placeholder-gray-400',
              'focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400',
              'transition-colors'
            )}
            placeholder="username"
            disabled={isLoading}
          />
        </div>

        <div>
          <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Full Name
          </label>
          <input
            id="fullName"
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className={classNames(
              'w-full px-4 py-2 rounded-lg border bg-white dark:bg-gray-800',
              'border-gray-300 dark:border-gray-700',
              'text-gray-900 dark:text-white',
              'placeholder-gray-500 dark:placeholder-gray-400',
              'focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400',
              'transition-colors'
            )}
            placeholder="John Doe"
            disabled={isLoading}
          />
        </div>
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Password *
        </label>
        <div className="relative">
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={classNames(
              'w-full px-4 py-2 pr-10 rounded-lg border bg-white dark:bg-gray-800',
              'border-gray-300 dark:border-gray-700',
              'text-gray-900 dark:text-white',
              'placeholder-gray-500 dark:placeholder-gray-400',
              'focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400',
              'transition-colors'
            )}
            placeholder="••••••••"
            disabled={isLoading}
            required
            minLength={6}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
          >
            <div className={classNames('text-xl', showPassword ? 'i-ph:eye-slash' : 'i-ph:eye')} />
          </button>
        </div>
      </div>

      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Confirm Password *
        </label>
        <input
          id="confirmPassword"
          type={showPassword ? 'text' : 'password'}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className={classNames(
            'w-full px-4 py-2 rounded-lg border bg-white dark:bg-gray-800',
            'border-gray-300 dark:border-gray-700',
            'text-gray-900 dark:text-white',
            'placeholder-gray-500 dark:placeholder-gray-400',
            'focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400',
            'transition-colors'
          )}
          placeholder="••••••••"
          disabled={isLoading}
          required
          minLength={6}
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className={classNames(
          'w-full py-2.5 px-4 rounded-lg font-medium',
          'bg-blue-500 hover:bg-blue-600 text-white',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          'transition-colors',
          'flex items-center justify-center gap-2'
        )}
      >
        {isLoading ? (
          <>
            <div className="i-svg-spinners:90-ring-with-bg text-lg" />
            Creating account...
          </>
        ) : (
          'Create account'
        )}
      </button>

      <div className="text-center text-sm text-gray-600 dark:text-gray-400">
        Already have an account?{' '}
        <button
          type="button"
          onClick={onSwitchToLogin}
          className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
        >
          Sign in
        </button>
      </div>
    </motion.form>
  );
}

