#!/usr/bin/env node

/**
 * Supabase Connection & Database Diagnostic Script
 * 
 * Purpose: Verify Supabase connection and test database tables
 * Usage: npx ts-node scripts/test-supabase.ts
 * 
 * Tests:
 * 1. Environment variables loaded
 * 2. Supabase client initializes
 * 3. Can connect to database
 * 4. Schema tables exist (posts, categories, profiles, settings)
 * 5. Can insert test data to posts table
 * 6. Can query test data
 * 7. Can delete test data
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('\n=== Supabase Diagnostic Test ===\n');

// 1. Check environment variables
console.log('1️⃣  Checking environment variables...');
if (!supabaseUrl) {
  console.error('❌ NEXT_PUBLIC_SUPABASE_URL not set');
  process.exit(1);
}
if (!supabaseKey) {
  console.error('❌ NEXT_PUBLIC_SUPABASE_ANON_KEY not set');
  process.exit(1);
}
console.log(`✅ NEXT_PUBLIC_SUPABASE_URL: ${supabaseUrl.substring(0, 30)}...`);
console.log(`✅ NEXT_PUBLIC_SUPABASE_ANON_KEY: ${supabaseKey.substring(0, 30)}...`);

// 2. Initialize Supabase client
console.log('\n2️⃣  Initializing Supabase client...');
const supabase = createClient(supabaseUrl, supabaseKey);
console.log('✅ Supabase client created');

// 3. Test connection by listing tables
console.log('\n3️⃣  Testing database connection...');
(async () => {
  try {
    // Try a simple query to verify connection
    const { data, error } = await supabase
      .from('posts')
      .select('count', { count: 'exact', head: true });

    if (error) {
      console.error(`❌ Connection failed: ${error.message}`);
      console.error(`Error code: ${error.code}`);
      process.exit(1);
    }

    console.log('✅ Database connection successful');

    // 4. Check schema tables
    console.log('\n4️⃣  Verifying schema tables...');
    const tables = ['posts', 'categories', 'profiles', 'settings'];
    
    for (const table of tables) {
      try {
        const { error: tableError } = await supabase
          .from(table)
          .select('count', { count: 'exact', head: true });

        if (tableError) {
          console.error(`❌ Table '${table}' not found or inaccessible`);
          console.error(`   Error: ${tableError.message}`);
        } else {
          console.log(`✅ Table '${table}' exists and accessible`);
        }
      } catch (err) {
        console.error(`❌ Error checking table '${table}':`, err);
      }
    }

    // 5. Insert test data
    console.log('\n5️⃣  Testing INSERT operation...');
    const testUUID = 'c0000000-0000-0000-0000-000000000001'; // Fixed UUID for testing
    const testSlug = `test-post-${Date.now()}`;

    const { data: insertData, error: insertError } = await supabase
      .from('posts')
      .insert({
        author_id: testUUID,
        title: 'Test Post - CLI Diagnostic',
        slug: testSlug,
        excerpt: 'This is a test post created via CLI diagnostic script',
        content_html: '<p>Test content</p>',
        status: 'draft',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select();

    if (insertError) {
      console.error(`❌ INSERT failed: ${insertError.message}`);
      console.error(`   Code: ${insertError.code}`);
      
      // Check if it's a permission issue
      if (insertError.message.includes('permission') || insertError.code === 'PGRST301') {
        console.error('   💡 Hint: RLS policy may be blocking. Need to be authenticated as admin.');
      }
      
      // Check if it's a foreign key issue
      if (insertError.message.includes('23503') || insertError.message.includes('foreign key')) {
        console.error('   💡 Hint: Author profile does not exist. This is expected with test UUID.');
      }
    } else {
      console.log('✅ INSERT successful');
      console.log(`   Created post with slug: ${testSlug}`);

      // 6. Query the inserted data
      console.log('\n6️⃣  Testing SELECT operation...');
      const { data: selectData, error: selectError } = await supabase
        .from('posts')
        .select('*')
        .eq('slug', testSlug);

      if (selectError) {
        console.error(`❌ SELECT failed: ${selectError.message}`);
      } else {
        console.log('✅ SELECT successful');
        console.log(`   Found ${selectData.length} post(s)`);
      }

      // 7. Delete test data
      console.log('\n7️⃣  Testing DELETE operation...');
      const { error: deleteError } = await supabase
        .from('posts')
        .delete()
        .eq('slug', testSlug);

      if (deleteError) {
        console.error(`❌ DELETE failed: ${deleteError.message}`);
      } else {
        console.log('✅ DELETE successful');
        console.log(`   Removed test post`);
      }
    }

    // Summary
    console.log('\n=== Diagnostic Summary ===');
    console.log('✅ All tests completed');
    console.log('\nNext steps:');
    console.log('1. If RLS policy errors: Make sure admin user is set up and authenticated');
    console.log('2. If foreign key errors: Create an actual user profile first');
    console.log('3. Check Supabase dashboard for more details: https://supabase.com/dashboard');
    console.log('');

  } catch (err) {
    console.error('\n❌ Unexpected error:', err);
    process.exit(1);
  }
})();
