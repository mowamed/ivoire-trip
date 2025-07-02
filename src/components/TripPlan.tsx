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
    <div className="bg-white shadow-lg rounded-xl p-8">
      <h2 className="text-3xl font-bold text-dark mb-6">Your Custom Itinerary</h2>

      {plan.hotel && (
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-dark mb-4">Accommodation</h3>
          <div className="bg-gray-50 rounded-xl p-6">
            <h4 className="text-xl font-bold text-dark">{plan.hotel.name}</h4>
            <p className="text-gray-600 mt-2">{plan.hotel.description}</p>
            <span className="inline-block bg-primary text-white text-sm font-semibold px-3 py-1 rounded-full mt-4 uppercase">{plan.hotel.budget}</span>
          </div>
        </div>
      )}

      <div className="mb-8">
        <h3 className="text-2xl font-bold text-dark mb-4">Day-by-Day Itinerary</h3>
        <div className="space-y-6">
          {plan.itinerary.map(({ day, activity }) => (
            <div key={day} className="bg-gray-50 rounded-xl p-6 transform hover:scale-105 transition-transform duration-300">
              <h4 className="text-xl font-bold text-dark">Day {day}: {activity.name}</h4>
              <div className="flex flex-col md:flex-row md:space-x-6 mt-4">
                <div className="md:w-1/2">
                  <img src={activity.imageUrl} className="rounded-lg shadow-md mb-4 md:mb-0" alt={activity.name} />
                  {activity.videoUrl && (
                    <div className="aspect-w-16 aspect-h-9 mt-4">
                      <iframe src={activity.videoUrl} title={activity.name} allowFullScreen className="rounded-lg shadow-md"></iframe>
                    </div>
                  )}
                </div>
                <div className="md:w-1/2">
                  <p className="text-gray-600">{activity.description}</p>
                  <div className="flex space-x-3 mt-4">
                    <span className="inline-block bg-blue-100 text-blue-800 text-sm font-semibold px-3 py-1 rounded-full uppercase">{activity.type}</span>
                    <span className="inline-block bg-green-100 text-green-800 text-sm font-semibold px-3 py-1 rounded-full uppercase">{activity.budget}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-2xl font-bold text-dark mb-4">Dining Suggestions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {plan.restaurants.map((restaurant) => (
            <div key={restaurant.name} className="bg-gray-50 rounded-xl p-6 transform hover:scale-105 transition-transform duration-300">
              <h4 className="text-xl font-bold text-dark">{restaurant.name}</h4>
              <p className="text-gray-600 mt-2">Cuisine: {restaurant.cuisine}</p>
              <span className="inline-block bg-green-100 text-green-800 text-sm font-semibold px-3 py-1 rounded-full mt-4 uppercase">{restaurant.budget}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TripPlan;