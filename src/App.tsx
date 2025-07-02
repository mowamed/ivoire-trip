import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import PlannerForm from './components/PlannerForm';
import TripPlan from './components/TripPlan';
import SettingsPanel from './components/SettingsPanel';
import { Loading } from './components/ui/loading';
import { CurrencyProvider } from './contexts/CurrencyContext';
import { hotels, activities, restaurants, travelTimes } from './data';
import type { Hotel, Activity, Restaurant, Geolocation } from './data';
import './App.css';

interface ItineraryItem {
  time: string;
  description: string;
  type: 'Activity' | 'Meal' | 'Transportation' | 'Travel' | 'Airport' | 'Hotel';
  details?: Activity | Restaurant;
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

  const generatePlan = async (duration: number, budget: number) => {
    setIsLoading(true);
    
    // Add a small delay to show loading state
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    try {
      // Determine budget category based on budget per day
      const budgetPerDay = budget / duration;
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
      
      // Select hotel within budget
      const availableHotels = hotels.filter(h => h.city === 'Abidjan').sort((a, b) => a.cost - b.cost);
      let selectedHotel = availableHotels.find(h => h.budget === budgetCategory);
      
      // If no hotel in budget category, find the most affordable option
      if (!selectedHotel) {
        selectedHotel = availableHotels.find(h => h.cost * duration <= budget * 0.6); // Max 60% of budget for accommodation
      }
      
      // Fallback to cheapest hotel if still over budget
      if (!selectedHotel) {
        selectedHotel = availableHotels[0];
      }

      const hotelCost = selectedHotel.cost * duration;
      let remainingBudget = budget - hotelCost;
      const dailyBudget = remainingBudget / duration;

      // If hotel cost exceeds 70% of budget, adjust to a cheaper option
      if (hotelCost > budget * 0.7) {
        selectedHotel = availableHotels.find(h => h.cost * duration <= budget * 0.5) || availableHotels[0];
        remainingBudget = budget - (selectedHotel.cost * duration);
      }

      const dailyPlans: DailyPlan[] = [];
      let totalCost = selectedHotel.cost * duration;
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
          remainingBudget
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
      if (totalCost > budget) {
        const optimizedPlan = optimizePlanForBudget(dailyPlans, selectedHotel, budget, duration);
        setPlan(optimizedPlan);
      } else {
        setPlan({
          hotel: selectedHotel,
          dailyPlans,
          restaurants: restaurants.filter(r => r.budget === budgetCategory),
          totalCost,
          totalDuration,
          budget,
        });
      }
    } catch (error) {
      console.error('Error generating plan:', error);
      // Fallback to a basic plan if something goes wrong
      generateBasicPlan(duration, budget);
    }
    
    setIsLoading(false);
  };

  // Helper function to plan the route through cities (prioritizing beach destinations)
  const planCitiesRoute = (duration: number): string[] => {
    const route: string[] = [];
    
    if (duration <= 3) {
      // Short trip: Focus on Abidjan and nearby beaches
      route.push('Abidjan'); // Start in Abidjan for nightlife
      if (duration > 1) route.push('Grand-Bassam'); // Beach day
      if (duration > 2) route.push('Assinie'); // Premium beach experience
    } else if (duration <= 7) {
      // Medium trip: Mix of beaches, nightlife, and culture
      route.push('Abidjan'); // Nightlife and city experience
      route.push('Grand-Bassam'); // Historic beach town
      route.push('Assinie'); // Luxury beach resort
      if (duration > 3) route.push('Abidjan'); // Return for more nightlife
      if (duration > 4) route.push('Yamoussoukro'); // Cultural experience
      if (duration > 5) route.push('Sassandra'); // More beaches
      if (duration > 6) route.push('Abidjan'); // Final night out
    } else {
      // Long trip: Comprehensive tour with emphasis on beaches and nightlife
      const cities = ['Abidjan', 'Grand-Bassam', 'Assinie', 'Abidjan', 'Sassandra', 'Yamoussoukro', 'Man', 'Abidjan'];
      for (let i = 0; i < duration; i++) {
        route.push(cities[i % cities.length]);
      }
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
    remainingBudget: number
  ): DailyPlan => {
    const schedule: ItineraryItem[] = [];
    let currentTime = 8; // Start earlier for first day (airport arrival)
    let dailyCost = 0;
    let dailyDuration = 0;
    let lastActivityLocation: Geolocation | null = null;
    let budgetUsed = 0;

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

    // Travel between cities (if not first day and city changed)
    if (day > 1 && citiesToVisit[day - 2] !== city) {
      const previousCity = citiesToVisit[day - 2];
      const travelTime = travelTimes[previousCity]?.[city] || 2;
      const travelCost = calculateTravelCost(previousCity, city, budgetCategory);

      schedule.push({
        time: `${currentTime}:00`,
        description: `Travel from ${previousCity} to ${city}`,
        type: 'Travel',
        duration: travelTime,
        cost: travelCost,
        city: city,
      });
      currentTime += travelTime;
      dailyDuration += travelTime;
      dailyCost += travelCost;
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

    return {
      day,
      city,
      schedule,
      totalCost: dailyCost,
      totalDuration: dailyDuration,
    };
  };

  // Helper function to calculate travel cost based on distance and budget
  const calculateTravelCost = (fromCity: string, toCity: string, budgetCategory: string): number => {
    const distance = travelTimes[fromCity]?.[toCity] || 2;
    const baseCost = distance * 15; // Base cost per hour of travel
    
    switch (budgetCategory) {
      case 'Budget':
        return baseCost * 0.7; // Public transport/shared taxi
      case 'Mid-Range':
        return baseCost; // Private taxi/VTC
      case 'Luxury':
        return baseCost * 2; // Private car with driver
      default:
        return baseCost;
    }
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
  const generateBasicPlan = (duration: number, budget: number) => {
    
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
    
    setPlan({
      hotel: cheapestHotel,
      dailyPlans,
      restaurants: restaurants.filter(r => r.budget === 'Budget'),
      totalCost: cheapestHotel.cost * duration + dailyPlans.reduce((sum, plan) => sum + plan.totalCost, 0),
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
          <section aria-label="Settings">
            <SettingsPanel />
          </section>
          <section aria-label="Trip Planning Form">
            <PlannerForm onPlanRequest={generatePlan} isLoading={isLoading} />
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