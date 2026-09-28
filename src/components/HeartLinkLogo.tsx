import React from 'react';

interface HeartLinkIconProps {
  className?: string;
  size?: number | string;
  variant?: 'filled' | 'outline' | 'embroidered' | 'white';
  showStitches?: boolean;
}

/**
 * Logótipo / Ícone HeartLink com DOIS CORAÇÕES INTEIROS JUNTOS E BORDADOS.
 * Dois corações completos e harmoniosos (sem cortes, sem parecer coração quebrado),
 * unidos lado a lado com pesponto artesanal bordado (stitching).
 */
export const HeartLinkTwoHeartsIcon: React.FC<HeartLinkIconProps> = ({
  className = 'w-6 h-6',
  variant = 'embroidered',
  showStitches = true,
}) => {
  const isWhite = variant === 'white';

  // Caminho exato de um coração clássico, completo, perfeito e simétrico
  // Centralizado em torno de (20, 20), largura 32, altura 32.5
  const singleHeartPath = 
    "M 20 34 " +
    "C 10 24 4 18 4 11.5 " +
    "C 4 5.5 8.5 1.5 14.5 1.5 " +
    "C 17.2 1.5 19.5 2.8 20 4.2 " +
    "C 20.5 2.8 22.8 1.5 25.5 1.5 " +
    "C 31.5 1.5 36 5.5 36 11.5 " +
    "C 36 18 30 24 20 34 Z";

  // Caminho interno ligeiramente recuado para o pesponto bordado
  const innerStitchPath =
    "M 20 31.5 " +
    "C 11.5 22.5 6.5 17 6.5 11.5 " +
    "C 6.5 6.8 10 3.5 14.5 3.5 " +
    "C 16.8 3.5 18.8 4.6 20 6 " +
    "C 21.2 4.6 23.2 3.5 25.5 3.5 " +
    "C 30 3.5 33.5 6.8 33.5 11.5 " +
    "C 33.5 17 28.5 22.5 20 31.5 Z";

  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`inline-block shrink-0 ${className}`}
    >
      <defs>
        {/* Gradiente do Primeiro Coração (Esquerdo - Rosa Carmim e Rubi) */}
        <linearGradient id="hlGradLeft" x1="4" y1="2" x2="36" y2="34" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FB7185" />
          <stop offset="50%" stopColor="#E11D48" />
          <stop offset="100%" stopColor="#9F1239" />
        </linearGradient>

        {/* Gradiente do Segundo Coração (Direito - Coral Fúcsia Vibrante) */}
        <linearGradient id="hlGradRight" x1="4" y1="2" x2="36" y2="34" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#F43F5E" />
          <stop offset="50%" stopColor="#EC4899" />
          <stop offset="100%" stopColor="#C026D3" />
        </linearGradient>

        {/* Gradiente do Pesponto de Linha Bordada (Fio Dourado/Cetim) */}
        <linearGradient id="hlStitchGold" x1="4" y1="2" x2="36" y2="34" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FEF08A" />
          <stop offset="50%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#FFE4E6" />
        </linearGradient>

        {/* Sombra suave para separar com nitidez os dois corações */}
        <filter id="hlFrontHeartShadow" x="-20%" y="-20%" width="150%" height="150%">
          <feDropShadow dx="-1.5" dy="1.5" stdDeviation="1.8" floodColor="#4C0519" floodOpacity="0.45" />
        </filter>
      </defs>

      {/* ========================================================
          CORAÇÃO 1 (ESQUERDO) - COMPLETO E INTEIRO
          Inclinado suavemente (-8 graus) para a esquerda
         ======================================================== */}
      <g transform="translate(4, 15) rotate(-8 20 20)">
        {/* Corpo preenchido do coração esquerdo */}
        <path
          d={singleHeartPath}
          fill={isWhite ? 'currentColor' : 'url(#hlGradLeft)'}
          opacity={isWhite ? 0.9 : 1}
        />

        {/* Contorno externo suave */}
        <path
          d={singleHeartPath}
          stroke={isWhite ? '#FFFFFF' : '#FDA4AF'}
          strokeWidth="1.2"
          opacity={isWhite ? 0.8 : 0.6}
        />

        {/* Pesponto bordado interno (Stitched Embroidery) */}
        {showStitches && (
          <path
            d={innerStitchPath}
            stroke={isWhite ? '#FFFFFF' : 'url(#hlStitchGold)'}
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeDasharray="2 1.8"
            opacity={isWhite ? 0.75 : 0.95}
          />
        )}

        {/* Brilho de seda no topo do lóbulo esquerdo */}
        <path
          d="M 8 10 C 9.5 5.5 13.5 4 16 4.5"
          stroke="#FFFFFF"
          strokeWidth="1.2"
          strokeLinecap="round"
          opacity={0.7}
        />
      </g>

      {/* ========================================================
          CORAÇÃO 2 (DIREITO) - COMPLETO, INTEIRO E EM DESTAQUE
          Inclinado suavemente (+8 graus) para a direita,
          unido e sobreposto com sombra suave de profundidade
         ======================================================== */}
      <g 
        transform="translate(24, 12) rotate(8 20 20)"
        filter={isWhite ? undefined : 'url(#hlFrontHeartShadow)'}
      >
        {/* Borda de realce ao redor do coração frontal */}
        <path
          d={singleHeartPath}
          stroke={isWhite ? '#FFFFFF' : '#FFF1F2'}
          strokeWidth="1.8"
          opacity={isWhite ? 0.9 : 0.9}
        />

        {/* Corpo preenchido do coração direito */}
        <path
          d={singleHeartPath}
          fill={isWhite ? 'currentColor' : 'url(#hlGradRight)'}
          opacity={isWhite ? 1 : 1}
        />

        {/* Pesponto bordado interno (Stitched Embroidery) */}
        {showStitches && (
          <path
            d={innerStitchPath}
            stroke={isWhite ? '#FFFFFF' : 'url(#hlStitchGold)'}
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeDasharray="2 1.8"
            opacity={isWhite ? 0.85 : 1}
          />
        )}

        {/* Brilho de seda no topo do lóbulo direito */}
        <path
          d="M 24 4.5 C 27 4 30.5 5.5 32 10"
          stroke="#FFFFFF"
          strokeWidth="1.2"
          strokeLinecap="round"
          opacity={0.75}
        />
      </g>

      {/* ========================================================
          DETALHE DE UNIÃO BORDADA (Fio de Conexão Entre os Dois)
         ======================================================== */}
      <circle cx="28" cy="27" r="1.5" fill={isWhite ? '#FFFFFF' : '#FEF08A'} opacity={0.8} />
      <circle cx="34" cy="30" r="1.2" fill={isWhite ? '#FFFFFF' : '#FEF08A'} opacity={0.7} />
    </svg>
  );
};

