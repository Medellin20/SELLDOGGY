/*
# Seed starter catalog with sample dogs

1. Modified Tables
- `dogs`: inserts 6 example dogs (Boebull, Malinois, Labrador, Cane Corso, Rottweiler, Berger Allemand)
  so the storefront is not empty on first launch. Rows are only inserted if the table is empty,
  so re-running the migration never duplicates data.

2. Security
- No security changes; the existing RLS policies apply.
*/

INSERT INTO dogs (name, breed, description, price, age_months, gender, color, vaccinated, status, image_url)
SELECT * FROM (VALUES
  ('Rocky', 'Boebull', 'Boebull au caractère doux et joueur, très affectueux avec les enfants. Excellent gardien, éduqué et propre.', 350000, 4, 'male', 'Fauve délavé', true, 'available', 'https://images.pexels.com/photos/333083/pexels-photo-333083.jpeg?auto=compress&cs=tinysrgb&w=800'),
  ('Luna', 'Malinois', 'Malinois belge au tempérament vif et loyal, idéale pour la garde et le sport canin. Adorée par sa famille d''accueil.', 420000, 6, 'female', 'Fauve charbonné', true, 'available', 'https://images.pexels.com/photos/1612861/pexels-photo-1612861.jpeg?auto=compress&cs=tinysrgb&w=800'),
  ('Max', 'Labrador', 'Labrador noir au cœur tendre, parfait compagnon familial. Sociabilisé avec les autres animaux.', 280000, 3, 'male', 'Noir', true, 'available', 'https://images.pexels.com/photos/2253275/pexels-photo-2253275.jpeg?auto=compress&cs=tinysrgb&w=800'),
  ('Nala', 'Cane Corso', 'Cane Corso majestueuse et protectrice, dressée aux bases de l''obéissance. Garde naturelle exceptionnelle.', 550000, 8, 'female', 'Bleu', true, 'reserved', 'https://images.pexels.com/photos/1851164/pexels-photo-1851164.jpeg?auto=compress&cs=tinysrgb&w=800'),
  ('Titus', 'Rottweiler', 'Rottweiler puissant et équilibré, issu d''une lignée de champions. Très attaché à ses maîtres.', 480000, 5, 'male', 'Noir et feu', true, 'available', 'https://images.pexels.com/photos/2196819/pexels-photo-2196819.jpeg?auto=compress&cs=tinysrgb&w=800'),
  ('Maya', 'Berger Allemand', 'Berger Allemand au pelage doré, intelligente et affectueuse. Apte à la garde comme à la compagnie.', 390000, 7, 'female', 'Doré', true, 'sold', 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=800')
) AS seed(name, breed, description, price, age_months, gender, color, vaccinated, status, image_url)
WHERE NOT EXISTS (SELECT 1 FROM dogs);