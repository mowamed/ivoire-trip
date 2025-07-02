import React from 'react';
import { AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { Card, CardContent } from './card';

interface BudgetAlertProps {
  totalCost: number;
  budget: number;
  currency: string;
}

export const BudgetAlert: React.FC<BudgetAlertProps> = ({ totalCost, budget }) => {
  const percentage = (totalCost / budget) * 100;
  
  if (percentage <= 80) {
    return (
      <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 mb-4">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <div>
              <h3 className="font-semibold text-green-800">Budget Optimized</h3>
              <p className="text-sm text-green-700">
                Your trip is well within budget at {percentage.toFixed(1)}% of your total budget.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (percentage <= 95) {
    return (
      <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200 mb-4">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <Info className="h-5 w-5 text-yellow-600" />
            <div>
              <h3 className="font-semibold text-yellow-800">Near Budget Limit</h3>
              <p className="text-sm text-yellow-700">
                Your trip uses {percentage.toFixed(1)}% of your budget. Consider some optional activities.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="bg-gradient-to-r from-red-50 to-pink-50 border-red-200 mb-4">
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <AlertTriangle className="h-5 w-5 text-red-600" />
          <div>
            <h3 className="font-semibold text-red-800">Budget Exceeded</h3>
            <p className="text-sm text-red-700">
              This plan has been optimized to fit your budget. Some activities may have been removed.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};