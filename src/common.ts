export const SYMBOLS = ['BTC-USD', 'ETH-USD'] as const;
export type TSymbol = (typeof SYMBOLS)[number];
