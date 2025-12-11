#!/usr/bin/env node

/**
 * Detailed Supabase Diagnostic
 * Helps debug connection issues with more verbose output
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
}

console.log('\n=== Detailed Supabase Diagnostic ===\n');

console.log('1️⃣  Environment Check');
console.log(`URL: ${supabaseUrl}`);
console.log(`Key: ${supabaseKey?.substring(0, 30)}...`);

const supabase = createClient(supabaseUrl, supabaseKey);
console.log('✅ Client initialized\n');

(async () => {
  try {
    // Test 1: Check posts with detailed error
    console.log('2️⃣  Testing posts table query...');
    const { data: postsData, error: postsError, status: postsStatus } = await supabase
      .from('posts')
      .select('*', { count: 'exact', head: true });

    if (postsError) {
      console.error(`❌ Posts query failed`);
      console.error(`   Message: "${postsError.message}"`);
      console.error(`   Code: ${postsError.code}`);
      console.error(`   Status: ${postsStatus}`);
      console.error(`   Full error:`, JSON.stringify(postsError, null, 2));
    } else {
      console.log(`✅ Posts query successful`);
      console.log(`   Records: ${postsData?.length || 0}`);
    }

    // Test 2: Check categories
    console.log('\n3️⃣  Testing categories table query...');
    const { data: catsData, error: catsError, status: catsStatus } = await supabase
      .from('categories')
      .select('*', { count: 'exact', head: true });

    if (catsError) {
      console.error(`❌ Categories query failed`);
      console.error(`   Message: "${catsError.message}"`);
      console.error(`   Code: ${catsError.code}`);
      console.error(`   Status: ${catsStatus}`);
      console.error(`   Full error:`, JSON.stringify(catsError, null, 2));
    } else {
      console.log(`✅ Categories query successful`);
      console.log(`   Records: ${catsData?.length || 0}`);
    }

    // Test 3: Check profiles
    console.log('\n4️⃣  Testing profiles table query...');
    const { data: profilesData, error: profilesError, status: profilesStatus } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true });

    if (profilesError) {
      console.error(`❌ Profiles query failed`);
      console.error(`   Message: "${profilesError.message}"`);
      console.error(`   Code: ${profilesError.code}`);
      console.error(`   Status: ${profilesStatus}`);
      console.error(`   Full error:`, JSON.stringify(profilesError, null, 2));
    } else {
      console.log(`✅ Profiles query successful`);
      console.log(`   Records: ${profilesData?.length || 0}`);
    }

    // Test 4: Try a simple insert with detailed error
    console.log('\n5️⃣  Testing simple INSERT...');
    const testSlug = `test-${Date.now()}`;
    const { data: insertData, error: insertError, status: insertStatus } = await supabase
      .from('posts')
      .insert({
        author_id: '00000000-0000-0000-0000-000000000001',
        title: 'Test',
        slug: testSlug,
        status: 'draft',
      })
      .select();

    if (insertError) {
      console.error(`❌ INSERT failed`);
      console.error(`   Message: "${insertError.message}"`);
      console.error(`   Code: ${insertError.code}`);
      console.error(`   Status: ${insertStatus}`);
      console.error(`   Full error:`, JSON.stringify(insertError, null, 2));
    } else {
      console.log(`✅ INSERT successful`);
      console.log(`   Data:`, insertData);
    }

  } catch (err) {
    console.error('\n❌ Unexpected error:');
    console.error(err);
  }
})();
