import React, { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { motion, AnimatePresence } from 'framer-motion';
import { LoginForm } from './LoginForm';
import { SignUpForm } from './SignUpForm';
import { classNames } from '~/utils/classNames';

interface AuthDialogProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'signup';
}

export function AuthDialog({ isOpen, onClose, initialMode = 'login' }: AuthDialogProps) {
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-md z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="bg-white dark:bg-gray-900 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden"
          >
            <div className="p-6">
              <Dialog.Title className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {mode === 'login' ? 'Welcome back' : 'Create your account'}
              </Dialog.Title>
              <Dialog.Description className="text-gray-600 dark:text-gray-400 mb-6">
                {mode === 'login'
                  ? 'Sign in to access your projects and continue coding'
                  : 'Join Syntax Stage and start building amazing projects'}
              </Dialog.Description>

              <AnimatePresence mode="wait">
                {mode === 'login' ? (
                  <LoginForm
                    key="login"
                    onSuccess={onClose}
                    onSwitchToSignUp={() => setMode('signup')}
                  />
                ) : (
                  <SignUpForm
                    key="signup"
                    onSuccess={onClose}
                    onSwitchToLogin={() => setMode('login')}
                  />
                )}
              </AnimatePresence>
            </div>

            <Dialog.Close asChild>
              <button
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="Close"
              >
                <div className="i-ph:x text-xl text-gray-500 dark:text-gray-400" />
              </button>
            </Dialog.Close>
          </motion.div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

