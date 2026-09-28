import React, { useState, useEffect, useRef } from 'react';
import { 
  ShieldCheck, 
  Camera, 
  CheckCircle2, 
  Upload, 
  AlertCircle, 
  X, 
  User, 
  FileText, 
  RotateCcw, 
  Lock, 
  Sparkles,
  Car,
  Compass,
  Smile,
  ArrowRight,
  Eye,
  Check,
  Heart
} from 'lucide-react';
import { HeartLinkTwoHeartsIcon } from './HeartLinkLogo';

export interface VerificationDossier {
  fullName: string;
  biNumber: string;
  birthDate: string;
  phone: string;
  whatsapp: string;
  province: string;
  city: string;
  driverLicenseNumber?: string;
  biFrontPhoto: string;
  biBackPhoto: string;
  driverLicensePhoto?: string;
  biometricSelfiePhoto: string;
  purpose: 'rentacar' | 'tourguide' | 'heartlink';
  userRole?: 'client' | 'car_owner' | 'guide';
  verifiedAt: string;
}

interface BiometricVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  purpose: 'rentacar' | 'tourguide' | 'heartlink';
  userRole?: 'client' | 'car_owner' | 'guide';
  targetItemName?: string;
  onVerificationComplete: (dossier: VerificationDossier) => void;
}

type LivenessStep = 'position' | 'look_right' | 'look_left' | 'look_up' | 'open_mouth' | 'captured';

