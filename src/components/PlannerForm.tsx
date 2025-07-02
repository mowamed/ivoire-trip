import React from 'react';
import { useTranslation } from 'react-i18next';
import { useCurrency } from '../contexts/CurrencyContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { MapPin, Calendar, DollarSign } from 'lucide-react';

interface Props {
  onPlanRequest: (duration: number, budget: number) => void;
}

const PlannerForm: React.FC<Props> = ({ onPlanRequest }) => {
  const { t } = useTranslation();
  const { currency } = useCurrency();
  const [duration, setDuration] = React.useState(7);
  const [budget, setBudget] = React.useState(1000);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onPlanRequest(duration, budget);
  };

  return (
    <Card className="mb-8 shadow-lg border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2 text-2xl">
          <MapPin className="h-6 w-6 text-primary-600" />
          {t('form.title')}
        </CardTitle>
        <CardDescription className="text-base">
          {t('form.subtitle')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="duration" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {t('form.duration')}
              </Label>
              <Input
                type="number"
                id="duration"
                value={duration}
                onChange={(e) => setDuration(parseInt(e.target.value))}
                min="1"
                max="30"
                className="text-lg"
              />
              <p className="text-sm text-gray-500">{t('form.durationHelp')}</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="budget" className="flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                {t('form.budget')} ({currency})
              </Label>
              <Input
                type="number"
                id="budget"
                value={budget}
                onChange={(e) => setBudget(parseInt(e.target.value))}
                min="100"
                step="50"
                className="text-lg"
              />
              <p className="text-sm text-gray-500">
                {t('form.budgetHelp')} - {t('form.currency')}: {currency}
              </p>
            </div>
          </div>
          <Button type="submit" className="w-full text-lg py-6 bg-gradient-to-r from-primary-600 to-blue-600 hover:from-primary-700 hover:to-blue-700">
            {t('form.generateButton')}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default PlannerForm;
