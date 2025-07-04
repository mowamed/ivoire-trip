import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import PlannerWithSettings from './components/PlannerWithSettings';
import TripPlan from './components/TripPlan';
import { Loading } from './components/ui/loading';
import { CurrencyProvider, useCurrency } from './contexts/CurrencyContext';
import { MapPin, Calendar, DollarSign } from 'lucide-react';
import flagIcon from './assets/flag.png';
import LanguageSwitcher from './components/ui/language-switcher';
import { hotels, restaurants, transportationOptions } from './data';
import { convertToUSD } from './utils/currencyUtils';
import { 
  planCitiesRoute,
  getBudgetCategory,
  type TripPlan as TripPlanType,
  type ItineraryItem
} from './utils/tripPlanningUtils';
import { generateDayPlanWithBudget } from './utils/dayPlanningUtils';
import { planAccommodations, optimizeAccommodationsForBudget } from './utils/accommodationUtils';
import { optimizePlanForBudget, generateBasicPlan } from './utils/planOptimizationUtils';
import './App.css';

const AppContent: React.FC = () => {
  const { t } = useTranslation();
  const { currency } = useCurrency();
  
  // Helper function to convert from selected currency to USD for internal calculations
  const convertToUSDLocal = (amount: number): number => {
    return convertToUSD(amount, currency);
  };
  
  const [isLoading, setIsLoading] = useState(false);
  const [plan, setPlan] = useState<TripPlanType | null>(null);

  const generatePlan = async (duration: number, budget: number, transportationModes: string[]) => {
    setIsLoading(true);
    
    // Add a small delay to show loading state
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Convert budget from selected currency to USD for internal calculations
    const budgetInUSD = convertToUSDLocal(budget);
    
    try {
      // Calculate private car cost if selected
      const hasPrivateCar = transportationModes.includes('Private Car with Driver');
      const privateCarCost = hasPrivateCar ? 
        transportationOptions.find(t => t.type === 'Private Car with Driver')?.costPerDay || 70 : 0;
      const totalPrivateCarCost = privateCarCost * duration;

      // Adjust available budget for accommodation and activities if private car is selected
      const adjustedBudget = hasPrivateCar ? budgetInUSD - totalPrivateCarCost : budgetInUSD;
      
      // Determine budget category based on adjusted budget per day
      const budgetCategory = getBudgetCategory(adjustedBudget / duration);

      // Plan cities to visit based on duration
      const citiesToVisit = planCitiesRoute(duration);
      
      // Plan accommodations for each city based on overnight stays
      const { accommodations, totalCost: totalAccommodationCost } = planAccommodations(citiesToVisit, duration, budgetCategory);
      
      // Select primary hotel (base hotel in Abidjan)
      const availableHotels = hotels.filter(h => h.city === 'Abidjan').sort((a, b) => a.cost - b.cost);
      const selectedHotel = availableHotels.find(h => h.budget === budgetCategory) || availableHotels[0];
      
      let remainingBudget = adjustedBudget;
      const dailyBudget = remainingBudget / duration;

      // If accommodation cost exceeds 70% of adjusted budget, optimize
      let finalAccommodations = accommodations;
      
      if (totalAccommodationCost > adjustedBudget * 0.7) {
        const optimized = optimizeAccommodationsForBudget(accommodations, citiesToVisit, duration, adjustedBudget * 0.7);
        finalAccommodations = optimized.accommodations;
      }

      const dailyPlans = [];
      let totalCost = 0; // Hotel costs will be included in daily costs now
      let totalDuration = 0;
      const visitedActivities: string[] = [];

      for (let day = 1; day <= duration; day++) {
        const cityForDay = citiesToVisit[day - 1];
        const availableBudgetForDay = Math.max(dailyBudget, 50); // Minimum $50 per day for activities
        
        const dayPlan = generateDayPlanWithBudget(
          day, 
          duration, 
          cityForDay, 
          budgetCategory, 
          visitedActivities, 
          citiesToVisit,
          availableBudgetForDay,
          remainingBudget,
          transportationModes,
          budgetInUSD,
          finalAccommodations
        );
        
        dailyPlans.push(dayPlan);
        totalCost += dayPlan.totalCost;
        totalDuration += dayPlan.totalDuration;
        remainingBudget -= dayPlan.totalCost;
        
        // Add visited activities to avoid repetition
        dayPlan.schedule.forEach((item: ItineraryItem) => {
          if (item.type === 'Activity' && item.details) {
            visitedActivities.push(item.details.name);
          }
        });
      }

      // Final budget check - if over budget, optimize the plan
      // Add transportation costs to total
      const finalTotalCost = totalCost + totalPrivateCarCost;
      
      if (finalTotalCost > budgetInUSD) {
        const optimizedPlan = optimizePlanForBudget(dailyPlans, selectedHotel, budgetInUSD, duration);
        // Add transportation cost to optimized plan
        optimizedPlan.totalCost += totalPrivateCarCost;
        // Add restaurants to optimized plan
        optimizedPlan.restaurants = restaurants.filter(r => r.budget === 'Budget'); // Use budget restaurants for optimized plans
        optimizedPlan.accommodations = finalAccommodations;
        setPlan(optimizedPlan);
      } else {
        setPlan({
          hotel: selectedHotel,
          dailyPlans,
          restaurants: restaurants.filter(r => r.budget === budgetCategory),
          totalCost: finalTotalCost,
          totalDuration,
          budget: budgetInUSD, // Store the USD budget for internal use
          accommodations: finalAccommodations,
        });
      }
    } catch (error) {
      console.error('Error generating plan:', error);
      // Fallback to a basic plan if something goes wrong
      generateBasicPlan(duration, budgetInUSD, transportationModes);
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-green-50 relative overflow-hidden">
      {/* Animated Background Elements - Côte d'Ivoire Colors */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-orange-400/20 to-orange-300/15 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-green-400/20 to-green-300/15 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-orange-300/10 to-green-300/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '4s'}}></div>
      </div>

      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-white/20 sticky top-0 z-50 shadow-lg">
        <div className="container mx-auto px-4 py-4 max-w-6xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 group">
              <div className="p-2 bg-gradient-to-r from-orange-500 to-green-500 rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                <MapPin className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-orange-600 via-green-600 to-orange-600 bg-clip-text text-transparent">
                  {t('app.title')}
                </h1>
                <p className="text-xs md:text-sm text-gray-600">{t('app.subtitle')}</p>
              </div>
            </div>
            <LanguageSwitcher />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      {!plan && !isLoading && (
        <section className="relative py-12 md:py-20 text-center">
          <div className="container mx-auto px-4 max-w-4xl relative z-10">
            <div className="space-y-6 md:space-y-8">
              <div className="space-y-4">
                <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-orange-600 via-green-600 to-orange-600 bg-clip-text text-transparent leading-tight">
                  {t('hero.title')}
                  <br />
                  <span className="text-green-600">Côte d'Ivoire</span> <img src={flagIcon} alt="Côte d'Ivoire flag" className="inline-block w-12 h-10 ml-2" />
                </h2>
                <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                  {t('hero.subtitle')}
                </p>
              </div>
              
              {/* Feature highlights */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
                <div className="group p-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-orange-100/50 hover:bg-white/80 transition-all duration-300 hover:scale-105 hover:shadow-xl">
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-center mb-4 group-hover:rotate-6 transition-transform duration-300">
                    <MapPin className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-2">{t('hero.smartItineraries')}</h3>
                  <p className="text-sm text-gray-600">{t('hero.smartItinerariesDesc')}</p>
                </div>
                
                <div className="group p-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-green-100/50 hover:bg-white/80 transition-all duration-300 hover:scale-105 hover:shadow-xl">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-4 group-hover:rotate-6 transition-transform duration-300">
                    <DollarSign className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-2">{t('hero.budgetFriendly')}</h3>
                  <p className="text-sm text-gray-600">{t('hero.budgetFriendlyDesc')}</p>
                </div>
                
                <div className="group p-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-orange-100/50 hover:bg-white/80 transition-all duration-300 hover:scale-105 hover:shadow-xl">
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-green-500 rounded-xl flex items-center justify-center mb-4 group-hover:rotate-6 transition-transform duration-300">
                    <Calendar className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-2">{t('hero.flexibleDuration')}</h3>
                  <p className="text-sm text-gray-600">{t('hero.flexibleDurationDesc')}</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-6xl relative z-10">
        <div className="space-y-8 md:space-y-12">
          <section aria-label="Trip Planning with Settings">
            <PlannerWithSettings onPlanRequest={generatePlan} isLoading={isLoading} />
          </section>
          {isLoading ? (
            <section aria-label="Loading" aria-live="polite">
              <Loading message={t('form.generating', 'Generating your perfect trip...')} />
            </section>
          ) : (
            <section aria-label="Trip Itinerary">
              <TripPlan plan={plan} />
            </section>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white/60 backdrop-blur-md border-t border-white/20 mt-16">
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          {/* Bottom Bar */}
          <div className="border-t border-gray-200 mt-6 pt-6 text-center">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <p className="text-sm text-gray-600">
                {t('footer.copyright')} <a 
                  href="mailto:mowamedbakus@gmail.com" 
                  className="gap-2 text-sm text-blue-600 hover:text-blue-700 transition-colors"
                >
                  Moh
                </a> {t('footer.forTravelers')}
              </p>
              <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
                <span>{t('footer.proudlySupporting')}</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <CurrencyProvider>
      <AppContent />
    </CurrencyProvider>
  );
};

export default App;