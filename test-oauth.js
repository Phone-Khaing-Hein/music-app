// Test Supabase GitHub OAuth Configuration
// Run this in your browser console on your app to test

import { supabase } from './lib/supabase';

// Test GitHub OAuth
export async function testGitHubAuth() {
  try {
    console.log('Testing GitHub OAuth...');
    
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: `${window.location.origin}`
      }
    });

    if (error) {
      console.error('GitHub OAuth error:', error);
    } else {
      console.log('GitHub OAuth initiated successfully:', data);
    }
  } catch (err) {
    console.error('Exception during GitHub OAuth:', err);
  }
}

// Call this function to test
// testGitHubAuth();
