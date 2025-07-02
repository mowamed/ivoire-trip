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
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4">Your Custom Itinerary</h2>

      {plan.hotel && (
        <div className="mb-6">
          <h3 className="text-xl font-bold mb-2">Accommodation</h3>
          <div className="bg-gray-100 rounded-lg p-4">
            <h4 className="text-lg font-bold">{plan.hotel.name}</h4>
            <p className="text-gray-700">{plan.hotel.description}</p>
            <span className="inline-block bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full uppercase">{plan.hotel.budget}</span>
          </div>
        </div>
      )}

      <div className="mb-6">
        <h3 className="text-xl font-bold mb-2">Day-by-Day Itinerary</h3>
        <div className="space-y-4">
          {plan.itinerary.map(({ day, activity }) => (
            <div key={day} className="bg-gray-100 rounded-lg p-4">
              <h4 className="text-lg font-bold">Day {day}: {activity.name}</h4>
              <div className="flex flex-col md:flex-row md:space-x-4 mt-2">
                <div className="md:w-1/2">
                  <img src={activity.imageUrl} className="rounded-lg mb-2" alt={activity.name} />
                  {activity.videoUrl && (
                    <div className="aspect-w-16 aspect-h-9">
                      <iframe src={activity.videoUrl} title={activity.name} allowFullScreen className="rounded-lg"></iframe>
                    </div>
                  )}
                </div>
                <div className="md:w-1/2">
                  <p className="text-gray-700">{activity.description}</p>
                  <div className="flex space-x-2 mt-2">
                    <span className="inline-block bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full uppercase">{activity.type}</span>
                    <span className="inline-block bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full uppercase">{activity.budget}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-xl font-bold mb-2">Dining Suggestions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {plan.restaurants.map((restaurant) => (
            <div key={restaurant.name} className="bg-gray-100 rounded-lg p-4">
              <h4 className="text-lg font-bold">{restaurant.name}</h4>
              <p className="text-gray-700">Cuisine: {restaurant.cuisine}</p>
              <span className="inline-block bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full uppercase">{restaurant.budget}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TripPlan;
