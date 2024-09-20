export type TKrakrnSymbol = 'BTC/USD' | 'ETH/USD';

export interface IKrakenWsResponse {
  channel: string;
  type: string;
  data: Datum[];
}

export interface Datum {
  symbol: TKrakrnSymbol;
  bids: Ask[];
  asks: Ask[];
  checksum: number;
}

export interface Ask {
  price: number;
  qty: number;
}

export type BidMap = Map<number, number>;
export type AskMap = Map<number, number>;
//------------------------------------------------
export type TKrakenBidsBook = Map<TKrakrnSymbol, BidMap>;
export type TKrakenAsksBook = Map<TKrakrnSymbol, AskMap>;
//------------------------------------------------

export interface IKrakenRestResponse {
  error: string[];
  result: RestResult;
}

export type RestResult = Record<TKrakrnSymbol, RestOrderBook>;

export interface RestOrderBook {
  asks: Array<[string, string, number]>;
  bids: Array<Array<number | string>>;
}
