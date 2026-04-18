// Fill missing powerReserve and frequency from a movement lookup table.
// Quartz/solar/digital → "N/A". Mechanical → known values.
// Usage: npx tsx scripts/fill-movement-specs.ts

import * as fs from 'fs';
import * as path from 'path';

// Quartz / solar / digital types — powerReserve and frequency are N/A
const QUARTZ_TYPES = new Set(['Quartz', 'Solar quartz', 'Quartz (digital)', 'Quartz (analog-digital)', 'Meca-Quartz']);

// Known movement specs: [powerReserve, frequency]
const MOVEMENT_SPECS: Record<string, { pr?: string; freq?: string }> = {
  // Seiko
  'Seiko NH35A':      { pr: '41.5 hours', freq: '21,600 vph' },
  'Seiko NH35':       { pr: '41.5 hours', freq: '21,600 vph' },
  'Seiko NH34':       { pr: '70 hours',   freq: '21,600 vph' },
  'Seiko NH38':       { pr: '50 hours',   freq: '21,600 vph' },

  // Miyota
  'Miyota 8215':      { pr: '42 hours',   freq: '21,600 vph' },
  'Miyota 9039':      { pr: '42 hours',   freq: '28,800 vph' },

  // HMT (Indian, based on ETA/Citizen architecture)
  'HMT 0231':         { pr: '40 hours',   freq: '18,000 vph' },
  'HMT 6401':         { pr: '40 hours',   freq: '18,000 vph' },
  'HMT 2809':         { pr: '40 hours',   freq: '18,000 vph' },

  // Oris
  'Oris Calibre 400': { freq: '28,800 vph' }, // PR already in data
  'Oris Calibre 733': { pr: '38 hours',   freq: '28,800 vph' },
  'Oris Calibre 751': { freq: '28,800 vph' },
  'Oris Calibre 752': { freq: '28,800 vph' },
  'Oris Calibre 771': { pr: '38 hours',   freq: '28,800 vph' },

  // Panerai
  'P.900':            { freq: '21,600 vph' }, // PR already in data
  'P.6000':           { freq: '21,600 vph' },

  // Tissot
  'Powermatic 80':    { freq: '25,200 vph' }, // PR already in data

  // Zenith
  'El Primero 3620':  { freq: '36,000 vph' },
  'El Primero 9004':  { freq: '36,000 vph' },
  'Elite 679':        { freq: '28,800 vph' },

  // Hublot
  'UNICO HUB1280':        { freq: '28,800 vph' },
  'UNICO HUB4700':        { freq: '28,800 vph' },
  'HUB1153':              { freq: '28,800 vph' },
  'HUB9005.H1.PN.1':      { freq: '28,800 vph' },

  // Blancpain
  'Calibre 1315':     { freq: '28,800 vph' }, // 120h PR already in data
  'Calibre 1150':     { freq: '28,800 vph' }, // 100h PR already in data
  'Calibre 1151':     { freq: '28,800 vph' }, // 100h PR already in data
  'Calibre F385':     { freq: '36,000 vph' }, // El Primero-based flyback, 50h PR already in data
  'Calibre 6654':     { freq: '28,800 vph' }, // 72h PR already in data
  'Calibre 11C5':     { pr: '100 hours',  freq: '21,600 vph' }, // ultra-thin auto
  'Calibre 66CM8':    { pr: '72 hours',   freq: '21,600 vph' }, // monopoussoir chrono

  // Breguet
  'Calibre 777Q':     { freq: '21,600 vph' }, // 55h PR already in data
  'Calibre 777A':     { freq: '21,600 vph' }, // 55h PR already in data
  'Calibre 502.3':    { pr: '50 hours',   freq: '21,600 vph' }, // ultra-thin manual
  'Calibre 502.3 DRP1': { pr: '50 hours', freq: '21,600 vph' },
  'Calibre 505 SR1':  { freq: '21,600 vph' }, // 50h PR already in data
  'Calibre 580DR':    { pr: '50 hours',   freq: '28,800 vph' }, // Tradition chrono indép.
  'Calibre 582 Q/A':  { pr: '48 hours',   freq: '28,800 vph' }, // Marine chrono
  'Calibre 728':      { freq: '28,800 vph' }, // 60h PR already in data
};

interface WatchSpecs {
  movementType: string;
  movement: string;
  powerReserve?: string;
  frequency?: string;
  [key: string]: unknown;
}

interface Watch {
  specs: WatchSpecs;
  [key: string]: unknown;
}

const dataPath = path.join(__dirname, '..', 'src', 'data', 'watches.json');
const watches: Watch[] = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

let filled = 0;
let quartzMarked = 0;

for (const watch of watches) {
  const s = watch.specs;

  // Quartz/solar/digital: mark both as N/A if not set
  if (QUARTZ_TYPES.has(s.movementType)) {
    let changed = false;
    if (!s.powerReserve) { s.powerReserve = 'N/A'; changed = true; }
    if (!s.frequency)    { s.frequency = 'N/A';    changed = true; }
    if (changed) quartzMarked++;
    continue;
  }

  // Mechanical: look up from table
  const lookup = MOVEMENT_SPECS[s.movement];
  if (!lookup) continue;

  if (!s.powerReserve && lookup.pr) { s.powerReserve = lookup.pr; filled++; }
  if (!s.frequency && lookup.freq)  { s.frequency = lookup.freq;  filled++; }
}

fs.writeFileSync(dataPath, JSON.stringify(watches, null, 2));
console.log(`Filled ${filled} mechanical movement fields.`);
console.log(`Marked ${quartzMarked} quartz/solar watches as N/A.`);
