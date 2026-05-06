export type Season = 'spring' | 'summer' | 'autumn' | 'winter';

export const getSeason = (): Season => {
  const m = new Date().getMonth(); // 0-11
  if (m >= 2 && m <= 4) return 'spring';
  if (m >= 5 && m <= 7) return 'summer';
  if (m >= 8 && m <= 10) return 'autumn';
  return 'winter';
};

// Daytime sky base colour per season — blended into fog colour in main.ts
export const SEASON_SKY: Record<Season, number> = {
  spring: 0x90c8e8,
  summer: 0x1a6fd4,
  autumn: 0xa0b4cc,
  winter: 0xb4c8d8,
};
