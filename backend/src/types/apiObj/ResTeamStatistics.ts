import { League } from '../League';
import { HomeAway, MinuteRange } from '../TeamStatistic';
import { Team } from '../TeamVenue';

export type ResTeamStatistics = {
  league: League;
  team: Team;
  form: string;
  fixtures: ResFixtures;
  goals: ResGoals;
  biggest: ResBiggest;
  clean_sheet: Record<HomeAway, number>;
  failed_to_score: Record<HomeAway, number>;
  penalty: ResPenalties;
  lineups: ResLineup[];
  cards: ResCards;
};

export type ResFixtures = {
  played: Record<HomeAway, number>;
  wins: Record<HomeAway, number>;
  draws: Record<HomeAway, number>;
  loses: Record<HomeAway, number>;
};

export type ResGoals = {
  for: {
    total: Record<HomeAway, number>;
    average: Record<HomeAway, string>;
    minute: Record<MinuteRange, { total: number | null; percentage: string | null }>;
  };
  against: {
    total: Record<HomeAway, number>;
    average: Record<HomeAway, string>;
    minute: Record<MinuteRange, { total: number | null; percentage: string | null }>;
  };
};

export type ResBiggest = {
  streak: {
    wins: number;
    draws: number;
    loses: number;
  };
  wins: Record<HomeAway, number>;
  loses: Record<HomeAway, number>;
  goals: {
    for: Record<HomeAway, number>;
    against: Record<HomeAway, number>;
  };
};

export type ResLineup = {
  formation: string;
  played: number;
};

export type ResCards = {
  yellow: Record<MinuteRange, { total: number | null; percentage: string | null }>;
  red: Record<MinuteRange, { total: number | null; percentage: string | null }>;
};

export type ResPenalties = {
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
