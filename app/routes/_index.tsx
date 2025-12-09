import { json, type MetaFunction } from '@remix-run/cloudflare';
import { ClientOnly } from 'remix-utils/client-only';
import { BaseChat } from '~/components/chat/BaseChat';
import { Chat } from '~/components/chat/Chat.client';
import { Header } from '~/components/header/Header';
import { ProtectedRoute } from '~/components/auth/ProtectedRoute';
import BackgroundRays from '~/components/ui/BackgroundRays';

export const meta: MetaFunction = () => {
  return [{ title: 'Syntax Stage' }, { name: 'description', content: 'Your Complete Web Development Playground' }];
};

export const loader = () => json({});

/**
 * Landing page component for Syntax Stage
 * Note: Settings functionality should ONLY be accessed through the sidebar menu.
 * Do not add settings button/panel to this landing page as it was intentionally removed
 * to keep the UI clean and consistent with the design system.
 * 
 * This page is now protected and requires authentication.
 */
export default function Index() {
  return (
    <ProtectedRoute>
      <div className="flex flex-col h-full w-full bg-bolt-elements-background-depth-1">
        <BackgroundRays />
        <Header />
        <ClientOnly fallback={<BaseChat />}>{() => <Chat />}</ClientOnly>
      </div>
    </ProtectedRoute>
  );
}
