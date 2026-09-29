/**
 * Helper utility to calculate and display platform tenure / registration age for users,
 * hosts, tour guides, car owners, and heartlink profiles.
 * Examples: "Na plataforma há 3 dias", "Na plataforma há 2 anos", "Na plataforma há 1 mês".
 */

export function getPlatformTenureText(
  registeredAt?: string,
  explicitTenure?: string,
  fallbackSeed?: number | string
): string {
  if (explicitTenure && explicitTenure.trim() !== '') {
    return explicitTenure;
  }

  if (registeredAt) {
    const regDate = new Date(registeredAt);
    if (!isNaN(regDate.getTime())) {
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - regDate.getTime());
      const daysAgo = Math.floor(diffTime / (1000 * 60 * 60 * 24));

      if (daysAgo <= 0) return 'Iniciou hoje na plataforma';
      if (daysAgo === 1) return 'Na plataforma há 1 dia';
      if (daysAgo < 7) return `Na plataforma há ${daysAgo} dias`;
      if (daysAgo < 30) {
        const weeks = Math.floor(daysAgo / 7);
        return `Na plataforma há ${weeks} ${weeks === 1 ? 'semana' : 'semanas'}`;
      }
      if (daysAgo < 365) {
        const months = Math.floor(daysAgo / 30);
        return `Na plataforma há ${months} ${months === 1 ? 'mês' : 'meses'}`;
      }
      const years = Math.floor(daysAgo / 365);
      return `Na plataforma há ${years} ${years === 1 ? 'ano' : 'anos'}`;
    }
  }

  // Deterministic variety presets for mock items without explicit date
  const presets = [
    'Na plataforma há 3 dias',
    'Na plataforma há 2 semanas',
    'Na plataforma há 1 mês',
    'Na plataforma há 6 meses',
    'Na plataforma há 1 ano',
    'Na plataforma há 2 anos',
    'Na plataforma há 3 anos',
  ];

  if (typeof fallbackSeed === 'number') {
    return presets[fallbackSeed % presets.length];
  } else if (typeof fallbackSeed === 'string') {
    let hash = 0;
    for (let i = 0; i < fallbackSeed.length; i++) {
      hash = (hash << 5) - hash + fallbackSeed.charCodeAt(i);
      hash |= 0;
    }
    return presets[Math.abs(hash) % presets.length];
  }

  return 'Na plataforma há 1 ano';
}
