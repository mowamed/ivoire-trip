import React from 'react';
import { useTranslation } from 'react-i18next';
import { useCurrency, CURRENCY_NAMES } from '../contexts/CurrencyContext';
import type { Currency } from '../contexts/CurrencyContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { MapPin, Calendar, DollarSign, Loader2, Settings, Globe, Car } from 'lucide-react';

interface Props {
  onPlanRequest: (duration: number, budget: number, transportationModes: string[]) => void;
  isLoading?: boolean;
}

const PlannerWithSettings: React.FC<Props> = ({ onPlanRequest, isLoading = false }) => {
  const { t, i18n } = useTranslation();
  const { currency, setCurrency } = useCurrency();
  const [duration, setDuration] = React.useState(7);
  const [budget, setBudget] = React.useState(1000);
  const [transportationModes, setTransportationModes] = React.useState<string[]>(['Woro-Woro (Shared Taxi)']);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const changeCurrency = (newCurrency: Currency) => {
    setCurrency(newCurrency);
  };

  const availableTransportationModes = [
    'Private Car with Driver',
    'VTC (Ride-sharing e.g. Yango)',
    'Inter-city Coach (UTB, etc.)',
    'Taxi (Metered)',
    'Woro-Woro (Shared Taxi)',
    'Sotra Bateau-Bus (Abidjan Lagoon)',
    'Domestic Flight (Air Côte d\'Ivoire)'
  ];

  const handleTransportationChange = (mode: string, checked: boolean) => {
    if (mode === 'Private Car with Driver') {
      if (checked) {
        // If private car is selected, only allow private car
        setTransportationModes(['Private Car with Driver']);
      } else {
        // If private car is deselected, default to shared taxi
        setTransportationModes(['Woro-Woro (Shared Taxi)']);
      }
    } else {
      if (transportationModes.includes('Private Car with Driver')) {
        // If private car is already selected, don't allow other modes
        return;
      }
      
      if (checked) {
        setTransportationModes([...transportationModes, mode]);
      } else {
        const newModes = transportationModes.filter(m => m !== mode);
        // Ensure at least one mode is selected
        if (newModes.length === 0) {
          setTransportationModes(['Woro-Woro (Shared Taxi)']);
        } else {
          setTransportationModes(newModes);
        }
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoading) {
      onPlanRequest(duration, budget, transportationModes);
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
        {/* Settings Section */}
        <div className="mb-8 p-4 md:p-6 bg-gradient-to-r from-blue-50/50 to-purple-50/50 rounded-xl border border-blue-100/50">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
              <Settings className="h-4 w-4 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800">{t('settings')}</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
            <div className="space-y-3">
              <Label className="flex items-center gap-2 text-sm md:text-base font-medium">
                <Globe className="h-4 w-4 text-blue-500" />
                {t('language')}
              </Label>
              <Select value={i18n.language} onValueChange={changeLanguage}>
                <SelectTrigger className="h-11 md:h-12 text-base">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en" className="text-base">🇺🇸 English</SelectItem>
                  <SelectItem value="fr" className="text-base">🇫🇷 Français</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-3">
              <Label className="flex items-center gap-2 text-sm md:text-base font-medium">
                <DollarSign className="h-4 w-4 text-green-500" />
                {t('form.currency')}
              </Label>
              <Select value={currency} onValueChange={changeCurrency}>
                <SelectTrigger className="h-11 md:h-12 text-base">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD" className="text-base">🇺🇸 {CURRENCY_NAMES.USD} (USD)</SelectItem>
                  <SelectItem value="EUR" className="text-base">🇪🇺 {CURRENCY_NAMES.EUR} (EUR)</SelectItem>
                  <SelectItem value="XOF" className="text-base">🇨🇮 {CURRENCY_NAMES.XOF} (XOF)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {/* Transportation Modes Section */}
          <div className="mt-6 space-y-3">
            <Label className="flex items-center gap-2 text-sm md:text-base font-medium">
              <Car className="h-4 w-4 text-purple-500" />
              Transportation Preferences
            </Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {availableTransportationModes.map((mode) => (
                <div key={mode} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={mode}
                    checked={transportationModes.includes(mode)}
                    onChange={(e) => handleTransportationChange(mode, e.target.checked)}
                    disabled={
                      !transportationModes.includes(mode) && 
                      transportationModes.includes('Private Car with Driver') && 
                      mode !== 'Private Car with Driver'
                    }
                    className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  />
                  <label 
                    htmlFor={mode} 
                    className={`text-sm ${
                      !transportationModes.includes(mode) && 
                      transportationModes.includes('Private Car with Driver') && 
                      mode !== 'Private Car with Driver'
                        ? 'text-gray-400' 
                        : 'text-gray-700'
                    }`}
                  >
                    {mode}
                  </label>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-500 flex items-start gap-2">
              <span className="text-purple-500 mt-0.5">🚗</span>
              {transportationModes.includes('Private Car with Driver') 
                ? 'Private car selected - driver available for entire trip duration'
                : 'Multiple transportation modes can be selected for flexibility'
              }
            </p>
          </div>
        </div>

        {/* Trip Planning Form */}
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
                <DollarSign className="h-4 w-4 text-green-500" />
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
                  {t('common.generating')}
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

export default PlannerWithSettings;