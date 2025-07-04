import React from 'react';
import { useTranslation } from 'react-i18next';
import { AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { Card, CardContent } from './card';

interface BudgetAlertProps {
  totalCost: number;
  budget: number;
  currency: string;
}

export const BudgetAlert: React.FC<BudgetAlertProps> = ({ totalCost, budget }) => {
  const { t } = useTranslation();
  const percentage = (totalCost / budget) * 100;
  
  if (percentage <= 80) {
    return (
      <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 mb-4">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <div>
              <h3 className="font-semibold text-green-800">{t('budgetAlert.optimized')}</h3>
              <p className="text-sm text-green-700">
                {t('budgetAlert.optimizedDesc', { percentage: percentage.toFixed(1) })}
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
              <h3 className="font-semibold text-yellow-800">{t('budgetAlert.nearLimit')}</h3>
              <p className="text-sm text-yellow-700">
                {t('budgetAlert.nearLimitDesc', { percentage: percentage.toFixed(1) })}
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
            <h3 className="font-semibold text-red-800">{t('budgetAlert.exceeded')}</h3>
            <p className="text-sm text-red-700">
              {t('budgetAlert.exceededDesc')}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};