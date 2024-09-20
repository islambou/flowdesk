export type THtxSymbol = 'btcusdt' | 'ethusdt';

export interface IHtxWsResponse {
  ch: string;
  ts: number;
  tick: Tick;
}

export interface Tick {
  seqId: number;
  ask: number;
  askSize: number;
  bid: number;
  bidSize: number;
  quoteTime: number;
  symbol: string;
}

export interface IHtxRestResponse {
  ch: string;
  status: string;
  ts: number;
  tick: RestTick;
}
interface RestTick {
  ts: number;
  version: number;
  bids: Array<number[]>;
  asks: Array<number[]>;
}
