export type TeamCard = {
  id: number;
  teamId: number;
  cardType: string;
  total: number;
  createdAt: Date;
  updatedAt: Date;
};

export type TeamLineup = {
  id: number;
  teamId: number;
  playerId: number;
  position: string;
  isStarter: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type TeamPenalty = {
  id: number;
  teamId: number;
  success: number;
  missed: number;
  total: number;
  createdAt: Date;
  updatedAt: Date;
};

export type TeamGoalMinute = {
  id: number;
  goalId: number;
  minute: number;
  total: number;
  createdAt: Date;
  updatedAt: Date;
};

export type TeamGoal = {
  id: number;
  teamId: number;
  type: string;
  total: number;
  createdAt: Date;
  updatedAt: Date;
};

export type TeamFixture = {
  id: number;
  teamId: number;
  fixtureId: number;
  result: string;
  createdAt: Date;
  updatedAt: Date;
};

export type TeamVenue = {
  id: number;
  teamId: number;
  venueId: number;
  preferenceOrder: number;
  createdAt: Date;
  updatedAt: Date;
};
