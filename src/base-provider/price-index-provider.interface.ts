export interface IPriceIndexProvider {
  exchange: string;
  listen: () => void;
}
