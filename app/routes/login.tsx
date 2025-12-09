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
    { title: 'Login - Syntax Stage' },
    { name: 'description', content: 'Sign in to your Syntax Stage account' },
  ];
};

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    setAuthLoading(true);

    try {
      const { user, error } = await authService.signIn({ email, password });

      if (error) {
        toast.error(error.message || 'Failed to sign in');
        return;
      }

      if (user) {
        setAuthUser(user);
        toast.success('Welcome back!');
        navigate('/');
      }
    } catch (error) {
      console.error('Login error:', error);
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
            Sign in to your account
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Email Address
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

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Password
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
                  autoComplete="current-password"
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

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-gray-300 dark:border-gray-700 text-red-500 focus:ring-2 focus:ring-red-500"
                />
                <span className="text-gray-700 dark:text-gray-300">Remember me</span>
              </label>
              <button
                type="button"
                className="text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 font-medium"
              >
                Forgot password?
              </button>
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
                'shadow-lg shadow-red-500/25 hover:shadow-xl hover:shadow-red-500/30'
              )}
            >
              {isLoading ? (
                <>
                  <div className="i-svg-spinners:90-ring-with-bg text-xl" />
                  Signing in...
                </>
              ) : (
                <>
                  <div className="i-ph:sign-in text-xl" />
                  Sign In
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
                Don't have an account?
              </span>
            </div>
          </div>

          {/* Sign Up Link */}
          <a
            href="/signup"
            className={classNames(
              'block w-full py-3.5 px-4 rounded-lg font-semibold text-base text-center',
              'border-2 border-gray-300 dark:border-gray-700',
              'text-gray-700 dark:text-gray-300',
              'hover:bg-gray-50 dark:hover:bg-gray-800',
              'transition-colors duration-200'
            )}
          >
            Create Account
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

