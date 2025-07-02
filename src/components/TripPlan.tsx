import React from 'react';
import type { Hotel, Activity, Restaurant, Transportation } from '../data';

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

interface Props {
  plan: {
    hotel: Hotel | null;
    dailyPlans: DailyPlan[];
    restaurants: Restaurant[];
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

        {plan.hotel && (
          <div className="mb-4">
            <h3 className="h5">Accommodation</h3>
            <div className="card">
              <div className="card-body">
                <h4 className="card-title">{plan.hotel.name}</h4>
                <p className="card-text">{plan.hotel.description}</p>
                <span className={`badge bg-success`}>{plan.hotel.budget}</span>
              </div>
            </div>
          </div>
        )}

        <div className="mb-4">
          <h3 className="h5">Daily Itinerary</h3>
          <div className="accordion" id="dailyItineraryAccordion">
            {plan.dailyPlans.map((dailyPlan) => (
              <div className="accordion-item" key={dailyPlan.day}>
                <h2 className="accordion-header" id={`headingDay${dailyPlan.day}`}>
                  <button
                    className="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target={`#collapseDay${dailyPlan.day}`}
                    aria-expanded="false"
                    aria-controls={`collapseDay${dailyPlan.day}`}
                  >
                    Day {dailyPlan.day}
                  </button>
                </h2>
                <div
                  id={`collapseDay${dailyPlan.day}`}
                  className="accordion-collapse collapse"
                  aria-labelledby={`headingDay${dailyPlan.day}`}
                  data-bs-parent="#dailyItineraryAccordion"
                >
                  <div className="accordion-body">
                    <ul className="list-group">
                      {dailyPlan.schedule.map((item, index) => (
                        <li className="list-group-item" key={index}>
                          <strong>{item.time}</strong> - {item.description}
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
                    <h4 className="card-title">{restaurant.name}</h4>
                    <p className="card-text">Cuisine: {restaurant.cuisine}</p>
                    <span className={`badge bg-success`}>{restaurant.budget}</span>
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
