import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import PlannerForm from './components/PlannerForm';
import TripPlan from './components/TripPlan';
import SettingsPanel from './components/SettingsPanel';
import { CurrencyProvider } from './contexts/CurrencyContext';
import { hotels, activities, restaurants, travelTimes } from './data';
import type { Hotel, Activity, Restaurant } from './data';
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
  const [plan, setPlan] = useState<{
    hotel: Hotel | null;
    dailyPlans: DailyPlan[];
    restaurants: Restaurant[];
    totalCost: number;
    totalDuration: number;
  } | null>(null);

  const generatePlan = (duration: number, budget: number) => {
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
    
    // Select hotel in main city (Abidjan)
    const selectedHotel = hotels.find(h => h.city === 'Abidjan' && h.budget === budgetCategory) || 
                         hotels.find(h => h.city === 'Abidjan') || hotels[0];

    const dailyPlans: DailyPlan[] = [];
    let totalCost = selectedHotel.cost * duration; // Hotel cost for all nights
    let totalDuration = 0;
    const visitedActivities: string[] = [];

    for (let day = 1; day <= duration; day++) {
      const cityForDay = citiesToVisit[day - 1];
      const dayPlan = generateDayPlan(day, duration, cityForDay, budgetCategory, visitedActivities, citiesToVisit);
      
      dailyPlans.push(dayPlan);
      totalCost += dayPlan.totalCost;
      totalDuration += dayPlan.totalDuration;
      
      // Add visited activities to avoid repetition
      dayPlan.schedule.forEach(item => {
        if (item.type === 'Activity' && item.details) {
          visitedActivities.push(item.details.name);
        }
      });
    }

    setPlan({
      hotel: selectedHotel,
      dailyPlans,
      restaurants: restaurants.filter(r => r.budget === budgetCategory),
      totalCost,
      totalDuration,
    });
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

  // Helper function to generate a single day plan
  const generateDayPlan = (
    day: number, 
    totalDays: number, 
    city: string, 
    budgetCategory: string, 
    visitedActivities: string[],
    citiesToVisit: string[]
  ): DailyPlan => {
    const schedule: ItineraryItem[] = [];
    let currentTime = 8; // Start earlier for first day (airport arrival)
    let dailyCost = 0;
    let dailyDuration = 0;

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
      schedule.push({
        time: `${currentTime}:00`,
        description: 'Transfer from airport to hotel',
        type: 'Transportation',
        duration: 1,
        cost: 30,
        city: 'Abidjan',
      });
      currentTime += 1;
      dailyDuration += 1;
      dailyCost += 30;

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
          const activity = morningActivities[Math.floor(Math.random() * morningActivities.length)];
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

    // Morning activity (prioritize beach activities)
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
        const activity = morningActivities[Math.floor(Math.random() * morningActivities.length)];
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
      }
    }

    // Lunch
    if (currentTime >= 12 && currentTime <= 14) {
      const lunchOptions = restaurants.filter(r => 
        r.city === city && 
        r.bestTime === 'Lunch' &&
        r.budget === budgetCategory
      );
      
      if (lunchOptions.length > 0) {
        const restaurant = lunchOptions[Math.floor(Math.random() * lunchOptions.length)];
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
      }
    }

    // Afternoon activity (continue beach or cultural activities)
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
        const activity = afternoonActivities[Math.floor(Math.random() * afternoonActivities.length)];
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
      }
    }

    // Evening activity (prioritize nightlife/clubbing) or dinner
    if (currentTime < 22) {
      let eveningActivities = activities.filter(a => 
        a.city === city && 
        a.bestTime === 'Evening' && 
        !visitedActivities.includes(a.name) &&
        a.budget === budgetCategory
      );
      
      // Prioritize nightlife activities in the evening, especially in Abidjan
      const nightlifeActivities = eveningActivities.filter(a => a.type === 'Nightlife');
      const isNightlifeCity = city === 'Abidjan' || city === 'Grand-Bassam';
      
      if (currentTime < 19) {
        // Early evening: dinner first
        const dinnerOptions = restaurants.filter(r => 
          r.city === city && 
          r.bestTime === 'Dinner' &&
          r.budget === budgetCategory
        );
        
        if (dinnerOptions.length > 0) {
          const restaurant = dinnerOptions[Math.floor(Math.random() * dinnerOptions.length)];
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
        }
      }
      
      // Late evening: nightlife activities (especially in nightlife cities)
      if (currentTime >= 19 && currentTime < 22) {
        if (isNightlifeCity && nightlifeActivities.length > 0) {
          const activity = nightlifeActivities[Math.floor(Math.random() * nightlifeActivities.length)];
          schedule.push({
            time: `${Math.max(currentTime, 21)}:00`,
            description: activity.name,
            type: 'Activity',
            details: activity,
            duration: activity.durationHours,
            cost: activity.cost,
            city: city,
          });
          dailyDuration += activity.durationHours;
          dailyCost += activity.cost;
        } else if (eveningActivities.length > 0) {
          // Fallback to other evening activities
          const activity = eveningActivities[Math.floor(Math.random() * eveningActivities.length)];
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            {t('app.title')}
          </h1>
          <p className="text-lg text-gray-600">
            {t('app.subtitle')}
          </p>
        </div>
        <SettingsPanel />
        <PlannerForm onPlanRequest={generatePlan} />
        <TripPlan plan={plan} />
      </div>
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