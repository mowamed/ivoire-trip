import React from 'react';
import { useTranslation } from 'react-i18next';
import { useCurrency, CURRENCY_NAMES } from '../contexts/CurrencyContext';
import type { Currency } from '../contexts/CurrencyContext';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Label } from './ui/label';
import { Settings, Globe, DollarSign } from 'lucide-react';

const SettingsPanel: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { currency, setCurrency } = useCurrency();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const changeCurrency = (newCurrency: Currency) => {
    setCurrency(newCurrency);
  };

  return (
    <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
          <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
            <Settings className="h-4 w-4 md:h-5 md:w-5 text-white" />
          </div>
          {t('settings')}
        </CardTitle>
      </CardHeader>
      <CardContent>
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
      </CardContent>
    </Card>
  );
};

export default SettingsPanel;