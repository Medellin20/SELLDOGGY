import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Pencil, Trash2, LogOut, Dog as DogIcon, ClipboardList, LayoutGrid, Loader2, RefreshCw } from 'lucide-react';
import { BrandLogo, brandName } from '@/components/Brand';
import { supabase, formatPrice, type Dog, type DogInput, type Order } from '@/lib/supabase';
import { DogForm } from '@/components/DogForm';

const ORDER_STATUS_LABEL: Record<Order['status'], string> = {
  pending: 'En attente',
  confirmed: 'Confirmée',
  cancelled: 'Annulée',
};

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<'dogs' | 'orders'>('orders');
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [ordersLoadFailed, setOrdersLoadFailed] = useState(false);
  const [orderUpdateFailed, setOrderUpdateFailed] = useState(false);
  const [editing, setEditing] = useState<Dog | null>(null);
  const [showForm, setShowForm] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const [dogsRes, ordersRes] = await Promise.all([
      supabase.from('dogs').select('*').order('created_at', { ascending: false }),
      supabase.from('orders').select('*').order('created_at', { ascending: false }),
    ]);
    if (!dogsRes.error) setDogs(dogsRes.data ?? []);
    setOrdersLoadFailed(Boolean(ordersRes.error));
    if (!ordersRes.error) setOrders(ordersRes.data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function saveDog(values: DogInput) {
    if (editing) {
      const { error } = await supabase.from('dogs').update(values).eq('id', editing.id);
      if (error) throw error;
    } else {
      const { error } = await supabase.from('dogs').insert(values);
      if (error) throw error;
    }
    setShowForm(false);
    setEditing(null);
    await load();
  }

  async function deleteDog(dog: Dog) {
    if (!window.confirm(`Supprimer ${dog.name} du catalogue ? Cette action est irréversible.`)) return;
    await supabase.from('dogs').delete().eq('id', dog.id);
    await load();
  }

  async function setOrderStatus(order: Order, status: Order['status']) {
    setOrderUpdateFailed(false);
    const { data, error } = await supabase.from('orders').update({ status }).eq('id', order.id).select('id').maybeSingle();
    if (error || !data) {
      setOrderUpdateFailed(true);
      return;
    }
    await load();
  }

  async function signOut() {
    await supabase.auth.signOut();
    navigate('/admin/login', { replace: true });
  }

  const pendingCount = orders.filter((o) => o.status === 'pending').length;
  const revenue = orders
    .filter((o) => o.status === 'confirmed' && o.type === 'purchase')
    .reduce((sum, o) => sum + (dogs.find((d) => d.id === o.dog_id)?.price ?? 0), 0);

  return (
    <div className="min-h-screen bg-neutral-100">
      <header className="bg-white border-b border-neutral-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BrandLogo className="h-12 w-12 shrink-0 object-contain" />
            <div>
              <p className="text-sm font-bold leading-tight text-neutral-900">{brandName}</p>
              <p className="text-xs text-neutral-600">Administration</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/" className="text-sm text-neutral-600 hover:text-amber-600 transition-colors hidden sm:block">
              Voir la boutique
            </Link>
            <button onClick={signOut} className="flex items-center gap-2 text-sm text-neutral-600 hover:text-red-600 transition-colors">
              <LogOut className="w-4 h-4" /> Déconnexion
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid gap-4 sm:grid-cols-3 mb-8">
          <StatCard label="Chiens au catalogue" value={String(dogs.length)} icon={LayoutGrid} />
          <StatCard label="Demandes en attente" value={ordersLoadFailed ? '—' : String(pendingCount)} icon={ClipboardList} highlight={pendingCount > 0} />
          <StatCard label="Ventes confirmées" value={formatPrice(revenue)} icon={DogIcon} />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div className="flex gap-1 bg-neutral-200/70 rounded-full p-1">
            <TabButton active={tab === 'orders'} onClick={() => { setTab('orders'); if (!loading && tab !== 'orders') void load(); }}>
              Demandes{!loading && !ordersLoadFailed && ` (${orders.length})`}
            </TabButton>
            <TabButton active={tab === 'dogs'} onClick={() => setTab('dogs')}>Catalogue ({dogs.length})</TabButton>
          </div>
          {tab === 'dogs' && (
            <button onClick={() => { setEditing(null); setShowForm(true); }}
              className="bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold px-5 py-2.5 rounded-full transition-colors flex items-center gap-2">
              <Plus className="w-4 h-4" /> Ajouter un chien
            </button>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center py-24">
            <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
          </div>
        ) : tab === 'dogs' ? (
          <DogsTable dogs={dogs} onEdit={(d) => { setEditing(d); setShowForm(true); }} onDelete={deleteDog} />
        ) : (
          <section aria-labelledby="order-requests">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <h1 id="order-requests" className="text-xl font-bold text-neutral-900">Demandes d’achat et de réservation</h1>
              <button onClick={load} className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-neutral-700 hover:bg-neutral-200">
                <RefreshCw className="w-4 h-4" /> Actualiser
              </button>
            </div>
            {ordersLoadFailed ? (
              <p role="alert" className="rounded-xl bg-red-50 p-4 text-sm text-red-700">Impossible de charger les demandes. Cliquez sur « Actualiser » pour réessayer.</p>
            ) : (
              <>
                {orderUpdateFailed && <p role="alert" className="mb-3 rounded-xl bg-red-50 p-4 text-sm text-red-700">Le statut de la demande n’a pas pu être mis à jour.</p>}
                <OrdersTable orders={orders} onStatus={setOrderStatus} />
              </>
            )}
          </section>
        )}
      </main>

      {showForm && (
        <DogForm
          initial={editing}
          onSubmit={saveDog}
          onCancel={() => { setShowForm(false); setEditing(null); }}
        />
      )}
    </div>
  );
}

