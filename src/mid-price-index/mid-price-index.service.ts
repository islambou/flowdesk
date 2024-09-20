import { Injectable } from '@nestjs/common';
import { BinanceProvider } from 'src/binance-provider/binance-provider';
import { HtxProvider } from 'src/htx-provider/htx-provider';
import { KrakenProvider } from 'src/kraken-provider/kraken-provider';
import { log, logHeader } from 'src/logger';
import {
  binanceSymbolsMap,
  htxeSymbolsMap,
  krakenSymbolsMap,
} from 'src/mid-price-index/symbolsMap';
import { formatStoreToTable } from 'src/mid-price-index/utils';
import { StoreService, TStore } from 'src/store/store.service';
import { GetMidPriceIndexDto } from './dto/get-mid-price-index.dto';

@Injectable()
export class MidPriceIndexService {
  constructor(private storeService: StoreService) {
    storeService.setOnDataUpdateCallback(this.onStoreUpdate);
    new BinanceProvider({
      wsConfig: {
        wsEndPointsPool: ['wss://stream.binance.com:9443/ws'],
      },
      restConfig: {
        restEndPointsPool: [
          'https://api.binance.com',
          'https://api-gcp.binance.com',
          'https://api1.binance.com',
          'https://api2.binance.com',
          'https://api3.binance.com',
          'https://api1.binance.com',
        ],
        interval: 1000,
      },
      symboles: ['BTCUSDT', 'ETHUSDT'],
      onDataUpdate: (data) => {
        const symbol = binanceSymbolsMap.get(data.symbol);
        if (!symbol) {
          log('symbol not found', data.symbol, binanceSymbolsMap);
          return;
        }
        storeService.set({
          ...data,
          symbol: symbol,
        });
      },
    }).listen();

    new KrakenProvider({
      restConfig: {
        restEndPointsPool: ['https://api.kraken.com'],
        interval: 1000,
      },
      wsConfig: {
        wsEndPointsPool: ['wss://ws.kraken.com/v2'],
      },

      symboles: ['BTC/USD', 'ETH/USD'],
      onDataUpdate: (data) => {
        const symbol = krakenSymbolsMap.get(data.symbol);
        if (!symbol) {
          log('symbol not found', data.symbol);
          return;
        }
        storeService.set({
          ...data,
          symbol: symbol,
        });
      },
    }).listen();

    new HtxProvider({
      wsConfig: {
        wsEndPointsPool: ['wss://api.huobi.pro/ws'],
      },
      restConfig: {
        restEndPointsPool: ['https://api.huobi.pro'],
        interval: 1000,
      },
      symboles: ['btcusdt', 'ethusdt'],
      onDataUpdate: (data) => {
        const symbol = htxeSymbolsMap.get(data.symbol);
        if (!symbol) {
          log('symbol not found', data.symbol);
          return;
        }
        storeService.set({
          ...data,
          symbol: symbol,
        });
      },
    }).listen();
  }

  findOne(query: GetMidPriceIndexDto): {
    midPrice: number;
    latestTimeStamp: number;
  } | null {
    const { symbol } = query;
    const symbolData = this.storeService.get(symbol);
    if (!symbolData) {
      return null;
    }
    const midPriceIndexSum = Array.from(symbolData.values()).reduce(
      (acc, value) => ({
        midPrice: acc.midPrice + value.midPrice,
        latestTimeStamp: Math.max(acc.latestTimeStamp, value.timeStamp),
      }),
      { midPrice: 0, latestTimeStamp: 0 },
    );
    return {
      midPrice: midPriceIndexSum.midPrice / (symbolData.size || 1),
      latestTimeStamp: midPriceIndexSum.latestTimeStamp,
    };
  }
  private onStoreUpdate(data: TStore) {
    logHeader(formatStoreToTable(data));
  }
}
