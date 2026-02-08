export interface Package {
  id: number;
  tracking_code: string;
  sender_name: string;
  sender_address: string;
  recipient_name: string;
  recipient_address: string;
  origin: string;
  destination: string;
  weight: number;
  status: 'pending' | 'in_transit' | 'delivered' | 'returned';
  estimated_delivery: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  shipped_date?: string;
  delivered_date?: string;
}