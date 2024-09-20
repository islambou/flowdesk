export type TBinanceSymbol = 'BTCUSDT' | 'ETHUSDT';

export interface IBinanceWsResponse {
  e: string;
  E: number;
  s: TBinanceSymbol;
  U: number;
  u: number;
  b: Array<string[]>;
  a: Array<string[]>;
}

export interface IBinanceRestResponse {
  lastUpdateId: number;
  bids: Array<string[]>;
  asks: Array<string[]>;
}
