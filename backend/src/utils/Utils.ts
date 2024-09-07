import { allCountries } from '../services/countryService';
import { Country } from '../types/Country';
import convertToCamel from './convertToCamel';
export function percentageStringToNumber(percentage: string | null): number | null {
  if (typeof percentage !== 'string' || !percentage.endsWith('%')) {
    return null;
  }

  const numericString = percentage.slice(0, -1);
  const numericValue = parseFloat(numericString);

  return isNaN(numericValue) ? null : numericValue;
}
export function getCountryIdsByCountryCodeAndNames(countries: Country[]): number[] {
  const countryIds = countries.map(country => {
    return allCountries.find(aCountry => country.code === aCountry.code && country.name === aCountry.name)?.id;
  });
  if (countryIds.includes(undefined)) {
    return [];
  }
  return countryIds as number[];
}

export function getCountryIdsByCountryNames(countryNames: string): number[] {
  const countryIds = countryNames.split(',').map(countryName => allCountries.find(country => country.name === countryName.trim())?.id);
  if (countryIds.includes(undefined)) {
    return [];
  }
  return countryIds as number[];
}