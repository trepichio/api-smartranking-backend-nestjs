export interface RankingResponseInterface {
  player?: string;
  rank?: number;
  score?: number;
  matchesHistory?: MatchHistoryInterface;
}

export interface MatchHistoryInterface {
  wins?: number;
  losses?: number;
  matches?: number;
}
