import { useState } from 'react';
import { useStore } from '@nanostores/react';
import { ClientOnly } from 'remix-utils/client-only';
import { chatStore } from '~/lib/stores/chat';
import { authStore } from '~/lib/stores/auth';
import { classNames } from '~/utils/classNames';
import { HeaderActionButtons } from './HeaderActionButtons.client';
import { ChatDescription } from '~/lib/persistence/ChatDescription.client';
import { AuthDialog } from '../auth/AuthDialog';
import { UserMenu } from '../auth/UserMenu';

export function Header() {
  const chat = useStore(chatStore);
  const { isAuthenticated, isLoading } = useStore(authStore);
  const [showAuthDialog, setShowAuthDialog] = useState(false);

  return (
    <header
      className={classNames('flex items-center px-4 border-b h-[var(--header-height)]', {
        'border-transparent': !chat.started,
        'border-bolt-elements-borderColor': chat.started,
      })}
    >
      <div className="flex items-center gap-2 z-logo text-bolt-elements-textPrimary cursor-pointer">
        <div className="i-ph:sidebar-simple-duotone text-xl" />
        <a href="/" className="text-2xl font-semibold text-gray-950 dark:text-white flex items-center gap-2">
          <span className="text-xl">{"</>"}</span>
          <span>Syntax Stage</span>
        </a>
      </div>
      {chat.started && ( // Display ChatDescription and HeaderActionButtons only when the chat has started.
        <>
          <span className="flex-1 px-4 truncate text-center text-bolt-elements-textPrimary">
            <ClientOnly>{() => <ChatDescription />}</ClientOnly>
          </span>
          <ClientOnly>
            {() => (
              <div className="flex items-center gap-2">
                <HeaderActionButtons chatStarted={chat.started} />
              </div>
            )}
          </ClientOnly>
        </>
      )}
      
      {/* Auth Section */}
      {!chat.started && <div className="flex-1" />}
      <ClientOnly>
        {() => (
          <div className="flex items-center gap-2">
            {!isLoading && (
              <>
                {isAuthenticated ? (
                  <UserMenu />
                ) : (
                  <button
                    onClick={() => setShowAuthDialog(true)}
                    className={classNames(
                      'px-4 py-2 rounded-lg font-medium',
                      'bg-blue-500 hover:bg-blue-600 text-white',
                      'transition-colors'
                    )}
                  >
                    Sign in
                  </button>
                )}
              </>
            )}
            <AuthDialog
              isOpen={showAuthDialog}
              onClose={() => setShowAuthDialog(false)}
              initialMode="login"
            />
          </div>
        )}
      </ClientOnly>
    </header>
  );
}
