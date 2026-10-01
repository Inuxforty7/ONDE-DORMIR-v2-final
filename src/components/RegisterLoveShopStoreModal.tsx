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
  photos: string[]; // 1 to 4 photo slides
  videoUrl?: string; // Optional final video
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
  const [step, setStep] = useState<'form' | 'identity_verification' | 'catalog_slots' | 'subscription' | 'success'>('form');

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

  // Mandatory Identity & Anti-Fraud Verification State
  const [docType, setDocType] = useState<'bi' | 'passport' | 'dire'>('bi');
  const [docNumber, setDocNumber] = useState('');
  const [biFrontPhoto, setBiFrontPhoto] = useState('');
  const [biBackPhoto, setBiBackPhoto] = useState('');
  const [facialSelfiePhoto, setFacialSelfiePhoto] = useState('');
  const [isFacialVerified, setIsFacialVerified] = useState(false);
  const [isCapturingSelfie, setIsCapturingSelfie] = useState(false);
  const [verificationError, setVerificationError] = useState<string | null>(null);

  // 1 to 25 Products with 1-4 Slides + 1 Optional Video each
  const [catalogSlots, setCatalogSlots] = useState<CatalogPhotoSlot[]>(() => [
    {
      id: 'slot-1',
      name: 'Vestido Kaftan Tie-Dye com Lenço Elegance',
      price: 1200,
      category: 'presentes',
      categoryLabel: 'Vestidos & Kaftans',
      photos: [
        'https://res.cloudinary.com/dwlfwnbt0/image/upload/v1790850247/WhatsApp_Image_2026-10-01_at_09.57.42_pazcz5.jpg',
        'https://res.cloudinary.com/dwlfwnbt0/image/upload/v1790850245/WhatsApp_Image_2026-10-01_at_09.57.40_1_bicov1.jpg',
        'https://res.cloudinary.com/dwlfwnbt0/image/upload/v1790850246/WhatsApp_Image_2026-10-01_at_09.57.40_x2fg1n.jpg',
        'https://res.cloudinary.com/dwlfwnbt0/image/upload/v1790850245/WhatsApp_Image_2026-10-01_at_09.41.58_zkejsm.jpg',
      ],
      videoUrl: 'https://res.cloudinary.com/dwlfwnbt0/video/upload/v1790851926/Dynamic_slide_transition_for_images_20261001125112_qxvkw0.mp4',
      description: 'Vestido longo tradicional Boubou Kaftan com tingimento artesanal Tie-Dye e lenço combinando.'
    }
  ]);

  const [showUpgradeModal, setShowUpgradeModal] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Subscription / Payment State
  const [paymentMethod, setPaymentMethod] = useState<'mpesa' | 'emola'>('mpesa');
  const [paymentPhone, setPaymentPhone] = useState('');

  // Invoice Modal
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);
  const [generatedInvoice, setGeneratedInvoice] = useState<BillingInvoiceData | null>(null);

  if (!isOpen) return null;

  // Add individual product (up to 25 max for standard plan)
  const handleAddIndividualSlot = () => {
    if (catalogSlots.length >= 25) {
      setShowUpgradeModal(true);
      return;
    }
    const nextIdx = catalogSlots.length + 1;
    const newSlot: CatalogPhotoSlot = {
      id: `slot-${Date.now()}-${nextIdx}`,
      name: '',
      price: 1500,
      category: 'presentes',
      categoryLabel: 'Vestidos & Kaftans',
      photos: [],
      videoUrl: '',
      description: ''
    };
    setCatalogSlots((prev) => [...prev, newSlot]);
  };

  // Remove individual slot (if > 1)
  const handleRemoveSlot = (id: string) => {
    if (catalogSlots.length <= 1) return;
    setCatalogSlots((prev) => prev.filter((s) => s.id !== id));
  };

  // Edit slot field
  const handleUpdateSlot = (id: string, field: keyof CatalogPhotoSlot, val: any) => {
    setCatalogSlots((prev) =>
      prev.map((s) => (s.id === id ? { ...s, [field]: val } : s))
    );
  };

  // Update photo for a specific slide index (0 to 3)
  const handleUpdateProductSlidePhoto = (slotId: string, slideIndex: number, url: string) => {
    setCatalogSlots((prev) =>
      prev.map((slot) => {
        if (slot.id !== slotId) return slot;
        const currentPhotos = [...(slot.photos || [])];
        if (url && url.trim().length > 0) {
          currentPhotos[slideIndex] = url.trim();
        } else {
          currentPhotos.splice(slideIndex, 1);
        }
        return {
          ...slot,
          photos: currentPhotos.slice(0, 4)
        };
      })
    );
  };

  // Update video for product
  const handleUpdateProductVideo = (slotId: string, url: string) => {
    setCatalogSlots((prev) =>
      prev.map((s) => (s.id === slotId ? { ...s, videoUrl: url.trim() } : s))
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
              photos: [base64Url],
              name: file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ') || updated[index].name
            };
          } else if (updated.length < 25) {
            updated.push({
              id: `slot-${Date.now()}-${index}`,
              name: file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ') || preset.name,
              price: preset.price,
              category: preset.category,
              categoryLabel: preset.categoryLabel,
              photos: [base64Url],
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
    setCatalogSlots(
      ROMANTIC_PRESET_TEMPLATES.map((preset, idx) => ({
        id: `slot-${idx + 1}`,
        name: preset.name,
        price: preset.price,
        category: preset.category,
        categoryLabel: preset.categoryLabel,
        photos: [preset.photo],
        videoUrl: idx === 0 ? 'https://res.cloudinary.com/dwlfwnbt0/video/upload/v1790851926/Dynamic_slide_transition_for_images_20261001125112_qxvkw0.mp4' : undefined,
        description: preset.description
      }))
    );
  };

  // Quick Simulation Test with Fashion & Kaftan Items (sem escrever)
  const handleQuickDemoSimulation = () => {
    setStoreName('Boutique Afro Chic');
    setSlogan('Vestidos Kaftan Tie-Dye exclusivos, moda africana e lenços finos.');
    setOwnerName('Amina Muthemba');
    setOwnerNuitOrBi('400888222');
    setCity('Maputo');
    setProvince('Maputo Cidade');
    setAddress('Av. Julius Nyerere, Polana Cimento');
    setPhone('+258841234567');
    setWhatsapp('258841234567');
    setDocNumber('110293847589B');
    setBiFrontPhoto('https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=400&q=80');
    setBiBackPhoto('https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=400&q=80');
    setFacialSelfiePhoto('https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80');
    setIsFacialVerified(true);
    
    // Set first product with 4 slides + Cloudinary video
    setCatalogSlots([
      {
        id: 'slot-1',
        name: 'Vestido Kaftan Tie-Dye com Lenço Elegance',
        price: 1200,
        category: 'presentes',
        categoryLabel: 'Vestidos & Kaftans',
        photos: [
          'https://res.cloudinary.com/dwlfwnbt0/image/upload/v1790850247/WhatsApp_Image_2026-10-01_at_09.57.42_pazcz5.jpg',
          'https://res.cloudinary.com/dwlfwnbt0/image/upload/v1790850245/WhatsApp_Image_2026-10-01_at_09.57.40_1_bicov1.jpg',
          'https://res.cloudinary.com/dwlfwnbt0/image/upload/v1790850246/WhatsApp_Image_2026-10-01_at_09.57.40_x2fg1n.jpg',
          'https://res.cloudinary.com/dwlfwnbt0/image/upload/v1790850245/WhatsApp_Image_2026-10-01_at_09.41.58_zkejsm.jpg',
        ],
        videoUrl: 'https://res.cloudinary.com/dwlfwnbt0/video/upload/v1790851926/Dynamic_slide_transition_for_images_20261001125112_qxvkw0.mp4',
        description: 'Vestido longo tradicional Boubou Kaftan com tingimento artesanal Tie-Dye e lenço combinando.'
      },
      {
        id: 'slot-2',
        name: 'Vestido Boubou Seda Africana Estampado Exclusivo',
        price: 1200,
        category: 'presentes',
        categoryLabel: 'Vestidos & Kaftans',
        photos: [
          'https://res.cloudinary.com/dwlfwnbt0/image/upload/v1790850245/WhatsApp_Image_2026-10-01_at_09.52.26_bw3rym.jpg',
          'https://res.cloudinary.com/dwlfwnbt0/image/upload/v1790850244/WhatsApp_Image_2026-10-01_at_09.38.07_bxfl7o.jpg',
        ],
        description: 'Boubou solto de alta costura com estampagem exclusiva e toque sedoso.'
      },
      {
        id: 'slot-3',
        name: 'Kaftan Cerimónia Amarelo Ouro e Roxo Tie-Dye',
        price: 1200,
        category: 'presentes',
        categoryLabel: 'Vestidos & Kaftans',
        photos: [
          'https://res.cloudinary.com/dwlfwnbt0/image/upload/v1790850244/WhatsApp_Image_2026-10-01_at_09.37.13_afo8bi.jpg',
          'https://res.cloudinary.com/dwlfwnbt0/image/upload/v1790850244/WhatsApp_Image_2026-10-01_at_09.35.39_rvi27n.jpg',
        ],
        description: 'Combinação contrastante de amarelo sol e roxo com técnica manual de tie-dye.'
      }
    ]);
    
    // Jump straight to catalog evaluation
    setStep('catalog_slots');
  };

  // Step transitions
  const handleProceedToIdentity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!storeName || !ownerName || !phone) return;
    setStep('identity_verification');
  };

  const handleProceedToCatalog = () => {
    if (!docNumber) {
      setVerificationError('Por favor insira o número do seu BI ou Passaporte.');
      return;
    }
    if (!biFrontPhoto) {
      setVerificationError('Por favor anexe a fotografia da frente do seu documento.');
      return;
    }
    if (!facialSelfiePhoto && !isFacialVerified) {
      setVerificationError('Por favor realize a validação facial selfie do titular.');
      return;
    }
    setVerificationError(null);
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
      logo: '👗',
      coverImage: coverImage || catalogSlots[0]?.photos?.[0] || 'https://res.cloudinary.com/dwlfwnbt0/image/upload/v1790850247/WhatsApp_Image_2026-10-01_at_09.57.42_pazcz5.jpg',
      verified: true,
      isIdentityVerified: true,
      verifiedDocType: docType,
      verifiedDocNumber: docNumber || ownerNuitOrBi,
      biFrontPhoto,
      biBackPhoto,
      facialSelfiePhoto,
      isFacialVerified: true,
      antiFraudBadge: '🛡️ Identidade & Loja Verificada Anti-Fraude',
      rating: 5.0,
      reviewsCount: 1,
      salesCount: catalogSlots.length,
      city,
      province,
      address,
      phone: cleanPhone,
      whatsapp: cleanWhatsApp,
      ownerName,
      ownerNuitOrBi: docNumber || ownerNuitOrBi,
      monthlyFee: 1000,
      isSubscriptionActive: true,
      isContactUnlocked: true,
      registeredAt: new Date().toISOString().split('T')[0],
      platformTenure: 'Loja Nova Verificada',
    };

    // Convert catalog slots into real LoveShopProduct entities (1 to 25 products!)
    const createdProducts: LoveShopProduct[] = catalogSlots.map((slot, index) => {
      const activePhotos = (slot.photos || []).filter((p) => p && p.trim().length > 0);
      const mainPhoto = activePhotos[0] || 'https://res.cloudinary.com/dwlfwnbt0/image/upload/v1790850247/WhatsApp_Image_2026-10-01_at_09.57.42_pazcz5.jpg';
      return {
        id: `prod-${storeId}-${index + 1}`,
        storeId,
        storeName,
        storeVerified: true,
        name: slot.name || `Produto ${index + 1}`,
        description: slot.description || `${slot.name} disponível na loja ${storeName} em ${city}.`,
        category: slot.category || 'presentes',
        categoryLabel: slot.categoryLabel || 'Vestidos & Presentes',
        price: Number(slot.price) || 1500,
        photo: mainPhoto,
        photos: activePhotos.length > 0 ? activePhotos : [mainPhoto],
        videoUrl: slot.videoUrl && slot.videoUrl.trim().length > 0 ? slot.videoUrl : undefined,
        videoDuration: slot.videoUrl ? '0:35 min' : undefined,
        inStock: true,
        isFeatured: index === 0,
        city,
        province,
        phone: cleanPhone,
        whatsapp: cleanWhatsApp,
        isContactUnlocked: true,
        registeredAt: new Date().toISOString().split('T')[0],
        platformTenure: 'Loja Verificada'
      };
    });

    // Generate Official Billing Invoice
    const invoiceNum = `INV-LS-${Math.floor(100000 + Math.random() * 900000)}`;
    const invoiceData: BillingInvoiceData = {
      invoiceNumber: invoiceNum,
      issueDate: new Date().toLocaleDateString('pt-MZ'),
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('pt-MZ'),
      status: 'PAID',
      moduleType: 'lodge',
      serviceTitle: 'Ativação Love Shop • Catálogo até 25 Produtos (4 Slides + 1 Vídeo cada)',
      serviceDescription: `Subscrição Mensal Love Shop • Ativação Comercial (${storeName}) com ${createdProducts.length} Produtos Cadastrados`,
      clientName: `${storeName} (${ownerName})`,
      clientNuitOrBi: ownerNuitOrBi || '400987654',
      clientPhone: cleanPhone,
      clientProvince: province,
      clientCity: city,
      itemDetails: [
        {
          description: `Subscrição Mensal Love Shop (${createdProducts.length} Produtos com 4 Slides + 1 Vídeo)`,
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

  const isMinimumReached = catalogSlots.length >= 1 && catalogSlots.length <= 25;

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
                  Registar Nova Loja
                </h2>
                <p className="text-xs text-rose-700 font-semibold">
                  Crie a sua vitrine comercial • 1.000 MT / mês
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

          {/* Stepper Navigation Indicator - Sleek, Responsive, Zero-Scrollbar */}
          <div className="px-5 py-3 bg-neutral-50/90 border-b border-neutral-200/80 shrink-0 space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-neutral-900">
                {step === 'form' && '1. Dados Comerciais da Loja'}
                {step === 'identity_verification' && '2. Verificação de Identidade (BI + Selfie)'}
                {step === 'catalog_slots' && '3. Catálogo de Artigos (1 a 25)'}
                {step === 'subscription' && '4. Ativação & Mensalidade'}
              </span>
              <span className="text-[11px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200/70">
                {step === 'form' ? 'Passo 1/4' : step === 'identity_verification' ? 'Passo 2/4' : step === 'catalog_slots' ? 'Passo 3/4' : 'Passo 4/4'}
              </span>
            </div>
            {/* Segmented Progress Track */}
            <div className="grid grid-cols-4 gap-1.5 h-1.5 w-full">
              <div className={`rounded-full transition-all duration-300 ${step === 'form' || step === 'identity_verification' || step === 'catalog_slots' || step === 'subscription' ? 'bg-rose-600' : 'bg-neutral-200'}`} />
              <div className={`rounded-full transition-all duration-300 ${step === 'identity_verification' || step === 'catalog_slots' || step === 'subscription' ? 'bg-rose-600' : 'bg-neutral-200'}`} />
              <div className={`rounded-full transition-all duration-300 ${step === 'catalog_slots' || step === 'subscription' ? 'bg-rose-600' : 'bg-neutral-200'}`} />
              <div className={`rounded-full transition-all duration-300 ${step === 'subscription' ? 'bg-rose-600' : 'bg-neutral-200'}`} />
            </div>
          </div>

          {/* Modal Body */}
          <div className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1 pb-32 sm:pb-6">
            
            {/* STEP 1: General Store Details Form */}
            {step === 'form' && (
              <form onSubmit={handleProceedToIdentity} className="space-y-3.5" autoComplete="off">

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
                      placeholder="Nome completo do responsável"
                      value={ownerName}
                      onChange={(e) => setOwnerName(e.target.value)}
                      className="w-full h-11 px-3.5 rounded-xl border border-neutral-300 text-sm focus:border-rose-600 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-neutral-800 block mb-1">
                      NUIT da Loja ou Empresa
                    </label>
                    <input
                      type="text"
                      autoComplete="off"
                      autoCorrect="off"
                      spellCheck={false}
                      inputMode="text"
                      placeholder="Ex: 400123987"
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
                  <span>Avançar para Verificação de Identidade (BI & Selfie)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}

            {/* STEP 2: Mandatory Identity Verification & Anti-Fraud Protection */}
            {step === 'identity_verification' && (
              <div className="space-y-4 animate-in fade-in duration-200">
                {/* Anti-Fraud Banner Rationale */}
                <div className="p-4 bg-gradient-to-r from-red-50 via-rose-50 to-amber-50 rounded-2xl border border-rose-200 shadow-xs space-y-2">
                  <div className="flex items-center gap-2 text-rose-950 font-black text-sm">
                    <ShieldCheck className="w-5 h-5 text-rose-600 shrink-0" />
                    <span>Verificação de Identidade Obrigatória & Prevenção Anti-Fraude</span>
                  </div>
                  <p className="text-xs text-rose-900 leading-relaxed font-medium">
                    <strong>Prevenção Anti-Fraude e Burlas:</strong> Os proprietários/donos de lojas têm de obrigatoriamente submeter documento de identificação válido (BI ou Passaporte) e realizar a validação facial (selfie). A exigência destas formalidades justifica-se pelo elevado risco de criação de lojas falsas por parte de burladores, visando proteger os utilizadores de esquemas e burlas na plataforma.
                  </p>
                </div>

                {verificationError && (
                  <div className="p-3 bg-red-100 border border-red-300 text-red-800 text-xs font-bold rounded-xl flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{verificationError}</span>
                  </div>
                )}

                {/* Document Type & Number */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-neutral-800 block mb-1">
                      Tipo de Documento Oficial *
                    </label>
                    <select
                      value={docType}
                      onChange={(e) => setDocType(e.target.value as any)}
                      className="w-full h-11 px-3.5 rounded-xl border border-neutral-300 text-sm focus:border-rose-600 focus:outline-none bg-white font-medium"
                    >
                      <option value="bi">Bilhete de Identidade (BI Moçambicano)</option>
                      <option value="passport">Passaporte Nacional</option>
                      <option value="dire">DIRE (Estrangeiro Residente)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-neutral-800 block mb-1">
                      Número do Documento ({docType === 'bi' ? 'BI' : 'Passaporte'}) *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder={docType === 'bi' ? 'Ex: 110100234567M' : 'Ex: AB123456'}
                      value={docNumber}
                      onChange={(e) => setDocNumber(e.target.value)}
                      className="w-full h-11 px-3.5 rounded-xl border border-neutral-300 text-sm focus:border-rose-600 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Document Photos (Frente & Verso) */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-neutral-800 block">
                    Fotografias Nítidas do Documento (Frente e Verso) *
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Front Photo */}
                    <div className="p-3 bg-neutral-50 rounded-2xl border border-neutral-200 text-center flex flex-col items-center justify-center min-h-[140px]">
                      {biFrontPhoto ? (
                        <div className="relative w-full h-28 rounded-xl overflow-hidden group">
                          <img src={biFrontPhoto} alt="Frente Documento" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => setBiFrontPhoto('')}
                            className="absolute top-2 right-2 p-1.5 rounded-full bg-black/70 text-white hover:bg-red-600 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                          <span className="absolute bottom-1 left-2 text-[10px] font-bold text-white bg-black/60 px-1.5 py-0.5 rounded">Frente Anexada</span>
                        </div>
                      ) : (
                        <label className="cursor-pointer flex flex-col items-center gap-1.5 p-2 w-full">
                          <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center">
                            <Upload className="w-5 h-5" />
                          </div>
                          <span className="text-xs font-bold text-neutral-800">Foto Frente do {docType === 'bi' ? 'BI' : 'Passaporte'}</span>
                          <span className="text-[10px] text-neutral-500">Clique para carregar foto nítida</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const f = e.target.files?.[0];
                              if (f) {
                                const r = new FileReader();
                                r.onload = (ev) => setBiFrontPhoto(ev.target?.result as string);
                                r.readAsDataURL(f);
                              }
                            }}
                          />
                        </label>
                      )}
                    </div>

                    {/* Back Photo */}
                    <div className="p-3 bg-neutral-50 rounded-2xl border border-neutral-200 text-center flex flex-col items-center justify-center min-h-[140px]">
                      {biBackPhoto ? (
                        <div className="relative w-full h-28 rounded-xl overflow-hidden group">
                          <img src={biBackPhoto} alt="Verso Documento" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => setBiBackPhoto('')}
                            className="absolute top-2 right-2 p-1.5 rounded-full bg-black/70 text-white hover:bg-red-600 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                          <span className="absolute bottom-1 left-2 text-[10px] font-bold text-white bg-black/60 px-1.5 py-0.5 rounded">Verso Anexado</span>
                        </div>
                      ) : (
                        <label className="cursor-pointer flex flex-col items-center gap-1.5 p-2 w-full">
                          <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center">
                            <Upload className="w-5 h-5" />
                          </div>
                          <span className="text-xs font-bold text-neutral-800">Foto Verso do {docType === 'bi' ? 'BI' : 'Documento'}</span>
                          <span className="text-[10px] text-neutral-500">Clique para carregar foto do verso</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const f = e.target.files?.[0];
                              if (f) {
                                const r = new FileReader();
                                r.onload = (ev) => setBiBackPhoto(ev.target?.result as string);
                                r.readAsDataURL(f);
                              }
                            }}
                          />
                        </label>
                      )}
                    </div>
                  </div>
                </div>

                {/* Facial Selfie Validation */}
                <div className="p-4 bg-rose-50/70 rounded-2xl border border-rose-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-black text-rose-950">Validação Facial do Titular *</h4>
                      <p className="text-[11px] text-rose-800">Tire uma selfie nítida do seu rosto em local bem iluminado.</p>
                    </div>
                    {isFacialVerified && (
                      <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Validado
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-3">
                    {facialSelfiePhoto ? (
                      <div className="relative w-24 h-24 rounded-2xl overflow-hidden border-2 border-emerald-500 shadow-md shrink-0">
                        <img src={facialSelfiePhoto} alt="Selfie do Titular" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-emerald-950/20 flex items-center justify-center">
                          <CheckCircle2 className="w-8 h-8 text-white drop-shadow-md" />
                        </div>
                      </div>
                    ) : (
                      <div className="w-24 h-24 rounded-2xl border-2 border-dashed border-rose-300 bg-white flex flex-col items-center justify-center text-rose-500 shrink-0">
                        <Sparkles className="w-6 h-6 mb-1 text-rose-400" />
                        <span className="text-[9px] font-bold text-center">Aguardando Selfie</span>
                      </div>
                    )}

                    <div className="flex-1 w-full space-y-2">
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setIsCapturingSelfie(true);
                            setTimeout(() => {
                              setFacialSelfiePhoto('https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80');
                              setIsFacialVerified(true);
                              setIsCapturingSelfie(false);
                            }, 1000);
                          }}
                          disabled={isCapturingSelfie}
                          className="flex-1 h-10 bg-rose-600 hover:bg-rose-700 active:scale-95 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer disabled:opacity-50"
                        >
                          <Sparkles className="w-4 h-4" />
                          <span>{isCapturingSelfie ? 'A validar biometria...' : 'Realizar Validação Facial'}</span>
                        </button>

                        <label className="h-10 px-3 bg-white border border-rose-300 hover:bg-rose-50 active:scale-95 text-rose-700 font-bold text-xs rounded-xl flex items-center justify-center gap-1 cursor-pointer transition-colors">
                          <Upload className="w-3.5 h-3.5" />
                          <span>Carregar</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const f = e.target.files?.[0];
                              if (f) {
                                const r = new FileReader();
                                r.onload = (ev) => {
                                  setFacialSelfiePhoto(ev.target?.result as string);
                                  setIsFacialVerified(true);
                                };
                                r.readAsDataURL(f);
                              }
                            }}
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setStep('form')}
                    className="px-4 h-12 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-2xl font-bold text-xs transition-colors cursor-pointer"
                  >
                    Voltar
                  </button>
                  <button
                    type="button"
                    onClick={handleProceedToCatalog}
                    className="flex-1 h-12 bg-rose-600 hover:bg-rose-700 active:scale-98 text-white rounded-2xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md shadow-rose-600/25 cursor-pointer"
                  >
                    <span>Continuar para o Catálogo</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: 1 to 25 Products Catalog */}
            {step === 'catalog_slots' && (
              <div className="space-y-4">
                {/* Catalog Status Bar */}
                <div className="p-3.5 bg-gradient-to-r from-rose-50 to-pink-50 rounded-2xl border border-rose-200 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <h3 className="font-black text-sm text-neutral-900 flex items-center gap-2">
                        <Store className="w-4 h-4 text-rose-600" />
                        <span>Catálogo da Loja</span>
                      </h3>
                      <p className="text-[11px] text-neutral-600 font-medium mt-0.5">
                        Adicione os produtos que deseja exibir no catálogo.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleAddIndividualSlot}
                      disabled={catalogSlots.length >= 25}
                      className="h-8 px-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs cursor-pointer disabled:opacity-50 shrink-0"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Adicionar</span>
                    </button>
                  </div>

                  <div className="pt-2 border-t border-rose-200/70 flex items-center justify-between text-xs font-semibold text-neutral-700">
                    <span>
                      Total no catálogo: <strong className="text-rose-600 font-black">{catalogSlots.length}</strong> produtos
                    </span>
                    {catalogSlots.length >= 25 && (
                      <span className="text-amber-700 bg-amber-100 px-2 py-0.5 rounded-md text-[11px] font-bold">
                        Limite de 25 atingido
                      </span>
                    )}
                  </div>
                </div>

                {/* Products List (1 to 25 items) */}
                <div className="space-y-4 max-h-[52vh] overflow-y-auto pr-1">
                  {catalogSlots.map((slot, pIdx) => (
                    <div
                      key={slot.id}
                      className="p-4 bg-white rounded-2xl border border-neutral-200/90 shadow-2xs space-y-3"
                    >
                      {/* Product Header */}
                      <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-black uppercase tracking-wider text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-lg border border-rose-200/60">
                            Produto #{pIdx + 1}
                          </span>
                          <span className="text-xs text-neutral-400 font-medium">
                            {slot.photos?.length || 0}/4 fotos • {slot.videoUrl ? '1 vídeo' : 'sem vídeo'}
                          </span>
                        </div>

                        {catalogSlots.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveSlot(slot.id)}
                            className="text-neutral-400 hover:text-red-600 p-1 transition-colors cursor-pointer"
                            title="Remover este produto"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>

                      {/* Product Info Row */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                        <div className="sm:col-span-2">
                          <label className="text-[11px] font-bold text-neutral-700 block mb-0.5">
                            Nome do Artigo / Vestido *
                          </label>
                          <input
                            type="text"
                            placeholder="Ex: Vestido Kaftan Tie-Dye com Lenço"
                            value={slot.name}
                            onChange={(e) => handleUpdateSlot(slot.id, 'name', e.target.value)}
                            className="w-full h-9 px-3 rounded-xl border border-neutral-300 text-xs font-bold focus:border-rose-600 focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] font-bold text-neutral-700 block mb-0.5">
                            Preço (MT) *
                          </label>
                          <input
                            type="number"
                            placeholder="Ex: 3500"
                            value={slot.price || ''}
                            onChange={(e) => handleUpdateSlot(slot.id, 'price', e.target.value)}
                            className="w-full h-9 px-3 rounded-xl border border-neutral-300 text-xs font-bold text-rose-600 focus:border-rose-600 focus:outline-none"
                          />
                        </div>
                      </div>

                      {/* Photos Row */}
                      <div className="space-y-1.5 pt-1">
                        <label className="text-[11px] font-bold text-neutral-800 block">
                          Fotos do Artigo (1 a 4)
                        </label>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                          {[0, 1, 2, 3].map((slideIdx) => {
                            const slidePhoto = slot.photos?.[slideIdx];
                            return (
                              <div
                                key={slideIdx}
                                className="p-2 bg-neutral-50 rounded-xl border border-neutral-200/90 flex flex-col items-center justify-between text-center relative group min-h-[110px]"
                              >
                                <span className="text-[9px] font-bold uppercase text-neutral-500 mb-1">
                                  Slide {slideIdx + 1} {slideIdx === 0 && '• Capa'}
                                </span>

                                {slidePhoto ? (
                                  <div className="relative w-full aspect-square rounded-lg overflow-hidden border border-neutral-200">
                                    <img
                                      src={slidePhoto}
                                      alt={`Slide ${slideIdx + 1}`}
                                      className="w-full h-full object-cover"
                                    />
                                    <button
                                      type="button"
                                      onClick={() => handleUpdateProductSlidePhoto(slot.id, slideIdx, '')}
                                      className="absolute top-1 right-1 p-1 bg-black/70 hover:bg-red-600 text-white rounded-full transition-colors cursor-pointer"
                                      title="Remover esta foto"
                                    >
                                      <Trash2 className="w-3 h-3" />
                                    </button>
                                  </div>
                                ) : (
                                  <label className="cursor-pointer flex flex-col items-center justify-center p-2 w-full flex-1 border border-dashed border-neutral-300 rounded-lg hover:bg-rose-50/50 transition-colors">
                                    <Upload className="w-4 h-4 text-neutral-400 mb-0.5" />
                                    <span className="text-[10px] font-semibold text-neutral-600">
                                      + Slide {slideIdx + 1}
                                    </span>
                                    <input
                                      type="file"
                                      accept="image/*"
                                      className="hidden"
                                      onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                          const reader = new FileReader();
                                          reader.onload = (ev) => {
                                            handleUpdateProductSlidePhoto(slot.id, slideIdx, ev.target?.result as string);
                                          };
                                          reader.readAsDataURL(file);
                                        }
                                      }}
                                    />
                                  </label>
                                )}

                                <input
                                  type="text"
                                  placeholder="Ou link URL"
                                  value={slidePhoto || ''}
                                  onChange={(e) => handleUpdateProductSlidePhoto(slot.id, slideIdx, e.target.value)}
                                  className="w-full h-6 px-1.5 mt-1.5 text-[9px] border border-neutral-200 rounded text-neutral-600 focus:outline-none truncate"
                                />
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Optional Video */}
                      <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 space-y-2">
                        <label className="text-[11px] font-bold text-neutral-800 flex items-center gap-1.5">
                          <span>🎬</span>
                          <span>Vídeo (opcional)</span>
                        </label>

                        <div className="flex flex-col sm:flex-row items-center gap-2">
                          <div className="flex-1 w-full flex items-center gap-1.5">
                            <input
                              type="text"
                              placeholder="Link do vídeo MP4"
                              value={slot.videoUrl || ''}
                              onChange={(e) => handleUpdateProductVideo(slot.id, e.target.value)}
                              className="flex-1 h-9 px-3 rounded-xl border border-neutral-300 text-xs text-neutral-700 focus:border-rose-600 focus:outline-none"
                            />
                            {slot.videoUrl && (
                              <button
                                type="button"
                                onClick={() => handleUpdateProductVideo(slot.id, '')}
                                className="px-2.5 h-9 rounded-xl bg-neutral-200 hover:bg-red-100 text-neutral-600 hover:text-red-600 text-xs font-bold transition-colors cursor-pointer"
                                title="Remover vídeo"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>

                          <label className="w-full sm:w-auto h-9 px-3.5 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 cursor-pointer shrink-0 transition-colors">
                            <Upload className="w-3.5 h-3.5 text-rose-600" />
                            <span>Carregar Vídeo</span>
                            <input
                              type="file"
                              accept="video/mp4,video/webm,video/*"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  const reader = new FileReader();
                                  reader.onload = (ev) => {
                                    handleUpdateProductVideo(slot.id, ev.target?.result as string);
                                  };
                                  reader.readAsDataURL(file);
                                }
                              }}
                            />
                          </label>
                        </div>

                        {slot.videoUrl && (
                          <div className="flex items-center gap-1.5 text-[10px] text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                            <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                            <span>Vídeo anexado com sucesso</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}

                  {/* Add Product Button or Upgrade notice */}
                  {catalogSlots.length < 25 ? (
                    <button
                      type="button"
                      onClick={handleAddIndividualSlot}
                      className="w-full p-3.5 rounded-2xl border-2 border-dashed border-rose-300 hover:border-rose-500 bg-rose-50/40 hover:bg-rose-50 text-rose-700 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                    >
                      <Plus className="w-4 h-4 text-rose-600" />
                      <span>+ Adicionar Produto</span>
                    </button>
                  ) : (
                    <div className="p-4 bg-amber-50 rounded-2xl border border-amber-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
                      <div>
                        <h4 className="text-xs font-black text-amber-950 flex items-center gap-1.5">
                          <span>👑</span>
                          <span>Limite de 25 Produtos Atingido no Plano Base</span>
                        </h4>
                        <p className="text-[11px] text-amber-900 mt-0.5">
                          Para cadastrar mais de 25 produtos, fale com a nossa equipa comercial para um plano corporativo.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowUpgradeModal(true)}
                        className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap shadow-xs"
                      >
                        Upgrade Comercial &rarr;
                      </button>
                    </div>
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
                    <span>Voltar</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleProceedToSubscription}
                    className="h-11 px-5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs sm:text-sm flex items-center gap-2 shadow-md shadow-rose-600/20 transition-all cursor-pointer"
                  >
                    <span>Avançar para Ativação ({catalogSlots.length} de 25 Produtos)</span>
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

      {/* 25-Product Standard Limit Upgrade / Upsell Modal */}
      {showUpgradeModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white w-full max-w-md rounded-3xl p-5 shadow-2xl border border-neutral-200 space-y-4 animate-in zoom-in-95">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mx-auto text-2xl font-black shadow-inner">
              👑
            </div>
            
            <div className="text-center space-y-1.5">
              <h3 className="text-base font-black text-neutral-900">
                Limite de 25 Produtos Atingido
              </h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                O seu pacote standard (1.000 MT/mês) permite até <strong>25 produtos diferentes</strong> com 4 slides e 1 vídeo cada. Para cadastrar 26 ou mais produtos, entre em contacto com a nossa equipa comercial para ativar um plano corporativo personalizado.
              </p>
            </div>

            <div className="space-y-2 pt-1">
              <a
                href="https://wa.me/258841234560?text=Ol%C3%A1!%20Tenho%20uma%20loja%20no%20Love%20Shop%20e%20pretendo%20fazer%20upgrade%20para%20mais%20de%2025%20produtos."
                target="_blank"
                rel="noopener noreferrer"
                className="w-full h-11 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white rounded-2xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-emerald-600/25"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Negociar Plano no WhatsApp</span>
              </a>

              <button
                type="button"
                onClick={() => setShowUpgradeModal(false)}
                className="w-full h-10 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-2xl font-bold text-xs transition-colors cursor-pointer"
              >
                Manter 25 Produtos
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
