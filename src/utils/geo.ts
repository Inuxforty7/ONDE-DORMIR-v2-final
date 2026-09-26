import { LocationCoordinates } from '../types';

/**
 * Calculates Haversine distance between two coordinates in kilometers.
 */
export function calculateDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Radius of Earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function deg2rad(deg: number): number {
  return deg * (Math.PI / 180);
}

/**
 * Formats distance in km or m for readability in Mozambique.
 */
export function formatDistance(distanceKm?: number): string {
  if (distanceKm === undefined || isNaN(distanceKm)) {
    return '-- km';
  }
  if (distanceKm < 1) {
    const meters = Math.round(distanceKm * 1000);
    return `${meters} m`;
  }
  if (distanceKm < 10) {
    return `${distanceKm.toFixed(1)} km`;
  }
  return `${Math.round(distanceKm)} km`;
}

/**
 * Generates navigation URL to open device native GPS navigation or Google Maps.
 */
export function getDirectionsUrl(lat: number, lng: number, placeName?: string): string {
  const query = placeName ? encodeURIComponent(placeName) : `${lat},${lng}`;
  return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&destination_place_id=${query}`;
}

/**
 * Generates direct WhatsApp click-to-chat URL with inquiry message.
 */
export function getWhatsAppInquiryUrl(phoneClean: string, accommodationName: string): string {
  // Clean phone number (remove +, spaces, dashes)
  let cleanNumber = phoneClean.replace(/[^0-9]/g, '');
  // If local Mozambique 9-digit number starting with 8, prefix with 258
  if (cleanNumber.length === 9 && cleanNumber.startsWith('8')) {
    cleanNumber = `258${cleanNumber}`;
  }
  const message = `Olá! Encontrei o estabelecimento *${accommodationName}* no aplicativo *Onde Dormir*. Gostaria de saber a disponibilidade atual de quartos e os preços das diárias. Obrigado!`;
  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
}

/**
 * Default preset locations in Mozambique for easy manual browsing.
 */
export interface MozLocationPreset {
  id: string;
  name: string;
  city: string;
  province: string;
  coords: LocationCoordinates;
  popularNeighborhoods: string[];
}

export const MOZ_PRESET_LOCATIONS: MozLocationPreset[] = [
  {
    id: 'maputo-central',
    name: 'Maputo (Centro & Polana)',
    city: 'Maputo',
    province: 'Maputo Cidade',
    coords: { lat: -25.9692, lng: 32.5732 },
    popularNeighborhoods: ['Polana Cimento', 'Sommerschield', 'Baixa', 'Central', 'Malhangalene', 'Coop'],
  },
  {
    id: 'maputo-costa',
    name: 'Maputo (Costa do Sol & Triunfo)',
    city: 'Maputo',
    province: 'Maputo Cidade',
    coords: { lat: -25.9225, lng: 32.6178 },
    popularNeighborhoods: ['Costa do Sol', 'Triunfo', 'Mavalane', 'Zimpeto'],
  },
  {
    id: 'matola',
    name: 'Matola (Cidade)',
    city: 'Matola',
    province: 'Maputo Província',
    coords: { lat: -25.9622, lng: 32.4589 },
    popularNeighborhoods: ['Fomento', 'Matola Rio', 'Machava', 'Liberdade', 'Tchumene'],
  },
  {
    id: 'beira',
    name: 'Beira (Centro & Macuti)',
    city: 'Beira',
    province: 'Sofala',
    coords: { lat: -19.8316, lng: 34.8389 },
    popularNeighborhoods: ['Ponta Gea', 'Macuti', 'Chiveve', 'Estoril', 'Munhava'],
  },
  {
    id: 'vilankulo',
    name: 'Vilankulo',
    city: 'Vilankulo',
    province: 'Inhambane',
    coords: { lat: -22.0134, lng: 35.3149 },
    popularNeighborhoods: ['Bairro Central', 'Zona da Praia', 'Chibuene'],
  },
  {
    id: 'nampula',
    name: 'Nampula (Cidade)',
    city: 'Nampula',
    province: 'Nampula',
    coords: { lat: -15.1165, lng: 39.2666 },
    popularNeighborhoods: ['Bairro Central', 'Muatala', 'Natikiri', 'Muhala'],
  },
  {
    id: 'ponta-ouro',
    name: 'Ponta do Ouro',
    city: 'Ponta do Ouro',
    province: 'Maputo Província',
    coords: { lat: -26.8456, lng: 32.8872 },
    popularNeighborhoods: ['Vila da Ponta', 'Praia', 'Ponta Malongane'],
  },
  {
    id: 'bilene',
    name: 'Praia do Bilene',
    city: 'Bilene',
    province: 'Gaza',
    coords: { lat: -25.2633, lng: 33.2427 },
    popularNeighborhoods: ['Lagoa Uembje', 'Vila do Bilene'],
  },
  {
    id: 'tete',
    name: 'Tete (Cidade)',
    city: 'Tete',
    province: 'Tete',
    coords: { lat: -16.1564, lng: 33.5863 },
    popularNeighborhoods: ['Francisco Manyanga', 'Degue', 'Matundo'],
  },
  {
    id: 'pemba',
    name: 'Pemba',
    city: 'Pemba',
    province: 'Cabo Delgado',
    coords: { lat: -12.9739, lng: 40.5178 },
    popularNeighborhoods: ['Wimbe', 'Centro', 'Natite'],
  },
];
