import { upsertVenues } from "../models/venue";
import { venues } from "./teamVenueService";

export const upsertVenuesInDB = async () => {
  return await upsertVenues(venues);
};
