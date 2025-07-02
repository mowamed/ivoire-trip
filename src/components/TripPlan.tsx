import React from 'react';
import { useTranslation } from 'react-i18next';
import { useCurrency } from '../contexts/CurrencyContext';
import type { Hotel, Activity, Restaurant, Transportation } from '../data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { MapPin, Clock, DollarSign, Camera, Utensils, Plane, Hotel as HotelIcon, Calendar, Waves, Music } from 'lucide-react';

interface ItineraryItem {
  time: string;
  description: string;
  type: 'Activity' | 'Meal' | 'Transportation' | 'Travel' | 'Airport' | 'Hotel';
  details?: Activity | Restaurant | Transportation;
  duration?: number;
  cost?: number;
  city?: string;
  icon?: string;
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
  const { t } = useTranslation();
  const { formatPrice } = useCurrency();
  
  if (!plan) {
    return null;
  }

  const getIcon = (type: string, details?: any) => {
    // Check if it's a beach or nightlife activity
    if (details && details.type === 'Beach') {
      return <Waves className="h-4 w-4 text-blue-500" />;
    }
    if (details && details.type === 'Nightlife') {
      return <Music className="h-4 w-4 text-purple-500" />;
    }
    
    switch (type) {
      case 'Activity':
        return <Camera className="h-4 w-4" />;
      case 'Meal':
        return <Utensils className="h-4 w-4" />;
      case 'Travel':
        return <Plane className="h-4 w-4" />;
      case 'Airport':
        return <Plane className="h-4 w-4" />;
      case 'Hotel':
        return <HotelIcon className="h-4 w-4" />;
      case 'Transportation':
        return <MapPin className="h-4 w-4" />;
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

  const translateBudget = (budget: string) => {
    return t(`budget.${budget}`);
  };

  const translateCity = (city: string) => {
    return t(`cities.${city}`, city);
  };


  const translateTime = (time: string) => {
    return t(`time.${time}`, time);
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">{t('plan.title')}</h2>
        <p className="text-lg text-gray-600">{t('plan.subtitle')}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <DollarSign className="h-8 w-8 text-green-600" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{t('plan.totalCost')}</h3>
                <p className="text-2xl font-bold text-green-600">{formatPrice(plan.totalCost)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Clock className="h-8 w-8 text-blue-600" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{t('plan.totalDuration')}</h3>
                <p className="text-2xl font-bold text-blue-600">{plan.totalDuration} {t('plan.hours')}</p>
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
              {t('plan.accommodation')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <h4 className="text-xl font-semibold text-gray-900">{plan.hotel.name}</h4>
                <p className="text-gray-600 flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {translateCity(plan.hotel.city)}
                </p>
              </div>
              <p className="text-gray-700">{plan.hotel.description}</p>
              <div className="flex items-center gap-3">
                <Badge variant={getBudgetVariant(plan.hotel.budget)}>
                  {translateBudget(plan.hotel.budget)}
                </Badge>
                <span className="text-lg font-semibold text-purple-600">
                  {formatPrice(plan.hotel.cost)} {t('plan.perNight')}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-6">
        <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Calendar className="h-6 w-6 text-primary-600" />
          {t('plan.dailyItinerary')}
        </h3>
        <div className="timeline">
          {plan.dailyPlans.map((dailyPlan) => (
            <div className="timeline-item" key={dailyPlan.day}>
              <div className="timeline-marker bg-primary-600 border-white shadow-lg"></div>
              <div className="timeline-content">
                <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
                  <CardHeader className="bg-gradient-to-r from-primary-50 to-blue-50">
                    <CardTitle className="flex items-center justify-between">
                      <span className="text-xl">{t('plan.day')} {dailyPlan.day} - {translateCity(dailyPlan.city)}</span>
                      <Badge variant="outline" className="text-primary-600 border-primary-600">
                        {translateCity(dailyPlan.city)}
                      </Badge>
                    </CardTitle>
                    <CardDescription className="flex items-center gap-4 text-base">
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {dailyPlan.totalDuration} {t('plan.hours')}
                      </span>
                      <span className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4" />
                        {formatPrice(dailyPlan.totalCost)}
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
                                {getIcon(item.type, item.details)}
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
                                  {formatPrice(item.cost)}
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
          {t('plan.diningRecommendations')}
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
                      {translateCity(restaurant.city)}
                    </p>
                  </div>
                  <p className="text-gray-700">
                    <span className="font-medium">{t('plan.cuisine')}:</span> {restaurant.cuisine}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-medium">{t('plan.bestTime')}:</span> {translateTime(restaurant.bestTime)}
                  </p>
                  <div className="flex items-center justify-between">
                    <Badge variant={getBudgetVariant(restaurant.budget)}>
                      {translateBudget(restaurant.budget)}
                    </Badge>
                    <span className="text-lg font-semibold text-green-600">
                      {formatPrice(restaurant.cost)}
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
