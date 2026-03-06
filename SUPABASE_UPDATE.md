# Supabase Schema Update Instructions

เพื่อให้ข้อมูลแสดงผลถูกต้อง ต้องอัปเดต Supabase schema ตามขั้นตอนนี้:

## ขั้นตอน 1: เข้า Supabase Dashboard
1. ไปที่ https://supabase.com/dashboard
2. เลือก project ของคุณ

## ขั้นตอน 2: ลบตาราง transactions เก่า แล้ว สร้างใหม่

### SQL ที่ต้องรัน:
```sql
-- Drop old table
DROP TABLE IF EXISTS public.transactions CASCADE;

-- Create new transactions table
CREATE TABLE IF NOT EXISTS public.transactions (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  asset_id BIGINT NOT NULL REFERENCES public.assets(id) ON DELETE CASCADE,
  date TEXT NOT NULL,
  price_purchase NUMERIC NOT NULL,
  units NUMERIC NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_transactions_asset_id ON public.transactions(asset_id);
CREATE INDEX IF NOT EXISTS idx_transactions_date ON public.transactions(date);
```

## ขั้นตอน 3: การดำเนินการ
1. ไปที่หน้า **SQL Editor** ใน Supabase Dashboard
2. คัดลอก SQL ข้างบนลงไป
3. กดปุ่ม **Run** 
4. ตรวจสอบว่าสำเร็จ

## ขั้นตอน 4: พิสูจน์ว่าทำงานถูกต้อง
หลังจากอัปเดต schema:
1. ตรวจสอบคอลัมน์ตาราง transactions:
   - id (BIGINT)
   - asset_id (BIGINT)
   - date (TIMESTAMP)
   - investment_amount (NUMERIC) ✓ จำนวนเงินลงทุน
   - units (NUMERIC) ✓ จำนวนหน่วย
   - created_at (TIMESTAMP)

2. ลองเพิ่มข้อมูลใหม่ผ่านแอป
3. ตรวจสอบว่าข้อมูลแสดงถูกต้อง

## ข้อมูลสำคัญ (Investment Log)
- **investment_amount**: จำนวนเงินที่ลงทุน (เช่น 31.6)
- **units**: จำนวนหน่วยที่ได้รับ (เช่น 2)
