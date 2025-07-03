import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import PlannerWithSettings from './components/PlannerWithSettings';
import TripPlan from './components/TripPlan';
import { Loading } from './components/ui/loading';
import { CurrencyProvider } from './contexts/CurrencyContext';
import { hotels, activities, restaurants, travelTimes, transportationOptions } from './data';
import type { Hotel, Activity, Restaurant, Geolocation, Transportation } from './data';
import './App.css';

interface ItineraryItem {
  time: string;
  description: string;
  type: 'Activity' | 'Meal' | 'Transportation' | 'Travel' | 'Airport' | 'Hotel' | 'Return';
  details?: Activity | Restaurant | Hotel;
  duration?: number;
  cost?: number;
  city?: string;
  icon?: string;
}

interface DailyPlan {
  day: number;
  city: string;
  schedule: ItineraryItem[];
  totalCost: number;
  totalDuration: number;
}

const AppContent: React.FC = () => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [plan, setPlan] = useState<{
    hotel: Hotel | null;
    dailyPlans: DailyPlan[];
    restaurants: Restaurant[];
    totalCost: number;
    totalDuration: number;
    budget?: number;
    accommodations?: { [key: string]: Hotel }; // Track hotels for each city
  } | null>(null);

  // Utility function to calculate distance between two points using Haversine formula
  const calculateDistance = (point1: Geolocation, point2: Geolocation): number => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (point2.lat - point1.lat) * Math.PI / 180;
    const dLng = (point2.lng - point1.lng) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(point1.lat * Math.PI / 180) * Math.cos(point2.lat * Math.PI / 180) * 
      Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c; // Distance in kilometers
  };

  // Function to group activities by proximity
  const groupActivitiesByProximity = (activitiesList: Activity[], maxDistance: number = 5): Activity[][] => {
    const groups: Activity[][] = [];
    const used = new Set<string>();

    for (const activity of activitiesList) {
      if (used.has(activity.name)) continue;

      const group = [activity];
      used.add(activity.name);

      // Find nearby activities
      for (const otherActivity of activitiesList) {
        if (used.has(otherActivity.name)) continue;
        
        const distance = calculateDistance(activity.geolocation, otherActivity.geolocation);
        if (distance <= maxDistance) {
          group.push(otherActivity);
          used.add(otherActivity.name);
        }
      }

      groups.push(group);
    }

    return groups;
  };

  // Function to find the closest restaurant to a given location
  const findClosestRestaurant = (
    location: Geolocation, 
    restaurantsList: Restaurant[], 
    maxDistance: number = 10
  ): Restaurant | null => {
    let closest: Restaurant | null = null;
    let minDistance = maxDistance;

    for (const restaurant of restaurantsList) {
      const distance = calculateDistance(location, restaurant.geolocation);
      if (distance < minDistance) {
        minDistance = distance;
        closest = restaurant;
      }
    }

    return closest;
  };

  const generatePlan = async (duration: number, budget: number, transportationModes: string[]) => {
    setIsLoading(true);
    
    // Add a small delay to show loading state
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    try {
      // Calculate private car cost if selected
      const hasPrivateCar = transportationModes.includes('Private Car with Driver');
      const privateCarCost = hasPrivateCar ? 
        transportationOptions.find(t => t.type === 'Private Car with Driver')?.costPerDay || 70 : 0;
      const totalPrivateCarCost = privateCarCost * duration;

      // Adjust available budget for accommodation and activities if private car is selected
      const adjustedBudget = hasPrivateCar ? budget - totalPrivateCarCost : budget;
      
      // Determine budget category based on adjusted budget per day
      const budgetPerDay = adjustedBudget / duration;
      let budgetCategory: 'Budget' | 'Mid-Range' | 'Luxury';
      if (budgetPerDay < 150) {
        budgetCategory = 'Budget';
      } else if (budgetPerDay < 300) {
        budgetCategory = 'Mid-Range';
      } else {
        budgetCategory = 'Luxury';
      }

      // Plan cities to visit based on duration
      const citiesToVisit = planCitiesRoute(duration);
      
      // Plan accommodations for each city based on overnight stays
      const accommodations: { [key: string]: Hotel } = {};
      let totalAccommodationCost = 0;
      
      // Determine overnight stays and select hotels
      for (let day = 1; day <= duration; day++) {
        const currentCity = citiesToVisit[day - 1];
        const nextCity = day < duration ? citiesToVisit[day] : null;
        const travelTimeToNext = nextCity ? (travelTimes[currentCity]?.[nextCity] || 2) : 0;
        
        const stayOvernight = day === duration || !nextCity || shouldStayOvernight(currentCity, nextCity, travelTimeToNext);
        
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
        
        const stayOvernight = day === duration || !nextCity || shouldStayOvernight(currentCity, nextCity, travelTimeToNext);
        
        if (stayOvernight && accommodations[currentCity]) {
          totalAccommodationCost += accommodations[currentCity].cost;
        }
      }
      
      // Select primary hotel (base hotel in Abidjan)
      const availableHotels = hotels.filter(h => h.city === 'Abidjan').sort((a, b) => a.cost - b.cost);
      let selectedHotel = availableHotels.find(h => h.budget === budgetCategory) || availableHotels[0];
      
      let remainingBudget = adjustedBudget;
      const dailyBudget = remainingBudget / duration;

      // If accommodation cost exceeds 70% of adjusted budget, optimize
      if (totalAccommodationCost > adjustedBudget * 0.7) {
        // Reduce to budget accommodations
        for (const city in accommodations) {
          const cityHotels = hotels.filter(h => h.city === city && h.budget === 'Budget').sort((a, b) => a.cost - b.cost);
          if (cityHotels.length > 0) {
            accommodations[city] = cityHotels[0];
          }
        }
        
        // Recalculate total accommodation cost
        totalAccommodationCost = 0;
        for (let day = 1; day <= duration; day++) {
          const currentCity = citiesToVisit[day - 1];
          const nextCity = day < duration ? citiesToVisit[day] : null;
          const travelTimeToNext = nextCity ? (travelTimes[currentCity]?.[nextCity] || 2) : 0;
          
          const stayOvernight = day === duration || !nextCity || shouldStayOvernight(currentCity, nextCity, travelTimeToNext);
          
          if (stayOvernight && accommodations[currentCity]) {
            totalAccommodationCost += accommodations[currentCity].cost;
          }
        }
      }

      const dailyPlans: DailyPlan[] = [];
      let totalCost = 0; // Hotel costs will be included in daily costs now
      let totalDuration = 0;
      const visitedActivities: string[] = [];

      for (let day = 1; day <= duration; day++) {
        const cityForDay = citiesToVisit[day - 1];
        const availableBudgetForDay = Math.max(dailyBudget, 50); // Minimum $50 per day for activities
        
        const dayPlan = generateDayPlanWithBudget(
          day, 
          duration, 
          cityForDay, 
          budgetCategory, 
          visitedActivities, 
          citiesToVisit,
          availableBudgetForDay,
          remainingBudget,
          transportationModes,
          budget,
          accommodations
        );
        
        dailyPlans.push(dayPlan);
        totalCost += dayPlan.totalCost;
        totalDuration += dayPlan.totalDuration;
        remainingBudget -= dayPlan.totalCost;
        
        // Add visited activities to avoid repetition
        dayPlan.schedule.forEach(item => {
          if (item.type === 'Activity' && item.details) {
            visitedActivities.push(item.details.name);
          }
        });
      }

      // Final budget check - if over budget, optimize the plan
      // Add transportation costs to total
      const finalTotalCost = totalCost + totalPrivateCarCost;
      
      if (finalTotalCost > budget) {
        const optimizedPlan = optimizePlanForBudget(dailyPlans, selectedHotel, budget, duration);
        // Add transportation cost to optimized plan
        optimizedPlan.totalCost += totalPrivateCarCost;
        setPlan(optimizedPlan);
      } else {
        setPlan({
          hotel: selectedHotel,
          dailyPlans,
          restaurants: restaurants.filter(r => r.budget === budgetCategory),
          totalCost: finalTotalCost,
          totalDuration,
          budget,
          accommodations,
        });
      }
    } catch (error) {
      console.error('Error generating plan:', error);
      // Fallback to a basic plan if something goes wrong
      generateBasicPlan(duration, budget, transportationModes);
    }
    
    setIsLoading(false);
  };

  // Helper function to determine if we should stay overnight in a city
  const shouldStayOvernight = (currentCity: string, nextCity: string, travelTimeToNext: number, baseCity: string = 'Abidjan'): boolean => {
    // Always stay overnight if it's the last day or if we're in the base city
    if (currentCity === baseCity) return true;
    
    // Stay overnight if travel time to next city is > 3 hours
    if (travelTimeToNext > 3) return true;
    
    // Stay overnight if it's a resort destination (Assinie, Sassandra)
    if (['Assinie', 'Sassandra'].includes(currentCity)) return true;
    
    // Stay overnight if travel time back to base + travel time to next city > 4 hours
    const travelTimeToBase = travelTimes[currentCity]?.[baseCity] || 2;
    const travelTimeFromBase = travelTimes[baseCity]?.[nextCity] || 2;
    if (travelTimeToBase + travelTimeFromBase > 4) return true;
    
    return false;
  };

  // Helper function to plan the route through cities (prioritizing beach destinations)
  const planCitiesRoute = (duration: number): string[] => {
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
    
    return route;
  };

  // Helper function to generate a budget-aware day plan
  const generateDayPlanWithBudget = (
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
    
    const hasPrivateCar = transportationModes.includes('Private Car with Driver');
    
    // Helper function to add transportation between locations
    const addTransportationIfNeeded = (fromLocation: Geolocation, toLocation: Geolocation, fromCity: string, toCity: string) => {
      if (hasPrivateCar) return; // No need for separate transport with private car
      
      const distance = calculateDistance(fromLocation, toLocation);
      if (distance < 0.5) return; // Walking distance, no transport needed
      
      const transportResult = calculateTravelCost(fromCity, toCity, transportationModes, totalBudget);
      
      schedule.push({
        time: `${Math.floor(currentTime)}:${(currentTime % 1 * 60).toString().padStart(2, '0')}`,
        description: `Transportation via ${transportResult.mode}`,
        type: 'Transportation',
        duration: 0.5, // 30 minutes for local transport
        cost: transportResult.cost,
        city: fromCity,
        icon: '🚗'
      });
      
      currentTime += 0.5;
      dailyCost += transportResult.cost;
      dailyDuration += 0.5;
      budgetUsed += transportResult.cost;
    };

    // First day: Airport arrival
    if (day === 1) {
      schedule.push({
        time: `${currentTime}:00`,
        description: 'Arrival at Félix-Houphouët-Boigny International Airport',
        type: 'Airport',
        duration: 1,
        cost: 0,
        city: 'Abidjan',
      });
      currentTime += 1;
      dailyDuration += 1;

      // Transfer to hotel
      const transferCost = Math.min(30, dailyBudget * 0.2); // Max 20% of daily budget for airport transfer
      schedule.push({
        time: `${currentTime}:00`,
        description: 'Transfer from airport to hotel',
        type: 'Transportation',
        duration: 1,
        cost: transferCost,
        city: 'Abidjan',
      });
      currentTime += 1;
      dailyDuration += 1;
      dailyCost += transferCost;
      budgetUsed += transferCost;

      // Hotel check-in
      schedule.push({
        time: `${currentTime}:00`,
        description: 'Hotel check-in and rest',
        type: 'Hotel',
        duration: 1,
        cost: 0,
        city: 'Abidjan',
      });
      currentTime += 1;
      dailyDuration += 1;
    }

    // Last day: Departure preparation
    if (day === totalDays) {
      // Morning activity if time allows
      if (currentTime < 11) {
        const morningActivities = activities.filter(a => 
          a.city === city && 
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
        city: 'Abidjan',
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
        city: 'Abidjan',
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
        city: 'Abidjan',
      });
      dailyDuration += 2;

      return {
        day,
        city: 'Abidjan',
        schedule,
        totalCost: dailyCost,
        totalDuration: dailyDuration,
      };
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
        
        if (shouldStayOvernight(prevDayCity, nextCityAfterPrev || '', travelTimeFromPrev)) {
          // We stayed in the previous city
          startingCity = prevDayCity;
        } else {
          // We returned to Abidjan
          startingCity = 'Abidjan';
        }
        
        // Add travel from starting city to current city
        const travelTime = travelTimes[startingCity]?.[currentDayCity] || 2;
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
    if (currentTime < 12) {
      let morningActivities = activities.filter(a => 
        a.city === city && 
        a.bestTime === 'Morning' && 
        !visitedActivities.includes(a.name) &&
        a.budget === budgetCategory
      );
      
      // Prioritize beach activities in the morning
      const beachActivities = morningActivities.filter(a => a.type === 'Beach');
      if (beachActivities.length > 0) {
        morningActivities = beachActivities;
      }
      
      if (morningActivities.length > 0) {
        // Filter activities that fit within remaining budget
        const affordableActivities = morningActivities.filter(a => 
          a.cost <= (dailyBudget - budgetUsed) && a.cost <= remainingBudget
        );
        
        if (affordableActivities.length > 0) {
          // Group activities by proximity to optimize travel time
          const activityGroups = groupActivitiesByProximity(affordableActivities, 3); // 3km radius
          const selectedGroup = activityGroups[Math.floor(Math.random() * activityGroups.length)];
          const activity = selectedGroup[0]; // Start with the first activity in the group
          
          // Add transportation if needed (from hotel/previous location to activity)
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
          
          // Store the current location for finding nearby lunch options
          lastActivityLocation = activity.geolocation;
        }
      }
    }

    // Lunch (find closest restaurant to last activity)
    if (currentTime >= 12 && currentTime <= 14) {
      const lunchOptions = restaurants.filter(r => 
        r.city === city && 
        r.bestTime === 'Lunch' &&
        r.budget === budgetCategory
      );
      
      let restaurant: Restaurant | null = null;
      
      // If we have a last activity location, find the closest restaurant
      if (lastActivityLocation && lunchOptions.length > 0) {
        restaurant = findClosestRestaurant(lastActivityLocation, lunchOptions, 10); // 10km radius
      }
      
      // Fallback to random selection if no close restaurant found
      if (!restaurant && lunchOptions.length > 0) {
        restaurant = lunchOptions[Math.floor(Math.random() * lunchOptions.length)];
      }
      
      if (restaurant && restaurant.cost <= (dailyBudget - budgetUsed) && restaurant.cost <= remainingBudget) {
        // Add transportation to restaurant if needed
        if (lastActivityLocation) {
          addTransportationIfNeeded(lastActivityLocation, restaurant.geolocation, city, city);
        }
        
        schedule.push({
          time: `${currentTime}:00`,
          description: `Lunch at ${restaurant.name}`,
          type: 'Meal',
          details: restaurant,
          duration: 1.5,
          cost: restaurant.cost,
          city: city,
        });
        currentTime += 1.5;
        dailyDuration += 1.5;
        dailyCost += restaurant.cost;
        budgetUsed += restaurant.cost;
        
        // Update location for afternoon activities
        lastActivityLocation = restaurant.geolocation;
      }
    }

    // Afternoon activity (continue beach or cultural activities, consider proximity)
    if (currentTime < 17) {
      let afternoonActivities = activities.filter(a => 
        a.city === city && 
        a.bestTime === 'Afternoon' && 
        !visitedActivities.includes(a.name) &&
        a.budget === budgetCategory
      );
      
      // If in a beach city, prioritize beach activities
      const isBeachCity = ['Assinie', 'Grand-Bassam', 'Sassandra'].includes(city);
      if (isBeachCity) {
        const beachActivities = afternoonActivities.filter(a => a.type === 'Beach');
        if (beachActivities.length > 0) {
          afternoonActivities = beachActivities;
        }
      }
      
      if (afternoonActivities.length > 0) {
        let selectedActivity: Activity;
        
        // If we have a last location, try to find nearby activities first
        if (lastActivityLocation) {
          const nearbyActivities = afternoonActivities.filter(a => 
            calculateDistance(lastActivityLocation!, a.geolocation) <= 5 // 5km radius
          );
          
          if (nearbyActivities.length > 0) {
            selectedActivity = nearbyActivities[Math.floor(Math.random() * nearbyActivities.length)];
          } else {
            selectedActivity = afternoonActivities[Math.floor(Math.random() * afternoonActivities.length)];
          }
        } else {
          selectedActivity = afternoonActivities[Math.floor(Math.random() * afternoonActivities.length)];
        }
        
        if (selectedActivity.cost <= (dailyBudget - budgetUsed) && selectedActivity.cost <= remainingBudget) {
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
          
          // Update location for evening activities
          lastActivityLocation = selectedActivity.geolocation;
        }
      }
    }

    // Evening activity (prioritize nightlife/clubbing) or dinner
    if (currentTime < 22) {
      const eveningActivities = activities.filter(a => 
        a.city === city && 
        a.bestTime === 'Evening' && 
        !visitedActivities.includes(a.name) &&
        a.budget === budgetCategory
      );
      
      // Prioritize nightlife activities in the evening, especially in Abidjan
      const nightlifeActivities = eveningActivities.filter(a => a.type === 'Nightlife');
      const isNightlifeCity = city === 'Abidjan' || city === 'Grand-Bassam';
      
      if (currentTime < 19) {
        // Early evening: dinner first (find close to last activity)
        const dinnerOptions = restaurants.filter(r => 
          r.city === city && 
          r.bestTime === 'Dinner' &&
          r.budget === budgetCategory
        );
        
        let restaurant: Restaurant | null = null;
        
        // Try to find a restaurant close to the last activity
        if (lastActivityLocation && dinnerOptions.length > 0) {
          restaurant = findClosestRestaurant(lastActivityLocation, dinnerOptions, 8); // 8km radius
        }
        
        // Fallback to random selection
        if (!restaurant && dinnerOptions.length > 0) {
          restaurant = dinnerOptions[Math.floor(Math.random() * dinnerOptions.length)];
        }
        
        if (restaurant && restaurant.cost <= (dailyBudget - budgetUsed) && restaurant.cost <= remainingBudget) {
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
          
          // Update location for nightlife activities
          lastActivityLocation = restaurant.geolocation;
        }
      }
      
      // Late evening: nightlife activities (especially in nightlife cities, consider proximity)
      if (currentTime >= 19 && currentTime < 22) {
        if (isNightlifeCity && nightlifeActivities.length > 0) {
          let selectedActivity: Activity;
          
          // Try to find nightlife close to dinner location
          if (lastActivityLocation) {
            const nearbyNightlife = nightlifeActivities.filter(a => 
              calculateDistance(lastActivityLocation!, a.geolocation) <= 10 // 10km radius for nightlife
            );
            
            if (nearbyNightlife.length > 0) {
              selectedActivity = nearbyNightlife[Math.floor(Math.random() * nearbyNightlife.length)];
            } else {
              selectedActivity = nightlifeActivities[Math.floor(Math.random() * nightlifeActivities.length)];
            }
          } else {
            selectedActivity = nightlifeActivities[Math.floor(Math.random() * nightlifeActivities.length)];
          }
          
          if (selectedActivity.cost <= (dailyBudget - budgetUsed) && selectedActivity.cost <= remainingBudget) {
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
          }
        } else if (eveningActivities.length > 0) {
          // Fallback to other evening activities (also consider proximity)
          let selectedActivity: Activity;
          
          if (lastActivityLocation) {
            const nearbyEvening = eveningActivities.filter(a => 
              calculateDistance(lastActivityLocation!, a.geolocation) <= 8 // 8km radius
            );
            
            if (nearbyEvening.length > 0) {
              selectedActivity = nearbyEvening[Math.floor(Math.random() * nearbyEvening.length)];
            } else {
              selectedActivity = eveningActivities[Math.floor(Math.random() * eveningActivities.length)];
            }
          } else {
            selectedActivity = eveningActivities[Math.floor(Math.random() * eveningActivities.length)];
          }
          
          if (selectedActivity.cost <= (dailyBudget - budgetUsed) && selectedActivity.cost <= remainingBudget) {
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
          }
        }
      }
    }

    // End of day: Handle accommodation or return trip
    if (day < totalDays) {
      const nextCity = citiesToVisit[day];
      const travelTimeToNext = nextCity ? (travelTimes[city]?.[nextCity] || 2) : 0;
      const baseCity = 'Abidjan';
      
      const stayOvernight = shouldStayOvernight(city, nextCity, travelTimeToNext, baseCity);

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

  // Function to get the best transportation option for a route
  const getBestTransportationOption = (
    fromCity: string, 
    toCity: string, 
    distance: number, 
    availableModes: string[], 
    budget: number
  ): { mode: Transportation; cost: number } | null => {
    // Determine if this is intra-city or inter-city travel
    const travelType: 'Intra-city' | 'Inter-city' = fromCity === toCity ? 'Intra-city' : 'Inter-city';
    
    // Filter transportation options by travel scope
    const availableTransportation = transportationOptions.filter(transport => 
      availableModes.includes(transport.type) &&
      transport.availableIn.includes(fromCity) &&
      transport.availableIn.includes(toCity) &&
      transport.travelScope.includes(travelType)
    );

    if (availableTransportation.length === 0) {
      // Fallback to walking if distance < 0.5km, otherwise use cheapest available option
      if (distance < 0.5) {
        return { 
          mode: { 
            type: 'Walking', 
            costPerTrip: 0, 
            costPerDay: null, 
            costPerKilometer: 0, 
            budget: 'Budget', 
            availableIn: ['Abidjan', 'Grand-Bassam', 'Assinie', 'Yamoussoukro', 'Man', 'Taï', 'Sassandra', 'Bouna', 'Korhogo', 'Bouaké', 'Tiassalé', 'Daloa', 'Bondoukou', 'Aboisso', 'San-Pédro'],
            travelScope: ['Intra-city'] 
          }, 
          cost: 0 
        };
      }
      // Use the cheapest available transportation from any city that matches the travel scope
      const fallbackOptions = transportationOptions.filter(transport => 
        availableModes.includes(transport.type) &&
        transport.travelScope.includes(travelType)
      ).sort((a, b) => {
        const costA = a.costPerKilometer ? a.costPerKilometer * distance : (a.costPerTrip || 50);
        const costB = b.costPerKilometer ? b.costPerKilometer * distance : (b.costPerTrip || 50);
        return costA - costB;
      });
      
      if (fallbackOptions.length > 0) {
        const mode = fallbackOptions[0];
        const cost = mode.costPerKilometer ? mode.costPerKilometer * distance : (mode.costPerTrip || 50);
        return { mode, cost };
      }
      return null;
    }

    // Sort by cost and select the cheapest option within budget
    const sortedOptions = availableTransportation.map(transport => {
      let cost = 0;
      if (transport.costPerKilometer) {
        cost = transport.costPerKilometer * distance;
      } else if (transport.costPerTrip) {
        cost = transport.costPerTrip;
      } else {
        cost = 50; // Default fallback cost
      }
      return { mode: transport, cost };
    }).sort((a, b) => a.cost - b.cost);

    // Return the cheapest option that fits the budget
    for (const option of sortedOptions) {
      if (option.cost <= budget * 0.1) { // Don't spend more than 10% of total budget on single transport
        return option;
      }
    }

    // If no option fits budget constraint, return the cheapest
    return sortedOptions[0] || null;
  };

  // Helper function to calculate travel cost based on distance and available transportation modes
  const calculateTravelCost = (fromCity: string, toCity: string, availableModes: string[], budget: number): { cost: number; mode: string } => {
    // Use travel time as distance proxy (convert hours to km roughly)
    const travelDistance = (travelTimes[fromCity]?.[toCity] || 2) * 50; // Assume 50km/h average
    
    if (travelDistance < 0.5) {
      return { cost: 0, mode: 'Walking' };
    }

    // Determine if this is intra-city or inter-city travel
    const travelType = fromCity === toCity ? 'Intra-city' : 'Inter-city';
    
    const transportOption = getBestTransportationOption(fromCity, toCity, travelDistance, availableModes, budget);
    
    if (!transportOption) {
      // Fallback calculation
      const baseCost = travelDistance * 0.1; // $0.1 per km as fallback
      return { cost: baseCost, mode: travelType === 'Intra-city' ? 'Local Transport' : 'Inter-city Bus' };
    }

    return { cost: transportOption.cost, mode: transportOption.mode.type };
  };

  // Function to optimize plan when over budget
  const optimizePlanForBudget = (
    dailyPlans: DailyPlan[], 
    hotel: Hotel, 
    budget: number, 
    duration: number
  ) => {
    let totalCost = hotel.cost * duration;
    const optimizedPlans = dailyPlans.map(plan => ({ ...plan }));
    
    // Calculate current total cost
    optimizedPlans.forEach(plan => {
      totalCost += plan.totalCost;
    });
    
    // If still over budget, remove expensive activities
    if (totalCost > budget) {
      const excessAmount = totalCost - budget;
      let savedAmount = 0;
      
      for (const plan of optimizedPlans) {
        if (savedAmount >= excessAmount) break;
        
        // Sort activities by cost (highest first) and remove expensive ones
        const expensiveActivities = plan.schedule
          .filter(item => item.type === 'Activity' && item.cost && item.cost > 50)
          .sort((a, b) => (b.cost || 0) - (a.cost || 0));
        
        for (const activity of expensiveActivities) {
          if (savedAmount >= excessAmount) break;
          
          // Remove this activity
          const index = plan.schedule.indexOf(activity);
          if (index > -1) {
            plan.schedule.splice(index, 1);
            plan.totalCost -= activity.cost || 0;
            savedAmount += activity.cost || 0;
          }
        }
      }
    }
    
    // Recalculate total cost
    totalCost = hotel.cost * duration;
    optimizedPlans.forEach(plan => {
      totalCost += plan.totalCost;
    });
    
    return {
      hotel,
      dailyPlans: optimizedPlans,
      restaurants: restaurants.filter(r => r.budget === 'Budget'), // Use budget restaurants
      totalCost,
      totalDuration: optimizedPlans.reduce((sum, plan) => sum + plan.totalDuration, 0),
      budget,
    };
  };

  // Fallback function for basic plan generation
  const generateBasicPlan = (duration: number, budget: number, transportationModes: string[] = ['Woro-Woro (Shared Taxi)']) => {
    
    // Select cheapest hotel
    const cheapestHotel = hotels
      .filter(h => h.city === 'Abidjan')
      .sort((a, b) => a.cost - b.cost)[0];
    
    const dailyPlans: DailyPlan[] = [];
    const remainingBudgetPerDay = Math.max((budget - cheapestHotel.cost * duration) / duration, 30);
    
    for (let day = 1; day <= duration; day++) {
      const basicSchedule: ItineraryItem[] = [];
      let dailyCost = 0;
      
      // Add basic activities within budget
      const affordableActivities = activities
        .filter(a => a.city === 'Abidjan' && a.cost <= remainingBudgetPerDay * 0.7)
        .sort((a, b) => a.cost - b.cost);
      
      if (affordableActivities.length > 0) {
        const activity = affordableActivities[0];
        basicSchedule.push({
          time: '10:00',
          description: activity.name,
          type: 'Activity',
          details: activity,
          duration: activity.durationHours,
          cost: activity.cost,
          city: 'Abidjan',
        });
        dailyCost += activity.cost;
      }
      
      // Add affordable meal
      const affordableRestaurant = restaurants
        .filter(r => r.city === 'Abidjan' && r.cost <= remainingBudgetPerDay * 0.3)
        .sort((a, b) => a.cost - b.cost)[0];
      
      if (affordableRestaurant) {
        basicSchedule.push({
          time: '12:00',
          description: `Lunch at ${affordableRestaurant.name}`,
          type: 'Meal',
          details: affordableRestaurant,
          duration: 1,
          cost: affordableRestaurant.cost,
          city: 'Abidjan',
        });
        dailyCost += affordableRestaurant.cost;
      }
      
      dailyPlans.push({
        day,
        city: 'Abidjan',
        schedule: basicSchedule,
        totalCost: dailyCost,
        totalDuration: basicSchedule.reduce((sum, item) => sum + (item.duration || 0), 0),
      });
    }
    
    // Calculate transportation costs for basic plan
    const hasPrivateCar = transportationModes.includes('Private Car with Driver');
    const privateCarCost = hasPrivateCar ? 
      transportationOptions.find(t => t.type === 'Private Car with Driver')?.costPerDay || 70 : 0;
    const totalPrivateCarCost = privateCarCost * duration;
    
    const basePlanCost = cheapestHotel.cost * duration + dailyPlans.reduce((sum, plan) => sum + plan.totalCost, 0);
    
    setPlan({
      hotel: cheapestHotel,
      dailyPlans,
      restaurants: restaurants.filter(r => r.budget === 'Budget'),
      totalCost: basePlanCost + totalPrivateCarCost,
      totalDuration: dailyPlans.reduce((sum, plan) => sum + plan.totalDuration, 0),
      budget,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-white/20 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 max-w-6xl">
          <div className="text-center">
            <h1 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              {t('app.title')}
            </h1>
            <p className="text-sm md:text-lg text-gray-600 max-w-3xl mx-auto">
              {t('app.subtitle')}
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 md:py-8 max-w-6xl">
        <div className="space-y-6 md:space-y-8">
          <section aria-label="Trip Planning with Settings">
            <PlannerWithSettings onPlanRequest={generatePlan} isLoading={isLoading} />
          </section>
          {isLoading ? (
            <section aria-label="Loading" aria-live="polite">
              <Loading message={t('form.generating', 'Generating your perfect trip...')} />
            </section>
          ) : (
            <section aria-label="Trip Itinerary">
              <TripPlan plan={plan} />
            </section>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white/60 backdrop-blur-md border-t border-white/20 mt-16">
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left"> 
            {/* About *
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">About</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Discover the beauty of Côte d'Ivoire with our intelligent trip planning platform. 
                Experience beaches, culture, and nightlife with optimized itineraries.
              </p>
            </div>
            
            {/* Features 
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Features</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>🗺️ Geolocation-based planning</li>
                <li>💱 Multi-currency support</li>
                <li>🌍 Bilingual interface</li>
                <li>🏖️ Beach & nightlife experiences</li>
              </ul>
            </div>
            
            {/* Contact 
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Contact</h3>
              <div className="space-y-2">
                <a 
                  href="mailto:contact@ivorycoasttrips.com" 
                  className="flex items-center justify-center md:justify-start gap-2 text-sm text-blue-600 hover:text-blue-700 transition-colors"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                  contact@ivorycoasttrips.com
                </a>
                <p className="text-xs text-gray-500">
                  For support, suggestions, or partnerships
                </p>
              </div>
            </div>
          </div>*/}
          
          {/* Bottom Bar */}
          <div className="border-t border-gray-200 mt-6 pt-6 text-center">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <p className="text-sm text-gray-600">
                © 2024 Ivory Coast Trip Planner. Made with ❤️ by <a 
                  href="mailto:mowamedbakus@gmail.com" 
                  className="gap-2 text-sm text-blue-600 hover:text-blue-700 transition-colors"
                >
                  Moh
                </a> for travelers exploring Côte d'Ivoire.
              </p>
              <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
                <span>🇨🇮 Proudly supporting Ivorian tourism</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <CurrencyProvider>
      <AppContent />
    </CurrencyProvider>
  );
};

export default App;