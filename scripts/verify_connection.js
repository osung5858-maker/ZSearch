
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
// Using the key currently in .env (which we suspect is the Service Role Key)
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

console.log('🔌 Testing Server-Side Connection...');
console.log('URL:', supabaseUrl);
console.log('Key (Prefix):', supabaseKey ? supabaseKey.substring(0, 15) + '...' : 'MISSING');

if (!supabaseKey || !supabaseKey.startsWith('sb_secret')) {
    console.warn('⚠️  Warning: The key in .env does NOT look like a Service Role Key (sb_secret...).');
    console.warn('   If this is an Anon key, this script might verify public access.');
    console.warn('   If this is a Service key, this script verifies admin access.');
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function verifyData() {
    try {
        const { data, error, count } = await supabase
            .from('public_services')
            .select('*', { count: 'exact', head: false })
            .limit(5);

        if (error) {
            console.error('❌ Connection Failed:', error.message);
        } else {
            console.log('✅ Connection Successful!');
            console.log(`📊 Total Records: ${count} (approx)`);
            console.log('📝 First 5 records:', data.map(d => d.name));

            if (data.length === 0) {
                console.log('⚠️  Connected but table is empty.');
            }
        }
    } catch (err) {
        console.error('❌ Unexpected Error:', err.message);
    }
}

verifyData();
