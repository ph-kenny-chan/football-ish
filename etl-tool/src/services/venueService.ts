import { upsertVenues } from "../models/venue";
import { venues } from "./teamVenueService";

export const upsertVenuesInDB = async () => {
  return await upsertVenues(venues);
  // const venuesFromAPI = venues;
  // for (const venueFromAPI of venuesFromAPI) {
  //   const venue = await findVenueByApiId(venueFromAPI.apiId ?? 0);
  //   if (!venue) {
  //     logger.info(`Inserting venue: ${venueFromAPI.name}`);
  //     await insertVenues([venueFromAPI]);
  //   } else if (isUpdatedVenueData(venue, venueFromAPI)) {
  //     logger.info(`Updating venue: ${venueFromAPI.name}`);
  //     await updateVenue(venueFromAPI);
  //   }
  // }
};
