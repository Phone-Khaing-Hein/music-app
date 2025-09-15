// Debug authentication and storage access
// Run this in your browser console after logging in

import { supabase } from './lib/supabase.js';

async function debugAuth() {
  console.log('=== DEBUG AUTHENTICATION ===');
  
  // 1. Check current session
  const { data: session, error: sessionError } = await supabase.auth.getSession();
  console.log('Current session:', session);
  console.log('Session error:', sessionError);
  
  // 2. Check current user
  const { data: user, error: userError } = await supabase.auth.getUser();
  console.log('Current user:', user);
  console.log('User error:', userError);
  
  // 3. Test storage access
  console.log('\n=== TEST STORAGE ACCESS ===');
  
  // Create a small test file
  const testFile = new File(['test content'], 'test.txt', { type: 'text/plain' });
  
  try {
    const { data, error } = await supabase.storage
      .from('songs')
      .upload(`test-${Date.now()}.txt`, testFile);
    
    console.log('Storage upload result:', { data, error });
    
    if (error) {
      console.error('Storage error details:', {
        message: error.message,
        statusCode: error.statusCode,
        error: error.error
      });
    }
  } catch (err) {
    console.error('Storage exception:', err);
  }
}

// Run the debug
debugAuth();
