
import React, { useState } from 'react';
import PlannerForm from './components/PlannerForm';
import TripPlan from './components/TripPlan';
import { hotels, activities, restaurants, Hotel, Activity, Restaurant } from './data';
import './App.css';

interface TripPlanData {
  hotel: Hotel | null;
  itinerary: { day: number; activity: Activity }[];
  restaurants: Restaurant[];
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
    const selectedRestaurants = restaurants.filter(r => r.budget === budgetCategory);

    const itinerary = [];
    for (let i = 0; i < duration; i++) {
      itinerary.push({
        day: i + 1,
        activity: suitableActivities[i % suitableActivities.length],
      });
    }

    setPlan({
      hotel: selectedHotel,
      itinerary,
      restaurants: selectedRestaurants,
    });
  };

  return (
    <div className="bg-light min-h-screen font-sans">
      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        <header className="text-center mb-12">
          <h1 className="text-5xl font-extrabold text-dark">Ivoire Trip Planner</h1>
          <p className="mt-3 text-lg text-gray-600">Your personalized adventure in Ivory Coast awaits</p>
        </header>
        <main>
          <div className="flex flex-col lg:flex-row lg:space-x-12">
            <div className="lg:w-1/3">
              <PlannerForm onPlanRequest={generatePlan} />
            </div>
            <div className="lg:w-2/3">
              {plan ? <TripPlan plan={plan} /> : (
                <div className="bg-white shadow-lg rounded-xl p-8 text-center">
                  <p className="text-gray-500">Enter your trip details to generate a plan.</p>
                </div>
              )}
            </div>
          </div>
        </main>
        <footer className="text-center mt-12">
          <p className="text-gray-500">Made with ❤️ for a memorable trip</p>
        </footer>
      </div>
    </div>
  );
};

export default App;
