import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import PlannerWithSettings from './components/PlannerWithSettings';
import TripPlan from './components/TripPlan';
import { Loading } from './components/ui/loading';
import { CurrencyProvider, useCurrency } from './contexts/CurrencyContext';
import { hotels, restaurants, transportationOptions } from './data';
import { convertToUSD } from './utils/currencyUtils';
import { 
  planCitiesRoute,
  getBudgetCategory,
  type TripPlan as TripPlanType
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
      let selectedHotel = availableHotels.find(h => h.budget === budgetCategory) || availableHotels[0];
      
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
        dayPlan.schedule.forEach((item: any) => {
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-white/20 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 max-w-6xl">
          <div className="text-center">
            <h1 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              {t('app.title')}
            </h1>
            <p className="text-sm md:text-lg text-gray-600 max-w-3xl mx-auto">
              {t('app.subtitle')}
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 md:py-8 max-w-6xl">
        <div className="space-y-6 md:space-y-8">
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
                © 2024 Ivory Coast Trip Planner. Made with ❤️ by <a 
                  href="mailto:mowamedbakus@gmail.com" 
                  className="gap-2 text-sm text-blue-600 hover:text-blue-700 transition-colors"
                >
                  Moh
                </a> for travelers exploring Côte d'Ivoire.
              </p>
              <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
                <span>🇨🇮 Proudly supporting Ivorian tourism</span>
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