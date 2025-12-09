# Deployment Guide - Syntax Stage

## Cloudflare Pages Environment Variables

When deploying to Cloudflare Pages, add these environment variables to your project settings:

### Required Variables

```
VITE_SUPABASE_URL=https://aldlkgfejbodxbqcclcv.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFsZGxrZ2ZlamJvZHhicWNjbGN2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ2NTk5OTAsImV4cCI6MjA4MDIzNTk5MH0.yoW9wuotBaVnE09ZrTW_eNqKqoTXeWIEy8KXU-6azHw
```

### How to Add Environment Variables to Cloudflare Pages

1. Go to your Cloudflare Pages project dashboard
2. Navigate to **Settings** → **Environment variables**
3. Click **Add variable** for each variable above
4. Set the environment to **Production** (and **Preview** if needed)
5. Click **Save**
6. Redeploy your application

## Local Development

For local development, the credentials are already configured in `.env.local`.

Just run:
```bash
pnpm dev
```

## Verifying Deployment

After deploying, verify the integration:

1. Visit your deployed site
2. Click "Sign in" in the header
3. Create a test account
4. Check that authentication works correctly

## Troubleshooting

### "Supabase client not initialized"
- Ensure environment variables are set in Cloudflare Pages
- Redeploy after adding variables
- Check browser console for errors

### Authentication not working
- Verify the Supabase URL and anon key are correct
- Check that the database schema has been run
- Ensure RLS policies are enabled

### Database connection errors
- Confirm the database schema was executed successfully
- Check Supabase project status in the dashboard
- Verify network connectivity to Supabase

## Security Notes

⚠️ **Important**: 
- Never commit `.env.local` to git (it's already in `.gitignore`)
- The anon key is safe to use in frontend code
- The service role key should NEVER be exposed to the frontend
- Supabase RLS policies protect your data even with the anon key

## Support

- **Supabase Issues**: [Supabase Support](https://supabase.com/support)
- **Cloudflare Pages**: [Cloudflare Docs](https://developers.cloudflare.com/pages/)
- **GitHub Issues**: [Project Repository](https://github.com/Tiagocruz3/Brainiacodelab)

