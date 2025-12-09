# Supabase Integration Setup Guide

This guide will help you set up Supabase authentication and project storage for Syntax Stage.

## Prerequisites

- A Supabase account (sign up at [supabase.com](https://supabase.com))
- Node.js and pnpm installed

## Step 1: Create a Supabase Project

1. Go to [app.supabase.com](https://app.supabase.com)
2. Click "New Project"
3. Fill in your project details:
   - **Name**: Syntax Stage (or any name you prefer)
   - **Database Password**: Create a strong password
   - **Region**: Choose the region closest to your users
4. Click "Create new project"

## Step 2: Set Up the Database Schema

1. In your Supabase project dashboard, go to the **SQL Editor**
2. Copy the contents of `supabase-schema.sql` from the project root
3. Paste it into the SQL Editor
4. Click "Run" to execute the SQL

This will create:
- `profiles` table for user information
- `projects` table for storing projects
- `chats` table for storing chat history
- `files` table for storing project files
- Row Level Security (RLS) policies for data protection
- Automatic triggers for profile creation and timestamp updates

## Step 3: Configure Authentication

1. In your Supabase project dashboard, go to **Authentication > Providers**
2. Enable **Email** provider (it's enabled by default)
3. Configure email templates (optional):
   - Go to **Authentication > Email Templates**
   - Customize the confirmation, recovery, and magic link emails

### Optional: Enable Additional Auth Providers

You can also enable social authentication:
- Google OAuth
- GitHub OAuth
- And more...

## Step 4: Get Your API Keys

1. Go to **Project Settings > API**
2. Copy the following values:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon public** key

## Step 5: Configure Environment Variables

Create or update your `.env.local` file in the project root:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

**Important**: Never commit these keys to version control!

## Step 6: Test the Integration

1. Start your development server:
   ```bash
   pnpm dev
   ```

2. Open the app in your browser
3. Click the "Sign in" button in the header
4. Create a new account using the sign-up form
5. Check your email for the confirmation link (if email confirmation is enabled)
6. Sign in with your credentials

## Features

### User Authentication
- ✅ Email/password registration
- ✅ Email/password login
- ✅ Automatic profile creation
- ✅ Session persistence
- ✅ Password reset
- ✅ Secure authentication with RLS

### Project Storage
- ✅ Save projects to Supabase
- ✅ Store chat history
- ✅ Store project files
- ✅ User-specific data isolation
- ✅ Public/private projects

## Database Schema Overview

### Tables

#### `profiles`
Stores user profile information:
- `id` (UUID, primary key, references auth.users)
- `email` (text, not null)
- `username` (text, unique)
- `avatar_url` (text)
- `full_name` (text)
- `created_at`, `updated_at` (timestamps)

#### `projects`
Stores user projects:
- `id` (UUID, primary key)
- `user_id` (UUID, references profiles)
- `name` (text, not null)
- `description` (text)
- `is_public` (boolean, default false)
- `metadata` (JSONB)
- `created_at`, `updated_at` (timestamps)

#### `chats`
Stores chat conversations:
- `id` (UUID, primary key)
- `project_id` (UUID, references projects)
- `user_id` (UUID, references profiles)
- `title` (text, not null)
- `messages` (JSONB, default [])
- `metadata` (JSONB)
- `created_at`, `updated_at` (timestamps)

#### `files`
Stores project files:
- `id` (UUID, primary key)
- `project_id` (UUID, references projects)
- `user_id` (UUID, references profiles)
- `path` (text, not null)
- `content` (text, not null)
- `size` (integer, not null)
- `metadata` (JSONB)
- `created_at`, `updated_at` (timestamps)
- Unique constraint on (`project_id`, `path`)

## Security

### Row Level Security (RLS)

All tables have RLS enabled with the following policies:

**Profiles:**
- Users can view and update their own profile

**Projects:**
- Users can create, view, update, and delete their own projects
- Anyone can view public projects

**Chats:**
- Users can access chats in their own projects
- Users can view chats in public projects

**Files:**
- Users can access files in their own projects
- Users can view files in public projects

## API Usage Examples

### Authentication

```typescript
import { authService } from '~/lib/supabase/auth';

// Sign up
const { user, error } = await authService.signUp({
  email: 'user@example.com',
  password: 'securePassword123',
  username: 'username',
  full_name: 'John Doe',
});

// Sign in
const { user, error } = await authService.signIn({
  email: 'user@example.com',
  password: 'securePassword123',
});

// Sign out
await authService.signOut();

// Get current user
const user = await authService.getCurrentUser();
```

### Storage

```typescript
import { storageService } from '~/lib/supabase/storage';

// Create a project
const { project, error } = await storageService.createProject({
  user_id: user.id,
  name: 'My Awesome Project',
  description: 'A description of my project',
  is_public: false,
});

// Save a chat
const { chat, error } = await storageService.createChat({
  project_id: project.id,
  user_id: user.id,
  title: 'Chat Title',
  messages: [],
});

// Save files
const { file, error } = await storageService.saveFile({
  project_id: project.id,
  user_id: user.id,
  path: 'src/index.ts',
  content: 'console.log("Hello World!");',
  size: 30,
});
```

## Troubleshooting

### "Supabase client not initialized"
- Check that your environment variables are set correctly
- Make sure you're running the app with `pnpm dev` (not `pnpm build`)
- Restart your development server after adding environment variables

### Email confirmation not working
- Check your Supabase email settings
- Ensure your email provider (SMTP) is configured correctly
- For development, you can disable email confirmation in Auth settings

### RLS Policy Errors
- Ensure you've run the schema SQL completely
- Check that the user is authenticated before making requests
- Verify the user ID matches the data they're trying to access

## Production Deployment

### Environment Variables

For production deployment (e.g., Cloudflare Pages), add these environment variables to your deployment settings:

```
VITE_SUPABASE_URL=your-production-url
VITE_SUPABASE_ANON_KEY=your-production-anon-key
```

### Security Checklist

- [ ] Enable email verification for new accounts
- [ ] Set up custom email templates
- [ ] Configure SMTP for production emails
- [ ] Review and test all RLS policies
- [ ] Enable database backups
- [ ] Set up monitoring and alerts
- [ ] Configure rate limiting (if needed)

## Support

For issues related to:
- **Supabase**: Check [Supabase Documentation](https://supabase.com/docs)
- **This Integration**: Open an issue on the GitHub repository

## Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/introduction)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Supabase Auth](https://supabase.com/docs/guides/auth)

