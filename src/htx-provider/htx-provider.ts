import { BaseConfig, BaseProvider } from 'src/base-provider/base-provider';
import {
  IHtxRestResponse,
  IHtxWsResponse,
  THtxSymbol,
} from './formatters/types';
import { gunzipSync } from 'zlib';
import WebSocket from 'ws';
import { log } from 'src/logger';
import axios from 'axios';
import { getBestBidAskRest } from './formatters/extractValues';

export class HtxProvider extends BaseProvider<THtxSymbol> {
  constructor(config: BaseConfig<THtxSymbol>) {
    super({ ...config, exchange: 'HTX' });
  }

  //-----------------------------------(WS)------------------------------------------
  onWsOpen = () => {
    this.symboles.forEach((s) => {
      // htx out of the box provides best bid and ask
      this.wsClient!.send(
        JSON.stringify({
          sub: `market.${s}.bbo`,
          id: `sub-${s}`,
        }),
      );
    });
  };

  onWsMessage = (data: WebSocket.Data) => {
    const decompressed = gunzipSync(data as any).toString();
    const parsedData = JSON.parse(decompressed);

    if (parsedData.ping) {
      this.wsClient!.send(JSON.stringify({ pong: parsedData.ping }));
      return;
    }
    const parsedMessage = JSON.parse(decompressed) as IHtxWsResponse;

    if (!parsedMessage.ch || !parsedMessage.tick) {
      return;
    }
    const symbol = parsedMessage.ch.split('.')[1] as THtxSymbol;
    this.onDataUpdate?.({
      bestAsk: parsedMessage.tick.ask,
      bestBid: parsedMessage.tick.bid,
      midPrice: (parsedMessage.tick.ask + parsedMessage.tick.bid) / 2,
      symbol,
      timeStamp: parsedMessage.ts,
      exchange: this.exchange + '(ws)',
    });
  };

  //---------------------------------(Rest)-------------------------------------------
  restfullRequest = () => {
    const endpoint = super.getNextAvailableRestEndPoint();
    if (!endpoint) {
      log('restEndPoint not set');
      return;
    }
    for (const symbol of this.symboles) {
      // we can't fetch all symbols at once because htx rest api doesn't support that
      axios
        .get(`${endpoint}/market/depth?symbol=${symbol}&depth=5&type=step0`)
        .then(({ data }: { data: IHtxRestResponse }) => {
          if (!data.status || data.status !== 'ok') {
            log(`error in restfull request: ${this.symboles}`);
            return;
          }
          const prices = getBestBidAskRest(data.tick);
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
        .catch((e) => {
          log('error in restfull request', e);
        });
    }
  };
}
