import React from 'react';
import type { Hotel, Activity, Restaurant, Transportation } from '../data';

interface ItineraryItem {
  time: string;
  description: string;
  type: 'Activity' | 'Meal' | 'Transportation' | 'Travel';
  details?: Activity | Restaurant | Transportation;
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

interface Props {
  plan: {
    hotel: Hotel | null;
    dailyPlans: DailyPlan[];
    restaurants: Restaurant[];
    totalCost: number;
    totalDuration: number;
  } | null;
}

const TripPlan: React.FC<Props> = ({ plan }) => {
  if (!plan) {
    return null;
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'Activity':
        return 'fas fa-camera';
      case 'Meal':
        return 'fas fa-utensils';
      case 'Travel':
        return 'fas fa-plane';
      default:
        return 'fas fa-question';
    }
  };

  return (
    <div className="container py-5">
      <div className="row text-center mb-5">
        <div className="col-lg-8 mx-auto">
          <h1 className="display-4">Your Custom Itinerary</h1>
          <p className="lead text-muted">A personalized travel plan for your Ivory Coast adventure.</p>
        </div>
      </div>

      <div className="row mb-4">
        <div className="col-md-6">
          <div className="card shadow-sm">
            <div className="card-body">
              <h3 className="h5">Total Cost: ${plan.totalCost.toFixed(2)}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card shadow-sm">
            <div className="card-body">
              <h3 className="h5">Total Duration: {plan.totalDuration} hours</h3>
            </div>
          </div>
        </div>
      </div>

      {plan.hotel && (
        <div className="mb-4">
          <h3 className="h5">Accommodation</h3>
          <div className="card shadow-sm">
            <div className="card-body">
              <h4 className="card-title">{plan.hotel.name} ({plan.hotel.city})</h4>
              <p className="card-text">{plan.hotel.description}</p>
              <span className={`badge bg-success`}>{plan.hotel.budget}</span>
              <span className="ms-2">${plan.hotel.cost} per night</span>
            </div>
          </div>
        </div>
      )}

      <div className="timeline">
        {plan.dailyPlans.map((dailyPlan) => (
          <div className="timeline-item" key={dailyPlan.day}>
            <div className="timeline-marker"></div>
            <div className="timeline-content">
              <div className="card shadow-sm">
                <div className="card-header">
                  <h4 className="card-title">Day {dailyPlan.day} - {dailyPlan.city}</h4>
                  <p className="card-subtitle text-muted">Total Duration: {dailyPlan.totalDuration} hours | Total Cost: ${dailyPlan.totalCost.toFixed(2)}</p>
                </div>
                <div className="card-body">
                  <ul className="list-group list-group-flush">
                    {dailyPlan.schedule.map((item, index) => (
                      <li className="list-group-item d-flex justify-content-between align-items-center" key={index}>
                        <div>
                          <i className={`${getIcon(item.type)} me-2`}></i>
                          <strong>{item.time}</strong> - {item.description}
                        </div>
                        <div>
                          {item.cost && <span className="badge bg-info ms-2">${item.cost}</span>}
                          {item.duration && <span className="badge bg-secondary ms-2">{item.duration} hours</span>}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5">
        <h3 className="h5">General Dining Suggestions</h3>
        <div className="row">
          {plan.restaurants.map((restaurant) => (
            <div className="col-md-6 mb-3" key={restaurant.name}>
              <div className="card h-100 shadow-sm">
                <div className="card-body">
                  <h4 className="card-title">{restaurant.name} ({restaurant.city})</h4>
                  <p className="card-text">Cuisine: {restaurant.cuisine}</p>
                  <span className={`badge bg-success`}>{restaurant.budget}</span>
                  <span className="ms-2">${restaurant.cost}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TripPlan;
