// Plan optimization utilities

import type { Hotel } from '../data';
import type { DailyPlan, TripPlan } from './tripPlanningUtils';

/**
 * Optimize plan for budget constraints
 */
export const optimizePlanForBudget = (
  dailyPlans: DailyPlan[],
  hotel: Hotel,
  budget: number,
  duration: number
): TripPlan => {
  const optimizedPlans = dailyPlans.map(plan => {
    const optimizedSchedule = plan.schedule.filter(item => {
      // Keep essential items (travel, hotel, airport)
      if (['Travel', 'Hotel', 'Airport', 'Transportation'].includes(item.type)) {
        return true;
      }
      // Keep affordable activities and meals
      return (item.cost || 0) <= budget * 0.1; // Max 10% of budget per activity
    });
    
    const optimizedCost = optimizedSchedule.reduce((sum, item) => sum + (item.cost || 0), 0);
    const optimizedDuration = optimizedSchedule.reduce((sum, item) => sum + (item.duration || 0), 0);
    
    return {
      ...plan,
      schedule: optimizedSchedule,
      totalCost: optimizedCost,
      totalDuration: optimizedDuration,
    };
  });
  
  const totalCost = optimizedPlans.reduce((sum, plan) => sum + plan.totalCost, 0) + (hotel.cost * duration);
  const totalDuration = optimizedPlans.reduce((sum, plan) => sum + plan.totalDuration, 0);
  
  return {
    hotel,
    dailyPlans: optimizedPlans,
    restaurants: [],
    totalCost,
    totalDuration,
    budget,
  };
};

/**
 * Generate a basic fallback plan
 */
export const generateBasicPlan = (
  duration: number,
  budget: number,
  _transportationModes: string[]
): TripPlan => {
  // This is a simplified fallback plan
  const basicDailyPlans: DailyPlan[] = [];
  
  for (let day = 1; day <= duration; day++) {
    const schedule = [
      {
        time: '09:00',
        description: day === 1 ? 'Airport arrival and hotel check-in' : 'Hotel breakfast',
        type: 'Hotel' as const,
        duration: 2,
        cost: 0,
        city: 'Abidjan',
      },
      {
        time: '11:00',
        description: 'City exploration',
        type: 'Activity' as const,
        duration: 4,
        cost: budget * 0.1,
        city: 'Abidjan',
      },
      {
        time: '15:00',
        description: 'Local restaurant',
        type: 'Meal' as const,
        duration: 1.5,
        cost: budget * 0.05,
        city: 'Abidjan',
      },
      {
        time: '18:00',
        description: day === duration ? 'Airport departure preparation' : 'Evening leisure',
        type: day === duration ? 'Airport' as const : 'Activity' as const,
        duration: 2,
        cost: day === duration ? 30 : budget * 0.08,
        city: 'Abidjan',
      },
    ];
    
    const totalCost = schedule.reduce((sum, item) => sum + (item.cost || 0), 0);
    const totalDuration = schedule.reduce((sum, item) => sum + (item.duration || 0), 0);
    
    basicDailyPlans.push({
      day,
      city: 'Abidjan',
      schedule,
      totalCost,
      totalDuration,
    });
  }
  
  const totalCost = basicDailyPlans.reduce((sum, plan) => sum + plan.totalCost, 0);
  const totalDuration = basicDailyPlans.reduce((sum, plan) => sum + plan.totalDuration, 0);
  
  return {
    hotel: null,
    dailyPlans: basicDailyPlans,
    restaurants: [],
    totalCost,
    totalDuration,
    budget,
  };
};