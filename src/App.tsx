import React, { useState } from 'react';
import PlannerForm from './components/PlannerForm';
import TripPlan from './components/TripPlan';
import { hotels, activities, restaurants, transportationOptions, Hotel, Activity, Restaurant, Transportation } from './data';
import './App.css';

interface ItineraryItem {
  time: string;
  description: string;
  type: 'Activity' | 'Meal' | 'Transportation';
  details?: Activity | Restaurant | Transportation;
}

interface DailyPlan {
  day: number;
  schedule: ItineraryItem[];
}

interface TripPlanData {
  hotel: Hotel | null;
  dailyPlans: DailyPlan[];
  restaurants: Restaurant[]; // Still keep this for general suggestions
}

const App: React.FC = () => {
  const [plan, setPlan] = useState<TripPlanData | null>(null);

  const generatePlan = (duration: number, budget: number) => {
    const budgetPerDay = budget / duration;

    let budgetCategory: 'Budget' | 'Mid-Range' | 'Luxury';
    if (budgetPerDay < 100) {
      budgetCategory = 'Budget';
    } else if (budgetPerDay < 200) {
      budgetCategory = 'Mid-Range';
    } else {
      budgetCategory = 'Luxury';
    }

    const selectedHotel = hotels.find(h => h.budget === budgetCategory) || null;
    const suitableActivities = activities.filter(a => a.budget === budgetCategory);
    const suitableRestaurants = restaurants.filter(r => r.budget === budgetCategory);
    const suitableTransportation = transportationOptions.filter(t => t.budget === budgetCategory);

    const dailyPlans: DailyPlan[] = [];

    for (let day = 1; day <= duration; day++) {
      const schedule: ItineraryItem[] = [];
      let currentTime = 8; // Start at 8 AM

      // Breakfast
      const breakfast = suitableRestaurants.find(r => r.bestTime === 'Breakfast');
      if (breakfast) {
        schedule.push({ time: `${currentTime}:00`, description: `Breakfast at ${breakfast.name}`, type: 'Meal', details: breakfast });
        currentTime += 1; // 1 hour for breakfast
      }

      // Morning Activity
      const morningActivity = suitableActivities.find(a => a.bestTime === 'Morning' && a.durationHours <= (12 - currentTime));
      if (morningActivity) {
        schedule.push({ time: `${currentTime}:00`, description: morningActivity.name, type: 'Activity', details: morningActivity });
        currentTime += morningActivity.durationHours;
        // Add transportation if needed (simple logic for now)
        if (suitableTransportation.length > 0) {
          schedule.push({ time: `${currentTime}:00`, description: `Travel by ${suitableTransportation[0].type}`, type: 'Transportation', details: suitableTransportation[0] });
          currentTime += 1; // Assume 1 hour travel
        }
      }

      // Lunch
      const lunch = suitableRestaurants.find(r => r.bestTime === 'Lunch');
      if (lunch) {
        schedule.push({ time: `${currentTime}:00`, description: `Lunch at ${lunch.name}`, type: 'Meal', details: lunch });
        currentTime += 1; // 1 hour for lunch
      }

      // Afternoon Activity
      const afternoonActivity = suitableActivities.find(a => a.bestTime === 'Afternoon' && a.durationHours <= (18 - currentTime));
      if (afternoonActivity) {
        schedule.push({ time: `${currentTime}:00`, description: afternoonActivity.name, type: 'Activity', details: afternoonActivity });
        currentTime += afternoonActivity.durationHours;
        // Add transportation if needed
        if (suitableTransportation.length > 0) {
          schedule.push({ time: `${currentTime}:00`, description: `Travel by ${suitableTransportation[0].type}`, type: 'Transportation', details: suitableTransportation[0] });
          currentTime += 1; // Assume 1 hour travel
        }
      }

      // Dinner
      const dinner = suitableRestaurants.find(r => r.bestTime === 'Dinner');
      if (dinner) {
        schedule.push({ time: `${currentTime}:00`, description: `Dinner at ${dinner.name}`, type: 'Meal', details: dinner });
        currentTime += 1; // 1 hour for dinner
      }

      // Evening Activity/Nightlife
      const eveningActivity = suitableActivities.find(a => a.bestTime === 'Evening' && a.durationHours <= (24 - currentTime));
      if (eveningActivity) {
        schedule.push({ time: `${currentTime}:00`, description: eveningActivity.name, type: 'Activity', details: eveningActivity });
        currentTime += eveningActivity.durationHours;
      }

      dailyPlans.push({ day, schedule });
    }

    setPlan({
      hotel: selectedHotel,
      dailyPlans,
      restaurants: suitableRestaurants, // Keep for general suggestions
    });
  };

  return (
    <div className="container mt-5">
      <header className="text-center mb-5">
        <h1 className="display-4">Ivoire Trip Planner</h1>
        <p className="lead">Your personalized adventure in Ivory Coast awaits</p>
      </header>
      <main>
        <div className="row">
          <div className="col-lg-4">
            <PlannerForm onPlanRequest={generatePlan} />
          </div>
          <div className="col-lg-8">
            {plan ? <TripPlan plan={plan} /> : (
              <div className="card shadow-sm">
                <div className="card-body text-center">
                  <p className="text-muted">Enter your trip details to generate a plan.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      <footer className="text-center mt-5">
        <p className="text-muted">Made with ❤️ for a memorable trip</p>
      </footer>
    </div>
  );
};

export default App;