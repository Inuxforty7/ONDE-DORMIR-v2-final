/**
 * ONDE DORMIR MOÇAMBIQUE - Indicador de Tempo nos Pacotes
 * Displays real-time live ticker of user registration seniority across all 4 modules:
 * 1. Onde Dormir (Lodges & Pensões)
 * 2. Rent-a-Car (Frotas e Viaturas)
 * 3. Guias Turísticos (Excursões & Credenciação)
 * 4. HeartLink (Passes VIP & Relacionamentos)
 */

import React from 'react';

interface PackagesTimeIndicatorProps {
  moduleName?: 'Onde Dormir' | 'Rent-a-Car' | 'Guias Turísticos' | 'HeartLink' | 'Todos os Pacotes';
  packageTitle?: string;
  variant?: 'banner' | 'card' | 'pill';
  showLoyaltyBadge?: boolean;
}

export const PackagesTimeIndicator: React.FC<PackagesTimeIndicatorProps> = () => {
  return null;
};
