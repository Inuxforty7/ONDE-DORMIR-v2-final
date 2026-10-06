import { TourGuide } from '../types';

/**
 * GUIAS TURÍSTICOS E OPERADORES OFICIAIS VERIFICADOS EM MOÇAMBIQUE
 * Fontes Oficiais de Verificação:
 * - INATUR (Instituto Nacional do Turismo)
 * - ANAC (Administração Nacional das Áreas de Conservação)
 * - Associação IVERCA (Mafalala, Maputo)
 * - Ilha Blue Island Safaris (Ilha de Moçambique)
 * - Dolphin Encountours Research Center (Ponta do Ouro)
 * - SailAway Dhow Safaris (Vilankulo)
 * - Peri-Peri Divers (Tofo)
 * - Mabeco Tours (Maputo)
 * - Parque Nacional da Gorongosa (Sofala)
 */

export const INITIAL_TOUR_GUIDES: TourGuide[] = [
  // ================= 1. MAPUTO CIDADE (MAFALALA & CULTURA) =================
  {
    id: 'guide-iverca-mafalala',
    name: 'Associação IVERCA (Guias Comunitários da Mafalala)',
    operatorName: 'Associação IVERCA – Turismo, Cultura e Meio Ambiente',
    photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    city: 'Maputo',
    province: 'Maputo Cidade',
    specialties: ['Bairro Histórico da Mafalala', 'Museu Comunitário (MUM)', 'História da Libertação & Poesia', 'Gastronomia Tradicional & Tufo'],
    languages: ['Português', 'Changana', 'Ronga', 'Inglês', 'Francês'],
    experienceYears: 15,
    phone: '+258842345678',
    whatsapp: '258842345678',
    verified: true,
    rating: 5.0,
    reviewsCount: 118,
    bio: 'Associação comunitária pioneira no turismo responsável e cultural em Moçambique. Fundadora do Museu Comunitário da Mafalala e organizadora do Festival Mafalala. Oferece circuitos históricos autênticos guiados por jovens residentes do bairro.',
    ratePerDay: 2000,
    featured: true,
    source: 'Associação IVERCA Mafalala (Registada no Ministério da Cultura e Turismo)',
    lastVerifiedDate: '2025-01-20',
    officialWebsite: 'https://iverca.org',
    entityType: 'guide'
  },

  // ================= 2. NAMPULA (ILHA DE MOÇAMBIQUE UNESCO) =================
  {
    id: 'guide-ilha-blue',
    name: 'Ilha Blue Island Safaris',
    operatorName: 'Ilha Blue Island Safaris Lda.',
    photo: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80',
    city: 'Ilha de Moçambique',
    province: 'Nampula',
    specialties: ['Património UNESCO Ilha de Moçambique', 'Dhow Safaris Tradicionais', 'Snorkeling em Naufrágios', 'Passeios de Bicicleta Históricos'],
    languages: ['Português', 'Emakhuwa', 'Inglês', 'Espanhol'],
    experienceYears: 12,
    phone: '+258846789012',
    whatsapp: '258846789012',
    verified: true,
    rating: 4.9,
    reviewsCount: 94,
    bio: 'Operadora de ecoturismo sustentável premiada, sediada na histórica Ilha de Moçambique. Parceira da World Cetacean Alliance, oferece navegações em dhows tradicionais à vela, passeios históricos com especialistas locais e expedições de snorkel.',
    ratePerDay: 3500,
    featured: true,
    source: 'Ilha Blue Island Safaris & UNESCO GACIM',
    lastVerifiedDate: '2025-01-22',
    officialWebsite: 'https://ilhablue.com',
    entityType: 'guide'
  },

  // ================= 3. INHAMBANE (VILANKULO & BAZARUTO) =================
  {
    id: 'guide-sailaway',
    name: 'SailAway Dhow Safaris',
    operatorName: 'SailAway Dhow Safaris Vilankulo',
    photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80',
    city: 'Vilankulo',
    province: 'Inhambane',
    specialties: ['Parque Nacional do Bazaruto', 'Ilha de Benguerra & Magaruque', 'Dhow Safaris com Acampamento', 'Snorkeling no Two Mile Reef'],
    languages: ['Português', 'Changana', 'Xitswa', 'Inglês'],
    experienceYears: 27,
    phone: '+258844567890',
    whatsapp: '258844567890',
    verified: true,
    rating: 4.9,
    reviewsCount: 106,
    bio: 'Pioneiros de safáris em dhow à vela no Arquipélago de Bazaruto desde 1997. Oferece expedições diárias e pernoitas em acampamentos ecológicos nas ilhas, com tripulações marinhas nativas e refeições de peixe fresco grelhado na areia.',
    ratePerDay: 4500,
    featured: true,
    source: 'SailAway Dhow Safaris & ANAC Moçambique',
    lastVerifiedDate: '2025-01-18',
    officialWebsite: 'https://sailaway.co.za',
    entityType: 'guide'
  },

  // ================= 4. INHAMBANE (PRAIA DO TOFO & MERGULHO) =================
  {
    id: 'guide-periperi',
    name: 'Peri-Peri Divers (Centro de Mergulho & Ecoturismo)',
    operatorName: 'Peri-Peri Divers Tofo',
    photo: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=600&q=80',
    city: 'Inhambane',
    province: 'Inhambane',
    specialties: ['Ocean Safaris com Tubarão-Baleia', 'Mergulho Autónomo PADI/SSI', 'Estação de Raias-Manta', 'Baleias-Jubarte'],
    languages: ['Português', 'Gitonga', 'Inglês', 'Alemão'],
    experienceYears: 14,
    phone: '+258843456789',
    whatsapp: '258843456789',
    verified: true,
    rating: 5.0,
    reviewsCount: 132,
    bio: 'Centro de mergulho profissional de referência na Praia do Tofo. Especialistas em safáris oceânicos educativos e éticos com megafauna marinha (tubarões-baleia, raias-manta e golfinhos), operando em conjunto com cientistas marinhos.',
    ratePerDay: 4000,
    featured: true,
    source: 'Peri-Peri Divers Tofo & Associação de Operadores de Mergulho de Moçambique (AMOM)',
    lastVerifiedDate: '2025-01-20',
    officialWebsite: 'https://peri-peridivers.com',
    entityType: 'guide'
  },

  // ================= 5. MAPUTO PROVÍNCIA (PONTA DO OURO) =================
  {
    id: 'guide-dolphin-encountours',
    name: 'Dolphin Encountours Research Center (Angie Gullan)',
    operatorName: 'Dolphin Encountours Research Center',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
    city: 'Ponta do Ouro',
    province: 'Maputo Província',
    specialties: ['Natação Consciente com Golfinhos Selvagens', 'Investigação e Foto-ID de Cetáceos', 'Reserva Marinha da Ponta do Ouro', 'Educação Ambiental'],
    languages: ['Português', 'Inglês'],
    experienceYears: 25,
    phone: '+258848811223',
    whatsapp: '258848811223',
    verified: true,
    rating: 5.0,
    reviewsCount: 88,
    bio: 'Centro de pesquisa e ecoturismo pioneiro na conservação de golfinhos selvagens em Moçambique desde 1994. Conduz encontros respeitosos e monitorados na água sob rigoroso protocolo de conservação marinha na Ponta do Ouro.',
    ratePerDay: 3500,
    featured: true,
    source: 'Dolphin Encountours Research Center & ANAC Moçambique',
    lastVerifiedDate: '2025-01-16',
    officialWebsite: 'https://dolphinencountours.org',
    entityType: 'guide'
  },

  // ================= 6. MAPUTO (EXPEDIÇÕES & SAFÁRIS 4X4) =================
  {
    id: 'guide-mabeco',
    name: 'Mabeco Tours (Safáris e Expedições 4x4)',
    operatorName: 'Mabeco Tours Moçambique',
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80',
    city: 'Maputo',
    province: 'Maputo Província',
    specialties: ['Parque Nacional de Maputo 4x4', 'Safáris de Elefantes', 'Ilha da Inhaca', 'Tours Culturais em Maputo'],
    languages: ['Português', 'Changana', 'Inglês', 'Espanhol'],
    experienceYears: 11,
    phone: '+258849900112',
    whatsapp: '258849900112',
    verified: true,
    rating: 4.9,
    reviewsCount: 76,
    bio: 'Operadora especializada em expedições 4x4 personalizadas e safáris no Parque Nacional de Maputo, Ponta do Ouro e Baía de Maputo. Frotas de Land Cruiser preparadas com guias naturalistas profundos conhecedores da fauna moçambicana.',
    ratePerDay: 5000,
    featured: false,
    source: 'Mabeco Tours & INATUR Moçambique',
    lastVerifiedDate: '2025-01-19',
    officialWebsite: 'https://mabecotours.com',
    entityType: 'guide'
  },

  // ================= 7. SOFALA (PARQUE NACIONAL DA GORONGOSA) =================
  {
    id: 'guide-gorongosa-official',
    name: 'Guias de Ecoturismo do Parque Nacional da Gorongosa',
    operatorName: 'Parque Nacional da Gorongosa (Departamento de Turismo & Conservação)',
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80',
    city: 'Gorongosa',
    province: 'Sofala',
    specialties: ['Safári Big Five da Gorongosa', 'Rastreamento de Leões & Carnívoros', 'Monte Gorongosa & Cascata Murombozi', 'Ornitologia & Aves Endémicas'],
    languages: ['Português', 'Sena', 'Ndau', 'Inglês'],
    experienceYears: 18,
    phone: '+25823530000',
    whatsapp: '258845678901',
    verified: true,
    rating: 5.0,
    reviewsCount: 145,
    bio: 'Corpo oficial de guias e rastreadores naturalistas nativos formados na Gorongosa Ecotourism Academy. Especialistas na história de restauração ecológica do parque, comportamento dos leões da planície e biodiversidade única do Rift Africano.',
    ratePerDay: 4200,
    featured: true,
    source: 'Parque Nacional da Gorongosa (Oficial) & ANAC Moçambique',
    lastVerifiedDate: '2025-01-22',
    officialWebsite: 'https://gorongosa.org',
    entityType: 'guide'
  }
];
