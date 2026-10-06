import { AmenityId, PropertyServiceId, RoomFeatureId, Accommodation } from '../types';

export interface AmenityMetadata {
  id: AmenityId;
  name: string;
  iconName: string;
  shortDesc: string;
}

export interface PropertyServiceMeta {
  id: PropertyServiceId;
  name: string;
  iconName: string;
  shortDesc: string;
}

export interface RoomFeatureMeta {
  id: RoomFeatureId;
  name: string;
  iconName: string;
  shortDesc: string;
}

export const PROPERTY_SERVICES_CATALOG: Record<PropertyServiceId, PropertyServiceMeta> = {
  bar: {
    id: 'bar',
    name: 'Bar / Bebidas',
    iconName: 'Wine',
    shortDesc: 'Bar no estabelecimento com bebidas e snacks',
  },
  restaurant: {
    id: 'restaurant',
    name: 'Restaurante / Refeições',
    iconName: 'Utensils',
    shortDesc: 'Serviço de refeições no local',
  },
  pool: {
    id: 'pool',
    name: 'Piscina',
    iconName: 'Waves',
    shortDesc: 'Piscina privativa para hóspedes',
  },
  parking: {
    id: 'parking',
    name: 'Estacionamento Seguro',
    iconName: 'Car',
    shortDesc: 'Parqueamento vedado e vigiado',
  },
  wifi: {
    id: 'wifi',
    name: 'Wi-Fi Grátis',
    iconName: 'Wifi',
    shortDesc: 'Internet sem fios em todo o estabelecimento',
  },
  generator: {
    id: 'generator',
    name: 'Gerador / Energia 24h',
    iconName: 'Zap',
    shortDesc: 'Energia alternativa garantida sem cortes',
  },
  reception_24h: {
    id: 'reception_24h',
    name: 'Recepção 24 Horas',
    iconName: 'Clock',
    shortDesc: 'Atendimento contínuo dia e noite',
  },
  security: {
    id: 'security',
    name: 'Segurança / Portaria 24h',
    iconName: 'ShieldCheck',
    shortDesc: 'Guarda e portaria permanente',
  },
  breakfast: {
    id: 'breakfast',
    name: 'Pequeno-Almoço',
    iconName: 'Coffee',
    shortDesc: 'Pequeno-almoço servido no local',
  },
};

export const ROOM_FEATURES_CATALOG: Record<RoomFeatureId, RoomFeatureMeta> = {
  ac: {
    id: 'ac',
    name: 'Ar Condicionado',
    iconName: 'Wind',
    shortDesc: 'Quartos climatizados individualmente',
  },
  double_bed: {
    id: 'double_bed',
    name: 'Cama de Casal',
    iconName: 'BedDouble',
    shortDesc: 'Cama de casal confortável e espaçosa',
  },
  private_bathroom: {
    id: 'private_bathroom',
    name: 'Casa de Banho Privativa',
    iconName: 'Bath',
    shortDesc: 'WC privativo e exclusivo dentro do quarto',
  },
  tv: {
    id: 'tv',
    name: 'Televisão / DStv',
    iconName: 'Tv',
    shortDesc: 'TV por satélite no quarto',
  },
  hot_water: {
    id: 'hot_water',
    name: 'Água Quente',
    iconName: 'Flame',
    shortDesc: 'Água quente canalizada (termoacumulador)',
  },
  balcony: {
    id: 'balcony',
    name: 'Varanda Privativa',
    iconName: 'Sun',
    shortDesc: 'Acesso a varanda exterior privativa',
  },
  fan: {
    id: 'fan',
    name: 'Ventilador',
    iconName: 'Fan',
    shortDesc: 'Ventilador de teto ou de pé',
  },
  desk: {
    id: 'desk',
    name: 'Secretária / Mesa',
    iconName: 'Laptop',
    shortDesc: 'Mesa de trabalho ou apoio',
  },
};

/**
 * Returns the resolved property services for an accommodation.
 */
export function getPropertyServicesForAccommodation(acc: Accommodation): PropertyServiceMeta[] {
  const result: PropertyServiceMeta[] = [];
  const serviceKeys: PropertyServiceId[] = [
    'bar',
    'restaurant',
    'pool',
    'parking',
    'wifi',
    'generator',
    'reception_24h',
    'security',
    'breakfast',
  ];

  for (const k of serviceKeys) {
    let hasIt = false;
    if (acc.propertyServices && acc.propertyServices.includes(k)) {
      hasIt = true;
    } else if (k === 'reception_24h' && acc.isOpen24h) {
      hasIt = true;
    } else if (acc.amenities && acc.amenities.includes(k as any)) {
      hasIt = true;
    } else if (k === 'bar' && acc.description.toLowerCase().includes('bar')) {
      hasIt = true;
    } else if (k === 'restaurant' && acc.description.toLowerCase().includes('restaurante')) {
      hasIt = true;
    } else if (k === 'pool' && (acc.description.toLowerCase().includes('piscina') || acc.amenities.includes('pool'))) {
      hasIt = true;
    }

    if (hasIt && PROPERTY_SERVICES_CATALOG[k]) {
      result.push(PROPERTY_SERVICES_CATALOG[k]);
    }
  }

  return result;
}