function StatCard({ label, value, icon: Icon, highlight }: {
  label: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  highlight?: boolean;
}) {
  return (
    <div className="bg-white rounded-2xl border border-neutral-200 p-5 flex items-center gap-4">
      <span className={`w-11 h-11 rounded-xl flex items-center justify-center ${highlight ? 'bg-red-100' : 'bg-amber-50'}`}>
        <Icon className={`w-5 h-5 ${highlight ? 'text-red-600' : 'text-amber-600'}`} />
      </span>
      <div>
        <p className="text-xs text-neutral-500 font-medium uppercase tracking-wide">{label}</p>
        <p className="text-xl font-bold text-neutral-900">{value}</p>
      </div>
    </div>
  );
}

function TabButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick}
      className={`px-5 py-2 rounded-full text-sm font-semibold transition-colors ${active ? 'bg-white text-neutral-900 shadow-sm' : 'text-neutral-500 hover:text-neutral-800'}`}>
      {children}
    </button>
  );
}

function DogsTable({ dogs, onEdit, onDelete }: {
  dogs: Dog[];
  onEdit: (d: Dog) => void;
  onDelete: (d: Dog) => void;
}) {
  if (dogs.length === 0) {
    return <p className="text-center text-neutral-500 bg-white rounded-2xl py-16 border border-neutral-200">Aucun chien au catalogue. Cliquez sur « Ajouter un chien » pour commencer.</p>;
  }
  return (
    <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-neutral-500 border-b border-neutral-200 bg-neutral-50">
            <th className="px-5 py-3 font-medium">Chien</th>
            <th className="px-5 py-3 font-medium">Race</th>
            <th className="px-5 py-3 font-medium">Prix</th>
            <th className="px-5 py-3 font-medium">Statut</th>
            <th className="px-5 py-3 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {dogs.map((dog) => (
            <tr key={dog.id} className="border-b border-neutral-100 last:border-0 hover:bg-neutral-50">
              <td className="px-5 py-3">
                <div className="flex items-center gap-3">
                  {dog.image_url ? (
                    <img src={dog.image_url} alt={dog.name} className="w-11 h-11 rounded-xl object-cover" />
                  ) : (
                    <div className="w-11 h-11 rounded-xl bg-neutral-100" />
                  )}
                  <div>
                    <p className="font-semibold text-neutral-900">{dog.name}</p>
                    <p className="text-xs text-neutral-500">{dog.gender === 'male' ? 'Mâle' : 'Femelle'} · {dog.age_months} mois</p>
                  </div>
                </div>
              </td>
              <td className="px-5 py-3 text-neutral-600">{dog.breed}</td>
              <td className="px-5 py-3 font-medium text-neutral-900">{formatPrice(dog.price)}</td>
              <td className="px-5 py-3">
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                  dog.status === 'available' ? 'bg-emerald-100 text-emerald-700' :
                  dog.status === 'reserved' ? 'bg-amber-100 text-amber-700' : 'bg-neutral-200 text-neutral-600'
                }`}>
                  {dog.status === 'available' ? 'Disponible' : dog.status === 'reserved' ? 'Réservé' : 'Adopté'}
                </span>
              </td>
              <td className="px-5 py-3">
                <div className="flex justify-end gap-2">
                  <button onClick={() => onEdit(dog)} className="p-2 rounded-lg text-neutral-500 hover:text-amber-600 hover:bg-amber-50" aria-label="Modifier">
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button onClick={() => onDelete(dog)} className="p-2 rounded-lg text-neutral-500 hover:text-red-600 hover:bg-red-50" aria-label="Supprimer">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function OrdersTable({ orders, onStatus }: {
  orders: Order[];
  onStatus: (o: Order, s: Order['status']) => void;
}) {
  if (orders.length === 0) {
    return <p className="text-center text-neutral-500 bg-white rounded-2xl py-16 border border-neutral-200">Aucune demande d’achat ou de réservation pour le moment.</p>;
  }
  return (
    <div className="space-y-3">
      {orders.map((order) => (
        <div key={order.id} className="bg-white rounded-2xl border border-neutral-200 p-5 flex flex-col lg:flex-row lg:items-center gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <p className="font-semibold text-neutral-900">{order.customer_name}</p>
              <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                order.type === 'purchase' ? 'bg-blue-100 text-blue-700' : 'bg-violet-100 text-violet-700'
              }`}>
                {order.type === 'purchase' ? 'Achat' : 'Réservation'}
              </span>
              <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                order.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                order.status === 'confirmed' ? 'bg-emerald-100 text-emerald-700' : 'bg-neutral-200 text-neutral-600'
              }`}>
                {ORDER_STATUS_LABEL[order.status]}
              </span>
            </div>
            <p className="text-sm text-neutral-600">
              {order.type === 'purchase' ? 'Achète' : 'Réserve'} <strong>{order.dog_name}</strong> · {new Date(order.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
            <p className="text-sm text-neutral-500 mt-1">{order.customer_email} · {order.customer_phone}</p>
            {order.message && (
              <p className="text-sm text-neutral-600 italic mt-2 bg-neutral-50 rounded-xl px-3 py-2">« {order.message} »</p>
            )}
          </div>
          <div className="flex gap-2 lg:flex-col xl:flex-row">
            {order.status !== 'confirmed' && (
              <button onClick={() => onStatus(order, 'confirmed')}
                className="text-sm font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-4 py-2 rounded-full transition-colors">
                Confirmer
              </button>
            )}
            {order.status !== 'cancelled' && (
              <button onClick={() => onStatus(order, 'cancelled')}
                className="text-sm font-medium text-neutral-600 bg-neutral-100 hover:bg-neutral-200 px-4 py-2 rounded-full transition-colors">
                Annuler
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
