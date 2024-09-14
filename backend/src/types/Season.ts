export type Season = {
  year: number;
  leagueId: number;
  start: string;
  end: string;
  current: boolean;
  coverage: CoverageSetting;
};

export type CoverageSetting = {
  fixtures: FixtureSetting;
  standings: boolean;
  players: boolean;
  top_scorers: boolean;
  predictions: boolean;
  odds: boolean;
};

export type FixtureSetting = {
  events: boolean;
  lineups: boolean;
  statistics_fixtures: boolean;
  statistics_players: boolean;
};
