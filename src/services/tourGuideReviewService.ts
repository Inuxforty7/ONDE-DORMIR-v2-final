export interface TourGuideDetailedRating {
  comunicacao: number;      // 1 to 5 (Comunicação)
  pontualidade: number;     // 1 to 5 (Pontualidade)
  atendimento: number;      // 1 to 5 (Atendimento)
  organizacao: number;      // 1 to 5 (Organização)
  seguranca: number;        // 1 to 5 (Segurança)
  profissionalismo: number; // 1 to 5 (Profissionalismo)
}

export interface TourGuideReview {
  id: string;
  guideId: string;
  guideName: string;
  userName: string;
  userCity?: string;
  date: string;
  ratings: TourGuideDetailedRating;
  overallRating: number; // Average of all 6 criteria
  comment?: string;
  createdAt: number;
}

const STORAGE_KEY = 'onde_dormir_tour_guide_reviews';

const INITIAL_MOCK_REVIEWS: TourGuideReview[] = [
  {
    id: 'rev-tg-1',
    guideId: 'guide-iverca-mafalala',
    guideName: 'Associação IVERCA (Guias Comunitários da Mafalala)',
    userName: 'Nelson Mabunda',
    userCity: 'Maputo',
    date: 'Há 2 dias',
    ratings: {
      comunicacao: 5,
      pontualidade: 5,
      atendimento: 5,
      organizacao: 5,
      seguranca: 5,
      profissionalismo: 5,
    },
    overallRating: 5.0,
    comment: 'Experiência cultural inesquecível no Museu Comunitário e nas ruas da Mafalala. Explicação histórica profunda e segurança impecável.',
    createdAt: Date.now() - 1000 * 60 * 60 * 48,
  },
  {
    id: 'rev-tg-2',
    guideId: 'guide-iverca-mafalala',
    guideName: 'Associação IVERCA (Guias Comunitários da Mafalala)',
    userName: 'Sara Tembe',
    userCity: 'Matola',
    date: 'Há 5 dias',
    ratings: {
      comunicacao: 5,
      pontualidade: 5,
      atendimento: 5,
      organizacao: 5,
      seguranca: 5,
      profissionalismo: 5,
    },
    overallRating: 5.0,
    comment: 'Guias atenciosos, excelente organização do grupo e pontualidade exemplar.',
    createdAt: Date.now() - 1000 * 60 * 60 * 120,
  },
  {
    id: 'rev-tg-3',
    guideId: 'guide-ilha-blue',
    guideName: 'Ilha Blue Island Safaris',
    userName: 'Dra. Elsa Manjate',
    userCity: 'Maputo',
    date: 'Há 3 dias',
    ratings: {
      comunicacao: 5,
      pontualidade: 5,
      atendimento: 5,
      organizacao: 5,
      seguranca: 5,
      profissionalismo: 5,
    },
    overallRating: 5.0,
    comment: 'Passeio de dhow à vela maravilhoso até Goa Island. Equipa muito profissional e segurança marítima nota 10.',
    createdAt: Date.now() - 1000 * 60 * 60 * 72,
  },
  {
    id: 'rev-tg-4',
    guideId: 'guide-sailaway',
    guideName: 'SailAway Dhow Safaris',
    userName: 'Cláudio Nhantumbo',
    userCity: 'Vilankulo',
    date: 'Há 1 semana',
    ratings: {
      comunicacao: 5,
      pontualidade: 4,
      atendimento: 5,
      organizacao: 5,
      seguranca: 5,
      profissionalismo: 5,
    },
    overallRating: 4.8,
    comment: 'Navegação fantástica pelo Arquipélago de Bazaruto com almoço fresco na praia de Magaruque.',
    createdAt: Date.now() - 1000 * 60 * 60 * 168,
  },
  {
    id: 'rev-tg-5',
    guideId: 'guide-periperi',
    guideName: 'Peri-Peri Divers & Ocean Safaris',
    userName: 'Artur Cumbane',
    userCity: 'Inhambane',
    date: 'Há 4 dias',
    ratings: {
      comunicacao: 5,
      pontualidade: 5,
      atendimento: 5,
      organizacao: 5,
      seguranca: 5,
      profissionalismo: 5,
    },
    overallRating: 5.0,
    comment: 'Safari oceânico com tubarões-baleia e mantas. Guias de mergulho altamente qualificados.',
    createdAt: Date.now() - 1000 * 60 * 60 * 96,
  },
];

