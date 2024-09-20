import { BaseConfig } from 'src/base-provider/base-provider';
import { BinanceProvider } from './binance-provider';
import { TBinanceSymbol } from './formatters/types';
import axios from 'axios';

const MockConfig: BaseConfig<TBinanceSymbol> = {
  symboles: ['BTCUSDT', 'ETHUSDT'],
  restConfig: {
    restEndPointsPool: ['https://api.binance.com'],
    interval: 1000,
  },
  wsConfig: {
    wsEndPointsPool: ['wss://stream.binance.com:9443/ws'],
  },
  onDataUpdate: (data) => {
    console.log(data);
  },
};

jest.mock('src/logger', () => ({
  log: jest.fn(),
}));
describe('BinanceProvider', () => {
  let provider: BinanceProvider;

  beforeEach(() => {
    provider = new BinanceProvider(MockConfig);
  });

  it('should initialize the exchange as binance', () => {
    expect(provider.exchange).toBe('binance');
  });

  it('should make REST API request and store calculated response', async () => {
    provider.symboles = ['BTCUSDT'];
    const mockGet = jest.spyOn(axios, 'get').mockResolvedValue({
      data: { bids: [['50000', '1']], asks: [['51000', '2']] },
    });

    const mockOnDataUpdate = jest.fn();
    provider.onDataUpdate = mockOnDataUpdate;

    await provider.restfullRequest();

    expect(mockGet).toHaveBeenCalledWith(
      expect.stringContaining('/api/v3/depth?symbol=BTCUSDT'),
    );
    expect(mockOnDataUpdate).toHaveBeenCalledWith({
      symbol: 'BTCUSDT',
      exchange: 'binance',
      timeStamp: expect.any(Number),
      bestBid: 50000,
      bestAsk: 51000,
      midPrice: 50500,
    });
  });

  it('should make REST API request and ignore null result from response', async () => {
    provider.symboles = ['BTCUSDT'];
    jest.spyOn(axios, 'get').mockResolvedValue({
      data: { bids: [], asks: [] },
    });

    const mockOnDataUpdate = jest.fn();
    provider.onDataUpdate = mockOnDataUpdate;

    await provider.restfullRequest();

    expect(mockOnDataUpdate.mock.calls.length).toBeFalsy();
  });
});
