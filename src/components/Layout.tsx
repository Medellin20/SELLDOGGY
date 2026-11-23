import { useState } from 'react';
import { Heart, ShieldCheck, Truck, BadgeCheck, Mail, MapPin, Menu, X, ArrowUpRight } from 'lucide-react';
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
    <header className="sticky top-0 z-40 store-header backdrop-blur border-b">
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
    <footer id="contact" className="store-footer text-neutral-300 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 grid gap-10 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <BrandLogo className="h-14 w-14 shrink-0 object-contain" />
            <span className="font-bold text-lg text-white">{brandName}</span>
          </div>
          <p className="text-sm leading-relaxed text-neutral-400">
            Élevage de chiens de race au Bénin : Boebull, Malinois, Labrador, Cane Corso et bien plus.
            Nos chiots sont vaccinés, pucés et élevés en famille.
          </p>
        </div>
        <div className="space-y-3 text-sm">
          <h3 className="font-semibold text-white mb-4">Contact</h3>
          <p className="flex items-center gap-3"><Mail className="w-4 h-4 text-amber-500" /> contact@kannele-dogs.fr</p>
          <p className="flex items-center gap-3"><MapPin className="w-4 h-4 text-amber-500" /> Bénin</p>
        </div>
        <div className="space-y-3 text-sm">
          <h3 className="font-semibold text-white mb-4">Horaires</h3>
          <p>Lundi – Vendredi : 9h – 18h</p>
          <p>Samedi : 10h – 17h</p>
          <p>Dimanche : sur rendez-vous</p>
        </div>
      </div>
      <div className="border-t border-neutral-800 py-5 text-center text-xs text-neutral-400">
        © {new Date().getFullYear()} {brandName} — Tous droits réservés
      </div>
    </footer>
  );
}

export function Hero() {
  return (
    <section id="accueil" className="store-hero text-white">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-14 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8 lg:py-24">
        <div className="hero-copy">
          <p className="mb-5 flex items-center gap-2 text-sm font-semibold text-amber-200">
            <MapPin aria-hidden="true" className="h-4 w-4" /> Élevage au Bénin
          </p>
          <h1 className="store-heading mb-6 text-[clamp(2.6rem,6vw,5.5rem)] leading-[1.02]">
            Trouvez le compagnon <em>qui vous ressemble.</em>
          </h1>
          <p className="mb-8 max-w-md text-base leading-relaxed text-stone-300 sm:text-lg">
            Boebull, Malinois, Labrador, Cane Corso… Découvrez nos chiots de race,
            vaccinés et prêts à rejoindre votre famille.
          </p>
          <div className="flex flex-wrap items-center gap-3 sm:gap-5">
            <a href="#catalogue" className="store-cta inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-bold sm:px-7">
              Découvrir le catalogue <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
            </a>
            <a href="#engagements" className="rounded-full border border-white/25 px-5 py-3 text-sm font-semibold text-stone-100 transition-colors hover:border-amber-300 hover:text-amber-200">
              Nos engagements
            </a>
          </div>
        </div>
        <div className="hero-visual relative pb-6 sm:pb-0">
          <div className="hero-frame overflow-hidden rounded-[2rem]">
            <img
              src={`${import.meta.env.BASE_URL}chiots-accueil.jpg`}
              alt="Deux chiots dans l’herbe"
              width={1200}
              height={900}
              fetchPriority="high"
              className="aspect-[4/3] w-full object-cover lg:aspect-[5/4]"
            />
          </div>
          <div className="hero-note absolute bottom-0 left-3 flex items-center gap-3 rounded-2xl px-4 py-3 text-stone-900 sm:bottom-5 sm:left-5">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-100">
              <ShieldCheck aria-hidden="true" className="h-5 w-5 text-emerald-700" />
            </span>
            <div>
              <p className="text-sm font-bold">Chiots vaccinés et pucés</p>
              <p className="text-xs text-stone-600">Suivi vétérinaire</p>
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
  { icon: Truck, title: 'Livraison possible', text: 'Remise en main propre ou transport sécurisé au Bénin.' },
];

export function Engagements() {
  return (
    <section id="engagements" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="text-center mb-12">
        <h2 className="store-heading text-4xl text-neutral-900 sm:text-5xl">Nos engagements</h2>
        <p className="text-neutral-500 mt-3">Parce qu’adopter un chien est une grande décision, nous vous accompagnons.</p>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {ENGAGEMENTS.map(({ icon: Icon, title, text }) => (
          <div key={title} className="store-card rounded-2xl p-6">
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
