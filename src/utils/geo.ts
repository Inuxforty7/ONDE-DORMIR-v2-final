import { LocationCoordinates, UserLocationState } from '../types';

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
 * Formats distance in km or m for high readability in Mozambique:
 * e.g. "a 150 metros de si", "a 500 metros de si", "a 1.2 km de si", "a 5 km de si".
 */
export function formatDistance(distanceKm?: number): string {
  if (distanceKm === undefined || isNaN(distanceKm)) {
    return 'a poucos metros de si';
  }
  if (distanceKm < 1) {
    const meters = Math.max(50, Math.round(distanceKm * 1000));
    return `a ${meters} metros de si`;
  }
  if (distanceKm < 10) {
    return `a ${distanceKm.toFixed(1)} km de si`;
  }
  return `a ${Math.round(distanceKm)} km de si`;
}

/**
 * Short concise distance string without suffix (e.g. "150m", "1.2 km")
 */
export function formatDistanceShort(distanceKm?: number): string {
  if (distanceKm === undefined || isNaN(distanceKm)) {
    return '--';
  }
  if (distanceKm < 1) {
    const meters = Math.max(50, Math.round(distanceKm * 1000));
    return `${meters}m`;
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
export function getWhatsAppInquiryUrl(
  phoneClean: string | undefined, 
  accommodationName: string,
  customMessage?: string
): string {
  if (!phoneClean) return '#';
  // Clean phone number (remove +, spaces, dashes)
  let cleanNumber = phoneClean.replace(/[^0-9]/g, '');
  // If local Mozambique 9-digit number starting with 8, prefix with 258
  if (cleanNumber.length === 9 && cleanNumber.startsWith('8')) {
    cleanNumber = `258${cleanNumber}`;
  }
  const message = customMessage || `Olá! Encontrei a *${accommodationName}* no aplicativo *Onde Dormir*. Gostaria de confirmar disponibilidade e preços para quarto privado/casal. Obrigado!`;
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
  // Inhambane
  {
    id: 'inhambane-cidade',
    name: 'Inhambane (Cidade)',
    city: 'Inhambane',
    province: 'Inhambane',
    coords: { lat: -23.8650, lng: 35.3833 },
    popularNeighborhoods: ['Balane', 'Salela', 'Chambone', 'Aeroporto'],
  },
  {
    id: 'inhambane-tofo',
    name: 'Praia do Tofo (Inhambane)',
    city: 'Inhambane',
    province: 'Inhambane',
    coords: { lat: -23.8552, lng: 35.5458 },
    popularNeighborhoods: ['Tofo Beach', 'Tofinho', 'Barra'],
  },
  {
    id: 'vilankulo',
    name: 'Vilankulo (Inhambane)',
    city: 'Vilankulo',
    province: 'Inhambane',
    coords: { lat: -22.0134, lng: 35.3149 },
    popularNeighborhoods: ['Bairro Central', 'Zona da Praia', 'Chibuene'],
  },

  // Maputo Cidade
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

  // Maputo Província
  {
    id: 'matola',
    name: 'Matola (Cidade)',
    city: 'Matola',
    province: 'Maputo Província',
    coords: { lat: -25.9622, lng: 32.4589 },
    popularNeighborhoods: ['Fomento', 'Matola Rio', 'Machava', 'Liberdade', 'Tchumene'],
  },
  {
    id: 'ponta-ouro',
    name: 'Ponta do Ouro',
    city: 'Ponta do Ouro',
    province: 'Maputo Província',
    coords: { lat: -26.8456, lng: 32.8872 },
    popularNeighborhoods: ['Vila da Ponta', 'Praia', 'Ponta Malongane'],
  },

  // Sofala
  {
    id: 'beira',
    name: 'Beira (Centro & Macuti)',
    city: 'Beira',
    province: 'Sofala',
    coords: { lat: -19.8316, lng: 34.8389 },
    popularNeighborhoods: ['Ponta Gea', 'Macuti', 'Chiveve', 'Estoril', 'Munhava'],
  },

  // Nampula
  {
    id: 'nampula',
    name: 'Nampula (Cidade)',
    city: 'Nampula',
    province: 'Nampula',
    coords: { lat: -15.1165, lng: 39.2666 },
    popularNeighborhoods: ['Bairro Central', 'Muatala', 'Natikiri', 'Muhala'],
  },
  {
    id: 'ilha-mocambique',
    name: 'Ilha de Moçambique',
    city: 'Ilha de Moçambique',
    province: 'Nampula',
    coords: { lat: -15.0342, lng: 40.7303 },
    popularNeighborhoods: ['Cidade de Pedra', 'Bairro dos Pescadores', 'Fortaleza'],
  },

  // Gaza
  {
    id: 'bilene',
    name: 'Praia do Bilene',
    city: 'Bilene',
    province: 'Gaza',
    coords: { lat: -25.2633, lng: 33.2427 },
    popularNeighborhoods: ['Lagoa Uembje', 'Vila do Bilene'],
  },
  {
    id: 'xai-xai',
    name: 'Xai-Xai (Cidade & Praia)',
    city: 'Xai-Xai',
    province: 'Gaza',
    coords: { lat: -25.0444, lng: 33.6406 },
    popularNeighborhoods: ['Praia de Xai-Xai', 'Bairro 1', 'Bairro 2'],
  },

  // Tete
  {
    id: 'tete',
    name: 'Tete (Cidade)',
    city: 'Tete',
    province: 'Tete',
    coords: { lat: -16.1564, lng: 33.5863 },
    popularNeighborhoods: ['Francisco Manyanga', 'Degue', 'Matundo'],
  },

  // Cabo Delgado
  {
    id: 'pemba',
    name: 'Pemba',
    city: 'Pemba',
    province: 'Cabo Delgado',
    coords: { lat: -12.9739, lng: 40.5178 },
    popularNeighborhoods: ['Wimbe', 'Centro', 'Natite'],
  },

  // Manica
  {
    id: 'chimoio',
    name: 'Chimoio',
    city: 'Chimoio',
    province: 'Manica',
    coords: { lat: -19.1167, lng: 33.4833 },
    popularNeighborhoods: ['Centro', 'Vila Nova', 'Chissui'],
  },

  // Zambézia
  {
    id: 'quelimane',
    name: 'Quelimane',
    city: 'Quelimane',
    province: 'Zambézia',
    coords: { lat: -17.8786, lng: 36.8883 },
    popularNeighborhoods: ['Centro', 'Torrone', 'Zalala'],
  },

  // Niassa
  {
    id: 'lichinga',
    name: 'Lichinga',
    city: 'Lichinga',
    province: 'Niassa',
    coords: { lat: -13.3128, lng: 35.2406 },
    popularNeighborhoods: ['Centro', 'Chiuaula', 'Nomba'],
  },
];

/**
 * Finds the closest Mozambican preset city/province based on GPS coordinates.
 */
export function findNearestPresetLocation(lat: number, lng: number): MozLocationPreset {
  let nearest = MOZ_PRESET_LOCATIONS[0];
  let minDistance = Infinity;

  for (const preset of MOZ_PRESET_LOCATIONS) {
    const dist = calculateDistanceKm(lat, lng, preset.coords.lat, preset.coords.lng);
    if (dist < minDistance) {
      minDistance = dist;
      nearest = preset;
    }
  }

  return nearest;
}

/**
 * Checks if an item matches the user's active location.
 * When userLocation is set to a specific province/city, it ensures only items from that region are returned.
 */
export function isLocationMatched(
  itemProvince: string,
  itemCity: string | undefined,
  userLocation?: UserLocationState
): boolean {
  if (!userLocation || userLocation.isAllMozambique || !userLocation.province) {
    return true;
  }

  const normUserProv = userLocation.province.toLowerCase().trim();
  const normItemProv = (itemProvince || '').toLowerCase().trim();

  // If user selected "Maputo Cidade" vs "Maputo Província"
  if (normUserProv === 'maputo cidade' || normUserProv === 'maputo província') {
    if (normItemProv === normUserProv) return true;
    if (normItemProv === 'maputo' && normUserProv.includes('maputo')) return true;
  } else if (normItemProv.includes(normUserProv) || normUserProv.includes(normItemProv)) {
    return true;
  }

  return false;
}
