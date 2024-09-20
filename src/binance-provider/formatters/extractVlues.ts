//www.measurethat.net/Benchmarks/Show/2710/0/sort-vs-reduce#latest_results_block   seems like reduce is faster than sort
import { IBinanceRestResponse, IBinanceWsResponse } from './types';

export function getBestBidAsk(data: IBinanceWsResponse) {
  const bestAsk = data.a.reduce(
    (acc, curr) => Math.min(+acc, +curr[0]),
    Infinity,
  );
  const bestBid = data.b.reduce(
    (acc, curr) => Math.max(+acc, +curr[0]),
    -Infinity,
  );
  if (bestAsk === Infinity || bestBid === -Infinity) {
    return null;
  }
  const midPrice = (bestAsk + bestBid) / 2;
  return {
    bestBid,
    bestAsk,
    midPrice,
  };
}

export function getBestBidAskRest(data: IBinanceRestResponse) {
  const bestAsk = data.asks.reduce(
    (acc, curr) => Math.min(+acc, +curr[0]),
    Infinity,
  );
  const bestBid = data.bids.reduce(
    (acc, curr) => Math.max(+acc, +curr[0]),
    -Infinity,
  );
  if (bestAsk === Infinity || bestBid === -Infinity) {
    return null;
  }
  const midPrice = (bestAsk + bestBid) / 2;
  return {
    bestBid,
    bestAsk,
    midPrice,
  };
}
