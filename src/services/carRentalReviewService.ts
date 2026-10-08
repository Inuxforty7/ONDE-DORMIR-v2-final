export interface CarRentalDetailedRating {
  vehicleCondition: number; // 1 to 5 (Estado da Viatura) -> affects vehicle ONLY
  cleanliness: number;      // 1 to 5 (Limpeza) -> affects vehicle ONLY
  comfort: number;          // 1 to 5 (Conforto) -> affects vehicle ONLY
  customerService: number;  // 1 to 5 (Atendimento ao Cliente) -> affects provider ONLY
  punctuality: number;      // 1 to 5 (Pontualidade) -> affects provider ONLY
}

export interface CarRentalReview {
  id: string;
  vehicleId: string;
  vehicleModel: string;
  providerId: string;
  providerName: string;
  userName: string;
  userCity: string;
  date: string;
  ratings: CarRentalDetailedRating;
  vehicleRatingAverage: number;  // (vehicleCondition + cleanliness + comfort) / 3
  providerRatingAverage: number; // (customerService + punctuality) / 2
  comment?: string;
  verifiedRental: boolean;
  createdAt: number;
}

const STORAGE_KEY = 'onde_dormir_car_rental_reviews';

const INITIAL_MOCK_REVIEWS: CarRentalReview[] = [
  {
    id: 'rev-cr-1',
    vehicleId: 'car-1',
    vehicleModel: 'Toyota Land Cruiser Prado 4x4',
    providerId: 'owner-demo-1',
    providerName: 'Armando C. Guebuza (Rentals)',
    userName: 'Nelson Mabunda',
    userCity: 'Maputo',
    date: 'Há 2 dias',
    ratings: {
      vehicleCondition: 5,
      cleanliness: 5,
      comfort: 5,
      customerService: 5,
      punctuality: 5,
    },
    vehicleRatingAverage: 5.0,
    providerRatingAverage: 5.0,
    comment: 'Viatura impecável para a viagem à Ponta do Ouro. Entrega pontual no local combinado.',
    verifiedRental: true,
    createdAt: Date.now() - 1000 * 60 * 60 * 48,
  },
  {
    id: 'rev-cr-2',
    vehicleId: 'car-1',
    vehicleModel: 'Toyota Land Cruiser Prado 4x4',
    providerId: 'owner-demo-1',
    providerName: 'Armando C. Guebuza (Rentals)',
    userName: 'Sara Tembe',
    userCity: 'Matola',
    date: 'Há 5 dias',
    ratings: {
      vehicleCondition: 5,
      cleanliness: 4,
      comfort: 5,
      customerService: 5,
      punctuality: 4,
    },
    vehicleRatingAverage: 4.7,
    providerRatingAverage: 4.5,
    comment: 'Muito confortável e segura para toda a família.',
    verifiedRental: true,
    createdAt: Date.now() - 1000 * 60 * 60 * 120,
  },
  {
    id: 'rev-cr-3',
    vehicleId: 'car-4',
    vehicleModel: 'Toyota Corolla Quest Sedan',
    providerId: 'owner-corolla-maputo',
    providerName: 'Maputo Rent Car Lda',
    userName: 'Eusébio Mondlane',
    userCity: 'Maputo',
    date: 'Há 1 semana',
    ratings: {
      vehicleCondition: 4,
      cleanliness: 5,
      comfort: 4,
      customerService: 5,
      punctuality: 5,
    },
    vehicleRatingAverage: 4.3,
    providerRatingAverage: 5.0,
    comment: 'Económico e ideal para deslocações na baixa e reuniões.',
    verifiedRental: true,
    createdAt: Date.now() - 1000 * 60 * 60 * 168,
  },
  {
    id: 'rev-cr-4',
    vehicleId: 'car-3',
    vehicleModel: 'Toyota Hilux Double Cab 4WD Safari',
    providerId: 'owner-vilankulo-safari',
    providerName: 'Bazaruto Car Rentals',
    userName: 'Cláudio Nhantumbo',
    userCity: 'Vilankulo',
    date: 'Há 4 dias',
    ratings: {
      vehicleCondition: 5,
      cleanliness: 5,
      comfort: 4,
      customerService: 5,
      punctuality: 5,
    },
    vehicleRatingAverage: 4.7,
    providerRatingAverage: 5.0,
    comment: 'Carrinha forte para as picadas de Vilankulo e praias.',
    verifiedRental: true,
    createdAt: Date.now() - 1000 * 60 * 60 * 96,
  },
  {
    id: 'rev-cr-5',
    vehicleId: 'fleet-v1',
    vehicleModel: 'Toyota Land Cruiser Prado VX 4x4',
    providerId: 'owner-demo-1',
    providerName: 'Armando C. Guebuza (Rentals)',
    userName: 'Fátima Ibraimo',
    userCity: 'Maputo',
    date: 'Há 3 dias',
    ratings: {
      vehicleCondition: 5,
      cleanliness: 5,
      comfort: 5,
      customerService: 5,
      punctuality: 5,
    },
    vehicleRatingAverage: 5.0,
    providerRatingAverage: 5.0,
    comment: 'Serviço de excelência e viatura como nova.',
    verifiedRental: true,
    createdAt: Date.now() - 1000 * 60 * 60 * 72,
  },
];

type Listener = () => void;

class CarRentalReviewService {
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

