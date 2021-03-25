export interface ISearch {
  coins: Coin[];
  exchanges: Exchange[];
  icos: any[];
}

export interface Coin {
  id: string;
  name: string;
  symbol: string;
  market_cap_rank?: number;
  thumb: string;
  large: string;
}

export interface Exchange {
  id: string;
  name: string;
  market_type: string;
  thumb: string;
  large: string;
}
