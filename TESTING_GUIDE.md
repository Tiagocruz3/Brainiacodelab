# Testing Guide - Supabase Integration

## ✅ What Has Been Integrated

### 1. User Authentication
- Sign up / Sign in functionality
- Profile management (username, full name, avatar)
- Session persistence across page reloads
- User menu with profile settings

### 2. Chat Persistence & Cloud Sync
- **Hybrid Storage**: Local IndexedDB + Supabase cloud backup
- **Auto-sync**: Chats automatically sync to Supabase when authenticated
- **Cross-device**: Access your projects from any device
- **Offline-first**: Works without authentication (local only)

### 3. Sidebar Integration
- Shows both local and cloud-synced chats
- Cloud sync indicator when authenticated
- Merge local and Supabase projects
- Duplicate prevention

## 🧪 Testing Steps

### Step 1: Database Setup (One-time)

1. **Go to Supabase Dashboard**
   - Visit: https://supabase.com/dashboard/project/aldlkgfejbodxbqcclcv
   - Navigate to **SQL Editor**

2. **Run the Schema**
   - Copy the entire contents of `supabase-schema.sql`
   - Paste into the SQL Editor
   - Click **"Run"**
   - You should see: "Success. No rows returned"

3. **Verify Tables Created**
   - Go to **Table Editor**
   - You should see: `profiles`, `projects`, `chats`, `files`

### Step 2: Start the Application

```bash
# Make sure you're in the project directory
cd /home/ace/Desktop/Labs/bolt.diy

# Start the development server
pnpm dev
```

### Step 3: Test Authentication

1. **Open the App**
   - Go to: http://localhost:5173
   
2. **Sign Up**
   - Click "Sign in" button in the header
   - Click "Sign up" tab
   - Fill in:
     - Email: your-email@example.com
     - Username: (optional)
     - Full Name: (optional)
     - Password: (minimum 6 characters)
     - Confirm Password: (same as above)
   - Click "Create account"
   
3. **Check Supabase**
   - Go to Supabase Dashboard → **Authentication**
   - You should see your new user listed
   - Go to **Table Editor** → `profiles`
   - Your profile should be automatically created

4. **Test Sign Out**
   - Click your avatar/name in the header
   - Click "Sign out"
   - Verify you're signed out

5. **Test Sign In**
   - Click "Sign in" again
   - Enter your email and password
   - Click "Sign in"
   - You should be signed in

### Step 4: Test Profile Settings

1. **Open Profile Settings**
   - Click your avatar/name in the header
   - Click "Profile Settings"
   
2. **Edit Profile**
   - Click "Edit Profile"
   - Update:
     - Username
     - Full Name
     - Avatar URL (optional, use a valid image URL)
   - Click "Save Changes"
   
3. **Verify Changes**
   - The user menu should show your updated name
   - Refresh the page - changes should persist

### Step 5: Test Chat Persistence

1. **Create a New Chat (Not Signed In)**
   - Sign out if signed in
   - Start a new chat
   - Type: "Create a simple Hello World app"
   - Send the message
   - The chat should be saved locally (IndexedDB)
   - Open sidebar (click hamburger menu)
   - You should see "No conversations" or your local chat

2. **Create a Chat While Signed In**
   - Sign in
   - Start a new chat
   - Type: "Create a React counter app"
   - Send and wait for response
   - Open the sidebar
   - You should see:
     - Your chat listed
     - A cloud sync indicator: "Synced with cloud"

3. **Verify Cloud Sync**
   - Go to Supabase Dashboard
   - Table Editor → `projects`
   - You should see a new project created
   - Table Editor → `chats`
   - You should see your chat with messages

### Step 6: Test Cross-Device Sync

1. **Create Multiple Chats**
   - While signed in, create 2-3 different chats
   - Each should have a unique description/title
   
2. **Simulate New Device**
   - Open a new incognito/private window
   - Go to: http://localhost:5173
   - Sign in with the same account
   - Open the sidebar
   - **Expected**: You should see all your chats from the other window

3. **Clear Local Storage** (Advanced test)
   - Open DevTools → Application → IndexedDB
   - Delete the database
   - Refresh the page
   - Sign in
   - Open sidebar
   - **Expected**: Your chats load from Supabase

### Step 7: Test Sidebar Behavior

1. **Without Authentication**
   - Sign out
   - Create a local chat
   - Open sidebar
   - Should show: "No previous conversations" or local chats only

2. **With Authentication**
   - Sign in
   - Open sidebar
   - Should show:
     - All your Supabase-synced chats
     - Cloud sync indicator
     - Ability to access any chat

