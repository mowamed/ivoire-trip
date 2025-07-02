import React from 'react';
import { Hotel, Activity, Restaurant } from '../data';

interface Props {
  plan: {
    hotel: Hotel | null;
    itinerary: { day: number; activity: Activity }[];
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
          <h3 className="h5">Day-by-Day Itinerary</h3>
          <div className="accordion" id="itineraryAccordion">
            {plan.itinerary.map(({ day, activity }) => (
              <div className="accordion-item" key={day}>
                <h2 className="accordion-header" id={`heading${day}`}>
                  <button
                    className="accordion-button collapsed" 
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target={`#collapse${day}`}
                    aria-expanded="false"
                    aria-controls={`collapse${day}`}
                  >
                    Day {day}: {activity.name}
                  </button>
                </h2>
                <div
                  id={`collapse${day}`}
                  className="accordion-collapse collapse"
                  aria-labelledby={`heading${day}`}
                  data-bs-parent="#itineraryAccordion"
                >
                  <div className="accordion-body">
                    <div className="row">
                      <div className="col-md-6">
                        <img src={activity.imageUrl} className="img-fluid rounded mb-3" alt={activity.name} />
                        {activity.videoUrl && (
                          <div className="ratio ratio-16x9">
                            <iframe src={activity.videoUrl} title={activity.name} allowFullScreen></iframe>
                          </div>
                        )}
                      </div>
                      <div className="col-md-6">
                        <p>{activity.description}</p>
                        <span className={`badge bg-info me-2`}>{activity.type}</span>
                        <span className={`badge bg-success`}>{activity.budget}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="h5">Dining Suggestions</h3>
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