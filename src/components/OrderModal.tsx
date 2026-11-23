import { useState } from 'react';
import { X, ShoppingBag, CalendarClock, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { supabase, formatAge, formatPrice, type Dog, type OrderType } from '@/lib/supabase';

interface Props {
  dog: Dog;
  defaultType: OrderType;
  onClose: () => void;
}

export function OrderModal({ dog, defaultType, onClose }: Props) {
  const [type, setType] = useState<OrderType>(defaultType);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('sending');
    setErrorMsg('');
    const { error } = await supabase.from('orders').insert({
      dog_id: dog.id,
      dog_name: dog.name,
      customer_name: name,
      customer_email: email,
      customer_phone: phone,
      type,
      message: message || null,
    });
    if (error) {
      setErrorMsg("Une erreur est survenue lors de l'envoi. Merci de réessayer.");
      setStatus('error');
      return;
    }
    setStatus('success');
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60" onClick={onClose}>
      <div
        className="bg-white rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {status === 'success' ? (
          <div className="p-10 text-center">
            <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto mb-5" />
            <h2 className="text-2xl font-bold text-neutral-900 mb-3">Demande envoyée !</h2>
            <p className="text-neutral-500 leading-relaxed mb-8">
              Merci {name}. Nous avons bien reçu votre demande de{' '}
              {type === 'purchase' ? 'achat' : 'réservation'} pour <strong>{dog.name}</strong>.
              Notre équipe vous recontacte sous 24h.
            </p>
            <button onClick={onClose} className="bg-amber-500 hover:bg-amber-600 text-white font-semibold px-8 py-3 rounded-full transition-colors">
              Fermer
            </button>
          </div>
        ) : (
          <div className="p-6 sm:p-8">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                {dog.image_url && (
                  <img src={dog.image_url} alt={dog.name} className="w-16 h-16 rounded-2xl object-cover" />
                )}
                <div>
                  <h2 className="text-xl font-bold text-neutral-900">{dog.name}</h2>
                  <p className="text-sm text-neutral-500">{dog.breed} · {formatAge(dog.age_months)} · {formatPrice(dog.price)}</p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 text-neutral-400 hover:text-neutral-700" aria-label="Fermer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-6">
              <button
                type="button"
                onClick={() => setType('purchase')}
                className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 font-medium text-sm transition-colors ${
                  type === 'purchase'
                    ? 'border-amber-500 bg-amber-50 text-amber-700'
                    : 'border-neutral-200 text-neutral-600 hover:border-neutral-300'
                }`}
              >
                <ShoppingBag className="w-4 h-4" /> Acheter
              </button>
              <button
                type="button"
                onClick={() => setType('reservation')}
                className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 font-medium text-sm transition-colors ${
                  type === 'reservation'
                    ? 'border-amber-500 bg-amber-50 text-amber-700'
                    : 'border-neutral-200 text-neutral-600 hover:border-neutral-300'
                }`}
              >
                <CalendarClock className="w-4 h-4" /> Réserver
              </button>
            </div>

            <form onSubmit={submit} className="space-y-4">
              <Field label="Nom complet">
                <input required value={name} onChange={(e) => setName(e.target.value)}
                  className="w-full border border-neutral-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none" />
              </Field>
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Email">
                  <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                    className="w-full border border-neutral-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none" />
                </Field>
                <Field label="Téléphone">
                  <input required type="tel" value={phone} onChange={(e) => setPhone(e.target.value)}
                    className="w-full border border-neutral-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none" />
                </Field>
              </div>
              <Field label="Message (optionnel)">
                <textarea rows={3} value={message} onChange={(e) => setMessage(e.target.value)}
                  className="w-full border border-neutral-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none resize-none" />
              </Field>

              {status === 'error' && (
                <div className="flex items-center gap-2 bg-red-50 text-red-700 text-sm px-4 py-3 rounded-xl">
                  <AlertCircle className="w-4 h-4 shrink-0" /> {errorMsg}
                </div>
              )}

              <button
                type="submit"
                disabled={status === 'sending'}
                className="w-full bg-amber-500 hover:bg-amber-600 disabled:opacity-60 text-white font-semibold py-3 rounded-full transition-colors flex items-center justify-center gap-2"
              >
                {status === 'sending' && <Loader2 className="w-4 h-4 animate-spin" />}
                {type === 'purchase' ? "Confirmer l'achat" : 'Confirmer la réservation'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-sm font-medium text-neutral-700 mb-1.5">{label}</span>
      {children}
    </label>
  );
}
