export interface WatchGroup {
  slug: string;
  name: string;
  country: string;
  description: string;
  website?: string;
  brandSlugs: string[];
}

export interface Brand {
  slug: string;
  name: string;
  country: string;
  groupSlug: string | null;
  founded: number;
  description: string;
  website?: string;
}

export interface Watch {
  reference: string;
  slug: string;
  brandSlug: string;
  name: string;
  collection: string;
  description: string;
  image?: string;
  specs: WatchSpecs;
  featured?: boolean;
  history?: string;
  notableWearers?: string[];
  highestSalePrice?: string;
  funFacts?: string[];
}

export interface WatchSpecs {
  movement: string;
  movementType: string;
  caseMaterial: string;
  caseDiameter: string;
  caseThickness?: string;
  waterResistance?: string;
  crystal: string;
  dialColor: string;
  strapMaterial?: string;
  powerReserve?: string;
  frequency?: string;
  complications?: string[];
  price?: string;
  yearIntroduced?: number;
}

export interface Country {
  slug: string;
  name: string;
  flag: string;
}
