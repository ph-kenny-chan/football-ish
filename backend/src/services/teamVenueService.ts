import { getTeamsByLeagueId } from '../api-football-client';
import { logger } from '../middlewares/loggerConfig';
import { findTeamVenueByTeamIdAndVenueId, upsertTeamVenues } from '../models/teamVenue';
import { Team, TeamVenue, Venue } from '../types/TeamVenue';
import { ApiResponse } from '../types/apiObj/ApiResponse';
import { ResTeamVenue } from '../types/apiObj/ResTeamVenue';
import { findTeamByApiId } from '../models/team';
import { findVenueByApiId } from '../models/venue';

export const venues: Venue[] = [];
export const teams: Team[] = [];
export const teamVenuesMap: { teamApiId: number | undefined; venueApiId: number | undefined; season: number }[] = [];

export const fetchTeamVenues = async (leagueIds: string, season: number) => {
  try {
    if (!leagueIds) throw new Error('League ids are required');
    for (const leagueId of leagueIds.split(',')) {
      const apiResTeamVenues: ApiResponse<ResTeamVenue, ResTeamVenue[]> = await getTeamsByLeagueId({ season, leagueId: parseInt(leagueId) });
      const resTeamVenues = apiResTeamVenues.response;
      const teamVenues = convertTeamVenueFromAPI(resTeamVenues);
      for (const teamVenue of teamVenues) {
        const { team, venue } = teamVenue;
        logger.info(`Syncing team: ${team.name}: apiId ${team.apiId} and venue: ${venue.name} apiId: ${venue.apiId}`);
        if (team && teams.findIndex(t => t.apiId === team.apiId) === -1) {
          teams.push(team);
        }

        if (venue && venues.findIndex(v => v.apiId === venue.apiId) === -1) {
          venues.push(venue);
        }

        if (team && venue && teamVenuesMap.findIndex(tvm => tvm.teamApiId === team.apiId && tvm.venueApiId === venue.apiId) === -1) {
          teamVenuesMap.push({ teamApiId: team.apiId, venueApiId: venue.apiId, season: season });
        }
      }
    }
    return { teams, venues, teamVenuesMap };
  } catch (error) {
    logger.error(error);
    throw error;
  }
};

export const addNewTeamVenuesToDB = async () => {
  const teamVenuesFromAPI = teamVenuesMap;
  const teamVenuesToInsert = [];
  for (const teamVenue of teamVenuesFromAPI) {
    const team = await findTeamByApiId(teamVenue.teamApiId ?? 0);
    const venue = await findVenueByApiId(teamVenue.venueApiId ?? 0);
    if (team && venue) {
      teamVenuesToInsert.push({ team, venue, season: teamVenue.season });
    }
  }
  return await upsertTeamVenues(teamVenuesToInsert);
};

const isUpdatedVenueData = (venue: Venue, venueFromAPI: Venue) => {
  return (
    venue.name !== venueFromAPI.name ||
    venue.address !== venueFromAPI.address ||
    venue.city !== venueFromAPI.city ||
    venue.capacity !== venueFromAPI.capacity ||
    venue.surface !== venueFromAPI.surface ||
    venue.image !== venueFromAPI.image
  );
};

const convertTeamVenueFromAPI = (teamVenues: ResTeamVenue[]) => {
  return teamVenues.map(
    teamVenue =>
      ({
        team: {
          apiId: teamVenue.team.id,
          name: teamVenue.team.name,
          code: teamVenue.team.code,
          country: teamVenue.team.country,
          founded: teamVenue.team.founded,
          national: teamVenue.team.national,
          logo: teamVenue.team.logo
        },
        venue: {
          apiId: teamVenue.venue.id,
          name: teamVenue.venue.name,
          city: teamVenue.venue.city,
          capacity: teamVenue.venue.capacity,
          surface: teamVenue.venue.surface,
          address: teamVenue.venue.address,
          image: teamVenue.venue.image
        }
      }) as TeamVenue
  );
};