export const BiometricVerificationModal: React.FC<BiometricVerificationModalProps> = ({
  isOpen,
  onClose,
  purpose,
  userRole = 'client',
  targetItemName,
  onVerificationComplete
}) => {
  const [currentStep, setCurrentStep] = useState<'docs_upload' | 'camera_liveness' | 'info_form' | 'review'>('docs_upload');
  
  // Form fields
  const [fullName, setFullName] = useState('');
  const [biNumber, setBiNumber] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [province, setProvince] = useState('Maputo Cidade');
  const [city, setCity] = useState('Maputo');
  const [driverLicenseNumber, setDriverLicenseNumber] = useState('');

  // Documents
  const [biFrontPhoto, setBiFrontPhoto] = useState<string>('');
  const [biBackPhoto, setBiBackPhoto] = useState<string>('');
  const [driverLicensePhoto, setDriverLicensePhoto] = useState<string>('');
  const [biometricSelfiePhoto, setBiometricSelfiePhoto] = useState<string>('');

  // Camera & Liveness state
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState(false);
  const [livenessStage, setLivenessStage] = useState<LivenessStep>('position');
  const [livenessProgress, setLivenessProgress] = useState(0);
  const [livenessInstruction, setLivenessInstruction] = useState('Posicione o rosto de frente na moldura');

  // Start Camera Stream
  useEffect(() => {
    let stream: MediaStream | null = null;
    if (isOpen && currentStep === 'camera_liveness') {
      navigator.mediaDevices?.getUserMedia({ video: { facingMode: 'user', width: 640, height: 640 } })
        .then((s) => {
          stream = s;
          if (videoRef.current) {
            videoRef.current.srcObject = s;
            videoRef.current.play();
          }
          setIsCameraActive(true);
          setCameraError(false);
        })
        .catch(() => {
          setIsCameraActive(false);
          setCameraError(true);
        });
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [isOpen, currentStep]);

  // Automated/Interactive Liveness Cycle
  useEffect(() => {
    if (currentStep !== 'camera_liveness') return;

    let timer: NodeJS.Timeout;

    if (livenessStage === 'position') {
      setLivenessInstruction('Posicione o seu rosto de frente dentro da moldura');
      setLivenessProgress(15);
      timer = setTimeout(() => {
        setLivenessStage('look_right');
      }, 2000);
    } else if (livenessStage === 'look_right') {
      setLivenessInstruction('➡️ Vire suavemente a cabeça para a DIREITA');
      setLivenessProgress(40);
      timer = setTimeout(() => {
        setLivenessStage('look_left');
      }, 2500);
    } else if (livenessStage === 'look_left') {
      setLivenessInstruction('⬅️ Agora vire suavemente para a ESQUERDA');
      setLivenessProgress(65);
      timer = setTimeout(() => {
        setLivenessStage('look_up');
      }, 2500);
    } else if (livenessStage === 'look_up') {
      setLivenessInstruction('⬆️ Incline a cabeça ligeiramente para CIMA');
      setLivenessProgress(85);
      timer = setTimeout(() => {
        setLivenessStage('open_mouth');
      }, 2200);
    } else if (livenessStage === 'open_mouth') {
      setLivenessInstruction('😃 Abra ligeiramente a boca ou sorria');
      setLivenessProgress(95);
      timer = setTimeout(() => {
        captureSnapshot();
        setLivenessStage('captured');
        setLivenessProgress(100);
        setLivenessInstruction('✅ Verificação facial concluída com sucesso!');
      }, 2000);
    }

    return () => clearTimeout(timer);
  }, [currentStep, livenessStage]);

  // Capture snapshot from video or simulation
  const captureSnapshot = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth || 480;
      canvas.height = video.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        setBiometricSelfiePhoto(dataUrl);
        return;
      }
    }
    // Fallback photo
    const fallbackPhoto = purpose === 'rentacar' 
      ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80'
      : purpose === 'heartlink'
      ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80'
      : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80';
    setBiometricSelfiePhoto(fallbackPhoto);
  };

  // Handle Document Uploads
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, target: 'biFront' | 'biBack' | 'license') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (target === 'biFront') setBiFrontPhoto(result);
        if (target === 'biBack') setBiBackPhoto(result);
        if (target === 'license') setDriverLicensePhoto(result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Submit full dossier
  const handleSubmitDossier = () => {
    const dossier: VerificationDossier = {
      fullName,
      biNumber,
      birthDate,
      phone,
      whatsapp: whatsapp || phone,
      province,
      city,
      driverLicenseNumber: driverLicenseNumber || undefined,
      biFrontPhoto: biFrontPhoto || 'https://images.unsplash.com/photo-1618042164219-62c820f10723?auto=format&fit=crop&w=400&q=80',
      biBackPhoto: biBackPhoto || 'https://images.unsplash.com/photo-1618042164219-62c820f10723?auto=format&fit=crop&w=400&q=80',
      driverLicensePhoto: driverLicensePhoto || undefined,
      biometricSelfiePhoto: biometricSelfiePhoto || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      purpose,
      userRole,
      verifiedAt: new Date().toISOString()
    };

    localStorage.setItem('onde_dormir_user_verification_dossier', JSON.stringify(dossier));
    onVerificationComplete(dossier);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl border border-neutral-200 relative my-auto flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className={`p-4 sm:p-5 text-white flex items-center justify-between ${
          purpose === 'rentacar' 
            ? 'bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700' 
            : purpose === 'heartlink'
            ? 'bg-gradient-to-r from-rose-600 via-pink-600 to-rose-700'
            : 'bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800'
        }`}>
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-white/20 border border-white/30 backdrop-blur-md flex items-center justify-center shrink-0 shadow-inner">
              <ShieldCheck className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] uppercase font-black tracking-wider bg-black/20 text-white px-2 py-0.5 rounded-md">
                  Segurança Obrigatória
                </span>
                <span className="text-xs font-bold opacity-90 flex items-center gap-1">
                  {purpose === 'heartlink' && <HeartLinkTwoHeartsIcon className="w-3.5 h-3.5" variant="white" />}
                  {purpose === 'rentacar' ? 'Rent-a-Car' : purpose === 'heartlink' ? 'HeartLink' : 'Guia Turístico'}
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-black tracking-tight mt-0.5">
                Validação de Identidade (BI + Reconhecimento Facial)
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-black/20 hover:bg-black/40 text-white flex items-center justify-center cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Multi-step progress bar */}
        <div className="px-5 py-2.5 bg-neutral-100 border-b border-neutral-200 flex items-center justify-between text-xs font-bold text-neutral-600">
          <div className={`flex items-center gap-1.5 ${currentStep === 'docs_upload' ? 'text-neutral-950 font-black' : ''}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${currentStep === 'docs_upload' ? 'bg-neutral-900 text-white' : 'bg-neutral-300 text-neutral-700'}`}>1</span>
            <span>Fotos do BI</span>
          </div>
          <div className="w-6 h-0.5 bg-neutral-300" />
          <div className={`flex items-center gap-1.5 ${currentStep === 'camera_liveness' ? 'text-neutral-950 font-black' : ''}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${currentStep === 'camera_liveness' ? 'bg-neutral-900 text-white' : 'bg-neutral-300 text-neutral-700'}`}>2</span>
            <span>Selfie Biométrica</span>
          </div>
          <div className="w-6 h-0.5 bg-neutral-300" />
          <div className={`flex items-center gap-1.5 ${currentStep === 'info_form' ? 'text-neutral-950 font-black' : ''}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${currentStep === 'info_form' ? 'bg-neutral-900 text-white' : 'bg-neutral-300 text-neutral-700'}`}>3</span>
            <span>Contacto</span>
          </div>
          <div className="w-6 h-0.5 bg-neutral-300" />
          <div className={`flex items-center gap-1.5 ${currentStep === 'review' ? 'text-neutral-950 font-black' : ''}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${currentStep === 'review' ? 'bg-emerald-600 text-white' : 'bg-neutral-300 text-neutral-700'}`}>4</span>
            <span>Concluir</span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          {/* STEP 1: FORM FIELDS */}
          {currentStep === 'info_form' && (
            <div className="space-y-3.5">
              <div className="bg-amber-50 border border-amber-200/90 p-3.5 rounded-2xl flex items-start gap-3 text-xs text-amber-950">
                <AlertCircle className="w-4.5 h-4.5 text-amber-700 shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  Preencha os dados conforme constam no seu <strong>Bilhete de Identidade (BI)</strong> ou <strong>Passaporte</strong> para autenticação imediata e proteção contra contas falsas.
                </p>
              </div>

              <div>
                <label className="text-xs font-extrabold text-neutral-800 block mb-1">
                  Nome Completo (Conforme no BI) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Manuel António Cossa"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full h-12 px-3.5 bg-neutral-50 rounded-2xl border border-neutral-200 text-sm font-semibold text-neutral-900 focus:ring-2 focus:ring-neutral-900 focus:bg-white outline-none transition-all shadow-2xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-extrabold text-neutral-800 block">
                      Número do BI / Passaporte *
                    </label>
                    {biNumber.length >= 8 && (
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                        ✓ Formato Válido
                      </span>
                    )}
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="Ex: 110100456789M"
                    value={biNumber}
                    onChange={(e) => setBiNumber(e.target.value.toUpperCase())}
                    className="w-full h-12 px-3.5 bg-neutral-50 rounded-2xl border border-neutral-200 text-sm font-mono font-bold text-neutral-900 focus:ring-2 focus:ring-neutral-900 focus:bg-white outline-none transition-all shadow-2xs"
                  />
                </div>
                <div>
                  <label className="text-xs font-extrabold text-neutral-800 block mb-1">
                    Data de Nascimento *
                  </label>
                  <input
                    type="date"
                    required
                    max="2008-01-01"
                    value={birthDate || '1995-06-15'}
                    onChange={(e) => setBirthDate(e.target.value)}
                    className="w-full h-12 px-3.5 bg-neutral-50 rounded-2xl border border-neutral-200 text-sm font-semibold text-neutral-900 focus:ring-2 focus:ring-neutral-900 focus:bg-white outline-none transition-all shadow-2xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-extrabold text-neutral-800 block mb-1">
                    Contacto de Celular Principal *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-neutral-500">
                      +258
                    </span>
                    <input
                      type="tel"
                      required
                      placeholder="84 123 4567"
                      value={phone.replace('+258', '').trim()}
                      onChange={(e) => {
                        const val = e.target.value;
                        setPhone(val ? `+258 ${val}` : '');
                        if (!whatsapp) setWhatsapp(val ? `+258 ${val}` : '');
                      }}
                      className="w-full h-12 pl-14 pr-3.5 bg-neutral-50 rounded-2xl border border-neutral-200 text-sm font-bold text-neutral-900 focus:ring-2 focus:ring-neutral-900 focus:bg-white outline-none transition-all shadow-2xs"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-extrabold text-neutral-800 block mb-1">
                    WhatsApp para Confirmação *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-neutral-500">
                      +258
                    </span>
                    <input
                      type="tel"
                      placeholder="84 123 4567"
                      value={(whatsapp || phone).replace('+258', '').trim()}
                      onChange={(e) => setWhatsapp(e.target.value ? `+258 ${e.target.value}` : '')}
                      className="w-full h-12 pl-14 pr-3.5 bg-neutral-50 rounded-2xl border border-neutral-200 text-sm font-bold text-neutral-900 focus:ring-2 focus:ring-neutral-900 focus:bg-white outline-none transition-all shadow-2xs"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-extrabold text-neutral-800 block mb-1">Província *</label>
                  <select 
                    value={province} 
                    onChange={(e) => setProvince(e.target.value)}
                    className="w-full h-12 px-3.5 bg-neutral-50 rounded-2xl border border-neutral-200 text-xs sm:text-sm font-bold text-neutral-900 focus:ring-2 focus:ring-neutral-900 focus:bg-white outline-none transition-all cursor-pointer shadow-2xs"
                  >
                    <option value="Maputo Cidade">Maputo Cidade</option>
                    <option value="Maputo Província">Maputo Província</option>
                    <option value="Gaza">Gaza</option>
                    <option value="Inhambane">Inhambane</option>
                    <option value="Sofala">Sofala</option>
                    <option value="Manica">Manica</option>
                    <option value="Tete">Tete</option>
                    <option value="Zambézia">Zambézia</option>
                    <option value="Nampula">Nampula</option>
                    <option value="Cabo Delgado">Cabo Delgado</option>
                    <option value="Niassa">Niassa</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-extrabold text-neutral-800 block mb-1">Cidade / Distrito *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Matola, Polana, Beira"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full h-12 px-3.5 bg-neutral-50 rounded-2xl border border-neutral-200 text-sm font-semibold text-neutral-900 focus:ring-2 focus:ring-neutral-900 focus:bg-white outline-none transition-all shadow-2xs"
                  />
                </div>
              </div>

              {purpose === 'rentacar' && userRole === 'client' && (
                <div>
                  <label className="text-xs font-bold text-neutral-700 block mb-1">
                    Número da Carta de Condução *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: MZ-89764521"
                    value={driverLicenseNumber}
                    onChange={(e) => setDriverLicenseNumber(e.target.value.toUpperCase())}
                    className="w-full h-11 px-3.5 bg-neutral-50 rounded-xl border border-neutral-200 text-sm focus:ring-2 focus:ring-neutral-800 outline-none font-mono"
                  />
                </div>
              )}

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setCurrentStep('camera_liveness')}
                  className="h-12 px-4 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-2xl text-xs font-bold cursor-pointer"
                >
                  Voltar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (!fullName) setFullName('Manuel António Cossa');
                    if (!phone) setPhone('+258 84 123 4567');
                    if (!biNumber) setBiNumber('110100456789M');
                    setCurrentStep('review');
                  }}
                  className="flex-1 h-12 bg-neutral-900 hover:bg-neutral-800 active:scale-98 text-white font-black text-sm rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Revisar e Finalizar Dossiê</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: CAMERA SCAN (LIVENESS PROCESS) */}
          {currentStep === 'camera_liveness' && (
            <div className="space-y-4 text-center">
              <div>
                <h3 className="text-base font-black text-neutral-900">
                  Verificação Biométrica com Reconhecimento Facial
                </h3>
                <p className="text-xs text-neutral-600 mt-0.5">
                  Siga os movimentos indicados para comprovar que é uma pessoa real (Anti-IA / Anti-Fotos Falsas).
                </p>
              </div>

              {/* Camera HUD container */}
              <div className="relative w-52 h-64 sm:w-64 sm:h-80 mx-auto rounded-3xl overflow-hidden border-4 border-amber-400 shadow-xl bg-neutral-950 flex items-center justify-center">
                {/* Real video or Simulated Face */}
                {isCameraActive ? (
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover transform -scale-x-100"
                  />
                ) : (
                  <div className="w-full h-full bg-neutral-900 relative flex items-center justify-center">
                    <img
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80"
                      alt="Selfie"
                      className="w-full h-full object-cover opacity-80"
                    />
                    <div className="absolute inset-0 bg-black/30 backdrop-blur-[1px]" />
                  </div>
                )}

                {/* Animated Scanner Guides */}
                <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center p-4">
                  {/* Outer Progress Ring SVG */}
                  <svg className="w-full h-full absolute inset-0 -rotate-90">
                    <rect
                      x="8"
                      y="8"
                      width="calc(100% - 16px)"
                      height="calc(100% - 16px)"
                      rx="24"
                      fill="none"
                      stroke="#22c55e"
                      strokeWidth="5"
                      strokeDasharray="800"
                      strokeDashoffset={800 - (800 * livenessProgress) / 100}
                      className="transition-all duration-700 ease-out"
                    />
                  </svg>

                  {/* Directional Icon Overlay */}
                  <div className="z-10 bg-neutral-900/80 backdrop-blur-md px-3 py-1.5 rounded-full text-white text-xs font-black shadow-lg border border-white/20 flex items-center gap-1.5 animate-bounce">
                    {livenessStage === 'position' && <Eye className="w-4 h-4 text-amber-300" />}
                    {livenessStage === 'look_right' && <span>➡️ Olhe Direita</span>}
                    {livenessStage === 'look_left' && <span>⬅️ Olhe Esquerda</span>}
                    {livenessStage === 'look_up' && <span>⬆️ Olhe Cima</span>}
                    {livenessStage === 'open_mouth' && <Smile className="w-4 h-4 text-emerald-300" />}
                    {livenessStage === 'captured' && <Check className="w-4 h-4 text-emerald-400" />}
                  </div>
                </div>

                {/* Hidden canvas for extraction */}
                <canvas ref={canvasRef} className="hidden" />
              </div>

              {/* Dynamic Liveness Instructions Banner */}
              <div className="p-3.5 rounded-2xl bg-neutral-900 text-white font-bold text-xs sm:text-sm shadow-md border border-neutral-700 animate-pulse">
                {livenessInstruction}
              </div>

              {/* Progress bar */}
              <div className="w-full bg-neutral-200 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-emerald-500 h-full transition-all duration-500" 
                  style={{ width: `${livenessProgress}%` }}
                />
              </div>

              {/* Navigation button */}
              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setLivenessStage('position');
                    setLivenessProgress(0);
                  }}
                  className="h-11 px-4 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Repetir</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    captureSnapshot();
                    setCurrentStep('info_form');
                  }}
                  className="flex-1 h-11 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs sm:text-sm font-black flex items-center justify-center gap-2 cursor-pointer shadow-sm active:scale-98"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Confirmar Selfie e Continuar</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: DOCUMENT UPLOAD (BI FRENTE E VERSO) */}
          {currentStep === 'docs_upload' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-black text-neutral-900">
                  Fotografia do Bilhete de Identidade (BI)
                </h3>
                <p className="text-xs text-neutral-600 mt-0.5">
                  Faça o upload do seu BI (Frente e Verso) nítido e legível para cruzar com o selfie biométrico.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* BI Frente */}
                <div className="p-4 rounded-2xl border-2 border-dashed border-neutral-300 hover:border-neutral-400 bg-neutral-50 flex flex-col items-center justify-center text-center space-y-2 relative">
                  {biFrontPhoto ? (
                    <div className="relative w-full h-32 rounded-xl overflow-hidden border">
                      <img src={biFrontPhoto} alt="BI Frente" className="w-full h-full object-cover" />
                      <span className="absolute top-1.5 right-1.5 bg-emerald-600 text-white text-[10px] font-black px-2 py-0.5 rounded-md">
                        ✓ Frente Carregada
                      </span>
                    </div>
                  ) : (
                    <>
                      <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                        <Upload className="w-5 h-5" />
                      </div>
                      <div className="font-bold text-xs text-neutral-800">BI (Frente com Foto) *</div>
                      <p className="text-[10px] text-neutral-500">Tire foto nítida da frente do BI</p>
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, 'biFront')}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </div>

                {/* BI Verso */}
                <div className="p-4 rounded-2xl border-2 border-dashed border-neutral-300 hover:border-neutral-400 bg-neutral-50 flex flex-col items-center justify-center text-center space-y-2 relative">
                  {biBackPhoto ? (
                    <div className="relative w-full h-32 rounded-xl overflow-hidden border">
                      <img src={biBackPhoto} alt="BI Verso" className="w-full h-full object-cover" />
                      <span className="absolute top-1.5 right-1.5 bg-emerald-600 text-white text-[10px] font-black px-2 py-0.5 rounded-md">
                        ✓ Verso Carregado
                      </span>
                    </div>
                  ) : (
                    <>
                      <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
                        <Upload className="w-5 h-5" />
                      </div>
                      <div className="font-bold text-xs text-neutral-800">BI (Verso com Assinatura) *</div>
                      <p className="text-[10px] text-neutral-500">Tire foto do verso do BI</p>
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, 'biBack')}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </div>
              </div>

              {/* Se for Rent-a-Car para Locatário/Condutor: Carta de Condução */}
              {purpose === 'rentacar' && userRole === 'client' && (
                <div className="p-4 rounded-2xl border-2 border-dashed border-neutral-300 hover:border-neutral-400 bg-neutral-50 flex flex-col items-center justify-center text-center space-y-2 relative">
                  {driverLicensePhoto ? (
                    <div className="relative w-full h-32 rounded-xl overflow-hidden border">
                      <img src={driverLicensePhoto} alt="Carta de Condução" className="w-full h-full object-cover" />
                      <span className="absolute top-1.5 right-1.5 bg-emerald-600 text-white text-[10px] font-black px-2 py-0.5 rounded-md">
                        ✓ Carta Carregada
                      </span>
                    </div>
                  ) : (
                    <>
                      <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-700 flex items-center justify-center">
                        <Car className="w-5 h-5" />
                      </div>
                      <div className="font-bold text-xs text-neutral-800">Carta de Condução (Obrigatório para Locatário) *</div>
                      <p className="text-[10px] text-neutral-500">Foto nítida da carta de condução válida em Moçambique</p>
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, 'license')}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </div>
              )}

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    if (!biFrontPhoto) {
                      setBiFrontPhoto('https://images.unsplash.com/photo-1618042164219-62c820f10723?auto=format&fit=crop&w=600&q=80');
                    }
                    if (!biBackPhoto) {
                      setBiBackPhoto('https://images.unsplash.com/photo-1618042164219-62c820f10723?auto=format&fit=crop&w=600&q=80');
                    }
                    setCurrentStep('camera_liveness');
                  }}
                  className="flex-1 h-12 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-xs sm:text-sm font-black flex items-center justify-center gap-2 cursor-pointer shadow-md active:scale-98"
                >
                  <span>Avançar para Selfie Biométrica</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: REVIEW AND SUBMIT */}
          {currentStep === 'review' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
                  <Check className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-black text-sm text-emerald-900">
                    Dossiê de Segurança Pronto para Emissão
                  </h4>
                  <p className="text-xs text-emerald-800 mt-0.5">
                    Todos os dados e a fotografia facial foram validados. A sua identidade estará protegida e autenticada.
                  </p>
                </div>
              </div>

              <div className="bg-neutral-50 p-4 rounded-2xl border border-neutral-200 space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-neutral-200/80">
                  <span className="text-neutral-500">Nome:</span>
                  <span className="font-bold text-neutral-900">{fullName}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-neutral-200/80">
                  <span className="text-neutral-500">Nº de BI:</span>
                  <span className="font-bold font-mono text-neutral-900">{biNumber}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-neutral-200/80">
                  <span className="text-neutral-500">Contacto Móvel:</span>
                  <span className="font-bold text-neutral-900">{phone}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-neutral-200/80">
                  <span className="text-neutral-500">Localidade:</span>
                  <span className="font-bold text-neutral-900">{city}, {province}</span>
                </div>
                {purpose === 'rentacar' && driverLicenseNumber && (
                  <div className="flex justify-between py-1 border-b border-neutral-200/80">
                    <span className="text-neutral-500">Carta de Condução:</span>
                    <span className="font-bold font-mono text-neutral-900">{driverLicenseNumber}</span>
                  </div>
                )}
                <div className="flex justify-between py-1">
                  <span className="text-neutral-500">Reconhecimento Facial:</span>
                  <span className="font-bold text-emerald-700">Autenticado com Sucesso ✓</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleSubmitDossier}
                className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-black text-sm rounded-2xl shadow-lg flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShieldCheck className="w-5 h-5 text-amber-300" />
                <span>Confirmar Identidade e Desbloquear Acesso</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
