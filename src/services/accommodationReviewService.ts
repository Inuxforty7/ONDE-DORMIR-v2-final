export interface AccommodationDetailedRating {
  conforto: number;    // 1 to 5 (Conforto)
  limpeza: number;     // 1 to 5 (Limpeza)
  atendimento: number; // 1 to 5 (Atendimento)
  localizacao: number; // 1 to 5 (Localização)
  seguranca: number;   // 1 to 5 (Segurança)
}

export interface AccommodationReview {
  id: string;
  accommodationId: string;
  accommodationName: string;
  userName: string;
  userCity?: string;
  date: string;
  ratings: AccommodationDetailedRating;
  overallRating: number; // Average of all 5 criteria
  comment?: string;
  createdAt: number;
}

const STORAGE_KEY = 'onde_dormir_accommodation_reviews';

const INITIAL_MOCK_REVIEWS: AccommodationReview[] = [
  {
    id: 'rev-acc-1',
    accommodationId: 'moz-martins',
    accommodationName: 'Pensão Martins',
    userName: 'Nelson Mabunda',
    userCity: 'Maputo',
    date: 'Há 2 dias',
    ratings: {
      conforto: 5,
      limpeza: 5,
      atendimento: 5,
      localizacao: 5,
      seguranca: 5,
    },
    overallRating: 5.0,
    comment: 'Excelente acolhimento e quartos muito limpos. A localização no centro facilita deslocações e reuniões de trabalho.',
    createdAt: Date.now() - 1000 * 60 * 60 * 48,
  },
  {
    id: 'rev-acc-2',
    accommodationId: 'moz-martins',
    accommodationName: 'Pensão Martins',
    userName: 'Sara Tembe',
    userCity: 'Matola',
    date: 'Há 5 dias',
    ratings: {
      conforto: 4,
      limpeza: 5,
      atendimento: 5,
      localizacao: 5,
      seguranca: 4,
    },
    overallRating: 4.6,
    comment: 'Piscina refrescante e ambiente tranquilo. Pequeno-almoço saboroso.',
    createdAt: Date.now() - 1000 * 60 * 60 * 120,
  },
  {
    id: 'rev-acc-3',
    accommodationId: 'moz-guesthouse-1109',
    accommodationName: 'Guesthouse 1109',
    userName: 'Dra. Elsa Manjate',
    userCity: 'Maputo',
    date: 'Há 3 dias',
    ratings: {
      conforto: 5,
      limpeza: 5,
      atendimento: 5,
      localizacao: 5,
      seguranca: 5,
    },
    overallRating: 5.0,
    comment: 'Jardim espetacular na Polana e recepção muito acolhedora. Quarto super confortável.',
    createdAt: Date.now() - 1000 * 60 * 60 * 72,
  },
  {
    id: 'rev-acc-4',
    accommodationId: 'moz-nacional',
    accommodationName: 'Pensão Nacional',
    userName: 'Cláudio Nhantumbo',
    userCity: 'Maputo',
    date: 'Há 1 semana',
    ratings: {
      conforto: 4,
      limpeza: 5,
      atendimento: 5,
      localizacao: 5,
      seguranca: 5,
    },
    overallRating: 4.8,
    comment: 'Muito bem localizado na Baixa de Maputo com acesso rápido a transportes e comércio.',
    createdAt: Date.now() - 1000 * 60 * 60 * 168,
  },
  {
    id: 'rev-acc-5',
    accommodationId: 'moz-casa-do-mar-tofo',
    accommodationName: 'Casa do Mar Guest House',
    userName: 'Fátima Ibraimo',
    userCity: 'Inhambane',
    date: 'Há 4 dias',
    ratings: {
      conforto: 5,
      limpeza: 5,
      atendimento: 5,
      localizacao: 5,
      seguranca: 5,
    },
    overallRating: 5.0,
    comment: 'Vista incrível para a Praia do Tofo e atendimento nota 10. Quartos arejados e muito seguros.',
    createdAt: Date.now() - 1000 * 60 * 60 * 96,
  },
  {
    id: 'rev-acc-6',
    accommodationId: 'moz-pachica',
    accommodationName: 'Pachica Guesthouse',
    userName: 'Armando Cumbane',
    userCity: 'Praia do Bilene',
    date: 'Há 6 dias',
    ratings: {
      conforto: 5,
      limpeza: 5,
      atendimento: 5,
      localizacao: 5,
      seguranca: 5,
    },
    overallRating: 5.0,
    comment: 'Ambiente acolhedor junto à lagoa de Bilene, excelente atendimento e limpeza impecável.',
    createdAt: Date.now() - 1000 * 60 * 60 * 144,
  },
];

type Listener = () => void;

