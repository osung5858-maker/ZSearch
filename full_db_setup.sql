-- Create public_services table
create table public_services (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  type text not null,
  address text,
  lat float,
  lng float,
  phone text,
  metadata jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Set up Row Level Security (RLS)
alter table public_services enable row level security;

-- Create a policy that allows anyone to read
create policy "Public services are viewable by everyone"
  on public_services for select
  using ( true );

-- Create a policy that allows authenticated users to insert (optional, depending on requirements)
-- create policy "Users can insert public services"
--   on public_services for insert
--   with check ( auth.role() = 'authenticated' );
-- Insert sample data into public_services
INSERT INTO public_services (name, type, address, lat, lng, phone, metadata) VALUES
  ('강남구청', 'GOV', '서울특별시 강남구 학동로 426', 37.517305, 127.047502, '02-3423-5114', '{"dept": "general"}'),
  ('서초구청', 'GOV', '서울특별시 서초구 남부순환로 2584', 37.483574, 127.032661, '02-2155-6114', '{"dept": "general"}'),
  ('종로구청', 'GOV', '서울특별시 종로구 종로1길 36', 37.573520, 126.978835, '02-2148-1114', '{"dept": "general"}'),
  ('서울시청', 'GOV', '서울특별시 중구 세종대로 110', 37.566535, 126.977969, '02-120', '{"dept": "city_hall"}'),
  ('송파구청', 'GOV', '서울특별시 송파구 올림픽로 326', 37.514477, 127.105860, '02-2147-2000', '{"dept": "general"}'),

  ('서울대학교', 'SCH', '서울특별시 관악구 관악로 1', 37.459882, 126.951905, '02-880-5114', '{"level": "university"}'),
  ('연세대학교', 'SCH', '서울특별시 서대문구 연세로 50', 37.565784, 126.938572, '02-2123-2114', '{"level": "university"}'),
  ('고려대학교', 'SCH', '서울특별시 성북구 안암로 145', 37.590799, 127.027802, '02-3290-1114', '{"level": "university"}'),
  ('한양대학교', 'SCH', '서울특별시 성동구 왕십리로 222', 37.557232, 127.045322, '02-2220-0114', '{"level": "university"}'),
  ('경기고등학교', 'SCH', '서울특별시 강남구 영동대로 643', 37.517578, 127.056088, '02-3438-2200', '{"level": "high_school"}'),
  ('세화고등학교', 'SCH', '서울특별시 서초구 신반포로 56-7', 37.501234, 126.991234, '02-536-2244', '{"level": "high_school"}'),

  ('서울성모병원', 'HOSP', '서울특별시 서초구 반포대로 222', 37.502082, 127.004944, '1588-1511', '{"specialty": "general"}'),
  ('서울아산병원', 'HOSP', '서울특별시 송파구 올림픽로43길 88', 37.524430, 127.107530, '1688-7575', '{"specialty": "general"}'),
  ('삼성서울병원', 'HOSP', '서울특별시 강남구 일원로 81', 37.488346, 127.085078, '1599-3114', '{"specialty": "general"}'),
  ('강남세브란스병원', 'HOSP', '서울특별시 강남구 언주로 211', 37.492797, 127.046312, '1599-6114', '{"specialty": "general"}'),
  ('좋은아침치과', 'HOSP', '서울특별시 강남구 테헤란로 123', 37.498123, 127.026123, '02-555-1234', '{"specialty": "dental"}'),

  ('종로약국', 'PHARM', '서울특별시 종로구 종로 123', 37.570123, 126.990456, '02-777-1234', '{"hours": "24h"}'),
  ('강남제일약국', 'PHARM', '서울특별시 강남구 강남대로 456', 37.503456, 127.025789, '02-543-9876', '{"hours": "09-22"}'),
  ('서초온누리약국', 'PHARM', '서울특별시 서초구 서초대로 345', 37.494567, 127.013456, '02-588-5555', '{"hours": "09-20"}'),
  ('행복한약국', 'PHARM', '서울특별시 혜화로 11', 37.585123, 127.001234, '02-765-4321', '{"hours": "09-18"}');
