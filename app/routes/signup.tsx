import { useState } from 'react';
import { useNavigate } from '@remix-run/react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { authService } from '~/lib/supabase/auth';
import { setAuthUser, setAuthLoading } from '~/lib/stores/auth';
import { classNames } from '~/utils/classNames';
import type { MetaFunction } from '@remix-run/cloudflare';

export const meta: MetaFunction = () => {
  return [
    { title: 'Sign Up - Syntax Stage' },
    { name: 'description', content: 'Create your Syntax Stage account' },
  ];
};

export default function SignUp() {
  const navigate = useNavigate();
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
        navigate('/');
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <a href="/" className="inline-flex items-center gap-2 text-4xl font-bold text-gray-950 dark:text-white mb-2">
            <span className="text-3xl">{"</>"}</span>
            <span>Syntax Stage</span>
          </a>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Create your account
          </p>
        </div>

        {/* Sign Up Card */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={classNames(
                  'w-full px-4 py-3 rounded-lg border-2 bg-white dark:bg-gray-800',
                  'border-gray-300 dark:border-gray-700',
                  'text-gray-900 dark:text-white',
                  'placeholder-gray-500 dark:placeholder-gray-400',
                  'focus:outline-none focus:border-red-500 dark:focus:border-red-400',
                  'transition-colors text-base'
                )}
                placeholder="your@email.com"
                disabled={isLoading}
                required
                autoComplete="email"
                autoFocus
              />
            </div>

            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="username" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className={classNames(
                    'w-full px-4 py-3 rounded-lg border-2 bg-white dark:bg-gray-800',
                    'border-gray-300 dark:border-gray-700',
                    'text-gray-900 dark:text-white',
                    'placeholder-gray-500 dark:placeholder-gray-400',
                    'focus:outline-none focus:border-red-500 dark:focus:border-red-400',
                    'transition-colors text-base'
                  )}
                  placeholder="username"
                  disabled={isLoading}
                />
              </div>
              <div>
                <label htmlFor="fullName" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Full Name
                </label>
                <input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className={classNames(
                    'w-full px-4 py-3 rounded-lg border-2 bg-white dark:bg-gray-800',
                    'border-gray-300 dark:border-gray-700',
                    'text-gray-900 dark:text-white',
                    'placeholder-gray-500 dark:placeholder-gray-400',
                    'focus:outline-none focus:border-red-500 dark:focus:border-red-400',
                    'transition-colors text-base'
                  )}
                  placeholder="John Doe"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={classNames(
                    'w-full px-4 py-3 pr-12 rounded-lg border-2 bg-white dark:bg-gray-800',
                    'border-gray-300 dark:border-gray-700',
                    'text-gray-900 dark:text-white',
                    'placeholder-gray-500 dark:placeholder-gray-400',
                    'focus:outline-none focus:border-red-500 dark:focus:border-red-400',
                    'transition-colors text-base'
                  )}
                  placeholder="••••••••"
                  disabled={isLoading}
                  required
                  autoComplete="new-password"
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                  tabIndex={-1}
                >
                  <div className={classNames('text-xl', showPassword ? 'i-ph:eye-slash' : 'i-ph:eye')} />
                </button>
              </div>
            </div>

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Confirm Password <span className="text-red-500">*</span>
              </label>
              <input
                id="confirmPassword"
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={classNames(
                  'w-full px-4 py-3 rounded-lg border-2 bg-white dark:bg-gray-800',
                  'border-gray-300 dark:border-gray-700',
                  'text-gray-900 dark:text-white',
                  'placeholder-gray-500 dark:placeholder-gray-400',
                  'focus:outline-none focus:border-red-500 dark:focus:border-red-400',
                  'transition-colors text-base'
                )}
                placeholder="••••••••"
                disabled={isLoading}
                required
                autoComplete="new-password"
                minLength={6}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={classNames(
                'w-full py-3.5 px-4 rounded-lg font-semibold text-base',
                'bg-red-500 hover:bg-red-600 text-white',
                'disabled:opacity-50 disabled:cursor-not-allowed',
                'transition-all duration-200',
                'flex items-center justify-center gap-2',
                'shadow-lg shadow-red-500/25 hover:shadow-xl hover:shadow-red-500/30',
                'mt-6'
              )}
            >
              {isLoading ? (
                <>
                  <div className="i-svg-spinners:90-ring-with-bg text-xl" />
                  Creating account...
                </>
              ) : (
                <>
                  <div className="i-ph:user-plus text-xl" />
                  Create Account
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 dark:border-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400">
                Already have an account?
              </span>
            </div>
          </div>

          {/* Login Link */}
          <a
            href="/login"
            className={classNames(
              'block w-full py-3.5 px-4 rounded-lg font-semibold text-base text-center',
              'border-2 border-gray-300 dark:border-gray-700',
              'text-gray-700 dark:text-gray-300',
              'hover:bg-gray-50 dark:hover:bg-gray-800',
              'transition-colors duration-200'
            )}
          >
            Sign In
          </a>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <a
            href="/"
            className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors text-sm flex items-center justify-center gap-2"
          >
            <div className="i-ph:arrow-left" />
            Back to Home
          </a>
        </div>
      </motion.div>
    </div>
  );
}

