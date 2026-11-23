import { useState } from 'react';
import { Loader2, X } from 'lucide-react';
import { supabase, type Dog, type DogInput } from '@/lib/supabase';

export function uploadDogPhoto(file: File): Promise<string> {
  const ext = file.name.split('.').pop() || 'jpg';
  const path = `dogs/${crypto.randomUUID()}.${ext}`;
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async () => {
      const { error } = await supabase.storage
        .from('dog-photos')
        .upload(path, reader.result as ArrayBuffer, { contentType: file.type });
      if (error) return reject(error);
      const { data } = supabase.storage.from('dog-photos').getPublicUrl(path);
      resolve(data.publicUrl);
    };
    reader.onerror = () => reject(new Error('Lecture du fichier impossible'));
    reader.readAsArrayBuffer(file);
  });
}

interface Props {
  initial?: Dog | null;
  onSubmit: (values: DogInput) => Promise<void>;
  onCancel: () => void;
}

export function DogForm({ initial, onSubmit, onCancel }: Props) {
  const [form, setForm] = useState<DogInput>({
    name: initial?.name ?? '',
    breed: initial?.breed ?? '',
    description: initial?.description ?? '',
    price: initial?.price ?? 0,
    age_months: initial?.age_months ?? 0,
    gender: initial?.gender ?? 'male',
    color: initial?.color ?? '',
    vaccinated: initial?.vaccinated ?? false,
    status: initial?.status ?? 'available',
    image_url: initial?.image_url ?? '',
  });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  function update<K extends keyof DogInput>(key: K, value: DogInput[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleFile(file: File) {
    setUploading(true);
    setError('');
    try {
      const url = await uploadDogPhoto(file);
      update('image_url', url);
    } catch {
      setError("Échec de l'envoi de la photo. Vérifiez le stockage d'images.");
    }
    setUploading(false);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      await onSubmit(form);
    } catch {
      setError("Une erreur est survenue lors de l'enregistrement.");
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 overflow-y-auto">
      <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl my-8">
        <div className="flex items-center justify-between px-6 sm:px-8 pt-6">
          <h2 className="text-xl font-bold text-neutral-900">
            {initial ? `Modifier ${initial.name}` : 'Ajouter un chien'}
          </h2>
          <button onClick={onCancel} className="p-2 text-neutral-400 hover:text-neutral-700" aria-label="Fermer">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={submit} className="p-6 sm:p-8 grid sm:grid-cols-2 gap-4">
          <Input label="Nom *" value={form.name} onChange={(v) => update('name', v)} required />
          <Input label="Race *" value={form.breed} onChange={(v) => update('breed', v)} required placeholder="Boebull, Malinois…" />
          <Input label="Prix (FCFA) *" type="number" min={0} value={form.price || ''} onChange={(v) => update('price', Number(v))} required />
          <Input label="Âge (mois) *" type="number" min={0} value={form.age_months || ''} onChange={(v) => update('age_months', Number(v))} required />
          <Input label="Couleur" value={form.color} onChange={(v) => update('color', v)} />
          <label className="block">
            <span className="block text-sm font-medium text-neutral-700 mb-1.5">Sexe</span>
            <select value={form.gender} onChange={(e) => update('gender', e.target.value as 'male' | 'female')}
              className="w-full border border-neutral-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-amber-500 outline-none">
              <option value="male">Mâle</option>
              <option value="female">Femelle</option>
            </select>
          </label>
          <label className="block">
            <span className="block text-sm font-medium text-neutral-700 mb-1.5">Statut</span>
            <select value={form.status} onChange={(e) => update('status', e.target.value as Dog['status'])}
              className="w-full border border-neutral-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-amber-500 outline-none">
              <option value="available">Disponible</option>
              <option value="reserved">Réservé</option>
              <option value="sold">Adopté</option>
            </select>
          </label>
          <label className="flex items-center gap-3 pt-6">
            <input type="checkbox" checked={form.vaccinated} onChange={(e) => update('vaccinated', e.target.checked)}
              className="w-4 h-4 accent-amber-500" />
            <span className="text-sm text-neutral-700">Vacciné</span>
          </label>
          <label className="block sm:col-span-2">
            <span className="block text-sm font-medium text-neutral-700 mb-1.5">Description</span>
            <textarea rows={3} value={form.description} onChange={(e) => update('description', e.target.value)}
              className="w-full border border-neutral-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-amber-500 outline-none resize-none" />
          </label>
          <div className="sm:col-span-2">
            <span className="block text-sm font-medium text-neutral-700 mb-1.5">Photo</span>
            <div className="flex items-center gap-4">
              {form.image_url ? (
                <img src={form.image_url} alt="Aperçu" className="w-20 h-20 rounded-2xl object-cover" />
              ) : (
                <div className="w-20 h-20 rounded-2xl bg-neutral-100 flex items-center justify-center text-xs text-neutral-400">Aucune</div>
              )}
              <div className="flex-1">
                <label className="inline-flex items-center gap-2 border border-neutral-300 hover:border-amber-500 rounded-full px-4 py-2 text-sm font-medium text-neutral-700 cursor-pointer transition-colors">
                  {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  {uploading ? 'Envoi en cours…' : 'Télécharger une photo'}
                  <input type="file" accept="image/*" className="hidden"
                    onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
                </label>
                {form.image_url && (
                  <button type="button" onClick={() => update('image_url', '')} className="ml-3 text-sm text-red-600 hover:underline">
                    Retirer
                  </button>
                )}
              </div>
            </div>
          </div>
          {error && <p className="sm:col-span-2 text-sm text-red-600 bg-red-50 rounded-xl px-4 py-3">{error}</p>}
          <div className="sm:col-span-2 flex gap-3 pt-2">
            <button type="submit" disabled={saving || uploading}
              className="flex-1 bg-amber-500 hover:bg-amber-600 disabled:opacity-60 text-white font-semibold py-3 rounded-full transition-colors flex items-center justify-center gap-2">
              {saving && <Loader2 className="w-4 h-4 animate-spin" />}
              {initial ? 'Enregistrer les modifications' : 'Ajouter au catalogue'}
            </button>
            <button type="button" onClick={onCancel}
              className="px-6 border border-neutral-300 hover:bg-neutral-50 rounded-full font-semibold text-neutral-700 text-sm transition-colors">
              Annuler
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Input({ label, value, onChange, type = 'text', required, placeholder, min }: {
  label: string;
  value: string | number;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
  placeholder?: string;
  min?: number;
}) {
  return (
    <label className="block">
      <span className="block text-sm font-medium text-neutral-700 mb-1.5">{label}</span>
      <input type={type} value={value} required={required} placeholder={placeholder} min={min}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-neutral-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none" />
    </label>
  );
}
