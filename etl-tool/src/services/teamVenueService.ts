import { getTeamsByLeagueId } from '../api-football-client';
import { logger } from '../middlewares/loggerConfig';
import { findTeamVenueByTeamIdAndVenueId, upsertTeamVenues } from '../models/teamVenue';
import { Team, TeamVenue, Venue } from '../types/TeamVenue';
import { ApiResponse } from '../types/apiObj/ApiResponse';
import { ResTeamVenue } from '../types/apiObj/ResTeamVenue';
import { findTeamByApiId, upsertTeams } from '../models/team';
import { findVenueByApiId, upsertVenues } from '../models/venue';

export const venues: Venue[] = [];
export const teams: Team[] = [];
export const teamVenuesMap: { teamApiId: number | undefined; venueApiId: number | undefined; season: number }[] = [];

export const fetchTeamVenues = async (leagueIds: number[], season: number) => {
  try {
    const filtered = leagueIds.slice(0, 3);
    for (const leagueId of filtered) {
      const apiResTeamVenues: ApiResponse<ResTeamVenue> = await getTeamsByLeagueId({ season, leagueId });
      const resTeamVenues = apiResTeamVenues.response;
      const teamVenues = convertTeamVenueFromAPI(resTeamVenues);
      logger.info(`Syncing teamVenues from leagueId: ${leagueId} and season: ${season}`);
      logger.info(`teamVenues: ${teamVenues.length}`);
      for (const teamVenue of teamVenues) {
        const { team, venue } = teamVenue;
        logger.info(`Syncing team: ${team.name}: apiId ${team.apiId} and venue: ${venue.name} apiId: ${venue.apiId}`);
        if (team) {
          teams.push(team);
        }

        if (venue) {
          venues.push(venue);
        }

        if (team && venue) {
          teamVenuesMap.push({ teamApiId: team.apiId, venueApiId: venue.apiId, season: season });
        }
      }
    }
    return { code: 200, message: 'ok' };
  } catch (error) {
    logger.error(error);
    return { code: 400, message: 'error' };
  }
};

export const addNewTeamVenuesToDB = async () => {
  const teamVenuesFromAPI = teamVenuesMap;
  const teamVenuesToInsert = [];
  for (const teamVenue of teamVenuesFromAPI) {
    const team = await findTeamByApiId(teamVenue.teamApiId ?? 0);
    const venue = await findVenueByApiId(teamVenue.venueApiId ?? 0);
    if (team && venue) {
      const teamVenueFromDB = await findTeamVenueByTeamIdAndVenueId(team.id ?? 0, venue.id ?? 0);
      if (!teamVenueFromDB) {
        teamVenuesToInsert.push({ team, venue, season: teamVenue.season });
      }
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