3. **Mixed Chats**
   - If you have local chats and then sign in
   - Both local and cloud chats should appear
   - Duplicates should be prevented

## 🐛 Troubleshooting

### Database Schema Issues

**Problem**: Error when running the schema
- **Solution**: Make sure you're running the complete `supabase-schema.sql` file
- Check that you're using the SQL Editor, not the Query Editor
- If tables already exist, you can drop them first:
  ```sql
  DROP TABLE IF EXISTS public.files CASCADE;
  DROP TABLE IF EXISTS public.chats CASCADE;
  DROP TABLE IF EXISTS public.projects CASCADE;
  DROP TABLE IF EXISTS public.profiles CASCADE;
  ```
  Then run the schema again.

### Authentication Issues

**Problem**: "Supabase client not initialized"
- **Solution**: 
  - Check that `.env.local` exists and contains the correct credentials
  - Restart the development server: `pnpm dev`
  - Check browser console for specific errors

**Problem**: Can't create account
- **Solution**:
  - Check Supabase Dashboard → Authentication → Email Auth is enabled
  - Try a different email address
  - Check that password is at least 6 characters

### Sync Issues

**Problem**: Chats not syncing to Supabase
- **Solution**:
  - Ensure you're signed in
  - Check browser console for sync errors
  - Verify the chat has a description/title
  - Check Supabase RLS policies are enabled

**Problem**: Chats not loading from Supabase
- **Solution**:
  - Check that projects and chats tables have data
  - Verify RLS policies allow SELECT for authenticated users
  - Check browser console for API errors

### Sidebar Issues

**Problem**: Sidebar shows "No conversations" but I have chats
- **Solution**:
  - Check if you're signed in (should see user menu)
  - Open DevTools → Application → IndexedDB
  - Verify `chatHistory` database exists and has data
  - Try refreshing the page

## ✨ Features to Test

### Priority 1: Must Work
- [ ] Sign up creates user and profile
- [ ] Sign in works with correct credentials
- [ ] Sign out clears session
- [ ] Profile settings can be updated
- [ ] New chats are saved when authenticated
- [ ] Sidebar shows cloud-synced chats
- [ ] Cross-device access works

### Priority 2: Should Work
- [ ] Local chats persist without auth
- [ ] Signing in loads cloud chats
- [ ] Duplicate prevention works
- [ ] Cloud sync indicator appears
- [ ] Profile avatar displays correctly
- [ ] Chat descriptions update properly

### Priority 3: Nice to Have
- [ ] Error messages are clear
- [ ] Sync is seamless (no lag)
- [ ] UI is responsive
- [ ] No console errors

## 📊 Expected Database State

After testing, your Supabase database should have:

### profiles table
```
id: your-user-id
email: your-email@example.com
username: your-username
full_name: Your Full Name
created_at: timestamp
updated_at: timestamp
```

### projects table
```
id: project-uuid
user_id: your-user-id
name: "React counter app" (or similar)
description: "Project created from chat..."
is_public: false
metadata: { chatId: "...", createdFrom: "chat" }
created_at: timestamp
```

### chats table
```
id: chat-uuid
project_id: project-uuid
user_id: your-user-id
title: "Create a React counter app"
messages: [array of message objects]
metadata: { chatId: "...", lastUpdated: "..." }
created_at: timestamp
```

## 🎯 Success Criteria

✅ **Authentication Works**
- Can create account
- Can sign in/out
- Session persists across page reloads
- Profile can be edited

✅ **Chat Storage Works**
- Chats save locally when not authenticated
- Chats sync to Supabase when authenticated
- Chats load from Supabase on sign in
- No data loss between local and cloud

✅ **Sidebar Works**
- Shows local chats when not authenticated
- Shows cloud chats when authenticated
- Displays cloud sync indicator
- Handles empty state correctly

## 📝 Known Limitations

1. **Initial sync**: First sign-in may take a moment to load all chats
2. **Duplicate IDs**: Local chat IDs and Supabase IDs are different
3. **File sync**: Project files are not yet synced (coming soon)
4. **Real-time**: Changes are not real-time yet (requires refresh)

## 🚀 Next Steps

After successful testing:
1. Deploy to Cloudflare Pages with Supabase env vars
2. Test on production environment
3. Consider adding:
   - Real-time updates (Supabase Realtime)
   - File storage sync
   - Project sharing
   - Public project gallery

## Need Help?

If you encounter issues:
1. Check browser console for errors
2. Check Supabase logs in Dashboard → Logs
3. Verify environment variables are set
4. Ensure database schema is complete
5. Try clearing IndexedDB and starting fresh

Happy testing! 🎉

