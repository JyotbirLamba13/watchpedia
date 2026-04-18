// Fill missing strapMaterial for known watch models
// Usage: npx tsx scripts/fill-strap-material.ts

import * as fs from 'fs';
import * as path from 'path';

// [brandSlug, watchName (partial match)] → strapMaterial
const STRAP_MAP: Array<[string, string, string]> = [
  // Blancpain
  ['blancpain', 'Fifty Fathoms Automatique Titanium', 'Titanium bracelet'],
  ['blancpain', 'Fifty Fathoms Automatique', 'Stainless steel bracelet'],
  ['blancpain', 'Fifty Fathoms Bathyscaphe Flyback', 'Stainless steel bracelet'],
  ['blancpain', 'Fifty Fathoms Bathyscaphe', 'Stainless steel bracelet'],
  ['blancpain', 'Fifty Fathoms Barakuda', 'Stainless steel bracelet'],
  ['blancpain', 'Villeret', 'Alligator leather strap'],

  // Breguet
  ['breguet', 'Classique', 'Alligator leather strap'],
  ['breguet', 'Marine 5517 Titanium', 'Rubber strap'],
  ['breguet', 'Marine Chronograph', 'Rubber strap'],
  ['breguet', 'Tradition', 'Alligator leather strap'],
  ['breguet', 'Type XX', 'Stainless steel bracelet'],

  // Oris
  ['oris', 'Aquis', 'Stainless steel bracelet'],
  ['oris', 'Divers Sixty-Five', 'Stainless steel bracelet'],
  ['oris', 'Big Crown ProPilot', 'Stainless steel bracelet'],

  // Hublot
  ['hublot', 'Big Bang Unico', 'Rubber strap'],
  ['hublot', 'Spirit of Big Bang', 'Rubber strap'],
  ['hublot', 'Classic Fusion Chronograph', 'Rubber strap'],
  ['hublot', 'MP-05 LaFerrari', 'Rubber strap'],

  // Zenith
  ['zenith', 'Defy Skyline', 'Stainless steel bracelet'],
  ['zenith', 'Pilot Type 20 Extra Special', 'Leather strap'],
  ['zenith', 'Defy Extreme', 'Rubber strap'],

  // Panerai
  ['panerai', 'Luminor Due', 'Alligator leather strap'],
  ['panerai', 'Submersible', 'Rubber strap'],
  ['panerai', 'Radiomir California', 'Leather strap'],

  // Tissot
  ['tissot', 'PRX', 'Stainless steel bracelet'],
];

interface Watch {
  brandSlug: string;
  name: string;
  specs: { strapMaterial?: string; [key: string]: unknown };
}

const dataPath = path.join(__dirname, '..', 'src', 'data', 'watches.json');
const watches: Watch[] = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

let filled = 0;

for (const watch of watches) {
  if (watch.specs.strapMaterial) continue;

  for (const [brand, nameMatch, strap] of STRAP_MAP) {
    if (watch.brandSlug === brand && watch.name.includes(nameMatch)) {
      watch.specs.strapMaterial = strap;
      console.log(`  ${watch.brandSlug} ${watch.name} → ${strap}`);
      filled++;
      break;
    }
  }
}

fs.writeFileSync(dataPath, JSON.stringify(watches, null, 2));
console.log(`\nFilled ${filled} strap materials.`);

// Report what's still missing
const still = watches.filter(w => !w.specs.strapMaterial);
console.log(`Still missing (${still.length}): ${[...new Set(still.map(w => w.brandSlug))].join(', ')}`);
