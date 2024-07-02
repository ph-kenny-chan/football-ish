import { Country } from '../Country';
import { League } from '../League';
import { Season } from '../Season';

export type ResLeague = {
  league: League;
  country: Country;
  seasons: Season[];
};
