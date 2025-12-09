# Admin User Setup Guide

## Quick Setup

### Option 1: Create User via Supabase Dashboard (Recommended)

This is the easiest method:

1. **Go to Supabase Dashboard**
   - Visit: https://supabase.com/dashboard/project/aldlkgfejbodxbqcclcv
   - Navigate to: **Authentication** → **Users**

2. **Add User**
   - Click **"Add user"** button
   - Select **"Create new user"**
   - Fill in:
     - **Email**: `tiagocruz3@gmail.com`
     - **Password**: `Thiago77!`
     - **Auto Confirm User**: ✅ (check this box)
   - Click **"Create user"**

3. **Verify Profile Created**
   - Go to **Table Editor** → **profiles**
   - You should see a profile for `tiagocruz3@gmail.com`
   - If not, the trigger should create it on first login

### Option 2: Using SQL (Advanced)

If you prefer SQL, run the `create-admin-user.sql` file:

1. Go to: **SQL Editor** in Supabase Dashboard
2. Copy the contents of `create-admin-user.sql`
3. Paste and click **"Run"**
4. Verify the user was created

### Option 3: Use the Sign Up Page

The simplest method if you want to test the flow:

1. Start the app: `pnpm dev`
2. Go to: http://localhost:5173/signup
3. Fill in the form:
   - Email: `tiagocruz3@gmail.com`
   - Password: `Thiago77!`
   - Confirm Password: `Thiago77!`
   - Username: `tiagocruz3` (optional)
   - Full Name: `Tiago Cruz` (optional)
4. Click **"Create Account"**
5. You'll be automatically signed in

## Testing the Login Screen

Once the user is created:

### Access the Login Page

1. **Direct URL**:
   ```
   http://localhost:5173/login
   ```

2. **Login Credentials**:
   - **Email**: `tiagocruz3@gmail.com`
   - **Password**: `Thiago77!`

### Features to Test

✅ **Login Page Features**:
- Clean, modern design
- Email and password fields
- Show/hide password toggle
- "Remember me" checkbox
- "Forgot password?" link
- Error handling
- Loading state during sign in
- Redirect to home after successful login
- Link to sign up page
- Back to home link

✅ **Sign Up Page Features**:
- Email, username, full name fields
- Password and confirm password
- Show/hide password toggle
- Field validation
- Loading state
- Redirect to home after sign up
- Link to login page

## Page Routes

| Route | Purpose |
|-------|---------|
| `/login` | Dedicated login page |
| `/signup` | Dedicated sign up page |
| `/` | Home page (with inline auth dialog) |

## Updating the Header

The header still has the inline "Sign in" dialog. You can update it to link to the login page:

### Option A: Link to Login Page
Change the "Sign in" button to navigate to `/login`:

```tsx
<a
  href="/login"
  className="px-4 py-2 rounded-lg font-medium bg-blue-500 hover:bg-blue-600 text-white transition-colors"
>
  Sign in
</a>
```

### Option B: Keep Both (Recommended)
Keep the inline dialog for quick access and also provide a link to the full login page for users who prefer it.

## Troubleshooting

### User Creation Failed

**Error**: "User already exists"
- **Solution**: User might already be in the system. Try logging in or check Authentication → Users in Supabase

**Error**: "Invalid password"
- **Solution**: Password must be at least 6 characters. `Thiago77!` meets this requirement.

### Login Issues

**Problem**: Can't log in after creating user
- **Solution**: 
  - Verify email confirmation: Check auth.users table, `email_confirmed_at` should not be NULL
  - If NULL, run: 
    ```sql
    UPDATE auth.users 
    SET email_confirmed_at = NOW() 
    WHERE email = 'tiagocruz3@gmail.com';
    ```

**Problem**: Profile not created
- **Solution**: The trigger should create it automatically. If not, manually insert:
  ```sql
  INSERT INTO public.profiles (id, email, username, full_name)
  SELECT id, email, 'tiagocruz3', 'Tiago Cruz'
  FROM auth.users
  WHERE email = 'tiagocruz3@gmail.com'
  ON CONFLICT (id) DO NOTHING;
  ```

### Page Not Found

**Problem**: `/login` returns 404
- **Solution**: Make sure the dev server is running (`pnpm dev`) and restart if needed

## Security Notes

⚠️ **Important**:
- The password `Thiago77!` is now in version control (this guide)
- **Recommendation**: Change it after first login via Profile Settings
- Never commit actual production passwords to git
- This is fine for development/testing

## Next Steps

After successful login:

1. ✅ Click your name/avatar in header
2. ✅ Go to "Profile Settings"
3. ✅ Update your information
4. ✅ Change password if desired
5. ✅ Start creating projects!

## Quick Test Checklist

- [ ] User created in Supabase
- [ ] Can access `/login` page
- [ ] Can log in with credentials
- [ ] Redirects to home after login
- [ ] User menu shows in header
- [ ] Profile settings accessible
- [ ] Can sign out
- [ ] Can sign in again
- [ ] Session persists across page refresh

## Login Page Screenshot

The login page features:
- 🎨 Beautiful gradient background
- 🖼️ Centered card design
- 🔐 Secure password input with toggle
- ⚡ Smooth animations
- 🌙 Dark mode support
- 📱 Fully responsive
- ♿ Accessible form labels
- ✨ Modern UI with shadows and transitions

Enjoy your new login experience! 🚀