type Listener = () => void;

class TourGuideReviewService {
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

  public getAllReviews(): TourGuideReview[] {
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

  private saveReviews(list: TourGuideReview[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
      this.notify();
    } catch (e) {
      // fallback
    }
  }

  public getReviewsByGuideId(guideId: string): TourGuideReview[] {
    return this.getAllReviews().filter((r) => r.guideId === guideId);
  }

  /**
   * All 6 criteria contribute to the overall rating of the individual tour guide.
   * Keeps the rating specific to the guide being reviewed.
   */
  public getGuideRatingStats(
    guideId: string,
    fallbackInitial?: { rating: number; reviewsCount: number }
  ): {
    rating: number;
    reviewsCount: number;
    breakdown: {
      comunicacao: number;
      pontualidade: number;
      atendimento: number;
      organizacao: number;
      seguranca: number;
      profissionalismo: number;
    };
  } {
    const reviews = this.getReviewsByGuideId(guideId);
    if (reviews.length === 0) {
      const baseRating = fallbackInitial?.rating || 4.9;
      const baseCount = fallbackInitial?.reviewsCount || 0;
      return {
        rating: baseRating,
        reviewsCount: baseCount,
        breakdown: {
          comunicacao: baseRating,
          pontualidade: baseRating,
          atendimento: baseRating,
          organizacao: baseRating,
          seguranca: baseRating,
          profissionalismo: baseRating,
        },
      };
    }

    let sumComunicacao = 0;
    let sumPontualidade = 0;
    let sumAtendimento = 0;
    let sumOrganizacao = 0;
    let sumSeguranca = 0;
    let sumProfissionalismo = 0;

    reviews.forEach((r) => {
      sumComunicacao += r.ratings.comunicacao;
      sumPontualidade += r.ratings.pontualidade;
      sumAtendimento += r.ratings.atendimento;
      sumOrganizacao += r.ratings.organizacao;
      sumSeguranca += r.ratings.seguranca;
      sumProfissionalismo += r.ratings.profissionalismo;
    });

    const count = reviews.length;
    const avgComunicacao = Number((sumComunicacao / count).toFixed(1));
    const avgPontualidade = Number((sumPontualidade / count).toFixed(1));
    const avgAtendimento = Number((sumAtendimento / count).toFixed(1));
    const avgOrganizacao = Number((sumOrganizacao / count).toFixed(1));
    const avgSeguranca = Number((sumSeguranca / count).toFixed(1));
    const avgProfissionalismo = Number((sumProfissionalismo / count).toFixed(1));

    // All 6 criteria contribute to the overall rating of the individual tour guide
    const overallRating = Number(
      (
        (avgComunicacao +
          avgPontualidade +
          avgAtendimento +
          avgOrganizacao +
          avgSeguranca +
          avgProfissionalismo) /
        6
      ).toFixed(1)
    );

    return {
      rating: overallRating,
      reviewsCount: count,
      breakdown: {
        comunicacao: avgComunicacao,
        pontualidade: avgPontualidade,
        atendimento: avgAtendimento,
        organizacao: avgOrganizacao,
        seguranca: avgSeguranca,
        profissionalismo: avgProfissionalismo,
      },
    };
  }

  /**
   * Submit Review:
   * Single unified review form.
   * Name = required
   * Star ratings = required (all 6 criteria)
   * Comment = optional (can submit with name + star ratings alone)
   */
  public submitReview(params: {
    guideId: string;
    guideName: string;
    userName: string;
    userCity?: string;
    ratings: TourGuideDetailedRating;
    comment?: string;
  }): TourGuideReview {
    const trimmedName = params.userName.trim();
    if (!trimmedName) {
      throw new Error('O nome é obrigatório para submeter a avaliação.');
    }

    // Average of the 6 criteria
    const overallRating = Number(
      (
        (params.ratings.comunicacao +
          params.ratings.pontualidade +
          params.ratings.atendimento +
          params.ratings.organizacao +
          params.ratings.seguranca +
          params.ratings.profissionalismo) /
        6
      ).toFixed(1)
    );

    const newReview: TourGuideReview = {
      id: `rev-tg-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      guideId: params.guideId,
      guideName: params.guideName,
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
      fetch('/api/tourism/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      }).catch(() => {});
    } catch {}

    return newReview;
  }
}

export const tourGuideReviewService = new TourGuideReviewService();
