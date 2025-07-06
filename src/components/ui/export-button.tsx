import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from './button';
import { Download, FileText, Loader2 } from 'lucide-react';
import { exportTripPlanToPDF, exportTripPlanToAdvancedPDF } from '../../utils/pdfExport';

interface ExportButtonProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  plan: any;
  className?: string;
  variant?: 'default' | 'outline' | 'secondary';
  size?: 'default' | 'sm' | 'lg';
  onExport?: (format: 'pdf' | 'image') => void;
}

export const ExportButton: React.FC<ExportButtonProps> = ({ 
  plan, 
  className = '',
  variant = 'default',
  size = 'default',
  onExport
}) => {
  const { t } = useTranslation();
  const [isExporting, setIsExporting] = useState(false);
  const [exportMethod, setExportMethod] = useState<'simple' | 'advanced'>('simple');

  const handleExport = async () => {
    if (!plan) return;

    setIsExporting(true);
    
    // Track export event
    if (onExport) {
      onExport('pdf');
    }
    
    try {
      const baseFilename = t('export.filename', 'Ivory Coast Trip Plan');
      const filename = `${baseFilename.toLowerCase().replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.pdf`;
      
      if (exportMethod === 'advanced') {
        // Try advanced export first (with styling)
        await exportTripPlanToAdvancedPDF('trip-plan-content', filename);
      } else {
        // Fallback to simple export
        await exportTripPlanToPDF(plan, { filename });
      }
      
      // Show success message
      alert(t('export.success'));
    } catch (error) {
      console.error('Export failed:', error);
      // Show error message
      alert(t('export.error'));
    } finally {
      setIsExporting(false);
    }
  };

  const toggleExportMethod = () => {
    setExportMethod(prev => prev === 'simple' ? 'advanced' : 'simple');
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        onClick={handleExport}
        disabled={isExporting || !plan}
        variant={variant}
        size={size}
        className={`${className} transition-all duration-300`}
      >
        {isExporting ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            {t('export.exporting')}
          </>
        ) : (
          <>
            <Download className="h-4 w-4 mr-2" />
            {t('export.button')}
          </>
        )}
      </Button>
      
      <Button
        onClick={toggleExportMethod}
        variant="outline"
        size="sm"
        className="px-2"
        title={exportMethod === 'simple' ? t('export.switchToStyled') : t('export.switchToSimple')}
      >
        <FileText className="h-4 w-4" />
      </Button>
    </div>
  );
};