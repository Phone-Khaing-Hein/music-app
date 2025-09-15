// Test script to check Supabase auth configuration
// Run this in browser console after opening your app

console.log('Testing Supabase Configuration...');
console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log('Current location:', window.location.origin);

// Test the auth configuration
import { supabase } from './lib/supabase.js';

supabase.auth.getSession().then(({ data, error }) => {
  if (error) {
    console.error('Session error:', error);
  } else {
    console.log('Current session:', data);
  }
});

// This will show the exact error when trying GitHub OAuth
async function testGitHubAuth() {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: window.location.origin
      }
    });
    
    if (error) {
      console.error('GitHub OAuth Error:', error);
      console.log('Error details:', {
        code: error.status,
        message: error.message,
        details: error
      });
    } else {
      console.log('GitHub OAuth Success:', data);
    }
  } catch (err) {
    console.error('Exception:', err);
  }
}

console.log('Run testGitHubAuth() to test GitHub login');
