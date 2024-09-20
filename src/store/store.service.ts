import { Injectable } from '@nestjs/common';
import { TSymbol } from 'src/common';
import { TOnUpdatePayload } from 'src/base-provider/base-provider';

type ExchangeData = { exchange: string; midPrice: number; timeStamp };

export type TStore = Map<TSymbol, Map<string, ExchangeData>>;
// Purpose: Store service that stores the data from the providers.
// It uses a map to store the data.
// It has a callback function that is called when the data is updated.
// It has two methods: get and set.
// get method returns the data for a given symbol.
// set method updates the data in the store.
// It is used by the providers to store the data.

@Injectable()
export class StoreService {
  private storeMap: TStore = new Map();

  onDataUpdate: (data: TStore) => void = () => {};
  setOnDataUpdateCallback(onDataUpdate: (data: TStore) => void) {
    this.onDataUpdate = onDataUpdate;
  }

  get(symbol: TSymbol): Map<string, ExchangeData> | undefined {
    return this.storeMap.get(symbol);
  }

  set(value: TOnUpdatePayload<TSymbol>): void {
    const currentExchangesValues = this.storeMap.get(value.symbol) || new Map();
    currentExchangesValues.set(value.exchange, {
      exchange: value.exchange,
      midPrice: value.midPrice,
      timeStamp: value.timeStamp,
    });

    this.storeMap.set(value.symbol, currentExchangesValues);
    this.onDataUpdate(this.storeMap);
  }
}
