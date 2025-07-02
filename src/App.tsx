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

  // Helper function to plan the route through cities
  const planCitiesRoute = (duration: number): string[] => {
    const route: string[] = [];
    
    if (duration <= 3) {
      // Short trip: Stay in Abidjan with day trips
      for (let i = 0; i < duration; i++) {
        if (i === 0) route.push('Abidjan');
        else if (i === 1) route.push('Grand-Bassam');
        else route.push('Assinie');
      }
    } else if (duration <= 7) {
      // Medium trip: Abidjan + 2-3 other cities
      route.push('Abidjan', 'Grand-Bassam', 'Yamoussoukro', 'Man');
      while (route.length < duration) {
        route.push('Abidjan'); // Return to Abidjan for remaining days
      }
    } else {
      // Long trip: Visit more cities
      const cities = ['Abidjan', 'Grand-Bassam', 'Assinie', 'Yamoussoukro', 'Man', 'Sassandra', 'Taï'];
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

    // Morning activity
    if (currentTime < 12) {
      const morningActivities = activities.filter(a => 
        a.city === city && 
        a.bestTime === 'Morning' && 
        !visitedActivities.includes(a.name) &&
        a.budget === budgetCategory
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

    // Afternoon activity
    if (currentTime < 17) {
      const afternoonActivities = activities.filter(a => 
        a.city === city && 
        a.bestTime === 'Afternoon' && 
        !visitedActivities.includes(a.name) &&
        a.budget === budgetCategory
      );
      
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

    // Evening activity or dinner
    if (currentTime < 20) {
      const eveningActivities = activities.filter(a => 
        a.city === city && 
        a.bestTime === 'Evening' && 
        !visitedActivities.includes(a.name) &&
        a.budget === budgetCategory
      );
      
      if (eveningActivities.length > 0 && currentTime < 19) {
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
      } else {
        // Dinner
        const dinnerOptions = restaurants.filter(r => 
          r.city === city && 
          r.bestTime === 'Dinner' &&
          r.budget === budgetCategory
        );
        
        if (dinnerOptions.length > 0) {
          const restaurant = dinnerOptions[Math.floor(Math.random() * dinnerOptions.length)];
          schedule.push({
            time: `${Math.max(currentTime, 19)}:00`,
            description: `Dinner at ${restaurant.name}`,
            type: 'Meal',
            details: restaurant,
            duration: 2,
            cost: restaurant.cost,
            city: city,
          });
          dailyDuration += 2;
          dailyCost += restaurant.cost;
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