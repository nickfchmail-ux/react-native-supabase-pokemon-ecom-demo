// hooks/useInvoices.ts  (recommended place to put custom hooks)
import { getAllInvoices } from '@/lib/data-service';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from './useAuth';

// Optional: Define the shape of your invoice data (great for TypeScript safety)
export interface Invoice {
  id: string;
  order_id: number;
  created_at: Date;
  total_amount: number;
  shipping_address: number;
  payment_status: 'paid' | 'pending' | 'overdue';
}

export function useInvoices() {
  const { session } = useAuth();

  return useQuery<Invoice[], Error>({
    queryKey: ['invoices'],
    queryFn: getAllInvoices,
    enabled: !!session,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
    retry: 2,
  });
}
