import { upsertTeams } from "../models/team";
import { Team } from "../types/TeamVenue";
import { teams } from "./teamVenueService";

export const updateTeamsInDB = async () => {
  return await upsertTeams(teams);
};

const isUpdatedTeamData = (team: Team, teamFromAPI: Team) => {
  return (
    team.name !== teamFromAPI.name ||
    team.code !== teamFromAPI.code ||
    team.country !== teamFromAPI.country ||
    team.founded !== teamFromAPI.founded ||
    team.national !== teamFromAPI.national ||
    team.logo !== teamFromAPI.logo
  );
};
