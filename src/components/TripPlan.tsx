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

  return (
    <div className="card shadow-sm">
      <div className="card-body">
        <h2 className="card-title h4 mb-3">Your Custom Itinerary</h2>

        <div className="row mb-4">
          <div className="col-md-6">
            <h3 className="h5">Total Cost: ${plan.totalCost.toFixed(2)}</h3>
          </div>
          <div className="col-md-6">
            <h3 className="h5">Total Duration: {plan.totalDuration} hours</h3>
          </div>
        </div>

        {plan.hotel && (
          <div className="mb-4">
            <h3 className="h5">Accommodation</h3>
            <div className="card">
              <div className="card-body">
                <h4 className="card-title">{plan.hotel.name} ({plan.hotel.city})</h4>
                <p className="card-text">{plan.hotel.description}</p>
                <span className={`badge bg-success`}>{plan.hotel.budget}</span>
                <span className="ms-2">${plan.hotel.cost} per night</span>
              </div>
            </div>
          </div>
        )}

        <div className="mb-4">
          <h3 className="h5">Daily Itinerary</h3>
          <div className="timeline">
            {plan.dailyPlans.map((dailyPlan) => (
              <div className="timeline-item" key={dailyPlan.day}>
                <div className="timeline-marker"></div>
                <div className="timeline-content">
                  <div className="card">
                    <div className="card-header">
                      <h4 className="card-title">Day {dailyPlan.day} - {dailyPlan.city}</h4>
                      <p className="card-subtitle text-muted">Total Duration: {dailyPlan.totalDuration} hours | Total Cost: ${dailyPlan.totalCost.toFixed(2)}</p>
                    </div>
                    <div className="card-body">
                      <ul className="list-group list-group-flush">
                        {dailyPlan.schedule.map((item, index) => (
                          <li className="list-group-item" key={index}>
                            <strong>{item.time}</strong> - {item.description}
                            {item.cost && <span className="badge bg-info ms-2">${item.cost}</span>}
                            {item.duration && <span className="badge bg-secondary ms-2">{item.duration} hours</span>}
                            {item.type === 'Activity' && item.details && (
                              <>
                                <br />
                                <img src={(item.details as Activity).imageUrl} className="img-fluid rounded mt-2" alt={(item.details as Activity).name} style={{ maxWidth: '200px' }} />
                                {(item.details as Activity).videoUrl && (
                                  <div className="ratio ratio-16x9 mt-2">
                                    <iframe src={(item.details as Activity).videoUrl} title={(item.details as Activity).name} allowFullScreen></iframe>
                                  </div>
                                )}
                              </>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="h5">General Dining Suggestions</h3>
          <div className="row">
            {plan.restaurants.map((restaurant) => (
              <div className="col-md-6 mb-3" key={restaurant.name}>
                <div className="card h-100">
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
    </div>
  );
};

export default TripPlan;