class AccommodationReviewService {
  private listeners: Set<Listener> = new Set();

  public subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify(): void {
    this.listeners.forEach((l) => {
      try {
        l();
      } catch (e) {
        // ignore
      }
    });
  }

  public getAllReviews(): AccommodationReview[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        return JSON.parse(raw);
      }
    } catch (e) {
      // fallback
    }
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_MOCK_REVIEWS));
    } catch {}
    return INITIAL_MOCK_REVIEWS;
  }

  private saveReviews(list: AccommodationReview[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
      this.notify();
    } catch (e) {
      // fallback
    }
  }

  public getReviewsByAccommodationId(accommodationId: string): AccommodationReview[] {
    return this.getAllReviews().filter((r) => r.accommodationId === accommodationId);
  }

  /**
   * All 5 criteria contribute to the overall rating of the specific accommodation being reviewed.
   * Rating applies ONLY to the specific Hotel, Pensão or Guest House.
   */
  public getAccommodationRatingStats(
    accommodationId: string,
    fallbackInitial?: { rating?: number; reviewsCount?: number }
  ): {
    rating: number;
    reviewsCount: number;
    breakdown: {
      conforto: number;
      limpeza: number;
      atendimento: number;
      localizacao: number;
      seguranca: number;
    };
  } {
    const reviews = this.getReviewsByAccommodationId(accommodationId);
    if (reviews.length === 0) {
      const baseRating = fallbackInitial?.rating || 4.8;
      const baseCount = fallbackInitial?.reviewsCount || 0;
      return {
        rating: baseRating,
        reviewsCount: baseCount,
        breakdown: {
          conforto: baseRating,
          limpeza: baseRating,
          atendimento: baseRating,
          localizacao: baseRating,
          seguranca: baseRating,
        },
      };
    }

    let sumConforto = 0;
    let sumLimpeza = 0;
    let sumAtendimento = 0;
    let sumLocalizacao = 0;
    let sumSeguranca = 0;

    reviews.forEach((r) => {
      sumConforto += r.ratings.conforto;
      sumLimpeza += r.ratings.limpeza;
      sumAtendimento += r.ratings.atendimento;
      sumLocalizacao += r.ratings.localizacao;
      sumSeguranca += r.ratings.seguranca;
    });

    const count = reviews.length;
    const avgConforto = Number((sumConforto / count).toFixed(1));
    const avgLimpeza = Number((sumLimpeza / count).toFixed(1));
    const avgAtendimento = Number((sumAtendimento / count).toFixed(1));
    const avgLocalizacao = Number((sumLocalizacao / count).toFixed(1));
    const avgSeguranca = Number((sumSeguranca / count).toFixed(1));

    // All 5 criteria contribute to the overall rating of the specific accommodation
    const overallRating = Number(
      ((avgConforto + avgLimpeza + avgAtendimento + avgLocalizacao + avgSeguranca) / 5).toFixed(1)
    );

    return {
      rating: overallRating,
      reviewsCount: count,
      breakdown: {
        conforto: avgConforto,
        limpeza: avgLimpeza,
        atendimento: avgAtendimento,
        localizacao: avgLocalizacao,
        seguranca: avgSeguranca,
      },
    };
  }

  /**
   * Submit Review:
   * Name = required
   * Star ratings = required (all 5 criteria)
   * Comment = optional (submission allowed with only name + star ratings)
   */
  public submitReview(params: {
    accommodationId: string;
    accommodationName: string;
    userName: string;
    userCity?: string;
    ratings: AccommodationDetailedRating;
    comment?: string;
  }): AccommodationReview {
    const trimmedName = params.userName.trim();
    if (!trimmedName) {
      throw new Error('O nome é obrigatório para submeter a avaliação.');
    }

    // Average of the 5 criteria
    const overallRating = Number(
      (
        (params.ratings.conforto +
          params.ratings.limpeza +
          params.ratings.atendimento +
          params.ratings.localizacao +
          params.ratings.seguranca) /
        5
      ).toFixed(1)
    );

    const newReview: AccommodationReview = {
      id: `rev-acc-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      accommodationId: params.accommodationId,
      accommodationName: params.accommodationName,
      userName: trimmedName,
      userCity: params.userCity?.trim() || undefined,
      date: 'Hoje',
      ratings: { ...params.ratings },
      overallRating,
      comment: params.comment?.trim() || undefined,
      createdAt: Date.now(),
    };

    const current = this.getAllReviews();
    const updated = [newReview, ...current];
    this.saveReviews(updated);

    // Optional background sync with server
    try {
      fetch('/api/accommodations/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      }).catch(() => {});
    } catch {}

    return newReview;
  }
}

export const accommodationReviewService = new AccommodationReviewService();
