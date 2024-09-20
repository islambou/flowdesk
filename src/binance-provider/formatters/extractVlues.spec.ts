import { getBestBidAsk, getBestBidAskRest } from './extractVlues';
import { IBinanceRestResponse, IBinanceWsResponse } from './types';

describe('getBestBidAsk', () => {
  it('should return the correct best bid, best ask, and mid price', () => {
    const data: IBinanceWsResponse = {
      a: [
        ['100.0', '1'],
        ['101.0', '1'],
        ['102.0', '1'],
      ],
      b: [
        ['99.0', '1'],
        ['98.0', '1'],
        ['97.0', '1'],
      ],
      E: 123456789,
      e: 'depthUpdate',
      s: 'BTCUSDT',
      U: 123456789,
      u: 123456789,
    };

    const result = getBestBidAsk(data);

    expect(result?.bestAsk).toBe(100.0);
    expect(result?.bestBid).toBe(99.0);
    expect(result?.midPrice).toBe((100.0 + 99.0) / 2);
  });

  it('should handle empty ask and bid arrays', () => {
    const data: IBinanceWsResponse = {
      a: [],
      b: [],
      E: 123456789,
      e: 'depthUpdate',
      s: 'BTCUSDT',
      U: 123456789,
      u: 123456789,
    };

    const result = getBestBidAsk(data);

    expect(result).toBe(null);
  });
});

describe('getBestBidAskRest', () => {
  it('should return the correct best bid, best ask, and mid price', () => {
    const data: Partial<IBinanceRestResponse> = {
      asks: [
        ['100.0', '1'],
        ['101.0', '1'],
        ['102.0', '1'],
      ],
      bids: [
        ['99.0', '1'],
        ['98.0', '1'],
        ['97.0', '1'],
      ],
    };

    const result = getBestBidAskRest(data as IBinanceRestResponse);

    expect(result?.bestAsk).toBe(100.0);
    expect(result?.bestBid).toBe(99.0);
    expect(result?.midPrice).toBe(99.5);
  });

  it('should handle empty asks and bids arrays', () => {
    const data: Partial<IBinanceRestResponse> = {
      asks: [],
      bids: [],
    };

    const result = getBestBidAskRest(data as IBinanceRestResponse);

    expect(result).toBe(null);
  });
});