/**
 * Returns the resolved room features for an accommodation.
 */
export function getRoomFeaturesForAccommodation(acc: Accommodation): RoomFeatureMeta[] {
  const result: RoomFeatureMeta[] = [];
  const roomKeys: RoomFeatureId[] = [
    'ac',
    'double_bed',
    'private_bathroom',
    'tv',
    'hot_water',
    'balcony',
    'fan',
    'desk',
  ];

  for (const k of roomKeys) {
    let hasIt = false;
    if (acc.roomFeatures && acc.roomFeatures.includes(k)) {
      hasIt = true;
    } else if (k === 'double_bed' && (
      acc.amenities.includes('private_bathroom') ||
      acc.description.toLowerCase().includes('casal') ||
      acc.description.toLowerCase().includes('suíte') ||
      acc.description.toLowerCase().includes('privativo')
    )) {
      hasIt = true;
    } else if (acc.amenities && acc.amenities.includes(k as any)) {
      hasIt = true;
    } else if (k === 'balcony' && acc.description.toLowerCase().includes('varanda')) {
      hasIt = true;
    }

    if (hasIt && ROOM_FEATURES_CATALOG[k]) {
      result.push(ROOM_FEATURES_CATALOG[k]);
    }
  }

  return result;
}

export const AMENITIES_CATALOG: Record<AmenityId, AmenityMetadata> = {
  ac: {
    id: 'ac',
    name: 'Ar Condicionado',
    iconName: 'Wind',
    shortDesc: 'Quartos climatizados',
  },
  wifi: {
    id: 'wifi',
    name: 'Wi-Fi Grátis',
    iconName: 'Wifi',
    shortDesc: 'Internet sem fios',
  },
  parking: {
    id: 'parking',
    name: 'Estacionamento Seguro',
    iconName: 'Car',
    shortDesc: 'Parqueamento vedado/vigilado',
  },
  generator: {
    id: 'generator',
    name: 'Gerador / Energia 24h',
    iconName: 'Zap',
    shortDesc: 'Energia alternativa garantida',
  },
  private_bathroom: {
    id: 'private_bathroom',
    name: 'Casa de Banho Privada',
    iconName: 'Bath',
    shortDesc: 'WC privativo no quarto',
  },
  double_bed: {
    id: 'double_bed',
    name: 'Cama de Casal',
    iconName: 'BedDouble',
    shortDesc: 'Quarto com cama de casal',
  },
  breakfast: {
    id: 'breakfast',
    name: 'Pequeno-Almoço',
    iconName: 'Coffee',
    shortDesc: 'Disponível no local',
  },
  restaurant: {
    id: 'restaurant',
    name: 'Restaurante / Refeições',
    iconName: 'Utensils',
    shortDesc: 'Serviço de refeições',
  },
  tv: {
    id: 'tv',
    name: 'Televisão / DStv',
    iconName: 'Tv',
    shortDesc: 'TV por satélite no quarto',
  },
  pool: {
    id: 'pool',
    name: 'Piscina',
    iconName: 'Waves',
    shortDesc: 'Piscina para hóspedes',
  },
  security: {
    id: 'security',
    name: 'Segurança 24h',
    iconName: 'ShieldCheck',
    shortDesc: 'Guarda e portaria permanente',
  },
  bar: {
    id: 'bar',
    name: 'Bar / Bebidas',
    iconName: 'Wine',
    shortDesc: 'Bebidas frescas e snacks',
  },
  hot_water: {
    id: 'hot_water',
    name: 'Água Quente',
    iconName: 'Flame',
    shortDesc: 'Termoacumulador funcional',
  },
};

export const ACCOMMODATION_TYPE_LABELS: Record<string, { label: string; badgeColor: string; description: string }> = {
  pensao: {
    label: 'Pensão',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    description: 'Hospedagem local acolhedora, quartos práticos e preço acessível para pernoita',
  },
  guest_house: {
    label: 'Guest House',
    badgeColor: 'bg-teal-100 text-teal-800 border-teal-200',
    description: 'Acolhimento familiar com conforto, quartos privativos e ambiente tranquilo',
  },
  residencial: {
    label: 'Residencial',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
    description: 'Alojamento local prático com quartos mobilados para pernoita segura',
  },
};
