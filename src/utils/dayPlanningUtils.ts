// Day planning utilities and logic

import { activities, restaurants, travelTimes } from '../data';
import type { Geolocation, Hotel } from '../data';
import { calculateTravelCost, shouldStayOvernight, type ItineraryItem, type DailyPlan } from './tripPlanningUtils';

/**
 * Helper function to generate a budget-aware day plan
 */
export const generateDayPlanWithBudget = (
  day: number, 
  totalDays: number, 
  city: string, 
  budgetCategory: string, 
  visitedActivities: string[],
  citiesToVisit: string[],
  dailyBudget: number,
  remainingBudget: number,
  transportationModes: string[],
  totalBudget: number,
  accommodations: { [key: string]: Hotel }
): DailyPlan => {
  const schedule: ItineraryItem[] = [];
  let currentTime = 8; // Start earlier for first day (airport arrival)
  let dailyCost = 0;
  let dailyDuration = 0;
  let lastActivityLocation: Geolocation | null = null;
  let budgetUsed = 0;
  const MAX_DAILY_DURATION = 10; // Maximum 10 hours of activities per day
  
  // Helper function to check if we can add more activities without exceeding 10h limit
  const canAddActivity = (activityDuration: number): boolean => {
    return (dailyDuration + activityDuration) <= MAX_DAILY_DURATION;
  };
  
  const hasPrivateCar = transportationModes.includes('Private Car with Driver');

  // Helper function to add transportation between activities
  const addTransportationIfNeeded = (from: Geolocation, to: Geolocation, _fromCity: string, toCity: string) => {
    if (from && to && (from.lat !== to.lat || from.lng !== to.lng)) {
      const transportationCost = hasPrivateCar ? 10 : 5;
      schedule.push({
        time: `${currentTime}:00`,
        description: `Transportation within ${toCity}`,
        type: 'Transportation',
        duration: 0.5,
        cost: transportationCost,
        city: toCity,
      });
      currentTime += 0.5;
      dailyDuration += 0.5;
      dailyCost += transportationCost;
      budgetUsed += transportationCost;
    }
  };

  // First day: Airport arrival
  if (day === 1) {
    schedule.push({
      time: '08:00',
      description: 'Arrival at Félix-Houphouët-Boigny International Airport',
      type: 'Airport',
      duration: 2,
      cost: 0,
      city: 'Abidjan',
    });
    currentTime = 10;
    dailyDuration += 2;

    // Transfer to hotel
    schedule.push({
      time: '10:00',
      description: 'Transfer to hotel',
      type: 'Transportation',
      duration: 1,
      cost: 30,
      city: 'Abidjan',
    });
    currentTime = 11;
    dailyDuration += 1;
    dailyCost += 30;

    // Hotel check-in
    schedule.push({
      time: '11:00',
      description: 'Hotel check-in',
      type: 'Hotel',
      duration: 1,
      cost: 0,
      city: 'Abidjan',
    });
    currentTime = 12;
    dailyDuration += 1;
  }

  // Determine where we're starting from today
  let startingCity = city;
  if (day > 1) {
    const prevDayCity = citiesToVisit[day - 2];
    const currentDayCity = city;
    
    // If we're going to a different city than yesterday
    if (prevDayCity !== currentDayCity) {
      // Check if we stayed overnight in the previous city or returned to Abidjan
      const nextCityAfterPrev = day - 1 < citiesToVisit.length ? citiesToVisit[day - 1] : null;
      const travelTimeFromPrev = nextCityAfterPrev ? (travelTimes[prevDayCity]?.[nextCityAfterPrev] || 2) : 0;
      
      const isPrevDaySecondLastDay = (day - 1) === totalDays - 1;
      if (shouldStayOvernight(prevDayCity, nextCityAfterPrev || '', travelTimeFromPrev, 'Abidjan', isPrevDaySecondLastDay)) {
        // We stayed in the previous city
        startingCity = prevDayCity;
      } else {
        // We returned to Abidjan
        startingCity = 'Abidjan';
      }
      
      // Add travel from starting city to current city
      const travelTime = travelTimes[startingCity]?.[currentDayCity] || 2;
      
      // Check if travel time would exceed daily limit
      if (!canAddActivity(travelTime)) {
        // If travel would exceed limit, skip this day's activities and just do minimal travel
        return {
          day,
          city: currentDayCity,
          schedule: [{
            time: `${currentTime}:00`,
            description: `Travel day: ${startingCity} to ${currentDayCity} (long journey)`,
            type: 'Travel',
            duration: Math.min(travelTime, MAX_DAILY_DURATION),
            cost: 0,
            city: currentDayCity,
          }],
          totalCost: 0,
          totalDuration: Math.min(travelTime, MAX_DAILY_DURATION),
        };
      }
      
      const travelResult = calculateTravelCost(startingCity, currentDayCity, transportationModes, totalBudget);

      schedule.push({
        time: `${currentTime}:00`,
        description: `Travel from ${startingCity} to ${currentDayCity} via ${travelResult.mode}`,
        type: 'Travel',
        duration: travelTime,
        cost: travelResult.cost,
        city: currentDayCity,
      });
      currentTime += travelTime;
      dailyDuration += travelTime;
      dailyCost += travelResult.cost;
      budgetUsed += travelResult.cost;
    }
  }

  // Morning activity (prioritize beach activities and group by proximity)
  if (currentTime < 12 && canAddActivity(1)) { // Check if we have time for at least 1 hour activity
    let morningActivities = activities.filter(a => 
      a.city === city && 
      a.bestTime === 'Morning' && 
      !visitedActivities.includes(a.name) &&
      a.budget === budgetCategory &&
      canAddActivity(a.durationHours) // Check if activity fits within daily limit
    );
    
    // Prioritize beach activities in the morning
    const beachActivities = morningActivities.filter(a => a.type === 'Beach');
    if (beachActivities.length > 0) {
      morningActivities = beachActivities;
    }
    
    if (morningActivities.length > 0) {
      // Filter activities that fit within remaining budget and time
      const affordableActivities = morningActivities.filter(a => 
        a.cost <= (dailyBudget - budgetUsed) && 
        a.cost <= remainingBudget &&
        canAddActivity(a.durationHours)
      );
      
      if (affordableActivities.length > 0) {
        const activity = affordableActivities[Math.floor(Math.random() * affordableActivities.length)];
        
        // Add transportation if needed (from hotel to activity)
        if (lastActivityLocation) {
          addTransportationIfNeeded(lastActivityLocation, activity.geolocation, city, city);
        }
        
        schedule.push({
          time: `${currentTime}:00`,
          description: activity.name,
          type: 'Activity',
          details: activity,
          duration: activity.durationHours,
          cost: activity.cost,
          city: city,
        });
        currentTime += activity.durationHours;
        dailyDuration += activity.durationHours;
        dailyCost += activity.cost;
        budgetUsed += activity.cost;
        visitedActivities.push(activity.name);
        lastActivityLocation = activity.geolocation;
      }
    }
  }

  // Lunch (find closest restaurant to last activity)
  if (currentTime >= 12 && currentTime <= 14 && canAddActivity(1.5)) { // Check if we have time for lunch
    const lunchOptions = restaurants.filter(r => 
      r.city === city && 
      r.bestTime === 'Lunch' &&
      r.budget === budgetCategory
    );
    
    if (lunchOptions.length > 0) {
      let selectedRestaurant = lunchOptions[0];
      
      // Find closest restaurant to last activity if we have location data
      if (lastActivityLocation) {
        selectedRestaurant = lunchOptions.reduce((closest, restaurant) => {
          const currentDistance = Math.sqrt(
            Math.pow(lastActivityLocation!.lat - restaurant.geolocation.lat, 2) +
            Math.pow(lastActivityLocation!.lng - restaurant.geolocation.lng, 2)
          );
          const closestDistance = Math.sqrt(
            Math.pow(lastActivityLocation!.lat - closest.geolocation.lat, 2) +
            Math.pow(lastActivityLocation!.lng - closest.geolocation.lng, 2)
          );
          return currentDistance < closestDistance ? restaurant : closest;
        });
      }
      
      if (selectedRestaurant.cost <= (dailyBudget - budgetUsed) && selectedRestaurant.cost <= remainingBudget) {
        // Add transportation to restaurant
        if (lastActivityLocation) {
          addTransportationIfNeeded(lastActivityLocation, selectedRestaurant.geolocation, city, city);
        }
        
        schedule.push({
          time: `${Math.max(currentTime, 12)}:00`,
          description: `Lunch at ${selectedRestaurant.name}`,
          type: 'Meal',
          details: selectedRestaurant,
          duration: 1.5,
          cost: selectedRestaurant.cost,
          city: city,
        });
        currentTime = Math.max(currentTime + 1.5, 13.5);
        dailyDuration += 1.5;
        dailyCost += selectedRestaurant.cost;
        budgetUsed += selectedRestaurant.cost;
        lastActivityLocation = selectedRestaurant.geolocation;
      }
    }
  }

  // Afternoon activity (continue beach or cultural activities, consider proximity)
  if (currentTime < 17 && canAddActivity(1)) { // Check if we have time for afternoon activity
    let afternoonActivities = activities.filter(a => 
      a.city === city && 
      a.bestTime === 'Afternoon' && 
      !visitedActivities.includes(a.name) &&
      a.budget === budgetCategory &&
      canAddActivity(a.durationHours) // Check if activity fits within daily limit
    );
    
    if (afternoonActivities.length > 0) {
      // Prioritize activities close to last location
      let selectedActivity = afternoonActivities[0];
      if (lastActivityLocation) {
        selectedActivity = afternoonActivities.reduce((closest, activity) => {
          const currentDistance = Math.sqrt(
            Math.pow(lastActivityLocation!.lat - activity.geolocation.lat, 2) +
            Math.pow(lastActivityLocation!.lng - activity.geolocation.lng, 2)
          );
          const closestDistance = Math.sqrt(
            Math.pow(lastActivityLocation!.lat - closest.geolocation.lat, 2) +
            Math.pow(lastActivityLocation!.lng - closest.geolocation.lng, 2)
          );
          return currentDistance < closestDistance ? activity : closest;
        });
      }
      
      if (selectedActivity.cost <= (dailyBudget - budgetUsed) && 
          selectedActivity.cost <= remainingBudget && 
          canAddActivity(selectedActivity.durationHours)) {
        // Add transportation if needed
        if (lastActivityLocation) {
          addTransportationIfNeeded(lastActivityLocation, selectedActivity.geolocation, city, city);
        }
        
        schedule.push({
          time: `${currentTime}:00`,
          description: selectedActivity.name,
          type: 'Activity',
          details: selectedActivity,
          duration: selectedActivity.durationHours,
          cost: selectedActivity.cost,
          city: city,
        });
        currentTime += selectedActivity.durationHours;
        dailyDuration += selectedActivity.durationHours;
        dailyCost += selectedActivity.cost;
        budgetUsed += selectedActivity.cost;
        visitedActivities.push(selectedActivity.name);
        lastActivityLocation = selectedActivity.geolocation;
      }
    }
  }

  // Evening activity (prioritize nightlife/clubbing) or dinner
  if (currentTime < 22 && canAddActivity(1)) { // Check if we have time for evening activities
    const eveningActivities = activities.filter(a => 
      a.city === city && 
      a.bestTime === 'Evening' && 
      !visitedActivities.includes(a.name) &&
      a.budget === budgetCategory &&
      canAddActivity(a.durationHours) // Check if activity fits within daily limit
    );
    
    if (eveningActivities.length > 0) {
      // Prioritize nightlife activities in Abidjan
      const nightlifeActivities = eveningActivities.filter(a => a.type === 'Nightlife');
      
      if (nightlifeActivities.length > 0 && city === 'Abidjan') {
        // First, have dinner
        const dinnerOptions = restaurants.filter(r => 
          r.city === city && 
          r.bestTime === 'Dinner' &&
          r.budget === budgetCategory
        );
        
        if (dinnerOptions.length > 0) {
          const restaurant = dinnerOptions[Math.floor(Math.random() * dinnerOptions.length)];
          
          if (restaurant && 
              restaurant.cost <= (dailyBudget - budgetUsed) && 
              restaurant.cost <= remainingBudget && 
              canAddActivity(1.5)) {
            schedule.push({
              time: `${Math.max(currentTime, 18)}:00`,
              description: `Dinner at ${restaurant.name}`,
              type: 'Meal',
              details: restaurant,
              duration: 1.5,
              cost: restaurant.cost,
              city: city,
            });
            currentTime = Math.max(currentTime + 1.5, 19.5);
            dailyDuration += 1.5;
            dailyCost += restaurant.cost;
            budgetUsed += restaurant.cost;
            lastActivityLocation = restaurant.geolocation;
          }
        }
        
        // Then nightlife
        if (currentTime < 22) {
          const selectedActivity = nightlifeActivities[Math.floor(Math.random() * nightlifeActivities.length)];
          
          if (selectedActivity.cost <= (dailyBudget - budgetUsed) && 
              selectedActivity.cost <= remainingBudget && 
              canAddActivity(selectedActivity.durationHours)) {
            schedule.push({
              time: `${Math.max(currentTime, 21)}:00`,
              description: selectedActivity.name,
              type: 'Activity',
              details: selectedActivity,
              duration: selectedActivity.durationHours,
              cost: selectedActivity.cost,
              city: city,
            });
            dailyDuration += selectedActivity.durationHours;
            dailyCost += selectedActivity.cost;
            budgetUsed += selectedActivity.cost;
            visitedActivities.push(selectedActivity.name);
          }
        }
      } else {
        // Regular evening activity
        const selectedActivity = eveningActivities[Math.floor(Math.random() * eveningActivities.length)];
        
        if (selectedActivity.cost <= (dailyBudget - budgetUsed) && 
            selectedActivity.cost <= remainingBudget && 
            canAddActivity(selectedActivity.durationHours)) {
          schedule.push({
            time: `${currentTime}:00`,
            description: selectedActivity.name,
            type: 'Activity',
            details: selectedActivity,
            duration: selectedActivity.durationHours,
            cost: selectedActivity.cost,
            city: city,
          });
          currentTime += selectedActivity.durationHours;
          dailyDuration += selectedActivity.durationHours;
          dailyCost += selectedActivity.cost;
          budgetUsed += selectedActivity.cost;
          visitedActivities.push(selectedActivity.name);
        }
      }
    }
  }

  // Last day: Departure preparation
  if (day === totalDays) {
    const baseCity = 'Abidjan';
    
    // If we're not in Abidjan, we need to travel there first
    if (city !== baseCity) {
      const travelTimeToBase = travelTimes[city]?.[baseCity] || 2;
      const travelResult = calculateTravelCost(city, baseCity, transportationModes, totalBudget);
      
      schedule.push({
        time: `${currentTime}:00`,
        description: `Travel to ${baseCity} for departure via ${travelResult.mode}`,
        type: 'Travel',
        duration: travelTimeToBase,
        cost: travelResult.cost,
        city: baseCity,
      });
      currentTime += travelTimeToBase;
      dailyDuration += travelTimeToBase;
      dailyCost += travelResult.cost;
      budgetUsed += travelResult.cost;
    }
    
    // Morning activity if time allows (only in Abidjan since we need to depart from there)
    if (currentTime < 11) {
      const morningActivities = activities.filter(a => 
        a.city === baseCity && 
        a.bestTime === 'Morning' && 
        !visitedActivities.includes(a.name) &&
        a.durationHours <= 3 // Short activity before departure
      );
      
      if (morningActivities.length > 0) {
        // Filter activities that fit within remaining budget
        const affordableActivities = morningActivities.filter(a => 
          a.cost <= (dailyBudget - budgetUsed) && a.cost <= remainingBudget
        );
        
        if (affordableActivities.length > 0) {
          const activity = affordableActivities[Math.floor(Math.random() * affordableActivities.length)];
          
          // Add transportation if needed (from hotel to activity)
          if (lastActivityLocation) {
            addTransportationIfNeeded(lastActivityLocation, activity.geolocation, baseCity, baseCity);
          }
          
          schedule.push({
            time: `${currentTime}:00`,
            description: activity.name,
            type: 'Activity',
            details: activity,
            duration: activity.durationHours,
            cost: activity.cost,
            city: baseCity,
          });
          currentTime += activity.durationHours;
          dailyDuration += activity.durationHours;
          dailyCost += activity.cost;
          budgetUsed += activity.cost;
          lastActivityLocation = activity.geolocation;
        }
      }
    }

    // Hotel checkout
    schedule.push({
      time: `${Math.max(currentTime, 11)}:00`,
      description: 'Hotel checkout',
      type: 'Hotel',
      duration: 1,
      cost: 0,
      city: baseCity,
    });
    currentTime = Math.max(currentTime + 1, 12);
    dailyDuration += 1;

    // Transfer to airport
    schedule.push({
      time: `${currentTime}:00`,
      description: 'Transfer to Félix-Houphouët-Boigny International Airport',
      type: 'Transportation',
      duration: 1,
      cost: 30,
      city: baseCity,
    });
    currentTime += 1;
    dailyDuration += 1;
    dailyCost += 30;

    // Airport departure
    schedule.push({
      time: `${currentTime}:00`,
      description: 'Departure from Félix-Houphouët-Boigny International Airport',
      type: 'Airport',
      duration: 2,
      cost: 0,
      city: baseCity,
    });
    dailyDuration += 2;

    return {
      day,
      city: baseCity,
      schedule,
      totalCost: dailyCost,
      totalDuration: dailyDuration,
    };
  }

  // End of day: Handle accommodation or return trip
  if (day < totalDays) {
    const nextCity = citiesToVisit[day];
    const travelTimeToNext = nextCity ? (travelTimes[city]?.[nextCity] || 2) : 0;
    const baseCity = 'Abidjan';
    
    const isSecondLastDay = day === totalDays - 1;
    const stayOvernight = shouldStayOvernight(city, nextCity, travelTimeToNext, baseCity, isSecondLastDay);

    if (stayOvernight) {
      // Stay overnight in current city
      const hotel = accommodations[city];
      if (hotel) {
        schedule.push({
          time: `${Math.max(currentTime, 22)}:00`,
          description: `Check-in at ${hotel.name}`,
          type: 'Hotel',
          details: hotel,
          duration: 1,
          cost: hotel.cost, // Include hotel cost for this night
          city: city,
          icon: '🏨'
        });
        dailyCost += hotel.cost;
        dailyDuration += 1;
      }
    } else {
      // Return trip to base city (Abidjan) if not already there
      if (city !== baseCity) {
        const returnTravelTime = travelTimes[city]?.[baseCity] || 2;
        const returnTravelResult = calculateTravelCost(city, baseCity, transportationModes, totalBudget);
        
        schedule.push({
          time: `${Math.max(currentTime, 20)}:00`,
          description: `Return trip to ${baseCity} via ${returnTravelResult.mode}`,
          type: 'Return',
          duration: returnTravelTime,
          cost: returnTravelResult.cost,
          city: baseCity,
          icon: '🔄'
        });
        dailyCost += returnTravelResult.cost;
        dailyDuration += returnTravelTime;
        currentTime = Math.max(currentTime + returnTravelTime, 22);
      }
      
      // Check-in at base hotel
      const baseHotel = accommodations[baseCity];
      if (baseHotel) {
        schedule.push({
          time: `${Math.max(currentTime, 22)}:00`,
          description: `Check-in at ${baseHotel.name} in ${baseCity}`,
          type: 'Hotel',
          details: baseHotel,
          duration: 1,
          cost: baseHotel.cost, // Include hotel cost for this night
          city: baseCity,
          icon: '🏨'
        });
        dailyCost += baseHotel.cost;
        dailyDuration += 1;
      }
    }
  }

  return {
    day,
    city,
    schedule,
    totalCost: dailyCost,
    totalDuration: dailyDuration,
  };
};