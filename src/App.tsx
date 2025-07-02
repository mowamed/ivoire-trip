import React, { useState } from 'react';
import PlannerForm from './components/PlannerForm';
import TripPlan from './components/TripPlan';
import { hotels, activities, restaurants, travelTimes, Hotel, Activity, Restaurant } from './data';
import './App.css';

interface ItineraryItem {
  time: string;
  description: string;
  type: 'Activity' | 'Meal' | 'Transportation' | 'Travel';
  details?: Activity | Restaurant;
  duration?: number;
  cost?: number;
  city?: string;
}

interface DailyPlan {
  day: number;
  city: string;
  schedule: ItineraryItem[];
  totalCost: number;
  totalDuration: number;
}

const App: React.FC = () => {
  const [plan, setPlan] = useState<{
    hotel: Hotel | null;
    dailyPlans: DailyPlan[];
    restaurants: Restaurant[];
    totalCost: number;
    totalDuration: number;
  } | null>(null);

  const generatePlan = (duration: number, budget: number) => {
    const budgetPerDay = budget / duration;
    let currentCity = 'Abidjan';
    let remainingBudget = budget;

    const selectedHotel = hotels.find(h => h.city === currentCity && h.budget === 'Mid-Range') || hotels[0];
    remainingBudget -= selectedHotel.cost * duration;

    const dailyPlans: DailyPlan[] = [];
    let totalCost = selectedHotel.cost * duration;
    let totalDuration = 0;

    for (let day = 1; day <= duration; day++) {
      let dailyCost = 0;
      let dailyDuration = 0;
      const schedule: ItineraryItem[] = [];
      let currentTime = 9; // Start day at 9 AM

      if (day > 1) {
        const availableCities = Object.keys(travelTimes[currentCity]).filter(city => city !== currentCity);
        const nextCity = availableCities[Math.floor(Math.random() * availableCities.length)];
        const travelTime = travelTimes[currentCity][nextCity];

        schedule.push({
          time: `${currentTime}:00`,
          description: `Travel from ${currentCity} to ${nextCity}`,
          type: 'Travel',
          duration: travelTime,
          cost: 50, // Placeholder for travel cost
          city: nextCity,
        });

        currentTime += travelTime;
        dailyDuration += travelTime;
        dailyCost += 50;
        currentCity = nextCity;
      }

      const morningActivities = activities.filter(a => a.city === currentCity && a.bestTime === 'Morning');
      const afternoonActivities = activities.filter(a => a.city === currentCity && a.bestTime === 'Afternoon');
      const eveningActivities = activities.filter(a => a.city === currentCity && a.bestTime === 'Evening');

      const addActivity = (activity: Activity) => {
        schedule.push({
          time: `${currentTime}:00`,
          description: activity.name,
          type: 'Activity',
          details: activity,
          duration: activity.durationHours,
          cost: activity.cost,
          city: currentCity,
        });
        currentTime += activity.durationHours;
        dailyDuration += activity.durationHours;
        dailyCost += activity.cost;
      };

      if (morningActivities.length > 0) {
        addActivity(morningActivities[Math.floor(Math.random() * morningActivities.length)]);
      }

      const lunch = restaurants.find(r => r.city === currentCity && r.bestTime === 'Lunch');
      if (lunch) {
        schedule.push({
          time: `${currentTime}:00`,
          description: `Lunch at ${lunch.name}`,
          type: 'Meal',
          details: lunch,
          duration: 1,
          cost: lunch.cost,
          city: currentCity,
        });
        currentTime += 1;
        dailyDuration += 1;
        dailyCost += lunch.cost;
      }

      if (afternoonActivities.length > 0) {
        addActivity(afternoonActivities[Math.floor(Math.random() * afternoonActivities.length)]);
      }

      if (eveningActivities.length > 0 && currentTime < 20) {
        addActivity(eveningActivities[Math.floor(Math.random() * eveningActivities.length)]);
      }

      dailyPlans.push({
        day,
        city: currentCity,
        schedule,
        totalCost: dailyCost,
        totalDuration: dailyDuration,
      });

      totalCost += dailyCost;
      totalDuration += dailyDuration;
    }

    setPlan({
      hotel: selectedHotel,
      dailyPlans,
      restaurants: restaurants.filter(r => r.budget === 'Mid-Range'),
      totalCost,
      totalDuration,
    });
  };

  return (
    <div className="container mt-5">
      <PlannerForm onPlanRequest={generatePlan} />
      <TripPlan plan={plan} />
    </div>
  );
};

export default App;