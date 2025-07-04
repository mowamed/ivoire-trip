import React from 'react';
import { useTranslation } from 'react-i18next';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';
import { Globe } from 'lucide-react';

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="flex items-center gap-2">
      <Globe className="h-4 w-4 text-gray-600" />
      <Select value={i18n.language} onValueChange={changeLanguage}>
        <SelectTrigger className="h-9 w-auto min-w-[100px] text-sm border-gray-200 bg-white/80 backdrop-blur-sm">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="en" className="text-sm">🇺🇸 EN</SelectItem>
          <SelectItem value="fr" className="text-sm">🇫🇷 FR</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default LanguageSwitcher;