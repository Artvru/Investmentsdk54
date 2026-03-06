-- Create Assets table
CREATE TABLE IF NOT EXISTS public.assets (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name TEXT NOT NULL,
  symbol TEXT NOT NULL UNIQUE,
  type TEXT DEFAULT 'cryptocurrency',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create Transactions table
CREATE TABLE IF NOT EXISTS public.transactions (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  asset_id BIGINT NOT NULL REFERENCES public.assets(id) ON DELETE CASCADE,
  date TIMESTAMP NOT NULL,
  investment_amount NUMERIC NOT NULL,
  units NUMERIC NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_transactions_asset_id ON public.transactions(asset_id);
CREATE INDEX IF NOT EXISTS idx_transactions_date ON public.transactions(date);
