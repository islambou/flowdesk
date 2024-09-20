import { IPriceIndexProvider } from 'src/base-provider/price-index-provider.interface';
import * as WebSocket from 'ws';
import { log } from 'src/logger';

type IWsConfig = {
  wsEndPointsPool: [string, ...string[]];
};
type IRestConfig = {
  restEndPointsPool: [string, ...string[]];
  interval: number;
};
type CommonConfig<TS> = {
  exchange: string;
  symboles: TS[];
  onDataUpdate?: (data: TOnUpdatePayload<TS>) => void;
};
type Config<TS> = {
  restConfig?: IRestConfig;
  wsConfig?: IWsConfig;
} & CommonConfig<TS>;
export type BaseConfig<TS> = Omit<Config<TS>, 'exchange'>;

export type TOnUpdatePayload<TS> = {
  timeStamp: number;
  symbol: TS;
  bestAsk: number;
  bestBid: number;
  midPrice: number;
  exchange: string;
};

// Purpose: Base class for all price index providers.
// It provides the common functionality for all providers.
// It is an abstract class that should be extended by all providers.

export abstract class BaseProvider<TS> implements IPriceIndexProvider {
  constructor(config: Config<TS>) {
    this.exchange = config.exchange;
    this.symboles = config.symboles;

    if (config.restConfig) {
      this.restEndpointsPool = config.restConfig.restEndPointsPool;
      this.restRequestInterval = config.restConfig.interval;
    }

    if (config.wsConfig?.wsEndPointsPool) {
      this.wsEndPointsPool = config.wsConfig.wsEndPointsPool;
      this.onDataUpdate = config.onDataUpdate;

      const wsEndPoint = config.wsConfig.wsEndPointsPool.at(
        this.wsEndpointsPoolIndex,
      );

      if (wsEndPoint) {
        this.wsClient = new WebSocket(wsEndPoint);
      }
    }
    log(`${this.exchange} provider created`);
  }

  exchange: string; // exchange name
  symboles: TS[]; // list of symboles to listen to

  restfullJob: NodeJS.Timeout | undefined; // restfull job interval id
  restEndpointsPool?: string[]; // list of restfull endpoints
  restEndpointsPoolIndex: number = 0; // index to keep track of the last used restfull endpoint
  restRequestInterval: number = 5000; // default interval for restfull requests

  wsEndPointsPool?: string[]; // list of websocket endpoints
  wsEndpointsPoolIndex: number = 0; // index to keep track of the last used websocket endpoint

  wsClient: WebSocket | undefined; // websocket client
  abstract onWsOpen: ((data: any) => void) | undefined; // callback for websocket open event
  abstract onWsMessage: ((data: WebSocket.Data) => void) | undefined; // callback for websocket message event
  abstract restfullRequest: (() => any) | undefined; // callback for restfull request

  onDataUpdate: ((data: TOnUpdatePayload<TS>) => void) | undefined; // callback for data update event

  public listen(): void {
    this.listenWs();
    this.listenRest();
  }

  private listenWs(): void {
    if (this.wsClient) {
      this.wsClient.on('open', (ws: WebSocket.WebSocket) => {
        log(`WebSocket connection for ${this.exchange} established`);
        this.onWsOpen?.(ws);
      });
      this.wsClient.on('message', (data: WebSocket.Data) => {
        this.onWsMessage?.(data);
      });
      this.wsClient.on('close', () => {
        log(`WebSocket connection for ${this.exchange} closed`);
        // implement reconnection logic
        this.handleWsException();
      });
      this.wsClient.on('error', (err) => {
        log(`WebSocket connection for ${this.exchange} error`, err);
        this.handleWsException();
        // implement error handeling logic
      });
    }
  }

  private listenRest(): void {
    if (this.restfullRequest) {
      // implement restfull job
      this.restfullJob = setInterval(() => {
        try {
          this.restfullRequest?.();
        } catch (e) {
          log('error in restfull job', this.exchange);
          this.handleRestException();
        }
      }, this.restRequestInterval);
    }
  }

  public getNextAvailableRestEndPoint(): string | undefined {
    const usableIndex =
      this.restEndpointsPoolIndex % (this.restEndpointsPool!.length || 1);
    return this.restEndpointsPool
      ? this.restEndpointsPool[usableIndex]
      : undefined;
  }

  public handleRestException() {
    // implement more sophesticated logic based on the thrown error
    log('updating pool index');
    this.restEndpointsPoolIndex++;
  }
  public handleWsException() {
    // implement more sophesticated logic based on the thrown error
    log('updating pool index');
    this.wsEndpointsPoolIndex++;
    const wsEndPoint = this.wsEndPointsPool?.at(this.wsEndpointsPoolIndex);
    if (!wsEndPoint) {
      return;
    }
    this.wsClient = new WebSocket(wsEndPoint);
  }
}
