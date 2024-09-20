import { BaseConfig, BaseProvider } from 'src/base-provider/base-provider';
import {
  IKrakenRestResponse,
  IKrakenWsResponse,
  TKrakenAsksBook,
  TKrakenBidsBook,
  TKrakrnSymbol,
} from './formatters/types';
import { getBestBidAsk, getBestBidAskRest } from './formatters/extractVlues';
import axios from 'axios';
import { log } from 'src/logger';

export class KrakenProvider extends BaseProvider<TKrakrnSymbol> {
  constructor(config: BaseConfig<TKrakrnSymbol>) {
    super({ ...config, exchange: 'kraken' });
  }
  depth: number = 10;
  //-----------------------------------(WS)------------------------------------------
  onWsOpen = () => {
    const subscribeMessage = {
      method: 'subscribe',
      params: {
        channel: 'book',
        symbol: this.symboles,
        depth: 10,
      },
    };
    this.wsClient!.send(JSON.stringify(subscribeMessage));
  };

  onWsMessage = (data: any) => {
    const dataString = data.toString();
    const parsedData = JSON.parse(dataString) as IKrakenWsResponse;
    if (!parsedData.channel || parsedData.channel !== 'book') {
      return;
    }
    if (!parsedData.data) {
      return;
    }
    for (const data of parsedData.data) {
      const symbolBids =
        this.bidsBook.get(data.symbol) || new Map<number, number>();
      const symbolAsks =
        this.asksBook.get(data.symbol) || new Map<number, number>();

      for (const ask of data.asks) {
        this.asksBook.get(data.symbol)?.set(new Date().getTime(), ask.price);
      }
      for (const bid of data.bids) {
        this.bidsBook.get(data.symbol)?.set(new Date().getTime(), bid.price);
      }
      if (symbolBids.size > this.depth && symbolAsks.size > this.depth) {
        const values = getBestBidAsk(symbolBids, symbolAsks);
        if (!values) {
          return;
        }
        this.onDataUpdate?.({
          symbol: data.symbol,
          ...values,
          exchange: this.exchange + '(ws)',
          timeStamp: new Date().getTime(),
        });
        symbolBids.clear();
        symbolAsks.clear();
      }
    }
  };
  //---------------------------------(Rest)-------------------------------------------
  restfullRequest = () => {
    const endpoint = super.getNextAvailableRestEndPoint();
    if (!endpoint) {
      log('restEndPoint not set');
      return;
    }
    for (const symbol of this.symboles) {
      // we can't fetch all symbols at once because kraken doesn't support that
      axios
        .get(`${endpoint}/0/public/Depth?pair=${symbol}`)
        .then(({ data }: { data: IKrakenRestResponse }) => {
          if (data.error?.length) {
            log(`error in restfull request: ${this.symboles}`);
            return;
          }
          const symbolData = data.result[symbol];
          const prices = getBestBidAskRest(symbolData);
          if (!prices) {
            return;
          }
          this.onDataUpdate?.({
            ...prices,
            symbol,
            exchange: this.exchange,
            timeStamp: new Date().getTime(),
          });
        })
        .catch(() => {
          log('error in restfull request');
        });
    }
  };

  //--------------------------------------------------------------------------------
  // kraken book events don't usually contain both bids and asks in the same event
  // so we need to keep track of the bids and asks in a local book record

  private bidsBook: TKrakenBidsBook = new Map(
    this.symboles.map((s) => [s, new Map()]),
  );
  private asksBook: TKrakenAsksBook = new Map(
    this.symboles.map((s) => [s, new Map()]),
  );
}
