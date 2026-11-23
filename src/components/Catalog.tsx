import { useMemo, useState } from 'react';
import { Search, ShoppingBag, CalendarClock, BadgeCheck } from 'lucide-react';
import { formatAge, formatPrice, type Dog } from '@/lib/supabase';

const STATUS_BADGE: Record<Dog['status'], { label: string; className: string }> = {
  available: { label: 'Disponible', className: 'bg-emerald-100 text-emerald-700' },
  reserved: { label: 'Réservé', className: 'bg-amber-100 text-amber-700' },
  sold: { label: 'Adopté', className: 'bg-neutral-200 text-neutral-600' },
};

interface Props {
  dogs: Dog[];
  loading: boolean;
  error: string | null;
  onOrder: (dog: Dog, type: 'purchase' | 'reservation') => void;
}

export function Catalog({ dogs, loading, error, onOrder }: Props) {
  const [query, setQuery] = useState('');
  const [breed, setBreed] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const breeds = useMemo(() => Array.from(new Set(dogs.map((d) => d.breed))).sort(), [dogs]);

  const filtered = dogs.filter((d) => {
    const matchQuery =
      d.name.toLowerCase().includes(query.toLowerCase()) ||
      d.breed.toLowerCase().includes(query.toLowerCase());
    const matchBreed = breed === 'all' || d.breed === breed;
    const matchStatus = statusFilter === 'all' || d.status === statusFilter;
    return matchQuery && matchBreed && matchStatus;
  });

  return (
    <section id="catalogue" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="text-center mb-10">
        <h2 className="store-heading text-4xl text-neutral-900 sm:text-5xl">Notre catalogue</h2>
        <p className="text-neutral-500 mt-3">Tous nos chiots disponibles à l'adoption ou à la réservation.</p>
      </div>

      <div className="store-filters flex flex-col gap-3 rounded-3xl p-3 mb-10 md:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            aria-label="Rechercher un nom ou une race"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher un nom ou une race…"
            className="w-full border border-neutral-300 rounded-full pl-11 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
          />
        </div>
        <select aria-label="Filtrer par race" value={breed} onChange={(e) => setBreed(e.target.value)}
          className="border border-neutral-300 rounded-full px-4 py-2.5 text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none bg-white">
          <option value="all">Toutes les races</option>
          {breeds.map((b) => <option key={b} value={b}>{b}</option>)}
        </select>
        <select aria-label="Filtrer par statut" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-neutral-300 rounded-full px-4 py-2.5 text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none bg-white">
          <option value="all">Tous les statuts</option>
          <option value="available">Disponibles</option>
          <option value="reserved">Réservés</option>
          <option value="sold">Adoptés</option>
        </select>
      </div>

      {loading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-3xl border border-neutral-200 overflow-hidden animate-pulse">
              <div className="h-56 bg-neutral-200" />
              <div className="p-5 space-y-3">
                <div className="h-4 bg-neutral-200 rounded w-1/2" />
                <div className="h-3 bg-neutral-200 rounded w-3/4" />
                <div className="h-9 bg-neutral-200 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <p className="text-center text-red-600 bg-red-50 rounded-2xl py-10">{error}</p>
      ) : filtered.length === 0 ? (
        <p className="text-center text-neutral-500 py-16">Aucun chien ne correspond à votre recherche.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((dog) => (
            <DogCard key={dog.id} dog={dog} onOrder={onOrder} />
          ))}
        </div>
      )}
    </section>
  );
}

function DogCard({ dog, onOrder }: { dog: Dog; onOrder: Props['onOrder'] }) {
  const badge = STATUS_BADGE[dog.status];
  const canOrder = dog.status === 'available';

  return (
    <article className="group store-card rounded-3xl overflow-hidden">
      <div className="relative h-56 overflow-hidden">
        {dog.image_url ? (
          <img src={dog.image_url} alt={dog.name} loading="lazy" decoding="async" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full bg-neutral-100 flex items-center justify-center text-neutral-400 text-sm">Sans photo</div>
        )}
        <span className={`absolute top-4 left-4 text-xs font-semibold px-3 py-1 rounded-full ${badge.className}`}>
          {badge.label}
        </span>
        {dog.vaccinated && (
          <span className="absolute top-4 right-4 bg-white/90 text-emerald-600 text-xs font-medium px-2.5 py-1 rounded-full flex items-center gap-1">
            <BadgeCheck className="w-3.5 h-3.5" /> Vacciné
          </span>
        )}
      </div>
      <div className="p-5">
        <div className="flex items-start justify-between mb-1">
          <h3 className="text-lg font-bold text-neutral-900">{dog.name}</h3>
          <p className="text-lg font-bold text-amber-800">{formatPrice(dog.price)}</p>
        </div>
        <p className="text-sm text-neutral-500 flex items-center gap-3 mb-3">
          <span>{dog.breed}</span>
          <span className="flex items-center gap-1">{dog.gender === 'male' ? '♂' : '♀'} {dog.gender === 'male' ? 'Mâle' : 'Femelle'}</span>
          <span>{formatAge(dog.age_months)}</span>
        </p>
        {dog.description && (
          <p className="text-sm text-neutral-500 leading-relaxed line-clamp-2 mb-4">{dog.description}</p>
        )}
        <div className="flex gap-2">
          <button
            onClick={() => onOrder(dog, 'purchase')}
            disabled={!canOrder}
            className="store-cta flex-1 disabled:opacity-40 disabled:cursor-not-allowed text-sm font-semibold py-2.5 rounded-full transition-colors flex items-center justify-center gap-2"
          >
            <ShoppingBag className="w-4 h-4" /> Acheter
          </button>
          <button
            onClick={() => onOrder(dog, 'reservation')}
            disabled={!canOrder}
            className="flex-1 border border-amber-600 text-amber-800 hover:bg-amber-50 disabled:opacity-40 disabled:cursor-not-allowed text-sm font-semibold py-2.5 rounded-full transition-colors flex items-center justify-center gap-2"
          >
            <CalendarClock className="w-4 h-4" /> Réserver
          </button>
        </div>
      </div>
    </article>
  );
}
