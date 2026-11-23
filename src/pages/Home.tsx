import { useState } from 'react';
import { useDogs } from '@/hooks/useDogs';
import { Catalog } from '@/components/Catalog';
import { Navbar, Hero, Engagements, Footer } from '@/components/Layout';
import { OrderModal } from '@/components/OrderModal';
import type { Dog, OrderType } from '@/lib/supabase';

export default function Home() {
  const { dogs, loading, error } = useDogs();
  const [orderDog, setOrderDog] = useState<Dog | null>(null);
  const [orderType, setOrderType] = useState<OrderType>('purchase');

  function openOrder(dog: Dog, type: OrderType) {
    setOrderType(type);
    setOrderDog(dog);
  }

  return (
    <div className="storefront min-h-screen">
      <Navbar />
      <Hero />
      <Catalog dogs={dogs} loading={loading} error={error} onOrder={openOrder} />
      <Engagements />
      <Footer />
      {orderDog && (
        <OrderModal dog={orderDog} defaultType={orderType} onClose={() => setOrderDog(null)} />
      )}
    </div>
  );
}
