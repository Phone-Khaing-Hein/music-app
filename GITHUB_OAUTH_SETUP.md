# GitHub OAuth Configuration for Supabase

## Steps to Fix GitHub Login:

1. **Login to your Supabase Dashboard**
   - Go to https://supabase.com/dashboard
   - Navigate to your project: `idkyfktbqqcqumgeajoo`

2. **Configure GitHub OAuth Provider**
   - Go to "Authentication" > "Providers"
   - Find "GitHub" in the list and click to configure it
   - Enable the GitHub provider

3. **Create GitHub OAuth App**
   - Go to https://github.com/settings/developers
   - Click "New OAuth App" 
   - Fill in:
     - **Application name**: Music Library (or any name you prefer)
     - **Homepage URL**: `http://localhost:3001` (for development)
     - **Authorization callback URL**: `https://idkyfktbqqcqumgeajoo.supabase.co/auth/v1/callback`
   - Click "Register application"

4. **Copy GitHub Credentials to Supabase**
   - From your GitHub OAuth App, copy the "Client ID"
   - Generate a "Client Secret" and copy it
   - Go back to Supabase Dashboard > Authentication > Providers > GitHub
   - Paste the Client ID and Client Secret
   - Set the redirect URL to: `https://idkyfktbqqcqumgeajoo.supabase.co/auth/v1/callback`
   - Save the configuration

5. **Update Site URL (Important!)**
   - In Supabase Dashboard, go to Authentication > URL Configuration
   - Set "Site URL" to: `http://localhost:3001` (for development)
   - Add `http://localhost:3001/**` to "Redirect URLs"

6. **For Production Deployment**
   - Update the Site URL to your production domain
   - Update the GitHub OAuth App's Homepage URL and Authorization callback URL
   - Add production URLs to Supabase redirect URLs

## Common Issues and Solutions:

1. **"Invalid redirect URI" error**
   - Make sure the callback URL in GitHub exactly matches: `https://idkyfktbqqcqumgeajoo.supabase.co/auth/v1/callback`
   - Check that there are no trailing slashes or extra characters

2. **"Site URL mismatch" error**
   - Ensure the Site URL in Supabase matches your current development URL (http://localhost:3001)

3. **Authentication loop**
   - Clear your browser cookies and cache
   - Check that the redirect URLs are properly configured

4. **RLS (Row Level Security) Issues**
   - Make sure you have proper RLS policies set up in your Supabase database
   - Users should be able to read public songs and manage their own data

## Test the Configuration:

1. Start your development server: `npm run dev`
2. Open your app in the browser
3. Try to log in with GitHub
4. Check the browser console for any errors
5. Check the Supabase logs in the dashboard for authentication events

## Additional Notes:

- The app has been updated to use the modern `@supabase/supabase-js` client
- All deprecated auth helpers have been removed
- Song IDs have been updated to use numbers instead of strings to match your database schema
- The middleware has been simplified but you may need to add auth logic if required
