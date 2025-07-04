// City-related utility functions

import { cities, getCityById, getCityByName, getCityName } from '../data';
import type { City } from '../data';

/**
 * Get city information with enhanced details
 */
export const getCityInfo = (cityIdentifier: string): City | null => {
  return getCityById(cityIdentifier) || getCityByName(cityIdentifier) || null;
};

/**
 * Get localized city name based on current language
 */
export const getLocalizedCityName = (cityIdentifier: string, language: 'en' | 'fr' = 'en'): string => {
  return getCityName(cityIdentifier, language);
};

/**
 * Get city description based on language
 */
export const getCityDescription = (cityIdentifier: string, language: 'en' | 'fr' = 'en'): string => {
  const city = getCityInfo(cityIdentifier);
  if (!city) return '';
  
  return language === 'fr' ? city.descriptionFr : city.descriptionEn;
};

/**
 * Check if a city has an airport
 */
export const cityHasAirport = (cityIdentifier: string): boolean => {
  const city = getCityInfo(cityIdentifier);
  return city?.hasAirport || false;
};

/**
 * Get cities suitable for different trip durations
 */
export const getCitiesForDuration = (duration: number): City[] => {
  if (duration <= 3) {
    // Short trips: Focus on Abidjan and nearby coastal cities
    return cities.filter(city => 
      city.id === 'abidjan' || 
      (city.type === 'coastal' && city.name === 'Grand-Bassam')
    );
  } else if (duration <= 7) {
    // Medium trips: Mix of coastal, cultural, and capital cities
    return cities.filter(city => 
      city.type === 'coastal' || 
      city.type === 'beach_resort' || 
      city.type === 'capital' || 
      city.type === 'mountain'
    );
  } else {
    // Long trips: All cities
    return cities;
  }
};

/**
 * Get recommended cities based on interests
 */
export const getCitiesByInterests = (interests: string[]): City[] => {
  const interestMap: { [key: string]: City['type'][] } = {
    'beach': ['coastal', 'beach_resort'],
    'culture': ['cultural', 'capital'],
    'nature': ['mountain'],
    'nightlife': ['capital'], // Abidjan has the best nightlife
    'history': ['coastal', 'cultural', 'capital']
  };
  
  const relevantTypes = new Set<City['type']>();
  interests.forEach(interest => {
    const types = interestMap[interest.toLowerCase()];
    if (types) {
      types.forEach(type => relevantTypes.add(type));
    }
  });
  
  return cities.filter(city => relevantTypes.has(city.type));
};

/**
 * Calculate distance between two cities (rough estimate based on coordinates)
 */
export const calculateCityDistance = (city1: string, city2: string): number => {
  const cityData1 = getCityInfo(city1);
  const cityData2 = getCityInfo(city2);
  
  if (!cityData1 || !cityData2) return 0;
  
  const lat1 = cityData1.geolocation.lat;
  const lon1 = cityData1.geolocation.lng;
  const lat2 = cityData2.geolocation.lat;
  const lon2 = cityData2.geolocation.lng;
  
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c; // Distance in kilometers
  
  return Math.round(distance);
};

/**
 * Get the best time to visit a city
 */
export const getBestTimeToVisit = (cityIdentifier: string): string[] => {
  const city = getCityInfo(cityIdentifier);
  return city?.bestTimeToVisit || [];
};

/**
 * Check if it's a good time to visit a city (based on current month)
 */
export const isGoodTimeToVisit = (cityIdentifier: string, month?: number): boolean => {
  const currentMonth = month || new Date().getMonth() + 1; // 1-12
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  const bestTimes = getBestTimeToVisit(cityIdentifier);
  return bestTimes.includes(monthNames[currentMonth - 1]);
};

/**
 * Get city temperature range
 */
export const getCityTemperature = (cityIdentifier: string): { min: number; max: number } | null => {
  const city = getCityInfo(cityIdentifier);
  return city?.averageTemperature || null;
};

/**
 * Get all unique city types
 */
export const getAllCityTypes = (): City['type'][] => {
  const types = new Set<City['type']>();
  cities.forEach(city => types.add(city.type));
  return Array.from(types);
};

/**
 * Get cities by region
 */
export const getCitiesByRegion = (region: string): City[] => {
  return cities.filter(city => city.region === region);
};

/**
 * Get all unique regions
 */
export const getAllRegions = (): string[] => {
  const regions = new Set<string>();
  cities.forEach(city => regions.add(city.region));
  return Array.from(regions).sort();
};