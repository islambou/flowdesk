import { TBinanceSymbol } from 'src/binance-provider/formatters/types';
import { TSymbol } from 'src/common';
import { TKrakrnSymbol } from 'src/kraken-provider/formatters/types';
import { THtxSymbol } from 'src/htx-provider/formatters/types';

export const krakenSymbolsMap: Map<TKrakrnSymbol, TSymbol> = new Map([
  ['BTC/USD', 'BTC-USD'],
  ['ETH/USD', 'ETH-USD'],
]);

export const binanceSymbolsMap: Map<TBinanceSymbol, TSymbol> = new Map([
  ['BTCUSDT', 'BTC-USD'],
  ['ETHUSDT', 'ETH-USD'],
]);

export const htxeSymbolsMap: Map<THtxSymbol, TSymbol> = new Map([
  ['btcusdt', 'BTC-USD'],
  ['ethusdt', 'ETH-USD'],
]);
