import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface TripPlan {
  hotel: any;
  dailyPlans: any[];
  restaurants: any[];
  totalCost: number;
  totalDuration: number;
  budget?: number;
}

interface ExportOptions {
  filename?: string;
  includeImages?: boolean;
  format?: 'a4' | 'letter';
  orientation?: 'portrait' | 'landscape';
}

export const exportTripPlanToPDF = async (
  plan: TripPlan,
  options: ExportOptions = {},
  t?: (key: string, fallback?: string) => string
): Promise<void> => {
  const {
    filename = 'ivory-coast-trip-plan.pdf',
    format = 'a4',
    orientation = 'portrait'
  } = options;

  try {
    // Create new PDF document
    const pdf = new jsPDF({
      orientation,
      unit: 'mm',
      format
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 20;
    const contentWidth = pageWidth - (margin * 2);
    let currentY = margin;

    // Helper function to add text with word wrapping
    const addText = (text: string, fontSize: number = 12, isBold: boolean = false) => {
      pdf.setFontSize(fontSize);
      pdf.setFont('helvetica', isBold ? 'bold' : 'normal');
      
      const lines = pdf.splitTextToSize(text, contentWidth);
      const lineHeight = fontSize * 0.35;
      
      // Check if we need a new page
      if (currentY + (lines.length * lineHeight) > pageHeight - margin) {
        pdf.addPage();
        currentY = margin;
      }
      
      pdf.text(lines, margin, currentY);
      currentY += lines.length * lineHeight + 5;
    };

    // Helper function to add a section header
    const addSectionHeader = (title: string) => {
      currentY += 10;
      pdf.setFillColor(59, 130, 246); // Blue color
      pdf.rect(margin, currentY - 8, contentWidth, 12, 'F');
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text(title, margin + 5, currentY);
      pdf.setTextColor(0, 0, 0);
      currentY += 15;
    };

    // Title
    pdf.setFontSize(24);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(59, 130, 246);
    const title = t ? t('app.title', 'Ivory Coast Trip Planner') : 'Ivory Coast Trip Planner';
    pdf.text(title, margin, currentY);
    currentY += 15;

    // Subtitle
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(100, 100, 100);
    const subtitle = t ? t('app.subtitle', 'Your personalized travel itinerary for Côte d\'Ivoire') : 'Your personalized travel itinerary for Côte d\'Ivoire';
    pdf.text(subtitle, margin, currentY);
    currentY += 20;

    // Trip Summary
    addSectionHeader('Trip Summary');
    addText(`Total Cost: $${plan.totalCost.toFixed(2)}`, 12, true);
    addText(`Total Duration: ${plan.totalDuration} hours`);
    if (plan.budget) {
      const percentage = (plan.totalCost / plan.budget) * 100;
      addText(`Budget Utilization: ${percentage.toFixed(1)}% of $${plan.budget}`);
    }
    addText(`Generated on: ${new Date().toLocaleDateString()}`);

    // Hotel Information
    if (plan.hotel) {
      addSectionHeader('Accommodation');
      addText(`${plan.hotel.name}`, 14, true);
      addText(`Location: ${plan.hotel.city}`);
      addText(`Category: ${plan.hotel.budget}`);
      addText(`Cost: $${plan.hotel.cost} per night`);
      addText(`Description: ${plan.hotel.description}`);
    }

    // Daily Itinerary
    addSectionHeader('Daily Itinerary');
    
    plan.dailyPlans.forEach((day, index) => {
      // Day header
      addText(`Day ${day.day} - ${day.city}`, 16, true);
      addText(`Daily Cost: $${day.totalCost.toFixed(2)} | Duration: ${day.totalDuration} hours`);
      
      // Activities for the day
      day.schedule.forEach((item: any, itemIndex: number) => {
        const activityText = `${item.time} - ${item.description}`;
        addText(activityText, 11);
        
        if (item.details && item.details.description) {
          addText(`   ${item.details.description}`, 10);
        }
        
        if (item.cost || item.duration) {
          const details = [];
          if (item.cost) details.push(`$${item.cost}`);
          if (item.duration) details.push(`${item.duration}h`);
          addText(`   ${details.join(' | ')}`, 10);
        }
        
        if (itemIndex < day.schedule.length - 1) {
          currentY += 3;
        }
      });
      
      if (index < plan.dailyPlans.length - 1) {
        currentY += 10;
      }
    });

    // Restaurant Recommendations
    if (plan.restaurants && plan.restaurants.length > 0) {
      addSectionHeader('Dining Recommendations');
      
      plan.restaurants.forEach((restaurant, index) => {
        addText(`${restaurant.name} (${restaurant.city})`, 12, true);
        addText(`Cuisine: ${restaurant.cuisine} | Best Time: ${restaurant.bestTime}`);
        addText(`Budget Category: ${restaurant.budget} | Cost: $${restaurant.cost}`);
        
        if (index < plan.restaurants.length - 1) {
          currentY += 5;
        }
      });
    }

    // Footer
    currentY = pageHeight - 30;
    pdf.setFontSize(10);
    pdf.setTextColor(150, 150, 150);
    pdf.text('Generated by Ivory Coast Trip Planner - contact@ivorycoasttrips.com', margin, currentY);

    // Save the PDF
    pdf.save(filename);
    
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('Failed to generate PDF. Please try again.');
  }
};

// Alternative method using HTML to Canvas for more complex layouts
export const exportTripPlanToAdvancedPDF = async (
  elementId: string,
  filename: string = 'ivory-coast-trip-plan.pdf'
): Promise<void> => {
  try {
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error('Element not found for PDF export');
    }

    // Configure html2canvas options
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      logging: false,
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = pageWidth - 20; // 10mm margin on each side
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 10; // 10mm top margin

    // Add first page
    pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
    heightLeft -= pageHeight - 20; // Account for margins

    // Add additional pages if needed
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight + 10;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
      heightLeft -= pageHeight - 20;
    }

    pdf.save(filename);
  } catch (error) {
    console.error('Error generating advanced PDF:', error);
    throw new Error('Failed to generate PDF. Please try again.');
  }
};