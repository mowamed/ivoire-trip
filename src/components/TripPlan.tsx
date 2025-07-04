import React from 'react';
import { useTranslation } from 'react-i18next';
import { getCityInfo, getLocalizedCityName, getCityDescription } from '../utils/cityUtils';
import { useCurrency } from '../contexts/CurrencyContext';
import type { Hotel, Activity, Restaurant, Transportation, Geolocation } from '../data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { BudgetAlert } from './ui/budget-alert';
import { ExportButton } from './ui/export-button';
import { MapPin, Clock, DollarSign, Camera, Utensils, Plane, Hotel as HotelIcon, Calendar, Waves, Music } from 'lucide-react';

interface ItineraryItem {
  time: string;
  description: string;
  type: 'Activity' | 'Meal' | 'Transportation' | 'Travel' | 'Airport' | 'Hotel' | 'Return';
  details?: Activity | Restaurant | Transportation | Hotel;
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
    budget?: number;
    accommodations?: { [key: string]: Hotel };
  } | null;
}

const TripPlan: React.FC<Props> = ({ plan }) => {
  const { t } = useTranslation();
  const { formatPrice } = useCurrency();
  
  if (!plan) {
    return null;
  }

  // Utility function to calculate distance between two points
  const calculateDistance = (point1: Geolocation, point2: Geolocation): number => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (point2.lat - point1.lat) * Math.PI / 180;
    const dLng = (point2.lng - point1.lng) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(point1.lat * Math.PI / 180) * Math.cos(point2.lat * Math.PI / 180) * 
      Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c; // Distance in kilometers
  };

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
      case 'Return':
        return <MapPin className="h-4 w-4 text-orange-500" />;
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
    const { i18n } = useTranslation();
    const currentLanguage = i18n.language as 'en' | 'fr';
    return getLocalizedCityName(city, currentLanguage) || t(`cities.${city}`, city);
  };


  const translateTime = (time: string) => {
    return t(`time.${time}`, time);
  };

  const translateCuisine = (cuisine: string) => {
    return t(`cuisineTypes.${cuisine}`, cuisine);
  };

  // const translateActivityType = (type: string) => {
  //   return t(`activityTypes.${type}`, type);
  // };

  const translateTransportation = (mode: string) => {
    return t(`transportation.${mode}`, mode);
  };

  const translateDescription = (description: string) => {
    // Handle translation keys from utility functions
    if (description.startsWith('common.')) {
      return t(description);
    }
    
    // Handle specific patterns for translation
    if (description.includes('Transportation within')) {
      const city = description.replace('Transportation within ', '');
      return t('common.transportationWithin', { city });
    }
    if (description.includes('Travel from') && description.includes(' to ') && description.includes(' via ')) {
      const match = description.match(/Travel from (.+) to (.+) via (.+)/);
      if (match) {
        return `${t('common.travelTo', { destination: match[2] })} ${t('common.via', { mode: translateTransportation(match[3]) })}`;
      }
    }
    if (description.includes('Travel to') && description.includes(' via ')) {
      const match = description.match(/Travel to (.+) via (.+)/);
      if (match) {
        return `${t('common.travelTo', { destination: match[1] })} ${t('common.via', { mode: translateTransportation(match[2]) })}`;
      }
    }
    if (description.includes('Return trip to')) {
      const match = description.match(/Return trip to (.+) via (.+)/);
      if (match) {
        return t('common.returnTrip', { city: match[1], mode: translateTransportation(match[2]) });
      }
    }
    if (description.includes('Travel day:')) {
      const match = description.match(/Travel day: (.+) to (.+) \(long journey\)/);
      if (match) {
        return t('common.travelDay', { from: match[1], to: match[2] });
      }
    }
    if (description.includes('Lunch at')) {
      const match = description.match(/Lunch at (.+)/);
      if (match) {
        return t('common.lunchAt', { restaurant: match[1] });
      }
    }
    if (description.includes('Dinner at')) {
      const match = description.match(/Dinner at (.+)/);
      if (match) {
        return t('common.dinnerAt', { restaurant: match[1] });
      }
    }
    if (description.includes('Check-in at') && description.includes(' in ')) {
      const match = description.match(/Check-in at (.+) in (.+)/);
      if (match) {
        return t('common.checkinAt', { hotel: match[1], city: match[2] });
      }
    }
    if (description.includes('Check-in at') && !description.includes(' in ')) {
      const match = description.match(/Check-in at (.+)/);
      if (match) {
        return t('common.checkinAtHotel', { hotel: match[1] });
      }
    }
    
    return description;
  };

  return (
    <div className="space-y-6 md:space-y-8 animate-slide-in-left">
      <div className="text-center">
        <h2 className="text-2xl md:text-3xl font-bold gradient-text-animated mb-3">
          {t('plan.title')}
        </h2>
        <p className="text-sm md:text-lg text-gray-600 max-w-4xl mx-auto leading-relaxed">
          {t('plan.subtitle')}
        </p>
        
        {/* Export Button */}
        <div className="mt-6">
          <ExportButton 
            plan={plan} 
            variant="outline" 
            size="lg"
            className="bg-white/80 backdrop-blur-sm hover:bg-white/90 border-2 border-blue-200 hover:border-blue-300 card-hover"
          />
        </div>
      </div>

      {plan.budget && (
        <BudgetAlert 
          totalCost={plan.totalCost} 
          budget={plan.budget} 
          currency="USD" 
        />
      )}

      {/* PDF Export Content Wrapper */}
      <div id="trip-plan-content" className="space-y-6 md:space-y-8 bg-white p-6 rounded-2xl">

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-0 shadow-lg card-hover rounded-2xl overflow-hidden group">
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center gap-3 md:gap-4">
              <div className="p-3 bg-gradient-to-r from-green-500 to-green-600 rounded-xl group-hover:scale-110 transition-transform duration-300">
                <DollarSign className="h-6 w-6 md:h-8 md:w-8 text-white" />
              </div>
              <div>
                <h3 className="text-sm md:text-lg font-semibold text-gray-700">{t('plan.totalCost')}</h3>
                <p className="text-xl md:text-2xl font-bold text-green-600 group-hover:scale-105 transition-transform duration-300">{formatPrice(plan.totalCost)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-0 shadow-lg card-hover rounded-2xl overflow-hidden group">
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center gap-3 md:gap-4">
              <div className="p-3 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl group-hover:scale-110 transition-transform duration-300">
                <Clock className="h-6 w-6 md:h-8 md:w-8 text-white" />
              </div>
              <div>
                <h3 className="text-sm md:text-lg font-semibold text-gray-700">{t('plan.totalDuration')}</h3>
                <p className="text-xl md:text-2xl font-bold text-orange-600 group-hover:scale-105 transition-transform duration-300">{plan.totalDuration} {t('plan.hours')}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {plan.hotel && (
        <Card className="bg-gradient-to-br from-orange-50 to-green-50 border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-orange-500/10 to-green-500/10 pb-4">
            <CardTitle className="flex items-center gap-3 text-lg md:text-xl">
              <div className="p-2 bg-gradient-to-r from-orange-500 to-green-500 rounded-lg">
                <HotelIcon className="h-4 w-4 md:h-5 md:w-5 text-white" />
              </div>
              {t('plan.accommodation')}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 md:p-6">
            <div className="space-y-4">
              <div>
                <h4 className="text-lg md:text-xl font-semibold text-gray-900">{plan.hotel.name}</h4>
                <p className="text-sm md:text-base text-gray-600 flex items-center gap-2 mt-1">
                  <MapPin className="h-4 w-4 text-orange-500" />
                  {translateCity(plan.hotel.city)}
                </p>
              </div>
              <p className="text-sm md:text-base text-gray-700 leading-relaxed">{plan.hotel.description}</p>
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <Badge variant={getBudgetVariant(plan.hotel.budget)} className="w-fit">
                  {translateBudget(plan.hotel.budget)}
                </Badge>
                <span className="text-base md:text-lg font-semibold text-green-600">
                  {formatPrice(plan.hotel.cost)} {t('plan.perNight')}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-6">
        <h3 className="text-xl md:text-2xl font-bold text-gray-900 flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-orange-500 to-green-500 rounded-lg">
            <Calendar className="h-5 w-5 md:h-6 md:w-6 text-white" />
          </div>
          {t('plan.dailyItinerary')}
        </h3>
        <div className="timeline">
          {plan.dailyPlans.map((dailyPlan) => (
            <div className="timeline-item" key={dailyPlan.day}>
              <div className="timeline-marker bg-gradient-to-r from-orange-500 to-green-500 border-white shadow-lg"></div>
              <div className="timeline-content">
                <Card className="shadow-xl border-0 bg-white/95 backdrop-blur-md rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300">
                  <CardHeader className="bg-gradient-to-r from-orange-500/10 to-green-500/10 pb-4">
                    <CardTitle className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <span className="text-lg md:text-xl font-bold">
                        {t('plan.day')} {dailyPlan.day} - {translateCity(dailyPlan.city)}
                      </span>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline" className="text-orange-600 border-orange-600 w-fit">
                          📍 {translateCity(dailyPlan.city)}
                        </Badge>
                        {(() => {
                          const cityInfo = getCityInfo(dailyPlan.city);
                          if (cityInfo) {
                            const typeEmojis = {
                              'coastal': '🏖️',
                              'beach_resort': '🏝️', 
                              'capital': '🏛️',
                              'cultural': '🎭',
                              'mountain': '⛰️',
                              'inland': '🏘️'
                            };
                            return (
                              <Badge variant="secondary" className="w-fit">
                                {typeEmojis[cityInfo.type]} {cityInfo.type.replace('_', ' ')}
                              </Badge>
                            );
                          }
                          return null;
                        })()}
                      </div>
                    </CardTitle>
                    <CardDescription className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm md:text-base">
                      <span className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-blue-500" />
                        {dailyPlan.totalDuration} {t('plan.hours')}
                      </span>
                      <span className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-green-500" />
                        {formatPrice(dailyPlan.totalCost)}
                      </span>
                      {(() => {
                        const cityInfo = getCityInfo(dailyPlan.city);
                        if (cityInfo && cityInfo.population) {
                          return (
                            <span className="flex items-center gap-2 text-gray-600">
                              👥 {cityInfo.population.toLocaleString()}
                            </span>
                          );
                        }
                        return null;
                      })()}
                    </CardDescription>
                    {(() => {
                      const { i18n } = useTranslation();
                      const currentLanguage = i18n.language as 'en' | 'fr';
                      const cityDescription = getCityDescription(dailyPlan.city, currentLanguage);
                      if (cityDescription) {
                        return (
                          <div className="mt-3 p-3 bg-blue-50/50 rounded-lg">
                            <p className="text-sm text-gray-700 italic">{cityDescription}</p>
                          </div>
                        );
                      }
                      return null;
                    })()}
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="space-y-0">
                      {dailyPlan.schedule.map((item, index) => (
                        <div 
                          key={index}
                          className={`p-3 md:p-4 border-b border-gray-100 last:border-b-0 hover:bg-blue-50/30 transition-colors ${
                            index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'
                          }`}
                        >
                          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                            <div className="flex items-start gap-3 flex-1">
                              <div className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-r from-blue-100 to-purple-100 text-blue-600 flex-shrink-0">
                                {getIcon(item.type, item.details)}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                                  <span className="font-bold text-blue-600 text-sm md:text-base">{item.time}</span>
                                  <span className="hidden sm:inline text-gray-400">•</span>
                                  <span className="font-semibold text-gray-900 text-sm md:text-base break-words">{translateDescription(item.description)}</span>
                                </div>
                                {item.details && 'description' in item.details && (
                                  <p className="text-xs md:text-sm text-gray-600 mt-1 leading-relaxed">{item.details.description}</p>
                                )}
                                {item.details && 'geolocation' in item.details && index > 0 && (
                                  (() => {
                                    const prevItem = dailyPlan.schedule[index - 1];
                                    if (prevItem.details && 'geolocation' in prevItem.details) {
                                      const distance = calculateDistance(
                                        prevItem.details.geolocation,
                                        item.details.geolocation
                                      );
                                      if (distance <= 2) {
                                        return (
                                          <p className="text-xs text-green-600 mt-2 flex items-center gap-1 bg-green-50 px-2 py-1 rounded-lg w-fit">
                                            <MapPin className="h-3 w-3" />
                                            {t('common.closeToLocation', { distance: distance.toFixed(1) })}
                                          </p>
                                        );
                                      }
                                    }
                                    return null;
                                  })()
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                              {item.cost && (
                                <Badge variant="success" className="text-xs font-medium">
                                  {formatPrice(item.cost)}
                                </Badge>
                              )}
                              {item.duration && (
                                <Badge variant="secondary" className="text-xs font-medium">
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
        <h3 className="text-xl md:text-2xl font-bold text-gray-900 flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg">
            <Utensils className="h-5 w-5 md:h-6 md:w-6 text-white" />
          </div>
          {t('plan.diningRecommendations')}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {plan.restaurants.map((restaurant, index) => (
            <Card key={restaurant.name} className="h-full card-hover border-0 bg-white/95 backdrop-blur-md rounded-2xl overflow-hidden group" style={{animationDelay: `${index * 0.1}s`}}>
              <CardContent className="p-4 md:p-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="text-base md:text-lg font-semibold text-gray-900 group-hover:text-orange-600 transition-colors">
                      {restaurant.name}
                    </h4>
                    <p className="text-sm md:text-base text-gray-600 flex items-center gap-2 mt-1">
                      <MapPin className="h-4 w-4 text-orange-500" />
                      {translateCity(restaurant.city)}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm md:text-base text-gray-700">
                      <span className="font-medium text-orange-600">{t('plan.cuisine')}:</span> {translateCuisine(restaurant.cuisine)}
                    </p>
                    <p className="text-sm md:text-base text-gray-700">
                      <span className="font-medium text-orange-600">{t('plan.bestTime')}:</span> {translateTime(restaurant.bestTime)}
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <Badge variant={getBudgetVariant(restaurant.budget)} className="w-fit">
                      {translateBudget(restaurant.budget)}
                    </Badge>
                    <span className="text-base md:text-lg font-bold text-green-600">
                      {formatPrice(restaurant.cost)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      
      </div> {/* End PDF Export Content Wrapper */}
    </div>
  );
};

export default TripPlan;
