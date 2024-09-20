import { RestTick } from './types';

export function getBestBidAskRest(book: RestTick) {
  const bestAsk = book.asks.reduce(
    (acc, curr) => Math.min(+acc, +curr[0]),
    Infinity,
  );
  const bestBid = book.bids.reduce(
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
