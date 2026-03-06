export type Asset = {
  id: number;
  name: string;
  symbol: string;
  type?: string;
};

export type Transaction = {
  id: number;
  asset_id: number;
  date: string;
  investment_amount: number;
  units: number;
  price_purchase: number;
  created_at?: string;
};

export type MarketPrice = {
  asset_id: number;
  current_price: number;
};
