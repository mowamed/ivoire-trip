// Trip planning utilities and logic

import { travelTimes, domesticFlights, getCityById, getCityByName } from '../data';
import type { Hotel, Activity, Restaurant, DomesticFlight } from '../data';

export interface ItineraryItem {
  time: string;
  description: string;
  type: 'Activity' | 'Meal' | 'Transportation' | 'Travel' | 'Airport' | 'Hotel' | 'Return';
  details?: Activity | Restaurant | Hotel;
  duration?: number;
  cost?: number;
  city?: string;
  icon?: string;
}

export interface DailyPlan {
  day: number;
  city: string;
  schedule: ItineraryItem[];
  totalCost: number;
  totalDuration: number;
}

export interface TripPlan {
  hotel: Hotel | null;
  dailyPlans: DailyPlan[];
  restaurants: Restaurant[];
  totalCost: number;
  totalDuration: number;
  budget?: number;
  accommodations?: { [key: string]: Hotel };
}

/**
 * Helper function to determine if we should stay overnight in a city
 */
export const shouldStayOvernight = (
  currentCity: string, 
  nextCity: string, 
  travelTimeToNext: number, 
  baseCity: string = 'Abidjan', 
  isSecondLastDay: boolean = false
): boolean => {
  // Always stay overnight if we're in the base city
  if (currentCity === baseCity) return true;
  
  // CRITICAL: On the second-to-last day, if travel time back to base city > 2 hours, 
  // we MUST return to base city to avoid missing the flight
  if (isSecondLastDay) {
    const travelTimeToBase = travelTimes[currentCity]?.[baseCity] || 2;
    if (travelTimeToBase > 2) {
      return false; // Force return to Abidjan the day before departure
    }
  }
  
  // Stay overnight if travel time to next city is > 3 hours
  if (travelTimeToNext > 3) return true;
  
  // Stay overnight if it's a resort destination (Assinie, Sassandra) - but not on second-to-last day if far
  if (['Assinie', 'Sassandra'].includes(currentCity)) {
    if (isSecondLastDay) {
      const travelTimeToBase = travelTimes[currentCity]?.[baseCity] || 2;
      return travelTimeToBase <= 2; // Only stay if close to airport
    }
    return true;
  }
  
  // Stay overnight if travel time back to base + travel time to next city > 4 hours
  const travelTimeToBase = travelTimes[currentCity]?.[baseCity] || 2;
  const travelTimeFromBase = travelTimes[baseCity]?.[nextCity] || 2;
  if (travelTimeToBase + travelTimeFromBase > 4) return true;
  
  return false;
};

/**
 * Helper function to plan the route through cities (prioritizing beach destinations)
 * Now uses the City interface for more intelligent planning
 */