  public getAllReviews(): CarRentalReview[] {
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

  private saveReviews(list: CarRentalReview[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
      this.notify();
    } catch (e) {
      // fallback
    }
  }

  public getReviewsByVehicleId(vehicleId: string): CarRentalReview[] {
    return this.getAllReviews().filter((r) => r.vehicleId === vehicleId);
  }

  public getReviewsByProviderId(providerIdOrName: string): CarRentalReview[] {
    const term = providerIdOrName.toLowerCase().trim();
    return this.getAllReviews().filter(
      (r) =>
        r.providerId.toLowerCase().trim() === term ||
        r.providerName.toLowerCase().trim() === term
    );
  }

  /**
   * Vehicle Rating:
   * Condition + Cleanliness + Comfort → affect ONLY the individual vehicle rating.
   */
  public getVehicleRatingStats(vehicleId: string): {
    rating: number;
    reviewsCount: number;
    breakdown: {
      vehicleCondition: number;
      cleanliness: number;
      comfort: number;
    };
  } {
    const reviews = this.getReviewsByVehicleId(vehicleId);
    if (reviews.length === 0) {
      return {
        rating: 4.8, // Baseline fallback for display
        reviewsCount: 0,
        breakdown: {
          vehicleCondition: 4.8,
          cleanliness: 4.8,
          comfort: 4.8,
        },
      };
    }

    let sumCondition = 0;
    let sumCleanliness = 0;
    let sumComfort = 0;

    reviews.forEach((r) => {
      sumCondition += r.ratings.vehicleCondition;
      sumCleanliness += r.ratings.cleanliness;
      sumComfort += r.ratings.comfort;
    });

    const avgCondition = Number((sumCondition / reviews.length).toFixed(1));
    const avgCleanliness = Number((sumCleanliness / reviews.length).toFixed(1));
    const avgComfort = Number((sumComfort / reviews.length).toFixed(1));

    // Individual vehicle rating = average of the 3 vehicle criteria
    const overallVehicleRating = Number(
      ((avgCondition + avgCleanliness + avgComfort) / 3).toFixed(1)
    );

    return {
      rating: overallVehicleRating,
      reviewsCount: reviews.length,
      breakdown: {
        vehicleCondition: avgCondition,
        cleanliness: avgCleanliness,
        comfort: avgComfort,
      },
    };
  }

  /**
   * Provider/Company Rating:
   * Customer Service + Punctuality → affect ONLY the rental provider/company rating.
   * Vehicle ratings DO NOT lower or increase the provider reputation!
   */
  public getProviderRatingStats(providerIdOrName: string): {
    rating: number;
    reviewsCount: number;
    breakdown: {
      customerService: number;
      punctuality: number;
    };
  } {
    const reviews = this.getReviewsByProviderId(providerIdOrName);
    if (reviews.length === 0) {
      return {
        rating: 4.9, // Baseline fallback for verified providers
        reviewsCount: 0,
        breakdown: {
          customerService: 4.9,
          punctuality: 4.9,
        },
      };
    }

    let sumService = 0;
    let sumPunctuality = 0;

    reviews.forEach((r) => {
      sumService += r.ratings.customerService;
      sumPunctuality += r.ratings.punctuality;
    });

    const avgService = Number((sumService / reviews.length).toFixed(1));
    const avgPunctuality = Number((sumPunctuality / reviews.length).toFixed(1));

    // Rental provider rating = average of the 2 service criteria ONLY
    const overallProviderRating = Number(
      ((avgService + avgPunctuality) / 2).toFixed(1)
    );

    return {
      rating: overallProviderRating,
      reviewsCount: reviews.length,
      breakdown: {
        customerService: avgService,
        punctuality: avgPunctuality,
      },
    };
  }

  /**
   * Submit Review:
   * Single unified review form.
   * Name = required
   * Star ratings = required (all 5 criteria)
   * Comment = optional (can submit with name + stars alone)
   */
  public submitReview(params: {
    vehicleId: string;
    vehicleModel: string;
    providerId: string;
    providerName: string;
    userName: string;
    userCity?: string;
    ratings: CarRentalDetailedRating;
    comment?: string;
  }): CarRentalReview {
    const trimmedName = params.userName.trim();
    if (!trimmedName) {
      throw new Error('O nome é obrigatório para submeter a avaliação.');
    }

    // Vehicle condition + cleanliness + comfort -> vehicle rating average
    const vehicleRatingAverage = Number(
      (
        (params.ratings.vehicleCondition +
          params.ratings.cleanliness +
          params.ratings.comfort) /
        3
      ).toFixed(1)
    );

    // Customer service + punctuality -> provider rating average
    const providerRatingAverage = Number(
      (
        (params.ratings.customerService + params.ratings.punctuality) /
        2
      ).toFixed(1)
    );

    const newReview: CarRentalReview = {
      id: `rev-cr-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      vehicleId: params.vehicleId,
      vehicleModel: params.vehicleModel,
      providerId: params.providerId,
      providerName: params.providerName,
      userName: trimmedName,
      userCity: params.userCity?.trim() || 'Maputo',
      date: 'Hoje',
      ratings: { ...params.ratings },
      vehicleRatingAverage,
      providerRatingAverage,
      comment: params.comment?.trim() || undefined,
      verifiedRental: true,
      createdAt: Date.now(),
    };

    const current = this.getAllReviews();
    const updated = [newReview, ...current];
    this.saveReviews(updated);

    // Background sync with authoritative server
    try {
      fetch('/api/rentacar/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      }).catch(() => {});
    } catch {}

    return newReview;
  }
}

export const carRentalReviewService = new CarRentalReviewService();
