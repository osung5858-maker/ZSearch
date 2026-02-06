
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables from .env
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Error: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY must be set in .env');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const seedData = [
    { name: '강남구청', type: 'GOV', address: '서울특별시 강남구 학동로 426', lat: 37.517305, lng: 127.047502, phone: '02-3423-5114', metadata: { dept: 'general' } },
    { name: '서초구청', type: 'GOV', address: '서울특별시 서초구 남부순환로 2584', lat: 37.483574, lng: 127.032661, phone: '02-2155-6114', metadata: { dept: 'general' } },
    { name: '종로구청', type: 'GOV', address: '서울특별시 종로구 종로1길 36', lat: 37.573520, lng: 126.978835, phone: '02-2148-1114', metadata: { dept: 'general' } },
    { name: '서울시청', type: 'GOV', address: '서울특별시 중구 세종대로 110', lat: 37.566535, lng: 126.977969, phone: '02-120', metadata: { dept: 'city_hall' } },
    { name: '송파구청', type: 'GOV', address: '서울특별시 송파구 올림픽로 326', lat: 37.514477, lng: 127.105860, phone: '02-2147-2000', metadata: { dept: 'general' } },

    { name: '서울대학교', type: 'SCH', address: '서울특별시 관악구 관악로 1', lat: 37.459882, lng: 126.951905, phone: '02-880-5114', metadata: { level: 'university' } },
    { name: '연세대학교', type: 'SCH', address: '서울특별시 서대문구 연세로 50', lat: 37.565784, lng: 126.938572, phone: '02-2123-2114', metadata: { level: 'university' } },
    { name: '고려대학교', type: 'SCH', address: '서울특별시 성북구 안암로 145', lat: 37.590799, lng: 127.027802, phone: '02-3290-1114', metadata: { level: 'university' } },
    { name: '한양대학교', type: 'SCH', address: '서울특별시 성동구 왕십리로 222', lat: 37.557232, lng: 127.045322, phone: '02-2220-0114', metadata: { level: 'university' } },
    { name: '경기고등학교', type: 'SCH', address: '서울특별시 강남구 영동대로 643', lat: 37.517578, lng: 127.056088, phone: '02-3438-2200', metadata: { level: 'high_school' } },
    { name: '세화고등학교', type: 'SCH', address: '서울특별시 서초구 신반포로 56-7', lat: 37.501234, lng: 126.991234, phone: '02-536-2244', metadata: { level: 'high_school' } },

    { name: '서울성모병원', type: 'HOSP', address: '서울특별시 서초구 반포대로 222', lat: 37.502082, lng: 127.004944, phone: '1588-1511', metadata: { specialty: 'general' } },
    { name: '서울아산병원', type: 'HOSP', address: '서울특별시 송파구 올림픽로43길 88', lat: 37.524430, lng: 127.107530, phone: '1688-7575', metadata: { specialty: 'general' } },
    { name: '삼성서울병원', type: 'HOSP', address: '서울특별시 강남구 일원로 81', lat: 37.488346, lng: 127.085078, phone: '1599-3114', metadata: { specialty: 'general' } },
    { name: '강남세브란스병원', type: 'HOSP', address: '서울특별시 강남구 언주로 211', lat: 37.492797, lng: 127.046312, phone: '1599-6114', metadata: { specialty: 'general' } },
    { name: '좋은아침치과', type: 'HOSP', address: '서울특별시 강남구 테헤란로 123', lat: 37.498123, lng: 127.026123, phone: '02-555-1234', metadata: { specialty: 'dental' } },

    { name: '종로약국', type: 'PHARM', address: '서울특별시 종로구 종로 123', lat: 37.570123, lng: 126.990456, phone: '02-777-1234', metadata: { hours: '24h' } },
    { name: '강남제일약국', type: 'PHARM', address: '서울특별시 강남구 강남대로 456', lat: 37.503456, lng: 127.025789, phone: '02-543-9876', metadata: { hours: '09-22' } },
    { name: '서초온누리약국', type: 'PHARM', address: '서울특별시 서초구 서초대로 345', lat: 37.494567, lng: 127.013456, phone: '02-588-5555', metadata: { hours: '09-20' } },
    { name: '행복한약국', type: 'PHARM', address: '서울특별시 혜화로 11', lat: 37.585123, lng: 127.001234, phone: '02-765-4321', metadata: { hours: '09-18' } }
];

async function seed() {
    console.log('🌱 Starting database seeding...');

    try {
        // Check if table exists (simple select check)
        const { error: checkError } = await supabase.from('public_services').select('count', { count: 'exact', head: true });

        if (checkError) {
            if (checkError.code === '42P01') { // undefined_table
                console.error('❌ Error: Table "public_services" does not exist.');
                console.error('   Please create the table first using the SQL Editor in Supabase Dashboard.');
                console.error('   (Supabase JS client cannot create tables directly)');
                process.exit(1);
            } else {
                throw checkError;
            }
        }

        // Insert data (Standard Insert)
        const { data, error } = await supabase
            .from('public_services')
            .insert(seedData)
            .select();

        if (error) throw error;

        console.log(`✅ Successfully inserted ${data.length} records.`);

        // Verify count
        const { count, error: countError } = await supabase
            .from('public_services')
            .select('*', { count: 'exact', head: true });

        if (countError) throw countError;

        console.log(`📊 Total records in 'public_services': ${count}`);

    } catch (err) {
        console.error('❌ Error seeding database:', err.message);
        process.exit(1);
    }
}

seed();
