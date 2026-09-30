import React, { useState, useRef } from 'react';
import { 
  X, 
  Store, 
  CheckCircle2, 
  ShieldCheck, 
  Plus, 
  ArrowRight, 
  ArrowLeft, 
  CreditCard, 
  FileText, 
  Sparkles, 
  Clock,
  Phone,
  MessageCircle,
  MapPin,
  Image as ImageIcon,
  Upload,
  Trash2,
  AlertCircle,
  Tag,
  Gift
} from 'lucide-react';
import { LoveShopStore, LoveShopProduct, LoveShopCategoryId } from '../types';
import { MOZ_PROVINCES_LIST } from './ExploreTab';
import { BillingInvoiceModal, BillingInvoiceData } from './BillingInvoiceModal';
import { TermsModal } from './TermsModal';

// 25 High-Quality Romantic Catalog Item Presets for immediate preview & fast template fill
const ROMANTIC_PRESET_TEMPLATES = [
  {
    name: 'Conjunto Alianças Prata 925 com Zircónia',
    category: 'noivado' as LoveShopCategoryId,
    categoryLabel: 'Noivado & Alianças',
    price: 3200,
    photo: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=600&q=80',
    description: 'Par de alianças elegantes em prata de lei 925 com gravação personalizada incluída.'
  },
  {
    name: 'Bouquet 24 Rosas Vermelhas Aveludadas',
    category: 'presentes' as LoveShopCategoryId,
    categoryLabel: 'Flores & Rosas',
    price: 1850,
    photo: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=600&q=80',
    description: 'Arranjo floral de luxo com rosas frescas selecionadas e fita de cetim vermelha.'
  },
  {
    name: 'Perfume Feminino Rose Elegance 100ml',
    category: 'presentes' as LoveShopCategoryId,
    categoryLabel: 'Perfumes & Fragrâncias',
    price: 2600,
    photo: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=600&q=80',
    description: 'Fragrância floral oriental marcante de longa fixação em frasco de cristal.'
  },
  {
    name: 'Relógio Cronógrafo Masculino Couro Preto',
    category: 'presentes' as LoveShopCategoryId,
    categoryLabel: 'Relógios & Acessórios',
    price: 3500,
    photo: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=600&q=80',
    description: 'Design sofisticado resistente à água com pulseira genuína em couro premium.'
  },
  {
    name: 'Caixa de Bombons Artesanais Belgas 24 un',
    category: 'presentes' as LoveShopCategoryId,
    categoryLabel: 'Chocolates Finos',
    price: 1200,
    photo: 'https://images.unsplash.com/photo-1548848221-0c2e497ed557?auto=format&fit=crop&w=600&q=80',
    description: 'Seleção requintada de chocolates recheados com avelã, caramelo salgado e trufa.'
  },
  {
    name: 'Urso de Peluche Gigante "Amo-te" 100cm',
    category: 'presentes' as LoveShopCategoryId,
    categoryLabel: 'Peluches & Fofuras',
    price: 2400,
    photo: 'https://images.unsplash.com/photo-1559454403-b8fb88521f11?auto=format&fit=crop&w=600&q=80',
    description: 'Peluche macio hipoalergénico com coração bordado e laço de veludo.'
  },
  {
    name: 'Aliança Solitário Ouro Amarelo 18k',
    category: 'casamento' as LoveShopCategoryId,
    categoryLabel: 'Casamento & Ouro',
    price: 5800,
    photo: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=600&q=80',
    description: 'Anel solitário clássico lapidação brilhante para pedidos de noivado inesquecíveis.'
  },
  {
    name: 'Colar Gargantilha Coração Cravejado',
    category: 'presentes' as LoveShopCategoryId,
    categoryLabel: 'Joias & Pingentes',
    price: 1950,
    photo: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80',
    description: 'Pingente em formato de coração banhado a ouro 18k com fecho ajustável.'
  },
  {
    name: 'Cesta Pequeno-Almoço Romântico VIP',
    category: 'presentes' as LoveShopCategoryId,
    categoryLabel: 'Cestas & Experiências',
    price: 2900,
    photo: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=600&q=80',
    description: 'Cesta com croissants, espumante sem álcool, frutas frescas, caneca e geleias.'
  },
  {
    name: 'Conjunto Lingerie Cetim & Renda Vermelha',
    category: 'presentes' as LoveShopCategoryId,
    categoryLabel: 'Lingerie Romântica',
    price: 1750,
    photo: 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?auto=format&fit=crop&w=600&q=80',
    description: 'Tecido sedoso macio com acabamento acetinado para momentos especiais.'
  },
  {
    name: 'Vela Aromática Baunilha & Lavanda Premium',
    category: 'presentes' as LoveShopCategoryId,
    categoryLabel: 'Aromas & Ambiente',
    price: 850,
    photo: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=600&q=80',
    description: 'Cera vegetal natural com pavio de algodão para atmosfera acolhedora e relaxante.'
  },
  {
    name: 'Caneca Personalizada "Par Perfeito" (Par)',
    category: 'presentes' as LoveShopCategoryId,
    categoryLabel: 'Lembranças Especiais',
    price: 950,
    photo: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80',
    description: 'Conjunto de 2 canecas de cerâmica esmaltada que se encaixam em formato de abraço.'
  },
  {
    name: 'Quadro Fotográfico Iluminado com LED',
    category: 'presentes' as LoveShopCategoryId,
    categoryLabel: 'Decoração & Afeto',
    price: 1600,
    photo: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=600&q=80',
    description: 'Moldura em madeira nobre com micro-luzes quentes para guardar recordações do casal.'
  },
  {
    name: 'Carteira de Couro Genuíno Masculina',
    category: 'presentes' as LoveShopCategoryId,
    categoryLabel: 'Acessórios Masculinos',
    price: 1400,
    photo: 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=600&q=80',
    description: 'Acabamento costurado à mão com proteção RFID e múltiplos compartimentos para cartões.'
  },
  {
    name: 'Kit Spa Relaxante Óleos Essenciais & Toalha',
    category: 'presentes' as LoveShopCategoryId,
    categoryLabel: 'Cuidado & Bem-Estar',
    price: 2100,
    photo: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80',
    description: 'Conjunto completo de sais de banho, óleo para massagem e toalha de algodão egípcio.'
  },
  // 16 to 25 items for high capacity expansion:
  {
    name: 'Pulseira em Prata com Berloques Românticos',
    category: 'presentes' as LoveShopCategoryId,
    categoryLabel: 'Joias & Pratas',
    price: 2300,
    photo: 'https://images.unsplash.com/photo-1611591475152-47397c373742?auto=format&fit=crop&w=600&q=80',
    description: 'Pulseira de elos finos com pingentes de coração, infinito e chave do amor.'
  },
  {
    name: 'Perfume Masculino Black Oud & Vanilla 100ml',
    category: 'presentes' as LoveShopCategoryId,
    categoryLabel: 'Perfumes Masculinos',
    price: 2800,
    photo: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=600&q=80',
    description: 'Aroma amadeirado intenso com notas de especiarias finas e âmbar dourado.'
  },
  {
    name: 'Mala de Viagem Fim de Semana Casal',
    category: 'presentes' as LoveShopCategoryId,
    categoryLabel: 'Malas & Viagens',
    price: 4200,
    photo: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80',
    description: 'Bolsa de viagem espaçosa em lona reforçada e detalhes em couro legítimo.'
  },
  {
    name: 'Álbum Fotográfico Romance Capa Dura',
    category: 'presentes' as LoveShopCategoryId,
    categoryLabel: 'Recordações & Álbuns',
    price: 1100,
    photo: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
    description: '50 páginas com folhas pretas protetoras para colar fotografias e mensagens do casal.'
  },
  {
    name: 'Conjunto Chá das Cinco & Biscoitos Gourmet',
    category: 'presentes' as LoveShopCategoryId,
    categoryLabel: 'Sabores & Gourmet',
    price: 1350,
    photo: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=600&q=80',
    description: 'Infusões artesanais de frutos silvestres com bolachas amanteigadas de canela.'
  },
  {
    name: 'Aliança de Compromisso em Titânio Preto',
    category: 'noivado' as LoveShopCategoryId,
    categoryLabel: 'Alianças Modernas',
    price: 2150,
    photo: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=600&q=80',
    description: 'Titânio escovado hipoalergénico ultra resistente a riscos e desgaste.'
  },
  {
    name: 'Garrafa Térmica Casal Personalizada (Par)',
    category: 'presentes' as LoveShopCategoryId,
    categoryLabel: 'Dia a Dia',
    price: 1500,
    photo: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80',
    description: 'Mantém bebidas geladas por 24h e quentes por 12h com acabamento fosco suave.'
  },
  {
    name: 'Caixa de Rosas Preservadas Eternas (Dura 3 Anos)',
    category: 'presentes' as LoveShopCategoryId,
    categoryLabel: 'Flores Eternas',
    price: 3800,
    photo: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=600&q=80',
    description: 'Rosas 100% naturais estabilizadas que conservam textura e perfume por até 3 anos.'
  },
  {
    name: 'Brincos de Pérola Natural com Prata 925',
    category: 'presentes' as LoveShopCategoryId,
    categoryLabel: 'Joias Clássicas',
    price: 1450,
    photo: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=600&q=80',
    description: 'Pérolas de água doce com brilho acetinado e tarrachas de pressão seguras.'
  },
  {
    name: 'Vale Presente Romântico VIP 5.000 MT',
    category: 'presentes' as LoveShopCategoryId,
    categoryLabel: 'Vales & Escolha Livre',
    price: 5000,
    photo: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=600&q=80',
    description: 'Cartão de presente elegante em caixa de veludo para a pessoa amada escolher o seu presente.'
  }
];

