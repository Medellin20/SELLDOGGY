import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Mail, Loader2, AlertCircle } from 'lucide-react';
import { BrandLogo, brandName } from '@/components/Brand';
import { supabase } from '@/lib/supabase';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    const { error: err } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (err) {
      setError('Identifiants incorrects. Vérifiez votre email et votre mot de passe.');
      return;
    }
    navigate('/admin', { replace: true });
  }

  return (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <BrandLogo className="mx-auto h-24 w-24 object-contain" />
          <p className="mb-2 text-sm font-semibold text-amber-400">{brandName}</p>
          <h1 className="text-2xl font-bold text-white">Espace administration</h1>
          <p className="text-neutral-400 text-sm mt-2">Connectez-vous pour gérer le catalogue et les commandes.</p>
        </div>
        <form onSubmit={submit} className="bg-neutral-900 border border-neutral-800 rounded-3xl p-8 space-y-5">
          <label className="block">
            <span className="block text-sm font-medium text-neutral-300 mb-1.5">Email</span>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-neutral-800 border border-neutral-700 rounded-xl pl-11 pr-4 py-2.5 text-sm text-white focus:ring-2 focus:ring-amber-500 outline-none" />
            </div>
          </label>
          <label className="block">
            <span className="block text-sm font-medium text-neutral-300 mb-1.5">Mot de passe</span>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
              <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-neutral-800 border border-neutral-700 rounded-xl pl-11 pr-4 py-2.5 text-sm text-white focus:ring-2 focus:ring-amber-500 outline-none" />
            </div>
          </label>
          {error && (
            <div className="flex items-center gap-2 bg-red-500/10 text-red-400 text-sm px-4 py-3 rounded-xl">
              <AlertCircle className="w-4 h-4 shrink-0" /> {error}
            </div>
          )}
          <button type="submit" disabled={loading}
            className="w-full bg-amber-500 hover:bg-amber-600 disabled:opacity-60 text-white font-semibold py-3 rounded-full transition-colors flex items-center justify-center gap-2">
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            Se connecter
          </button>
        </form>
        <p className="text-center text-sm text-neutral-500 mt-6">
          <Link to="/" className="hover:text-amber-400">← Retour à la boutique</Link>
        </p>
      </div>
    </div>
  );
}
