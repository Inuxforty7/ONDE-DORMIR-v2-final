import { AmenityId } from '../types';

export interface AmenityMetadata {
  id: AmenityId;
  name: string;
  iconName: string;
  shortDesc: string;
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
