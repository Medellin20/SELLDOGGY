import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type DogStatus = 'available' | 'reserved' | 'sold';
export type OrderType = 'purchase' | 'reservation';
export type OrderStatus = 'pending' | 'confirmed' | 'cancelled';

export interface Dog {
  id: string;
  name: string;
  breed: string;
  description: string | null;
  price: number;
  age_months: number;
  gender: 'male' | 'female';
  color: string | null;
  vaccinated: boolean;
  status: DogStatus;
  image_url: string | null;
  created_at: string;
}

export interface Order {
  id: string;
  dog_id: string | null;
  dog_name: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  type: OrderType;
  message: string | null;
  status: OrderStatus;
  created_at: string;
}

export interface DogInput {
  name: string;
  breed: string;
  description: string;
  price: number;
  age_months: number;
  gender: 'male' | 'female';
  color: string;
  vaccinated: boolean;
  status: DogStatus;
  image_url: string;
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('fr-FR').format(Math.round(price)) + ' FCFA';
}

export function formatAge(months: number): string {
  if (months < 12) return `${months} mois`;
  const years = Math.floor(months / 12);
  const rest = months % 12;
  return rest === 0 ? `${years} an${years > 1 ? 's' : ''}` : `${years} an${years > 1 ? 's' : ''} ${rest} mois`;
}
