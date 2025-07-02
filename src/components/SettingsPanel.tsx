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
    <Card className="mb-6 bg-white/90 backdrop-blur-sm border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5 text-primary-600" />
          {t('settings')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              {t('language')}
            </Label>
            <Select value={i18n.language} onValueChange={changeLanguage}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">🇺🇸 English</SelectItem>
                <SelectItem value="fr">🇫🇷 Français</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              {t('form.currency')}
            </Label>
            <Select value={currency} onValueChange={changeCurrency}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USD">🇺🇸 {CURRENCY_NAMES.USD} (USD)</SelectItem>
                <SelectItem value="EUR">🇪🇺 {CURRENCY_NAMES.EUR} (EUR)</SelectItem>
                <SelectItem value="XOF">🇨🇮 {CURRENCY_NAMES.XOF} (XOF)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SettingsPanel;