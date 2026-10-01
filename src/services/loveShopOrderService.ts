import { LoveShopOrder, LoveShopProduct, LoveShopReview, DetailedReviewRating } from '../types';

const ORDERS_STORAGE_KEY = 'loveshop_orders_v1';
const REVIEWS_STORAGE_KEY = 'loveshop_reviews_v1';

// Initial Mock Orders so that the store dashboard and client view have initial realistic data
const INITIAL_MOCK_ORDERS: LoveShopOrder[] = [
  {
    id: 'LS-20261001-0001',
    storeId: 'store-7',
    storeName: 'Boutique Afro Chic',
    productId: 'prod-kaftan-1',
    productName: 'Vestido Kaftan Tie-Dye com Lenço Elegance',
    productPrice: 1200,
    productPhoto: 'https://res.cloudinary.com/dwlfwnbt0/image/upload/v1790850247/WhatsApp_Image_2026-10-01_at_09.57.42_pazcz5.jpg',
    categoryLabel: 'Vestidos & Kaftans',
    createdAt: '01/10/2026',
    timestamp: Date.now() - 3600000 * 24 * 2,
    clientName: 'Dra. Elsa Manjate',
    clientPhone: '+258849123456',
    status: 'concluido',
    completedAt: '01/10/2026',
    hasReviewed: true,
    reviewId: 'rev-ls-1',
  },
  {
    id: 'LS-20261001-0002',
    storeId: 'store-7',
    storeName: 'Boutique Afro Chic',
    productId: 'prod-kaftan-1',
    productName: 'Vestido Kaftan Tie-Dye com Lenço Elegance',
    productPrice: 1200,
    productPhoto: 'https://res.cloudinary.com/dwlfwnbt0/image/upload/v1790850247/WhatsApp_Image_2026-10-01_at_09.57.42_pazcz5.jpg',
    categoryLabel: 'Vestidos & Kaftans',
    createdAt: '01/10/2026',
    timestamp: Date.now() - 3600000 * 4,
    clientName: 'Visitante (Maputo)',
    clientPhone: '+258823456789',
    status: 'pendente',
  },
  {
    id: 'LS-20261001-0003',
    storeId: 'store-5',
    storeName: 'Oásis das Joias & Relógios',
    productId: 'prod-1',
    productName: 'Par de Alianças Tradicionais Ouro 18K Anatómicas',
    productPrice: 18500,
    productPhoto: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1000&q=80',
    categoryLabel: 'Alianças & Anéis',
    createdAt: '30/09/2026',
    timestamp: Date.now() - 3600000 * 30,
    clientName: 'Artur Cumbane',
    clientPhone: '+258852233440',
    status: 'concluido',
    completedAt: '01/10/2026',
    hasReviewed: false,
  }
];

const INITIAL_MOCK_REVIEWS: LoveShopReview[] = [
  {
    id: 'rev-ls-1',
    orderId: 'LS-20261001-0001',
    storeId: 'store-7',
    productId: 'prod-kaftan-1',
    productName: 'Vestido Kaftan Tie-Dye com Lenço Elegance',
    userName: 'Dra. Elsa Manjate',
    userCity: 'Maputo',
    date: 'Há 2 dias',
    ratings: {
      productQuality: 5,
      deliverySpeed: 5,
      customerService: 5,
      recommendation: 5,
      overallSatisfaction: 5,
    },
    storeRatingAverage: 5.0,
    productQualityRating: 5.0,
    comment: 'O vestido é de qualidade excecional, tecido super fresco e o lenço combinou perfeitamente. Entrega muito rápida.',
    verifiedPurchase: true,
  }
];

