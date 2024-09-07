export type TeamCard = {
  id?: number;
  teamId: number;
  leagueId: number;
  yearNum: number;
  minute: MinuteRange;
  yellowTotal: number;
  yellowPercentage: number | null;
  redTotal: number;
  redPercentage: number | null;
};

export type TeamFixture = {
  id?: number;
  teamId: number;
  leagueId: number;
  yearNum: number;
  homeAway: HomeAway;
  played: number;
  wins: number;
  draws: number;
  loses: number;
};

export type TeamGoal = {
  id?: number;
  teamId: number;
  leagueId: number;
  yearNum: number;
  homeAway: HomeAway;
  forAgainst: ForAgainst;
  total: number;
  average: number;
};

export type TeamGoalMinute = {
  id?: number;
  teamId: number;
  leagueId: number;
  yearNum: number;
  forAgainst: ForAgainst;
  minute: MinuteRange;
  total: number;
  percentage: number;
};

export type TeamFormation = {
  id?: number;
  teamId: number;
  leagueId: number;
  yearNum: number;
  formation: string;
  played: number;
  createdAt: Date;
  updatedAt: Date;
};

export type TeamRecord = {
  id?: number;
  teamId: number;
  leagueId: number;
  yearNum: number;
  form: string;
  streakWins: number;
  streakDraws: number;
  streakLoses: number;
  winsHome: number;
  winsAway: number;
  losesHome: number;
  losesAway: number;
  biggestForHome: number;
  biggestForAway: number;
  biggestAgainstHome: number;
  biggestAgainstAway: number;
  cleanSheetHome: number;
  cleanSheetAway: number;
  cleanSheetTotal: number;
  failedToScoreHome: number;
  failedToScoreAway: number;
  failedToScoreTotal: number;
  penaltyTotal: number;
  penaltyScoredTotal: number;
  penaltyScoredPercentage: number;
  penaltyMissedTotal: number;
  penaltyMissedPercentage: number;
};

export type TeamVenue = {
  id: number;
  teamId: number;
  venueId: number;
  preferenceOrder: number;
  createdAt: Date;
  updatedAt: Date;
};

export type HomeAway = 'home' | 'away' | 'total';

export type ForAgainst = 'for' | 'against';

export type MinuteRange = '0-15' | '16-30' | '31-45' | '46-60' | '61-75' | '76-90' | '91-105' | '106-120';