interface HeartLinkLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  variant?: 'colored' | 'white' | 'badge';
  subtitle?: string;
}

/**
 * Logótipo Oficial Completo do HeartLink:
 * Dois corações inteiros juntos e bordados + tipografia harmoniosa.
 */
export const HeartLinkLogo: React.FC<HeartLinkLogoProps> = ({
  className = '',
  size = 'md',
  showText = true,
  variant = 'colored',
  subtitle,
}) => {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-11 h-11',
    xl: 'w-14 h-14',
  };

  const badgeSizes = {
    sm: 'p-1.5 rounded-xl',
    md: 'p-2 rounded-2xl',
    lg: 'p-2.5 rounded-2xl',
    xl: 'p-3 rounded-3xl',
  };

  const titleSizes = {
    sm: 'text-sm font-black',
    md: 'text-base font-black',
    lg: 'text-xl font-black',
    xl: 'text-2xl font-black',
  };

  const isWhite = variant === 'white';

  return (
    <div className={`inline-flex items-center gap-2.5 shrink-0 min-w-0 ${className}`}>
      {/* Emblema com os Dois Corações Inteiros Bordados */}
      <div
        className={`${badgeSizes[size]} relative overflow-hidden flex items-center justify-center shrink-0 transition-transform active:scale-95 ${
          variant === 'badge'
            ? 'bg-gradient-to-br from-rose-500/20 via-pink-500/15 to-rose-600/25 border border-rose-300/40 shadow-xs'
            : isWhite
            ? 'bg-white/15 backdrop-blur-md border border-white/25 shadow-xs'
            : 'bg-rose-50 border border-rose-200 shadow-2xs'
        }`}
      >
        <HeartLinkTwoHeartsIcon
          className={iconSizes[size]}
          variant={isWhite ? 'white' : 'embroidered'}
          showStitches={true}
        />
      </div>

      {/* Tipografia */}
      {showText && (
        <div className="flex flex-col min-w-0 leading-tight">
          <div className={`${titleSizes[size]} tracking-tight flex items-center gap-0.5`}>
            <span className={isWhite ? 'text-white' : 'text-rose-600'}>Heart</span>
            <span className={isWhite ? 'text-pink-200' : 'text-pink-500 font-extrabold'}>Link</span>
          </div>
          {subtitle && (
            <span
              className={`text-[10px] truncate font-medium ${
                isWhite ? 'text-pink-100' : 'text-neutral-500'
              }`}
            >
              {subtitle}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
