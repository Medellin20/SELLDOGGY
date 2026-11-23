import { useState } from 'react';
import { Heart, ShieldCheck, Truck, BadgeCheck, Phone, Mail, MapPin, Menu, X } from 'lucide-react';
import { BrandLogo, brandName } from '@/components/Brand';

const NAV = [
  { label: 'Accueil', href: '#accueil' },
  { label: 'Catalogue', href: '#catalogue' },
  { label: 'Nos engagements', href: '#engagements' },
  { label: 'Contact', href: '#contact' },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <a href="#accueil" className="flex items-center gap-2">
            <BrandLogo className="h-14 w-14 shrink-0 object-contain" />
            <span className="font-bold text-sm sm:text-base text-neutral-900 tracking-tight">{brandName}</span>
          </a>
          <nav className="hidden lg:flex items-center gap-8">
            {NAV.map((item) => (
              <a key={item.href} href={item.href} className="text-sm font-medium text-neutral-600 hover:text-amber-600 transition-colors">
                {item.label}
              </a>
            ))}
            <a href="#catalogue" className="text-sm font-semibold bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-full transition-colors">
              Voir les chiens
            </a>
          </nav>
          <button className="lg:hidden p-2" onClick={() => setOpen(!open)} aria-label="Menu">
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>
      {open && (
        <nav className="lg:hidden border-t border-neutral-200 bg-white px-4 pb-4 pt-2 space-y-1">
          {NAV.map((item) => (
            <a key={item.href} href={item.href} onClick={() => setOpen(false)} className="block px-3 py-2 rounded-lg text-neutral-700 hover:bg-neutral-100">
              {item.label}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}

export function Footer() {
  return (
    <footer id="contact" className="bg-neutral-900 text-neutral-300 mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 grid gap-10 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <BrandLogo className="h-14 w-14 shrink-0 object-contain" />
            <span className="font-bold text-lg text-white">{brandName}</span>
          </div>
          <p className="text-sm leading-relaxed text-neutral-400">
            Élevage passionné de chiens de race : Boebull, Malinois, Labrador, Cane Corso et bien plus.
            Nos chiots sont vaccinés, pucés et élevés en famille.
          </p>
        </div>
        <div className="space-y-3 text-sm">
          <h3 className="font-semibold text-white mb-4">Contact</h3>
          <p className="flex items-center gap-3"><Phone className="w-4 h-4 text-amber-500" /> +33 6 12 34 56 78</p>
          <p className="flex items-center gap-3"><Mail className="w-4 h-4 text-amber-500" /> contact@kannele-dogs.fr</p>
          <p className="flex items-center gap-3"><MapPin className="w-4 h-4 text-amber-500" /> 123 route des Champs, 75000 Paris</p>
        </div>
        <div className="space-y-3 text-sm">
          <h3 className="font-semibold text-white mb-4">Horaires</h3>
          <p>Lundi – Vendredi : 9h – 18h</p>
          <p>Samedi : 10h – 17h</p>
          <p>Dimanche : sur rendez-vous</p>
        </div>
      </div>
      <div className="border-t border-neutral-800 py-5 text-center text-xs text-neutral-500">
        © {new Date().getFullYear()} {brandName} — Tous droits réservés
      </div>
    </footer>
  );
}

export function Hero() {
  return (
    <section id="accueil" className="relative bg-neutral-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <span className="inline-block bg-amber-500/15 text-amber-400 text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full mb-6">
            Élevage certifié depuis 2012
          </span>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
            Trouvez le compagnon<br />qui vous ressemble
          </h1>
          <p className="text-lg text-neutral-300 leading-relaxed mb-8">
            Boebull, Malinois, Labrador, Cane Corso… Des chiots de race élevés avec amour,
            vaccinés et prêts à rejoindre votre famille. Réservez en ligne en quelques clics.
          </p>
          <div className="flex flex-wrap gap-4">
            <a href="#catalogue" className="bg-amber-500 hover:bg-amber-600 text-white font-semibold px-7 py-3 rounded-full transition-colors">
              Découvrir le catalogue
            </a>
            <a href="#engagements" className="border border-neutral-600 hover:border-amber-500 hover:text-amber-400 text-neutral-200 font-semibold px-7 py-3 rounded-full transition-colors">
              Nos engagements
            </a>
          </div>
        </div>
        <div className="relative">
          <img
            src="https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=1000"
            alt="Chiot berger allemand"
            className="rounded-3xl shadow-2xl w-full h-[420px] object-cover"
          />
          <div className="absolute -bottom-6 -left-6 bg-white text-neutral-900 rounded-2xl shadow-xl px-6 py-4 hidden sm:flex items-center gap-4">
            <span className="w-11 h-11 rounded-full bg-emerald-100 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-emerald-600" />
            </span>
            <div>
              <p className="font-semibold text-sm">Chiots vaccinés & pucés</p>
              <p className="text-xs text-neutral-500">Suivi vétérinaire complet</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const ENGAGEMENTS = [
  { icon: ShieldCheck, title: 'Santé garantie', text: 'Chaque chiot est vacciné, vermifugé et suivi par un vétérinaire partenaire.' },
  { icon: Heart, title: 'Élevage en famille', text: 'Nos chiots grandissent au contact des humains, dans un environnement sain.' },
  { icon: BadgeCheck, title: 'Papiers inclus', text: 'Pedigree et carnet de santé fournis pour chaque adoption.' },
  { icon: Truck, title: 'Livraison possible', text: 'Remise en main propre ou transport sécurisé partout dans le pays.' },
];

export function Engagements() {
  return (
    <section id="engagements" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-neutral-900">Nos engagements</h2>
        <p className="text-neutral-500 mt-3">Parce qu''adopter un chien est une grande décision, nous vous accompagnons.</p>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {ENGAGEMENTS.map(({ icon: Icon, title, text }) => (
          <div key={title} className="bg-white rounded-2xl border border-neutral-200 p-6 hover:shadow-lg hover:-translate-y-1 transition-all">
            <span className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center mb-4">
              <Icon className="w-6 h-6 text-amber-600" />
            </span>
            <h3 className="font-semibold text-neutral-900 mb-2">{title}</h3>
            <p className="text-sm text-neutral-500 leading-relaxed">{text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