export const planCitiesRoute = (duration: number): string[] => {
  const route: string[] = [];
  const baseCity = 'Abidjan';
  
  if (duration <= 3) {
    // Short trip: Focus on Abidjan and nearby beaches
    route.push(baseCity); // Start in Abidjan
    if (duration > 1) {
      if (duration === 2) {
        route.push(baseCity); // Stay in Abidjan for 2-day trip
      } else {
        route.push('Grand-Bassam'); // Historic beach town - close to Abidjan
        route.push(baseCity); // Return to Abidjan for departure
      }
    }
  } else if (duration <= 7) {
    // Medium trip: Mix of beaches, culture, and mountains
    route.push(baseCity); // Start in Abidjan
    
    // Plan route based on city types (coastal, cultural, mountain)
    
    // Plan route based on duration
    const destinations: string[] = [];
    destinations.push('Grand-Bassam'); // Always include historic beach town
    if (duration > 3) destinations.push('Assinie'); // Luxury beach resort
    if (duration > 4) destinations.push('Yamoussoukro'); // Political capital
    if (duration > 5) destinations.push('Sassandra'); // More beaches
    if (duration > 6) destinations.push('Man'); // Mountain experience
    
    // Add destinations to route
    for (let i = 1; i < duration - 1; i++) {
      if (destinations[i - 1]) {
        route.push(destinations[i - 1]);
      }
    }
    
    // Always end in Abidjan for departure
    route.push(baseCity);
  } else {
    // Long trip: Comprehensive tour using city types
    route.push(baseCity); // Start in Abidjan
    
    // Create a balanced itinerary with different city types
    const prioritizedDestinations = [
      'Grand-Bassam', // Historic coastal
      'Assinie',      // Beach resort
      'Yamoussoukro', // Political capital
      'Sassandra',    // Coastal
      'Man',          // Mountain
      'Korhogo',      // Cultural
      'Bouaké',       // Commercial hub
      'San-Pédro'     // Port city
    ];
    
    // Fill middle days with destinations
    for (let i = 1; i < duration - 1; i++) {
      const destIndex = (i - 1) % prioritizedDestinations.length;
      route.push(prioritizedDestinations[destIndex]);
    }
    
    // Always end in Abidjan for departure
    route.push(baseCity);
  }
  
  // CRITICAL SAFETY CHECK: Ensure second-to-last day doesn't put us far from airport
  if (duration > 2) {
    const secondLastDayIndex = duration - 2;
    const secondLastDayCity = route[secondLastDayIndex];
    const travelTimeToBase = travelTimes[secondLastDayCity]?.[baseCity] || 2;
    
    // If second-to-last day city is >2h from Abidjan, replace it with Abidjan
    if (travelTimeToBase > 2) {
      route[secondLastDayIndex] = baseCity;
    }
  }
  
  return route;
};

/**
 * Helper function to find available domestic flight between two cities
 * Now supports both city names and city IDs
 */
export const findDomesticFlight = (
  fromCity: string, 
  toCity: string
): DomesticFlight | null => {
  // Get city data to handle both IDs and names
  const fromCityData = getCityById(fromCity) || getCityByName(fromCity);
  const toCityData = getCityById(toCity) || getCityByName(toCity);
  
  if (!fromCityData || !toCityData) {
    // Fallback to original string matching for backward compatibility
    return domesticFlights.find(
      flight => flight.departureCity === fromCity && flight.arrivalCity === toCity
    ) || domesticFlights.find(
      flight => flight.departureCity === toCity && flight.arrivalCity === fromCity
    ) || null;
  }
  
  // Search using city IDs (preferred) and names (fallback)
  return domesticFlights.find(
    flight => 
      (flight.departureCityId === fromCityData.id && flight.arrivalCityId === toCityData.id) ||
      (flight.departureCity === fromCityData.name && flight.arrivalCity === toCityData.name)
  ) || domesticFlights.find(
    flight => 
      (flight.departureCityId === toCityData.id && flight.arrivalCityId === fromCityData.id) ||
      (flight.departureCity === toCityData.name && flight.arrivalCity === fromCityData.name)
  ) || null;
};

/**
 * Calculate travel cost based on distance and transportation mode
 */
export const calculateTravelCost = (
  fromCity: string, 
  toCity: string, 
  transportationModes: string[], 
  totalBudget: number
): { cost: number; mode: string } => {
  const distance = travelTimes[fromCity]?.[toCity] || 2;
  
  // Check for domestic flights if that mode is selected
  if (transportationModes.includes('Domestic Flight (Air Côte d\'Ivoire)')) {
    const flight = findDomesticFlight(fromCity, toCity);
    if (flight) {
      return { 
        cost: flight.priceUSD, 
        mode: `Domestic Flight (${flight.airline})` 
      };
    }
  }
  
  if (transportationModes.includes('Private Car with Driver')) {
    return { cost: distance * 25, mode: 'Private Car with Driver' };
  } else if (transportationModes.includes('Rental Car') && totalBudget > 1000) {
    return { cost: distance * 15, mode: 'Rental Car' };
  } else if (transportationModes.includes('Inter-city Coach')) {
    return { cost: distance * 8, mode: 'Inter-city Coach' };
  } else {
    return { cost: distance * 5, mode: 'Public Transport' };
  }
};

/**
 * Get budget category based on total budget
 */
export const getBudgetCategory = (budget: number): string => {
  if (budget < 800) return 'Budget';
  if (budget < 2000) return 'Mid-range';
  return 'Luxury';
};