export interface CatalogPhotoSlot {
  id: string;
  name: string;
  price: number;
  category: LoveShopCategoryId;
  categoryLabel: string;
  photoUrl: string;
  description: string;
}

interface RegisterLoveShopStoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddStore: (store: LoveShopStore, products?: LoveShopProduct[]) => void;
  defaultCity?: string;
  defaultProvince?: string;
}

export const RegisterLoveShopStoreModal: React.FC<RegisterLoveShopStoreModalProps> = ({
  isOpen,
  onClose,
  onAddStore,
  defaultCity = 'Maputo',
  defaultProvince = 'Maputo Cidade',
}) => {
  const [step, setStep] = useState<'form' | 'catalog_slots' | 'subscription' | 'success'>('form');

  // Form State
  const [storeName, setStoreName] = useState('');
  const [slogan, setSlogan] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [ownerNuitOrBi, setOwnerNuitOrBi] = useState('');
  const [city, setCity] = useState(defaultCity);
  const [province, setProvince] = useState(defaultProvince);
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [coverImage, setCoverImage] = useState('');

  // 15 to 25 Image Slots Catalog State
  const [catalogSlots, setCatalogSlots] = useState<CatalogPhotoSlot[]>(() => {
    // Initial standard 15 slots populated with presets
    return ROMANTIC_PRESET_TEMPLATES.slice(0, 15).map((preset, idx) => ({
      id: `slot-${idx + 1}`,
      name: preset.name,
      price: preset.price,
      category: preset.category,
      categoryLabel: preset.categoryLabel,
      photoUrl: preset.photo,
      description: preset.description
    }));
  });

  const [targetSlotCapacity, setTargetSlotCapacity] = useState<15 | 20 | 25>(15);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Subscription / Payment State
  const [paymentMethod, setPaymentMethod] = useState<'mpesa' | 'emola'>('mpesa');
  const [paymentPhone, setPaymentPhone] = useState('');

  // Invoice Modal
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);
  const [generatedInvoice, setGeneratedInvoice] = useState<BillingInvoiceData | null>(null);

  if (!isOpen) return null;

  // Change preset batch (15, 20 or 25 slots)
  const handleSetCapacity = (capacity: 15 | 20 | 25) => {
    setTargetSlotCapacity(capacity);
    const existingCount = catalogSlots.length;

    if (capacity > existingCount) {
      // Add more slots up to capacity from presets
      const toAdd = ROMANTIC_PRESET_TEMPLATES.slice(existingCount, capacity).map((preset, idx) => ({
        id: `slot-${existingCount + idx + 1}`,
        name: preset.name,
        price: preset.price,
        category: preset.category,
        categoryLabel: preset.categoryLabel,
        photoUrl: preset.photo,
        description: preset.description
      }));
      setCatalogSlots((prev) => [...prev, ...toAdd]);
    } else if (capacity < existingCount) {
      // Trim to selected capacity
      setCatalogSlots((prev) => prev.slice(0, capacity));
    }
  };

  // Add individual slot up to max 25
  const handleAddIndividualSlot = () => {
    if (catalogSlots.length >= 25) return;
    const nextIdx = catalogSlots.length;
    const preset = ROMANTIC_PRESET_TEMPLATES[nextIdx % ROMANTIC_PRESET_TEMPLATES.length];
    const newSlot: CatalogPhotoSlot = {
      id: `slot-${Date.now()}-${nextIdx}`,
      name: preset.name,
      price: preset.price,
      category: preset.category,
      categoryLabel: preset.categoryLabel,
      photoUrl: preset.photo,
      description: preset.description
    };
    setCatalogSlots((prev) => [...prev, newSlot]);
  };

  // Remove individual slot (if > 1)
  const handleRemoveSlot = (id: string) => {
    setCatalogSlots((prev) => prev.filter((s) => s.id !== id));
  };

  // Edit slot field
  const handleUpdateSlot = (id: string, field: keyof CatalogPhotoSlot, val: any) => {
    setCatalogSlots((prev) =>
      prev.map((s) => (s.id === id ? { ...s, [field]: val } : s))
    );
  };

  // Multiple File Upload Handler
  const handleMultiFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const fileList = Array.from(files).slice(0, 25);
    const newLoadedSlots: CatalogPhotoSlot[] = [];

    fileList.forEach((file, index) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64Url = event.target?.result as string;
        const preset = ROMANTIC_PRESET_TEMPLATES[index % ROMANTIC_PRESET_TEMPLATES.length];

        setCatalogSlots((prev) => {
          const updated = [...prev];
          if (updated[index]) {
            updated[index] = {
              ...updated[index],
              photoUrl: base64Url,
              name: file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ') || updated[index].name
            };
          } else if (updated.length < 25) {
            updated.push({
              id: `slot-${Date.now()}-${index}`,
              name: file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ') || preset.name,
              price: preset.price,
              category: preset.category,
              categoryLabel: preset.categoryLabel,
              photoUrl: base64Url,
              description: preset.description
            });
          }
          return updated;
        });
      };
      reader.readAsDataURL(file);
    });
  };

  // Fill all 25 with rich romantic stock catalog
  const handleFillAll25Presets = () => {
    setTargetSlotCapacity(25);
    setCatalogSlots(
      ROMANTIC_PRESET_TEMPLATES.map((preset, idx) => ({
        id: `slot-${idx + 1}`,
        name: preset.name,
        price: preset.price,
        category: preset.category,
        categoryLabel: preset.categoryLabel,
        photoUrl: preset.photo,
        description: preset.description
      }))
    );
  };

  // Step transitions
  const handleProceedToCatalog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!storeName || !ownerName || !phone) return;
    setStep('catalog_slots');
  };

  const handleProceedToSubscription = () => {
    setPaymentPhone(whatsapp || phone);
    setStep('subscription');
  };

  const handleConfirmAndActivate = () => {
    const storeId = `store-${Date.now()}`;
    const cleanPhone = phone.startsWith('+') ? phone : `+258${phone.replace(/[^0-9]/g, '')}`;
    const cleanWhatsApp = (whatsapp || phone).replace(/[^0-9]/g, '');

    const newStore: LoveShopStore = {
      id: storeId,
      name: storeName,
      slogan: slogan || 'Presentes e artigos especiais selecionados com carinho.',
      logo: '🎁',
      coverImage: coverImage || catalogSlots[0]?.photoUrl || 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=800&q=80',
      verified: true,
      rating: 5.0,
      reviewsCount: 1,
      salesCount: catalogSlots.length,
      city,
      province,
      address,
      phone: cleanPhone,
      whatsapp: cleanWhatsApp,
      ownerName,
      ownerNuitOrBi,
      monthlyFee: 1000,
      isSubscriptionActive: true,
      isContactUnlocked: true,
      registeredAt: new Date().toISOString().split('T')[0],
      platformTenure: 'Iniciou hoje na plataforma',
    };

    // Convert catalog slots into real LoveShopProduct entities (15 to 25 products!)
    const createdProducts: LoveShopProduct[] = catalogSlots.map((slot, index) => ({
      id: `prod-${storeId}-${index + 1}`,
      storeId: storeId,
      storeName: storeName,
      storeVerified: true,
      name: slot.name || `Artigo ${index + 1}`,
      description: slot.description || `${slot.name} disponível na loja ${storeName} em ${city}.`,
      category: slot.category || 'presentes',
      categoryLabel: slot.categoryLabel || 'Presentes',
      price: Number(slot.price) || 1200,
      photo: slot.photoUrl || 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=600&q=80',
      photos: [slot.photoUrl],
      inStock: true,
      isFeatured: index < 4,
      city,
      province,
      phone: cleanPhone,
      whatsapp: cleanWhatsApp,
      isContactUnlocked: true,
      registeredAt: new Date().toISOString().split('T')[0],
      platformTenure: 'Iniciou hoje na plataforma'
    }));

    // Generate Official Billing Invoice
    const invoiceNum = `INV-LS-${Math.floor(100000 + Math.random() * 900000)}`;
    const invoiceData: BillingInvoiceData = {
      invoiceNumber: invoiceNum,
      issueDate: new Date().toLocaleDateString('pt-MZ'),
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('pt-MZ'),
      status: 'PAID',
      moduleType: 'lodge',
      serviceTitle: 'Ativação Love Shop • Catálogo 15-25 Fotos',
      serviceDescription: `Subscrição Mensal Love Shop • Ativação Comercial (${storeName}) com ${createdProducts.length} Artigos Publicados`,
      clientName: `${storeName} (${ownerName})`,
      clientNuitOrBi: ownerNuitOrBi || '400987654',
      clientPhone: cleanPhone,
      clientProvince: province,
      clientCity: city,
      itemDetails: [
        {
          description: `Subscrição Mensal Love Shop (${createdProducts.length} Espaços de Fotos Ativos)`,
          quantity: 1,
          unitPriceMzn: 1000,
          totalMzn: 1000,
        },
      ],
      subtotalMzn: 1000,
      ivaRate: 0,
      ivaAmountMzn: 0,
      totalMzn: 1000,
      paymentMethod: paymentMethod === 'mpesa' ? 'M-Pesa' : 'e-Mola',
      transactionReference: `TX-LS-${Math.floor(10000000 + Math.random() * 90000000)}`,
    };

    setGeneratedInvoice(invoiceData);
    onAddStore(newStore, createdProducts);
    setStep('success');
  };

  const filledCount = catalogSlots.filter((s) => s.photoUrl && s.photoUrl.trim().length > 0).length;
  const isMinimumReached = catalogSlots.length >= 15;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-200">
        <div 
          className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-neutral-200 overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200 relative"
          role="dialog"
          aria-modal="true"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="px-5 py-4 border-b border-neutral-100 flex items-center justify-between bg-gradient-to-r from-rose-50 via-pink-50 to-rose-50 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-md">
                <Store className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-black text-neutral-900 leading-tight">
                  Registo & Catálogo Love Shop
                </h2>
                <p className="text-xs text-rose-700 font-semibold">
                  Mínimo 15 a 25 Espaços de Fotos • 1.000 MT / mês
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full hover:bg-neutral-200 text-neutral-500 hover:text-neutral-800 transition-colors flex items-center justify-center cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Stepper Navigation Indicator */}
          <div className="px-5 py-2.5 bg-neutral-50 border-b border-neutral-200/80 flex items-center justify-between text-xs font-bold text-neutral-500 shrink-0">
            <div className={`flex items-center gap-1.5 ${step === 'form' ? 'text-rose-600 font-black' : 'text-neutral-500'}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step === 'form' ? 'bg-rose-600 text-white' : 'bg-neutral-200'}`}>1</span>
              <span>Dados da Loja</span>
            </div>
            <span className="text-neutral-300">→</span>
            <div className={`flex items-center gap-1.5 ${step === 'catalog_slots' ? 'text-rose-600 font-black' : 'text-neutral-500'}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step === 'catalog_slots' ? 'bg-rose-600 text-white' : 'bg-neutral-200'}`}>2</span>
              <span>15 a 25 Fotos</span>
            </div>
            <span className="text-neutral-300">→</span>
            <div className={`flex items-center gap-1.5 ${step === 'subscription' ? 'text-rose-600 font-black' : 'text-neutral-500'}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step === 'subscription' ? 'bg-rose-600 text-white' : 'bg-neutral-200'}`}>3</span>
              <span>Taxa 1.000 MT</span>
            </div>
          </div>

          {/* Modal Body */}
          <div className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1 pb-32 sm:pb-6">
            
            {/* STEP 1: General Store Details Form */}
            {step === 'form' && (
              <form onSubmit={handleProceedToCatalog} className="space-y-3.5" autoComplete="off">
                <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-950 space-y-1">
                  <div className="font-bold flex items-center gap-1 text-amber-900">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Registo Comercial & Capacidade Ampliada</span>
                  </div>
                  <p className="leading-relaxed">
                    Como a sua loja investe a taxa mensal de <strong>1.000 MT</strong>, terá direito a carregar entre <strong>15 a 25 espaços de imagens e produtos</strong> para expor todos os seus artigos sem limitações.
                  </p>
                </div>

                {/* Nome da Loja */}
                <div>
                  <label className="text-xs font-bold text-neutral-800 block mb-1">
                    Nome Comercial da Loja *
                  </label>
                  <input
                    type="text"
                    required
                    autoComplete="off"
                    autoCorrect="off"
                    spellCheck={false}
                    onFocus={(e) => {
                      setTimeout(() => {
                        e.target.scrollIntoView({ behavior: 'smooth', block: 'center' });
                      }, 200);
                    }}
                    placeholder="Ex: Amor & Mais, Joias do Coração, Boutique Elegance"
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                    className="w-full h-11 px-3.5 rounded-xl border border-neutral-300 text-sm focus:border-rose-600 focus:outline-none"
                  />
                </div>

                {/* Slogan */}
                <div>
                  <label className="text-xs font-bold text-neutral-800 block mb-1">
                    Slogan ou Especialidade da Loja
                  </label>
                  <input
                    type="text"
                    autoComplete="off"
                    autoCorrect="off"
                    spellCheck={false}
                    onFocus={(e) => {
                      setTimeout(() => {
                        e.target.scrollIntoView({ behavior: 'smooth', block: 'center' });
                      }, 200);
                    }}
                    placeholder="Ex: Alianças de noivado, perfumes, peluches e presentes inesquecíveis"
                    value={slogan}
                    onChange={(e) => setSlogan(e.target.value)}
                    className="w-full h-11 px-3.5 rounded-xl border border-neutral-300 text-sm focus:border-rose-600 focus:outline-none"
                  />
                </div>

                {/* Responsável & NUIT/BI */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-neutral-800 block mb-1">
                      Proprietário / Gerente *
                    </label>
                    <input
                      type="text"
                      required
                      autoComplete="off"
                      autoCorrect="off"
                      spellCheck={false}
                      onFocus={(e) => {
                        setTimeout(() => {
                          e.target.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        }, 200);
                      }}
                      placeholder="Nome completo do responsável"
                      value={ownerName}
                      onChange={(e) => setOwnerName(e.target.value)}
                      className="w-full h-11 px-3.5 rounded-xl border border-neutral-300 text-sm focus:border-rose-600 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-neutral-800 block mb-1">
                      NUIT ou Número do BI *
                    </label>
                    <input
                      type="text"
                      required
                      autoComplete="off"
                      autoCorrect="off"
                      spellCheck={false}
                      inputMode="text"
                      onFocus={(e) => {
                        setTimeout(() => {
                          e.target.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        }, 200);
                      }}
                      placeholder="Ex: 400123987 ou 110100..."
                      value={ownerNuitOrBi}
                      onChange={(e) => setOwnerNuitOrBi(e.target.value)}
                      className="w-full h-11 px-3.5 rounded-xl border border-neutral-300 text-sm focus:border-rose-600 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Localização */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-neutral-800 block mb-1">
                      Cidade *
                    </label>
                    <input
                      type="text"
                      required
                      autoComplete="off"
                      autoCorrect="off"
                      spellCheck={false}
                      onFocus={(e) => {
                        setTimeout(() => {
                          e.target.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        }, 200);
                      }}
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full h-11 px-3.5 rounded-xl border border-neutral-300 text-sm focus:border-rose-600 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-neutral-800 block mb-1">
                      Província *
                    </label>
                    <select
                      value={province}
                      onChange={(e) => setProvince(e.target.value)}
                      className="w-full h-11 px-3.5 rounded-xl border border-neutral-300 text-sm focus:border-rose-600 focus:outline-none bg-white"
                    >
                      {MOZ_PROVINCES_LIST.filter((p) => p !== 'all').map((p) => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Endereço */}
                <div>
                  <label className="text-xs font-bold text-neutral-800 block mb-1">
                    Bairro ou Endereço Físico
                  </label>
                  <input
                    type="text"
                    autoComplete="off"
                    autoCorrect="off"
                    spellCheck={false}
                    onFocus={(e) => {
                      setTimeout(() => {
                        e.target.scrollIntoView({ behavior: 'smooth', block: 'center' });
                      }, 200);
                    }}
                    placeholder="Ex: Bairro Polana Cimento, Av. Julius Nyerere nº 120"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full h-11 px-3.5 rounded-xl border border-neutral-300 text-sm focus:border-rose-600 focus:outline-none"
                  />
                </div>

                {/* Telefones */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-neutral-800 block mb-1">
                      Telefone de Atendimento *
                    </label>
                    <input
                      type="tel"
                      required
                      autoComplete="off"
                      inputMode="tel"
                      onFocus={(e) => {
                        setTimeout(() => {
                          e.target.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        }, 200);
                      }}
                      placeholder="84 / 82 / 85..."
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full h-11 px-3.5 rounded-xl border border-neutral-300 text-sm focus:border-rose-600 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-neutral-800 block mb-1">
                      WhatsApp para Pedidos Directos *
                    </label>
                    <input
                      type="tel"
                      required
                      autoComplete="off"
                      inputMode="tel"
                      onFocus={(e) => {
                        setTimeout(() => {
                          e.target.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        }, 200);
                      }}
                      placeholder="84 / 85 / 86..."
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value)}
                      className="w-full h-11 px-3.5 rounded-xl border border-neutral-300 text-sm focus:border-rose-600 focus:outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full h-12 bg-rose-600 hover:bg-rose-700 active:scale-98 text-white rounded-2xl font-black text-sm flex items-center justify-center gap-2 transition-all shadow-md shadow-rose-600/25 cursor-pointer mt-2"
                >
                  <span>Avançar para Carregamento de Fotos (15 a 25 Espaços)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}

            {/* STEP 2: 15 to 25 Image Slots Upload & Management */}
            {step === 'catalog_slots' && (
              <div className="space-y-4">
                {/* Capacity Selection Toolbar */}
                <div className="p-4 bg-gradient-to-r from-rose-50 to-pink-50 rounded-2xl border border-rose-200 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h3 className="font-black text-sm sm:text-base text-neutral-900 flex items-center gap-2">
                        <ImageIcon className="w-4 h-4 text-rose-600" />
                        <span>Espaços de Imagem do Catálogo (Mín: 15 | Máx: 25)</span>
                      </h3>
                      <p className="text-xs text-neutral-600 mt-0.5">
                        Defina a quantidade de artigos para expor na sua loja comercial.
                      </p>
                    </div>

                    {/* Fast Presets: 15, 20 or 25 slots */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="text-[11px] font-bold text-neutral-500 mr-1">Espaços:</span>
                      {([15, 20, 25] as const).map((cap) => (
                        <button
                          key={cap}
                          type="button"
                          onClick={() => handleSetCapacity(cap)}
                          className={`h-8 px-3 rounded-xl text-xs font-black transition-all cursor-pointer ${
                            catalogSlots.length === cap
                              ? 'bg-rose-600 text-white shadow-xs'
                              : 'bg-white text-neutral-700 border border-neutral-200 hover:bg-rose-100/50'
                          }`}
                        >
                          {cap} Fotos
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Progress & Status Bar */}
                  <div className="pt-2 border-t border-rose-200/70 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-neutral-800">
                        Total de Espaços Ativos: <strong className="text-rose-600">{catalogSlots.length}</strong> / 25
                      </span>
                      {isMinimumReached ? (
                        <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-bold text-[11px] flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          Mínimo cumprido (≥15)
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 font-bold text-[11px] flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                          Faltam {15 - catalogSlots.length} para o mínimo de 15
                        </span>
                      )}
                    </div>

                    {/* Action Buttons: Batch Upload or Template Preset */}
                    <div className="flex items-center gap-2">
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleMultiFileUpload}
                        multiple
                        accept="image/*"
                        className="hidden"
                      />

                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="h-8 px-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                        title="Carregar fotos do telemóvel"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>Carregar Fotos</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleFillAll25Presets}
                        className="h-8 px-3 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                        title="Preencher todos os 25 espaços com catálogo romântico"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                        <span>Preencher 25 Fotos</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Slots Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[50vh] overflow-y-auto pr-1">
                  {catalogSlots.map((slot, index) => (
                    <div
                      key={slot.id}
                      className="p-3 bg-white rounded-2xl border border-neutral-200 shadow-2xs space-y-2 flex flex-col justify-between"
                    >
                      {/* Top slot header */}
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase tracking-wider text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md">
                          Espaço #{index + 1} de {catalogSlots.length}
                        </span>
                        {catalogSlots.length > 15 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveSlot(slot.id)}
                            className="text-neutral-400 hover:text-rose-600 p-1 transition-colors cursor-pointer"
                            title="Remover este espaço"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>

                      {/* Photo Thumbnail & URL / Input */}
                      <div className="flex items-center gap-2.5">
                        <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-neutral-100 border border-neutral-200 shrink-0">
                          {slot.photoUrl ? (
                            <img
                              src={slot.photoUrl}
                              alt={slot.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center text-neutral-400">
                              <ImageIcon className="w-5 h-5" />
                              <span className="text-[9px] font-bold">Sem foto</span>
                            </div>
                          )}
                        </div>

                        <div className="flex-1 min-w-0 space-y-1">
                          <input
                            type="text"
                            placeholder="Nome do Artigo / Presente"
                            value={slot.name}
                            onChange={(e) => handleUpdateSlot(slot.id, 'name', e.target.value)}
                            className="w-full h-8 px-2.5 rounded-lg border border-neutral-300 text-xs font-bold focus:border-rose-600 focus:outline-none"
                          />
                          <div className="flex items-center gap-1.5">
                            <input
                              type="number"
                              placeholder="Preço MT"
                              value={slot.price || ''}
                              onChange={(e) => handleUpdateSlot(slot.id, 'price', e.target.value)}
                              className="w-24 h-7 px-2 rounded-lg border border-neutral-300 text-xs font-bold text-rose-600 focus:border-rose-600 focus:outline-none"
                            />
                            <span className="text-[11px] font-bold text-neutral-500">MT</span>
                          </div>
                        </div>
                      </div>

                      {/* Photo Link Input */}
                      <div>
                        <input
                          type="text"
                          placeholder="Link da imagem (ou use o botão 'Carregar Fotos')"
                          value={slot.photoUrl}
                          onChange={(e) => handleUpdateSlot(slot.id, 'photoUrl', e.target.value)}
                          className="w-full h-7 px-2 rounded-lg border border-neutral-200 text-[11px] text-neutral-600 focus:border-rose-600 focus:outline-none truncate"
                        />
                      </div>
                    </div>
                  ))}

                  {/* Add Individual Slot Button if < 25 */}
                  {catalogSlots.length < 25 && (
                    <button
                      type="button"
                      onClick={handleAddIndividualSlot}
                      className="p-4 rounded-2xl border-2 border-dashed border-rose-300 hover:border-rose-500 bg-rose-50/40 hover:bg-rose-50 text-rose-700 font-bold text-xs flex flex-col items-center justify-center gap-1 transition-all cursor-pointer min-h-[140px]"
                    >
                      <Plus className="w-6 h-6 text-rose-600" />
                      <span>Adicionar Espaço #{catalogSlots.length + 1} (até 25)</span>
                    </button>
                  )}
                </div>

                {/* Bottom Navigation */}
                <div className="pt-2 flex items-center justify-between gap-3 border-t border-neutral-100">
                  <button
                    type="button"
                    onClick={() => setStep('form')}
                    className="h-11 px-4 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Voltar aos Dados</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleProceedToSubscription}
                    className="h-11 px-5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs sm:text-sm flex items-center gap-2 shadow-md shadow-rose-600/20 transition-all cursor-pointer"
                  >
                    <span>Avançar para Ativação ({catalogSlots.length} Artigos Prontos)</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: Subscription & Payment Modal */}
            {step === 'subscription' && (
              <div className="space-y-4">
                <div className="p-4 bg-gradient-to-br from-rose-50 to-pink-50 rounded-2xl border border-rose-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-rose-800">
                      Subscrição Mensal Oficial
                    </span>
                    <span className="text-xs font-black bg-rose-600 text-white px-2.5 py-0.5 rounded-md">
                      1.000 MT / mês
                    </span>
                  </div>
                  <h3 className="text-base font-black text-neutral-900">
                    Ativação da Loja: {storeName}
                  </h3>
                  <p className="text-xs text-neutral-600 leading-relaxed">
                    Dá direito à publicação dos <strong>{catalogSlots.length} artigos e fotos carregados</strong>, selo de Loja Verificada, WhatsApp direto e emissão de fatura fiscal oficial com NUIT e IVA.
                  </p>
                </div>

                {/* Payment Method Selector */}
                <div>
                  <label className="text-xs font-bold text-neutral-800 block mb-2">
                    Método de Pagamento da Mensalidade:
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('mpesa')}
                      className={`p-3 rounded-2xl border-2 flex items-center gap-3 transition-all cursor-pointer ${
                        paymentMethod === 'mpesa'
                          ? 'border-red-500 bg-red-50/50 shadow-xs'
                          : 'border-neutral-200 hover:border-neutral-300 bg-white'
                      }`}
                    >
                      <div className="w-8 h-8 rounded-xl bg-red-600 text-white flex items-center justify-center font-black text-xs shrink-0">
                        M
                      </div>
                      <div className="text-left">
                        <div className="font-extrabold text-xs text-neutral-900">M-Pesa</div>
                        <div className="text-[10px] text-neutral-500">Vodacom Moçambique</div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('emola')}
                      className={`p-3 rounded-2xl border-2 flex items-center gap-3 transition-all cursor-pointer ${
                        paymentMethod === 'emola'
                          ? 'border-orange-500 bg-orange-50/50 shadow-xs'
                          : 'border-neutral-200 hover:border-neutral-300 bg-white'
                      }`}
                    >
                      <div className="w-8 h-8 rounded-xl bg-orange-600 text-white flex items-center justify-center font-black text-xs shrink-0">
                        e
                      </div>
                      <div className="text-left">
                        <div className="font-extrabold text-xs text-neutral-900">e-Mola</div>
                        <div className="text-[10px] text-neutral-500">Movitel</div>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Phone for payment prompt */}
                <div>
                  <label className="text-xs font-bold text-neutral-800 block mb-1">
                    Número {paymentMethod === 'mpesa' ? 'M-Pesa' : 'e-Mola'} para Débito:
                  </label>
                  <input
                    type="tel"
                    required
                    value={paymentPhone}
                    onChange={(e) => setPaymentPhone(e.target.value)}
                    placeholder="84 / 85 / 86..."
                    className="w-full h-11 px-3.5 rounded-xl border border-neutral-300 text-sm focus:border-rose-600 focus:outline-none"
                  />
                </div>

                {/* Legal note */}
                <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 text-[11px] text-neutral-600 flex items-start gap-2">
                  <Clock className="w-4 h-4 text-neutral-500 shrink-0 mt-0.5" />
                  <span>
                    A ativação é imediata. A fatura fiscal oficial será gerada e ficará disponível para consulta e download na plataforma.
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="pt-2 flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => setStep('catalog_slots')}
                    className="h-11 px-4 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Voltar às Fotos</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleConfirmAndActivate}
                    className="h-11 px-5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 active:scale-98 text-white font-black text-xs sm:text-sm flex items-center gap-2 shadow-md transition-all cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>Confirmar Pagamento de 1.000 MT</span>
                  </button>
                </div>
              </div>
            )}

            {/* STEP 4: Success View */}
            {step === 'success' && (
              <div className="text-center py-4 space-y-4">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto shadow-sm">
                  <CheckCircle2 className="w-10 h-10" />
                </div>

                <div className="space-y-1">
                  <h3 className="text-lg sm:text-xl font-black text-neutral-900">
                    Loja Ativada com Sucesso!
                  </h3>
                  <p className="text-xs text-neutral-600 max-w-sm mx-auto">
                    A loja <strong>{storeName}</strong> foi registada e os seus <strong>{catalogSlots.length} artigos</strong> já estão publicados na Love Shop do Onde Dormir Moçambique.
                  </p>
                </div>

                {/* Actions */}
                <div className="pt-2 space-y-2 max-w-xs mx-auto">
                  {generatedInvoice && (
                    <button
                      type="button"
                      onClick={() => setIsInvoiceOpen(true)}
                      className="w-full h-11 rounded-2xl bg-amber-500 hover:bg-amber-600 active:scale-95 text-zinc-950 font-black text-xs flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer"
                    >
                      <FileText className="w-4 h-4" />
                      <span>Ver Fatura Fiscal Oficial (INV-LS)</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={onClose}
                    className="w-full h-11 rounded-2xl bg-neutral-900 hover:bg-neutral-800 active:scale-95 text-white font-bold text-xs transition-colors cursor-pointer"
                  >
                    Concluir e Explorar Love Shop
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* Official Invoice Modal View */}
      {generatedInvoice && (
        <BillingInvoiceModal
          isOpen={isInvoiceOpen}
          onClose={() => setIsInvoiceOpen(false)}
          invoiceData={generatedInvoice}
        />
      )}
    </>
  );
};
