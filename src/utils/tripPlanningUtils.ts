// Trip planning utilities and logic

import { travelTimes } from '../data';
import type { Hotel, Activity, Restaurant } from '../data';

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
        route.push('Grand-Bassam'); // Beach day
        route.push(baseCity); // Return to Abidjan for departure
      }
    }
  } else if (duration <= 7) {
    // Medium trip: Mix of beaches, nightlife, and culture
    route.push(baseCity); // Start in Abidjan
    route.push('Grand-Bassam'); // Historic beach town
    route.push('Assinie'); // Luxury beach resort
    if (duration > 3) route.push('Yamoussoukro'); // Cultural experience
    if (duration > 4) route.push('Sassandra'); // More beaches
    if (duration > 5) route.push('Man'); // Mountain experience
    // Always end in Abidjan for departure
    route[duration - 1] = baseCity;
  } else {
    // Long trip: Comprehensive tour
    const destinations = ['Grand-Bassam', 'Assinie', 'Yamoussoukro', 'Sassandra', 'Man', 'Korhogo', 'Bouaké'];
    route.push(baseCity); // Start in Abidjan
    
    // Fill middle days with destinations
    for (let i = 1; i < duration - 1; i++) {
      const destIndex = (i - 1) % destinations.length;
      route.push(destinations[destIndex]);
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
 * Calculate travel cost based on distance and transportation mode
 */
export const calculateTravelCost = (
  fromCity: string, 
  toCity: string, 
  transportationModes: string[], 
  totalBudget: number
): { cost: number; mode: string } => {
  const distance = travelTimes[fromCity]?.[toCity] || 2;
  
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