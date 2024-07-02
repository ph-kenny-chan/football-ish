export type TeamVenue = {
  id?: number;
  team: Team;
  venue: Venue;
  season: number;
};

export type Team = {
  id?: number;
  apiId?: number;
  name: string;
  code: string;
  country: string;
  founded: number;
  national: boolean;
  logo: string;
};

export type Venue = {
  id?: number;
  apiId?: number;
  name: string;
  address: string;
  city: string;
  capacity: number;
  surface: string;
  image: string;
};