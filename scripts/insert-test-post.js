#!/usr/bin/env node

/**
 * Test Post Insertion Script
 * 
 * Purpose: Insert a test post into the database to verify Supabase connectivity
 * Usage: node scripts/insert-test-post.js
 * 
 * This tests:
 * 1. Can insert a post record
 * 2. RLS policies allow inserts
 * 3. Database connection is working
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load .env.local
const envPath = path.join(__dirname, '..', '.env.local');
let supabaseUrl, supabaseKey;

if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  const urlMatch = envContent.match(/NEXT_PUBLIC_SUPABASE_URL=(.+)/);
  const keyMatch = envContent.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY=(.+)/);
  supabaseUrl = urlMatch ? urlMatch[1].trim() : process.env.NEXT_PUBLIC_SUPABASE_URL;
  supabaseKey = keyMatch ? keyMatch[1].trim() : process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
} else {
  supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
}

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

console.log('\n=== Test Post Insertion ===\n');

(async () => {
  try {
    // Test 1: Simple insert with minimal data
    console.log('Attempting to insert a test post...\n');

    const testSlug = `test-post-${Date.now()}`;
    const testAuthorId = 'c0000000-0000-0000-0000-000000000001'; // Fixed UUID for testing

    const { data, error } = await supabase
      .from('posts')
      .insert([
        {
          author_id: testAuthorId,
          title: 'CLI Test Post',
          slug: testSlug,
          excerpt: 'This is a test post created via CLI script',
          content_html: '<p>Test content</p>',
          status: 'draft',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ])
      .select();

    if (error) {
      console.error('❌ Insert failed!');
      console.error(`Error Message: ${error.message}`);
      console.error(`Error Code: ${error.code || 'unknown'}`);
      if (error.hint) console.error(`Hint: ${error.hint}`);
      if (error.details) console.error(`Details: ${error.details}`);

      console.log('\n📋 Troubleshooting Guide:\n');

      if (error.message.includes('permission') || error.code === 'PGRST301') {
        console.log('💡 RLS Policy Issue:');
        console.log('   The insert is being blocked by Row Level Security policies.');
        console.log('   Possible causes:');
        console.log('   1. Policies expect authenticated user');
        console.log('   2. author_id must be the current user ID');
        console.log('   3. User must be an admin (is_admin = true)');
        console.log('');
      }

      if (error.message.includes('23503') || error.message.includes('foreign key')) {
        console.log('💡 Foreign Key Issue:');
        console.log('   The author_id does not exist in the profiles table.');
        console.log('   You need to:');
        console.log('   1. Create a user in Supabase Auth');
        console.log('   2. Get their user ID');
        console.log('   3. Update the script to use that ID');
        console.log('');
      }

      if (error.message.includes('undefined')) {
        console.log('💡 Connection Issue:');
        console.log('   The database connection may have failed.');
        console.log('   Check that your Supabase URL and key are correct.');
        console.log('');
      }

      console.log('Resolution options:');
      console.log('Option A: Set up admin user first');
      console.log('  1. Go to Supabase Dashboard → Auth → Users');
      console.log('  2. Create a user (e.g., albertnkhata@hotmail.com)');
      console.log('  3. Set is_admin = true in profiles table');
      console.log('  4. Then run: node scripts/insert-test-post-as-admin.js');
      console.log('');
      console.log('Option B: Test with server-side code');
      console.log('  The admin middleware can handle inserts properly.');
      console.log('  Try the dashboard at /admin to test authenticated operations.');
      console.log('');

    } else {
      console.log('✅ Insert successful!');
      console.log(`\nPost created with slug: ${testSlug}`);
      console.log(`Data:`, data);

      // Try to query it back
      console.log('\nVerifying by querying back...\n');
      const { data: queryData, error: queryError } = await supabase
        .from('posts')
        .select('*')
        .eq('slug', testSlug);

      if (queryError) {
        console.error('❌ Query failed:', queryError.message);
      } else {
        console.log('✅ Query successful - found', queryData.length, 'post(s)');
      }

      // Clean up
      console.log('\nCleaning up test data...\n');
      const { error: deleteError } = await supabase
        .from('posts')
        .delete()
        .eq('slug', testSlug);

      if (deleteError) {
        console.error('❌ Delete failed:', deleteError.message);
      } else {
        console.log('✅ Test data cleaned up');
      }
    }

  } catch (err) {
    console.error('❌ Unexpected error:', err.message);
    process.exit(1);
  }
})();
