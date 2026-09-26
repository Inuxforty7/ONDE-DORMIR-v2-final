const SAVED_STORAGE_KEY = 'ondedormir_saved_accommodations_v1';
const RECENT_VIEW_KEY = 'ondedormir_local_history_v1'; // strictly on user's device only

export function getSavedAccommodationIds(): string[] {
  try {
    const data = localStorage.getItem(SAVED_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function isAccommodationSaved(id: string): boolean {
  const list = getSavedAccommodationIds();
  return list.includes(id);
}

export function toggleSaveAccommodation(id: string): boolean {
  try {
    const list = getSavedAccommodationIds();
    let updated: string[];
    let isNowSaved = false;

    if (list.includes(id)) {
      updated = list.filter((item) => item !== id);
      isNowSaved = false;
    } else {
      updated = [id, ...list];
      isNowSaved = true;
    }

    localStorage.setItem(SAVED_STORAGE_KEY, JSON.stringify(updated));
    return isNowSaved;
  } catch {
    return false;
  }
}

export function clearSavedAccommodations(): void {
  try {
    localStorage.removeItem(SAVED_STORAGE_KEY);
  } catch {
    // ignore
  }
}

export const PRIVACY_MANIFESTO = {
  title: 'Compromisso de Privacidade do Onde Dormir',
  points: [
    {
      title: 'Sem Registo Obrigatório',
      description: 'Pode pesquisar, ver hospedagens, traçar rotas e contactar sem criar conta nem partilhar o seu email.',
    },
    {
      title: 'Nenhum Motivo Perguntado',
      description: 'Não perguntamos a razão da sua viagem ou descanso. A sua estadia é assunto exclusivamente seu.',
    },
    {
      title: 'Sem Rastreio Público ou Métricas de Visitas',
      description: 'Os proprietários não sabem quem visitou o perfil ou quem pesquisou na zona. Não há feeds sociais nem contadores públicos.',
    },
    {
      title: 'Contacto Direto e Sem Comissões',
      description: 'Ao clicar no WhatsApp ou telefone, fala diretamente com a equipa da hospedagem sem intermediários nem comissões no meio.',
    },
    {
      title: 'Dados Guardados Apenas no Seu Dispositivo',
      description: 'Os seus favoritos e preferências ficam guardados na memória do seu próprio telefone ou computador.',
    },
  ],
};
