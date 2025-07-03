import React from 'react';
import { useTranslation } from 'react-i18next';
import { useCurrency } from '../contexts/CurrencyContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { MapPin, Calendar, DollarSign, Euro, Loader2 } from 'lucide-react';

interface Props {
  onPlanRequest: (duration: number, budget: number) => void;
  isLoading?: boolean;
}

const PlannerForm: React.FC<Props> = ({ onPlanRequest, isLoading = false }) => {
  const { t } = useTranslation();
  const { currency } = useCurrency();
  const [duration, setDuration] = React.useState(7);
  const [budget, setBudget] = React.useState(1000);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoading) {
      onPlanRequest(duration, budget);
    }
  };

  return (
    <Card className="bg-white/95 backdrop-blur-md border-0 shadow-xl rounded-2xl overflow-hidden">
      <CardHeader className="text-center bg-gradient-to-r from-green-500/10 to-blue-500/10 pb-6">
        <CardTitle className="flex items-center justify-center gap-3 text-xl md:text-2xl">
          <div className="p-3 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl">
            <MapPin className="h-5 w-5 md:h-6 md:w-6 text-white" />
          </div>
          {t('form.title')}
        </CardTitle>
        <CardDescription className="text-sm md:text-base text-gray-600 max-w-2xl mx-auto">
          {t('form.subtitle')}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 md:p-6">
        <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
            <div className="space-y-3">
              <Label htmlFor="duration" className="flex items-center gap-2 text-sm md:text-base font-medium">
                <Calendar className="h-4 w-4 text-blue-500" />
                {t('form.duration')}
              </Label>
              <Input
                type="number"
                id="duration"
                value={duration}
                onChange={(e) => setDuration(parseInt(e.target.value))}
                min="1"
                max="30"
                className="h-12 md:h-14 text-base md:text-lg border-2 border-gray-200 hover:border-blue-300 focus:border-blue-500 transition-colors rounded-xl"
                placeholder="7"
              />
              <p className="text-xs md:text-sm text-gray-500 flex items-start gap-2">
                <span className="text-blue-500 mt-0.5">💡</span>
                {t('form.durationHelp')}
              </p>
            </div>
            <div className="space-y-3">
              <Label htmlFor="budget" className="flex items-center gap-2 text-sm md:text-base font-medium">
                {currency === 'EUR' ? (
                  <Euro className="h-4 w-4 text-green-500" />
                ) : (
                  <DollarSign className="h-4 w-4 text-green-500" />
                )}
                {t('form.budget')} ({currency})
              </Label>
              <Input
                type="number"
                id="budget"
                value={budget}
                onChange={(e) => setBudget(parseInt(e.target.value))}
                min="100"
                step="50"
                className="h-12 md:h-14 text-base md:text-lg border-2 border-gray-200 hover:border-green-300 focus:border-green-500 transition-colors rounded-xl"
                placeholder="1000"
              />
              <p className="text-xs md:text-sm text-gray-500 flex items-start gap-2">
                <span className="text-green-500 mt-0.5">💰</span>
                {t('form.budgetHelp')} - {t('form.currency')}: {currency}
              </p>
            </div>
          </div>
          <Button 
            type="submit" 
            disabled={isLoading}
            className="w-full h-12 md:h-16 text-base md:text-lg font-semibold bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 hover:from-blue-700 hover:via-purple-700 hover:to-green-700 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl disabled:opacity-70 disabled:cursor-not-allowed"
          >
            <span className="flex items-center gap-2">
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  ✨ {t('form.generateButton')}
                </>
              )}
            </span>
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default PlannerForm;
