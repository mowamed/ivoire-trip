import React, { useState } from 'react';
import { Button } from './button';
import { Download, FileText, Loader2 } from 'lucide-react';
import { exportTripPlanToPDF, exportTripPlanToAdvancedPDF } from '../../utils/pdfExport';

interface ExportButtonProps {
  plan: any;
  className?: string;
  variant?: 'default' | 'outline' | 'secondary';
  size?: 'default' | 'sm' | 'lg';
}

export const ExportButton: React.FC<ExportButtonProps> = ({ 
  plan, 
  className = '',
  variant = 'default',
  size = 'default'
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const [exportMethod, setExportMethod] = useState<'simple' | 'advanced'>('simple');

  const handleExport = async () => {
    if (!plan) return;

    setIsExporting(true);
    try {
      const filename = `ivory-coast-trip-${new Date().toISOString().split('T')[0]}.pdf`;
      
      if (exportMethod === 'advanced') {
        // Try advanced export first (with styling)
        await exportTripPlanToAdvancedPDF('trip-plan-content', filename);
      } else {
        // Fallback to simple export
        await exportTripPlanToPDF(plan, { filename });
      }
      
      // Show success message (you could add a toast notification here)
      console.log('PDF exported successfully!');
    } catch (error) {
      console.error('Export failed:', error);
      // Show error message (you could add a toast notification here)
      alert('Failed to export PDF. Please try again.');
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
            Exporting...
          </>
        ) : (
          <>
            <Download className="h-4 w-4 mr-2" />
            Export PDF
          </>
        )}
      </Button>
      
      <Button
        onClick={toggleExportMethod}
        variant="outline"
        size="sm"
        className="px-2"
        title={`Switch to ${exportMethod === 'simple' ? 'styled' : 'simple'} export`}
      >
        <FileText className="h-4 w-4" />
      </Button>
    </div>
  );
};