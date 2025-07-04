// Accommodation planning utilities

import { hotels, travelTimes } from '../data';
import type { Hotel } from '../data';
import { shouldStayOvernight } from './tripPlanningUtils';

/**
 * Plan accommodations for each city based on overnight stays
 */
export const planAccommodations = (
  citiesToVisit: string[],
  duration: number,
  budgetCategory: string
): { accommodations: { [key: string]: Hotel }; totalCost: number } => {
  const accommodations: { [key: string]: Hotel } = {};
  let totalAccommodationCost = 0;
  
  // Determine overnight stays and select hotels
  for (let day = 1; day <= duration; day++) {
    const currentCity = citiesToVisit[day - 1];
    const nextCity = day < duration ? citiesToVisit[day] : null;
    const travelTimeToNext = nextCity ? (travelTimes[currentCity]?.[nextCity] || 2) : 0;
    const isSecondLastDay = day === duration - 1;
    
    const stayOvernight = day === duration || !nextCity || shouldStayOvernight(currentCity, nextCity, travelTimeToNext, 'Abidjan', isSecondLastDay);
    
    if (stayOvernight && !accommodations[currentCity]) {
      // Select hotel for this city
      const cityHotels = hotels.filter(h => h.city === currentCity).sort((a, b) => a.cost - b.cost);
      let selectedHotel = cityHotels.find(h => h.budget === budgetCategory);
      
      // Fallback to most affordable option
      if (!selectedHotel && cityHotels.length > 0) {
        selectedHotel = cityHotels[0];
      }
      
      // If no hotel in this city, use Abidjan hotel as fallback
      if (!selectedHotel) {
        const abidjanHotels = hotels.filter(h => h.city === 'Abidjan').sort((a, b) => a.cost - b.cost);
        selectedHotel = abidjanHotels.find(h => h.budget === budgetCategory) || abidjanHotels[0];
      }
      
      if (selectedHotel) {
        accommodations[currentCity] = selectedHotel;
      }
    }
  }
  
  // Calculate total accommodation costs
  for (let day = 1; day <= duration; day++) {
    const currentCity = citiesToVisit[day - 1];
    const nextCity = day < duration ? citiesToVisit[day] : null;
    const travelTimeToNext = nextCity ? (travelTimes[currentCity]?.[nextCity] || 2) : 0;
    const isSecondLastDay = day === duration - 1;
    
    const stayOvernight = day === duration || !nextCity || shouldStayOvernight(currentCity, nextCity, travelTimeToNext, 'Abidjan', isSecondLastDay);
    
    if (stayOvernight && accommodations[currentCity]) {
      totalAccommodationCost += accommodations[currentCity].cost;
    }
  }
  
  return { accommodations, totalCost: totalAccommodationCost };
};

/**
 * Optimize accommodations for budget constraints
 */
export const optimizeAccommodationsForBudget = (
  accommodations: { [key: string]: Hotel },
  citiesToVisit: string[],
  duration: number,
  _maxBudget: number
): { accommodations: { [key: string]: Hotel }; totalCost: number } => {
  const optimizedAccommodations = { ...accommodations };
  
  // Reduce to budget accommodations
  for (const city in optimizedAccommodations) {
    const cityHotels = hotels.filter(h => h.city === city && h.budget === 'Budget').sort((a, b) => a.cost - b.cost);
    if (cityHotels.length > 0) {
      optimizedAccommodations[city] = cityHotels[0];
    }
  }
  
  // Recalculate total accommodation cost
  let totalAccommodationCost = 0;
  for (let day = 1; day <= duration; day++) {
    const currentCity = citiesToVisit[day - 1];
    const nextCity = day < duration ? citiesToVisit[day] : null;
    const travelTimeToNext = nextCity ? (travelTimes[currentCity]?.[nextCity] || 2) : 0;
    const isSecondLastDay = day === duration - 1;
    
    const stayOvernight = day === duration || !nextCity || shouldStayOvernight(currentCity, nextCity, travelTimeToNext, 'Abidjan', isSecondLastDay);
    
    if (stayOvernight && optimizedAccommodations[currentCity]) {
      totalAccommodationCost += optimizedAccommodations[currentCity].cost;
    }
  }
  
  return { accommodations: optimizedAccommodations, totalCost: totalAccommodationCost };
};