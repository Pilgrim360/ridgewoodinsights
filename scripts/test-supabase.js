#!/usr/bin/env node

/**
 * Supabase Connection & Database Diagnostic Script (JavaScript)
 * 
 * Purpose: Verify Supabase connection and test database tables
 * Usage: node scripts/test-supabase.js
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

console.log('\n=== Supabase Diagnostic Test ===\n');

// 1. Check environment variables
console.log('1️⃣  Checking environment variables...');
if (!supabaseUrl) {
  console.error('❌ NEXT_PUBLIC_SUPABASE_URL not set in .env.local');
  process.exit(1);
}
if (!supabaseKey) {
  console.error('❌ NEXT_PUBLIC_SUPABASE_ANON_KEY not set in .env.local');
  process.exit(1);
}
console.log(`✅ NEXT_PUBLIC_SUPABASE_URL: ${supabaseUrl.substring(0, 30)}...`);
console.log(`✅ NEXT_PUBLIC_SUPABASE_ANON_KEY: ${supabaseKey.substring(0, 30)}...`);

// 2. Initialize Supabase client
console.log('\n2️⃣  Initializing Supabase client...');
const supabase = createClient(supabaseUrl, supabaseKey);
console.log('✅ Supabase client created');

// 3. Test connection by querying tables
console.log('\n3️⃣  Testing database connection...');
(async () => {
  try {
    // Try a simple query to verify connection
    const { data, error } = await supabase
      .from('posts')
      .select('count', { count: 'exact', head: true });

    if (error) {
      console.error(`❌ Connection failed: ${error.message}`);
      console.error(`Error code: ${error.code || 'unknown'}`);
      if (error.hint) console.error(`Hint: ${error.hint}`);
      process.exit(1);
    }

    console.log('✅ Database connection successful');
    console.log(`   Posts table has ${data?.length || 'unknown'} records`);

    // 4. Check schema tables
    console.log('\n4️⃣  Verifying schema tables...');
    const tables = ['posts', 'categories', 'profiles', 'settings'];
    
    const results = {};
    for (const table of tables) {
      try {
        const { count, error: tableError } = await supabase
          .from(table)
          .select('count', { count: 'exact', head: true });

        if (tableError) {
          console.error(`❌ Table '${table}' not found or inaccessible`);
          console.error(`   Error: ${tableError.message}`);
          results[table] = false;
        } else {
          console.log(`✅ Table '${table}' exists (${count || 0} records)`);
          results[table] = true;
        }
      } catch (err) {
        console.error(`❌ Error checking table '${table}':`, err.message);
        results[table] = false;
      }
    }

    // 5. Summary
    const allTablesOk = Object.values(results).every(v => v);
    console.log('\n=== Diagnostic Summary ===');
    
    if (allTablesOk) {
      console.log('✅ All tables accessible - Supabase is properly configured!');
    } else {
      const missing = Object.entries(results)
        .filter(([_, ok]) => !ok)
        .map(([table]) => table);
      console.log(`⚠️  Some tables are inaccessible: ${missing.join(', ')}`);
      console.log('\nPossible causes:');
      console.log('1. Tables not created in database (run SUPABASE_SQL_CHECKLIST.md)');
      console.log('2. RLS policies blocking queries');
      console.log('3. Database URL/key incorrect');
    }

    console.log('\nNext steps:');
    console.log('1. Check dashboard: https://supabase.com/dashboard');
    console.log('2. Verify SQL was run from SUPABASE_SQL_CHECKLIST.md');
    console.log('3. Check RLS policies on each table');
    console.log('\n');

  } catch (err) {
    console.error('\n❌ Unexpected error:', err.message);
    process.exit(1);
  }
})();
