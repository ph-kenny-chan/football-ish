import { League } from '../League';
import { Team } from '../TeamVenue';

export type ResTeamStatistics = {
  league: League;
  team: Team;
  form: string;
  fixtures: Fixtures;
  goals: Goals;
  biggest: Biggest;
  clean_sheet: {
    home: number;
    away: number;
    total: number;
  };
  failed_to_score: {
    home: number;
    away: number;
    total: number;
  };
  penalty: {
    scored: {
      total: number;
      percentage: string;
    };
    missed: {
      total: number;
      percentage: string;
    };
    total: number;
  };
  lineups: Lineup[];
  cards: Cards;
};

type Fixtures = {
  played: {
    home: number;
    away: number;
    total: number;
  };
  wins: {
    home: number;
    away: number;
    total: number;
  };
  draws: {
    home: number;
    away: number;
    total: number;
  };
  loses: {
    home: number;
    away: number;
    total: number;
  };
};

type Goals = {
  for: {
    total: {
      home: number;
      away: number;
      total: number;
    };
    average: {
      home: string;
      away: string;
      total: string;
    };
    minute: Record<string, { total: number | null; percentage: string | null }>;
  };
  against: {
    total: {
      home: number;
      away: number;
      total: number;
    };
    average: {
      home: string;
      away: string;
      total: string;
    };
    minute: Record<string, { total: number | null; percentage: string | null }>;
  };
};

type Biggest = {
  streak: {
    wins: number;
    draws: number;
    loses: number;
  };
  wins: {
    home: string;
    away: string;
  };
  loses: {
    home: string;
    away: string;
  };
  goals: {
    for: {
      home: number;
      away: number;
    };
    against: {
      home: number;
      away: number;
    };
  };
};

type Lineup = {
  formation: string;
  played: number;
};

type Cards = {
  yellow: Record<string, { total: number | null; percentage: string | null }>;
  red: Record<string, { total: number | null; percentage: string | null }>;
};
