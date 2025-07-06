import { useEffect } from 'react';
import { 
  initGA, 
  initClarity, 
  trackPageView, 
  trackTripPlanningEvent, 
  trackUserInteraction,
  trackConversion 
} from '../utils/analytics';

// Hook to initialize analytics
export const useAnalytics = () => {
  useEffect(() => {
    // Initialize analytics on app load
    initGA();
    initClarity();
    
    // Track initial page view
    trackPageView('Ivory Coast Trip Planner - Home');
  }, []);

  return {
    trackPageView,
    trackTripPlanningEvent,
    trackUserInteraction,
    trackConversion,
  };
};

// Hook for tracking trip planning events
export const useTripPlanningAnalytics = () => {
  const trackPlanGeneration = (planDetails: {
    cities: string[];
    duration: number;
    budget: number;
    currency: string;
    interests: string[];
  }) => {
    trackTripPlanningEvent('plan_generated', {
      cities_count: planDetails.cities.length,
      duration_days: planDetails.duration,
      budget_amount: planDetails.budget,
      currency: planDetails.currency,
      interests: planDetails.interests.join(','),
    });
  };

  const trackPlanExport = (format: 'pdf' | 'image') => {
    trackTripPlanningEvent('plan_exported', { format });
    trackConversion('plan_export');
  };

  const trackCitySelection = (city: string) => {
    trackUserInteraction('city_selector', 'city_selected', { city });
  };

  const trackBudgetChange = (budget: number, currency: string) => {
    trackUserInteraction('budget_input', 'budget_changed', { 
      budget, 
      currency 
    });
  };

  const trackInterestSelection = (interests: string[]) => {
    trackUserInteraction('interests', 'interests_selected', { 
      interests: interests.join(','),
      count: interests.length 
    });
  };

  const trackLanguageChange = (language: string) => {
    trackUserInteraction('language_switcher', 'language_changed', { language });
  };

  const trackCurrencyChange = (currency: string) => {
    trackUserInteraction('currency_selector', 'currency_changed', { currency });
  };

  return {
    trackPlanGeneration,
    trackPlanExport,
    trackCitySelection,
    trackBudgetChange,
    trackInterestSelection,
    trackLanguageChange,
    trackCurrencyChange,
  };
};