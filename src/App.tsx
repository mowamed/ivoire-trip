
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
