import React from 'react';
import type { Hotel, Activity, Restaurant, Transportation } from '../data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { MapPin, Clock, DollarSign, Camera, Utensils, Plane, Hotel as HotelIcon, Calendar } from 'lucide-react';

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
        return <Camera className="h-4 w-4" />;
      case 'Meal':
        return <Utensils className="h-4 w-4" />;
      case 'Travel':
        return <Plane className="h-4 w-4" />;
      default:
        return <MapPin className="h-4 w-4" />;
    }
  };

  const getBudgetVariant = (budget: string) => {
    switch (budget) {
      case 'Budget':
        return 'secondary' as const;
      case 'Mid-Range':
        return 'default' as const;
      case 'Luxury':
        return 'warning' as const;
      default:
        return 'secondary' as const;
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Your Custom Itinerary</h2>
        <p className="text-lg text-gray-600">A personalized travel plan for your Ivory Coast adventure</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <DollarSign className="h-8 w-8 text-green-600" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Total Cost</h3>
                <p className="text-2xl font-bold text-green-600">${plan.totalCost.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Clock className="h-8 w-8 text-blue-600" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Total Duration</h3>
                <p className="text-2xl font-bold text-blue-600">{plan.totalDuration} hours</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {plan.hotel && (
        <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HotelIcon className="h-5 w-5 text-purple-600" />
              Accommodation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <h4 className="text-xl font-semibold text-gray-900">{plan.hotel.name}</h4>
                <p className="text-gray-600 flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {plan.hotel.city}
                </p>
              </div>
              <p className="text-gray-700">{plan.hotel.description}</p>
              <div className="flex items-center gap-3">
                <Badge variant={getBudgetVariant(plan.hotel.budget)}>
                  {plan.hotel.budget}
                </Badge>
                <span className="text-lg font-semibold text-purple-600">
                  ${plan.hotel.cost} per night
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-6">
        <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Calendar className="h-6 w-6 text-primary-600" />
          Daily Itinerary
        </h3>
        <div className="timeline">
          {plan.dailyPlans.map((dailyPlan) => (
            <div className="timeline-item" key={dailyPlan.day}>
              <div className="timeline-marker bg-primary-600 border-white shadow-lg"></div>
              <div className="timeline-content">
                <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
                  <CardHeader className="bg-gradient-to-r from-primary-50 to-blue-50">
                    <CardTitle className="flex items-center justify-between">
                      <span className="text-xl">Day {dailyPlan.day} - {dailyPlan.city}</span>
                      <Badge variant="outline" className="text-primary-600 border-primary-600">
                        {dailyPlan.city}
                      </Badge>
                    </CardTitle>
                    <CardDescription className="flex items-center gap-4 text-base">
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {dailyPlan.totalDuration} hours
                      </span>
                      <span className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4" />
                        ${dailyPlan.totalCost.toFixed(2)}
                      </span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="space-y-0">
                      {dailyPlan.schedule.map((item, index) => (
                        <div 
                          key={index}
                          className={`p-4 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors ${
                            index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary-100 text-primary-600">
                                {getIcon(item.type)}
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="font-semibold text-primary-600">{item.time}</span>
                                  <span className="text-gray-400">•</span>
                                  <span className="font-medium text-gray-900">{item.description}</span>
                                </div>
                                {item.details && 'description' in item.details && (
                                  <p className="text-sm text-gray-600 mt-1">{item.details.description}</p>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {item.cost && (
                                <Badge variant="success" className="text-xs">
                                  ${item.cost}
                                </Badge>
                              )}
                              {item.duration && (
                                <Badge variant="secondary" className="text-xs">
                                  {item.duration}h
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Utensils className="h-6 w-6 text-primary-600" />
          Dining Recommendations
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {plan.restaurants.map((restaurant) => (
            <Card key={restaurant.name} className="h-full hover:shadow-lg transition-shadow duration-300 border-0 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="space-y-3">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">{restaurant.name}</h4>
                    <p className="text-gray-600 flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {restaurant.city}
                    </p>
                  </div>
                  <p className="text-gray-700">
                    <span className="font-medium">Cuisine:</span> {restaurant.cuisine}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-medium">Best time:</span> {restaurant.bestTime}
                  </p>
                  <div className="flex items-center justify-between">
                    <Badge variant={getBudgetVariant(restaurant.budget)}>
                      {restaurant.budget}
                    </Badge>
                    <span className="text-lg font-semibold text-green-600">
                      ${restaurant.cost}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TripPlan;