class LoveShopOrderService {
  private loadOrders(): LoveShopOrder[] {
    try {
      const stored = localStorage.getItem(ORDERS_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Error loading love shop orders', e);
    }
    return INITIAL_MOCK_ORDERS;
  }

  private saveOrders(orders: LoveShopOrder[]): void {
    try {
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
    } catch (e) {
      console.error('Error saving love shop orders', e);
    }
  }

  private loadReviews(): LoveShopReview[] {
    try {
      const stored = localStorage.getItem(REVIEWS_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Error loading love shop reviews', e);
    }
    return INITIAL_MOCK_REVIEWS;
  }

  private saveReviews(reviews: LoveShopReview[]): void {
    try {
      localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(reviews));
    } catch (e) {
      console.error('Error saving love shop reviews', e);
    }
  }

  /**
   * Automatically creates an order entry when a customer clicks "Contactar Vendedor" / WhatsApp
   */
  public createOrderOnContact(product: LoveShopProduct, clientName?: string, clientPhone?: string): LoveShopOrder {
    const orders = this.loadOrders();
    const todayStr = new Date().toLocaleDateString('pt-MZ');
    const dateCode = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const seq = String(orders.length + 1).padStart(4, '0');
    const orderId = `LS-${dateCode}-${seq}`;

    const newOrder: LoveShopOrder = {
      id: orderId,
      storeId: product.storeId || 'store-generic',
      storeName: product.storeName,
      productId: product.id,
      productName: product.name,
      productPrice: product.price,
      productPhoto: product.photo,
      categoryLabel: product.categoryLabel,
      createdAt: todayStr,
      timestamp: Date.now(),
      clientName: clientName || 'Visitante',
      clientPhone: clientPhone || product.phone,
      status: 'pendente',
      hasReviewed: false,
    };

    const updated = [newOrder, ...orders];
    this.saveOrders(updated);
    return newOrder;
  }

  public getOrders(): LoveShopOrder[] {
    return this.loadOrders();
  }

  public getOrdersByStoreId(storeId: string): LoveShopOrder[] {
    return this.loadOrders().filter((o) => o.storeId === storeId);
  }

  public getOrderById(orderId: string): LoveShopOrder | undefined {
    return this.loadOrders().find((o) => o.id === orderId);
  }

  /**
   * Merchant updates order to 'concluido' (sale succeeded) or 'cancelado' (no sale)
   */
  public updateOrderStatus(orderId: string, status: 'concluido' | 'cancelado'): LoveShopOrder | null {
    const orders = this.loadOrders();
    const index = orders.findIndex((o) => o.id === orderId);
    if (index === -1) return null;

    const todayStr = new Date().toLocaleDateString('pt-MZ');
    const updatedOrder: LoveShopOrder = {
      ...orders[index],
      status,
      ...(status === 'concluido' ? { completedAt: todayStr } : { cancelledAt: todayStr }),
    };

    orders[index] = updatedOrder;
    this.saveOrders(orders);
    return updatedOrder;
  }

  /**
   * Customer submits verified review once order is marked as 'concluido'
   */
  public submitReview(
    orderId: string,
    ratings: DetailedReviewRating,
    comment?: string,
    userName?: string,
    userCity?: string
  ): LoveShopReview | null {
    const orders = this.loadOrders();
    const orderIndex = orders.findIndex((o) => o.id === orderId);
    if (orderIndex === -1) return null;

    const order = orders[orderIndex];
    if (order.status !== 'concluido' || order.hasReviewed) {
      return null; // Only completed orders can be reviewed once!
    }

    const reviews = this.loadReviews();
    const reviewId = `rev-ls-${Date.now()}`;

    // Separate calculations:
    // Store Rating = Average of (Delivery + Service + Recommendation + Overall)
    const storeRatingAverage = Number(
      ((ratings.deliverySpeed + ratings.customerService + ratings.recommendation + ratings.overallSatisfaction) / 4).toFixed(1)
    );
    // Product Rating = Product Quality only!
    const productQualityRating = ratings.productQuality;

    const newReview: LoveShopReview = {
      id: reviewId,
      orderId,
      storeId: order.storeId,
      productId: order.productId,
      productName: order.productName,
      userName: userName?.trim() || order.clientName || 'Cliente Verificado',
      userCity: userCity?.trim() || 'Maputo',
      date: 'Hoje',
      ratings,
      storeRatingAverage,
      productQualityRating,
      comment: comment?.trim() || '',
      verifiedPurchase: true,
    };

    // Save review
    const updatedReviews = [newReview, ...reviews];
    this.saveReviews(updatedReviews);

    // Mark order as reviewed
    orders[orderIndex] = {
      ...order,
      hasReviewed: true,
      reviewId,
    };
    this.saveOrders(orders);

    return newReview;
  }

  public getReviewsByProductId(productId: string): LoveShopReview[] {
    return this.loadReviews().filter((r) => r.productId === productId && !r.isReported);
  }

  public getReviewsByStoreId(storeId: string): LoveShopReview[] {
    return this.loadReviews().filter((r) => r.storeId === storeId);
  }

  /**
   * Merchant reports an abusive or fraudulent review
   */
  public reportReview(
    reviewId: string,
    reason: 'nao_foi_cliente' | 'linguagem_ofensiva' | 'avaliacao_fraudulenta'
  ): boolean {
    const reviews = this.loadReviews();
    const index = reviews.findIndex((r) => r.id === reviewId);
    if (index === -1) return false;

    reviews[index] = {
      ...reviews[index],
      isReported: true,
      reportReason: reason,
      reportDate: new Date().toLocaleDateString('pt-MZ'),
      reportStatus: 'em_analise',
    };

    this.saveReviews(reviews);
    return true;
  }

  /**
   * Store Reputation: Based on Customer Service, Delivery Speed, Recommendation, and Overall Satisfaction
   */
  public calculateStoreReputation(storeId: string): {
    rating: number;
    count: number;
    breakdown: {
      customerService: number;
      deliverySpeed: number;
      recommendation: number;
      overallSatisfaction: number;
    };
  } {
    const reviews = this.getReviewsByStoreId(storeId).filter((r) => !r.isReported);
    if (reviews.length === 0) {
      return {
        rating: 5.0,
        count: 0,
        breakdown: {
          customerService: 5.0,
          deliverySpeed: 5.0,
          recommendation: 5.0,
          overallSatisfaction: 5.0,
        },
      };
    }

    let totalStoreAvg = 0;
    let totalService = 0;
    let totalDelivery = 0;
    let totalRecom = 0;
    let totalSat = 0;

    reviews.forEach((r) => {
      totalStoreAvg += r.storeRatingAverage;
      totalService += r.ratings.customerService;
      totalDelivery += r.ratings.deliverySpeed;
      totalRecom += r.ratings.recommendation;
      totalSat += r.ratings.overallSatisfaction;
    });

    const count = reviews.length;
    return {
      rating: Number((totalStoreAvg / count).toFixed(1)),
      count,
      breakdown: {
        customerService: Number((totalService / count).toFixed(1)),
        deliverySpeed: Number((totalDelivery / count).toFixed(1)),
        recommendation: Number((totalRecom / count).toFixed(1)),
        overallSatisfaction: Number((totalSat / count).toFixed(1)),
      },
    };
  }

  /**
   * Product Reputation: Based strictly on Product Quality
   */
  public calculateProductReputation(productId: string): {
    rating: number;
    count: number;
    qualityRating: number;
  } {
    const reviews = this.getReviewsByProductId(productId);
    if (reviews.length === 0) {
      return {
        rating: 5.0,
        count: 0,
        qualityRating: 5.0,
      };
    }

    const totalQuality = reviews.reduce((acc, r) => acc + r.ratings.productQuality, 0);
    const avg = Number((totalQuality / reviews.length).toFixed(1));
    return {
      rating: avg,
      count: reviews.length,
      qualityRating: avg,
    };
  }
}

export const loveShopOrderService = new LoveShopOrderService();
