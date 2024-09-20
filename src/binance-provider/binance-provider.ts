import { log } from 'src/logger';
import { getBestBidAsk, getBestBidAskRest } from './formatters/extractVlues';
import {
  IBinanceRestResponse,
  IBinanceWsResponse,
  TBinanceSymbol,
} from './formatters/types';
import { BaseConfig, BaseProvider } from 'src/base-provider/base-provider';
import axios from 'axios';

export class BinanceProvider extends BaseProvider<TBinanceSymbol> {
  constructor(config: BaseConfig<TBinanceSymbol>) {
    super({ ...config, exchange: 'binance' });
  }
  //-----------------------------------(WS)------------------------------------------

  onWsOpen = () => {
    const subscribeMessage = {
      method: 'SUBSCRIBE',
      params: this.symboles.map((s) => `${s.toLowerCase()}@depth`),
      id: 1,
    };
    this.wsClient!.send(JSON.stringify(subscribeMessage));
  };
  onWsMessage = (data: any) => {
    const dataString = data.toString();
    const parsedData = JSON.parse(dataString);
    if (parsedData.ping) {
      console.log('ping');
      return;
    }

    const parsedMessage = JSON.parse(dataString) as IBinanceWsResponse;
    if (!parsedMessage.e || parsedMessage.e !== 'depthUpdate') {
      return; // ignore non-trade events
    }
    const prices = getBestBidAsk(parsedMessage);
    if (!prices) {
      return;
    }
    this.onDataUpdate?.({
      ...prices,
      symbol: parsedMessage.s,
      timeStamp: parsedMessage.E,
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
      // we can't fetch all symbols at once because binance rest api doesn't support that
      axios
        .get(`${endpoint}/api/v3/depth?symbol=${symbol}`)
        .then(({ data }: { data: IBinanceRestResponse }) => {
          if (!data.bids) {
            log(`data missing in restfull request: ${symbol}`);
            log(data);
            return;
          }
          const prices = getBestBidAskRest(data);
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
          log('error in restfull request', this.exchange, symbol, e.errno);
          this.handleRestException();
        });
    }
  };
}
