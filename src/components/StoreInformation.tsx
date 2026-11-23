import { ArrowUpRight, Check, Globe2 } from 'lucide-react';

const services = [
  'Vente de chiots de race',
  'Élevage et vente de chiens de race',
  'Import & export de chiens et de chats',
  'Assignation de vétérinaire (service vétérinaire)',
  'Vente d’accessoires & compléments alimentaires',
];

const breeds = [
  'Berger Allemand',
  'Boerboel',
  'Cane Corso',
  'American Bully',
  'Caniche',
  'Pitbull',
  'Berger de Caucase',
  'Bouledogue Français',
  'Et bien d’autres…',
];

const destinations = [
  ['🇹🇬', 'Togo'],
  ['🇬🇭', 'Ghana'],
  ['🇳🇬', 'Nigéria'],
  ['🇨🇲', 'Cameroun'],
  ['🇫🇷', 'France'],
  ['🇨🇮', 'Côte d’Ivoire'],
  ['🇿🇦', 'Afrique du Sud'],
];

export function StoreInformation() {
  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 pb-12 sm:px-6 lg:px-8">
      <div className="grid gap-6 lg:grid-cols-2">
        <section id="services" className="store-card rounded-3xl p-6 sm:p-8">
          <h2 className="store-heading mb-6 text-4xl">Nos services</h2>
          <ul className="divide-y divide-amber-100">
            {services.map((service) => (
              <li key={service} className="flex items-start gap-3 py-3 text-stone-700">
                <Check aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-amber-700" />
                {service}
              </li>
            ))}
          </ul>
        </section>
        <section id="races" className="store-card rounded-3xl p-6 sm:p-8">
          <h2 className="store-heading mb-6 text-4xl">Races disponibles</h2>
          <ul className="flex flex-wrap gap-2">
            {breeds.map((breed) => (
              <li key={breed} className="rounded-full bg-amber-50 px-4 py-2 text-sm font-medium text-amber-950">
                {breed}
              </li>
            ))}
          </ul>
          <a href="#catalogue" className="mt-6 inline-flex items-center gap-2 font-semibold text-amber-800 hover:underline">
            Voir les chiens du catalogue <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
          </a>
        </section>
      </div>
      <section id="livraison" className="store-hero rounded-3xl p-6 text-white sm:p-10">
        <h2 className="store-heading flex items-center gap-3 text-4xl">
          <Globe2 aria-hidden="true" className="h-7 w-7 shrink-0 text-amber-200" />
          Livraison internationale
        </h2>
        <ul className="mt-6 flex flex-wrap gap-2">
          {destinations.map(([flag, country]) => (
            <li key={country} className="rounded-full border border-white/20 px-4 py-2 text-sm">
              <span aria-hidden="true">{flag}</span> {country}
            </li>
          ))}
          <li className="rounded-full border border-white/20 px-4 py-2 text-sm">Etc.</li>
        </ul>
        <a href="#contact" className="mt-6 inline-flex items-center gap-2 font-semibold text-amber-200 hover:underline">
          Nous contacter pour une livraison <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
        </a>
      </section>
    </div>
  );
}
