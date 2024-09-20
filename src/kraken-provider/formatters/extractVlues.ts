//www.measurethat.net/Benchmarks/Show/2710/0/sort-vs-reduce#latest_results_block   seems like reduce is faster than sort
import { AskMap, BidMap, RestOrderBook } from './types';

export function getBestBidAsk(asks: AskMap, bids: BidMap) {
  const bestBid = Array.from(bids.values()).reduce(
    (acc, curr) => Math.max(+acc, +curr),
    -Infinity,
  );
  const bestAsk = Array.from(asks.values()).reduce(
    (acc, curr) => Math.min(+acc, +curr),
    Infinity,
  );
  if (bestAsk === Infinity || bestBid === -Infinity) {
    return null;
  }
  const midPrice = (bestBid + bestAsk) / 2;
  return {
    bestBid,
    bestAsk,
    midPrice,
  };
}

export function getBestBidAskRest(book: RestOrderBook) {
  const bids = book.bids.map((bid) => +bid[0]);
  const asks = book.asks.map((ask) => +ask[0]);
  const bestBid = bids.reduce((acc, curr) => Math.min(+acc, +curr), Infinity);
  const bestAsk = asks.reduce((acc, curr) => Math.max(+acc, +curr), -Infinity);
  if (bestAsk === Infinity || bestBid === -Infinity) {
    return null;
  }
  const midPrice = (bestBid + bestAsk) / 2;
  return {
    bestBid,
    bestAsk,
    midPrice,
  };
}
