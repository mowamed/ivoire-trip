/* eslint-disable @typescript-eslint/no-explicit-any */
// Analytics utilities for Google Analytics and Microsoft Clarity

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    clarity: (...args: any[]) => void;
  }
}

// Google Analytics configuration
export const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID || '';

// Microsoft Clarity configuration
export const CLARITY_PROJECT_ID = import.meta.env.VITE_CLARITY_PROJECT_ID || '';

// Initialize Google Analytics
export const initGA = () => {
  if (!GA_MEASUREMENT_ID) {
    console.warn('Google Analytics Measurement ID not found');
    return;
  }

  // Load Google Analytics script
  const script1 = document.createElement('script');
  script1.async = true;
  script1.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script1);

  // Initialize gtag
  window.gtag = function() {
     
    (window as any).dataLayer = (window as any).dataLayer || [];
    // eslint-disable-next-line prefer-rest-params
    (window as any).dataLayer.push(arguments);
  };

  window.gtag('js', new Date());
  window.gtag('config', GA_MEASUREMENT_ID, {
    page_title: document.title,
    page_location: window.location.href,
  });
};

// Initialize Microsoft Clarity
export const initClarity = () => {
  if (!CLARITY_PROJECT_ID) {
    console.warn('Microsoft Clarity Project ID not found');
    return;
  }

  // Load Microsoft Clarity script
  const script = document.createElement('script');
  script.type = 'text/javascript';
  script.innerHTML = `
    (function(c,l,a,r,i,t,y){
        c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
        t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
        y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
    })(window, document, "clarity", "script", "${CLARITY_PROJECT_ID}");
  `;
  document.head.appendChild(script);
};

// Track page views
export const trackPageView = (page_title: string, page_location?: string) => {
  if (typeof window.gtag !== 'undefined') {
    window.gtag('config', GA_MEASUREMENT_ID, {
      page_title,
      page_location: page_location || window.location.href,
    });
  }
};

// Track custom events
export const trackEvent = (action: string, category: string, label?: string, value?: number) => {
  if (typeof window.gtag !== 'undefined') {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

// Track trip planning events
export const trackTripPlanningEvent = (eventName: string, properties?: Record<string, any>) => {
  trackEvent(eventName, 'trip_planning', JSON.stringify(properties));
  
  // Also send to Clarity if available
  if (typeof window.clarity !== 'undefined') {
    window.clarity('event', eventName, properties);
  }
};

// Track user interactions
export const trackUserInteraction = (element: string, action: string, details?: Record<string, any>) => {
  trackEvent(action, 'user_interaction', element, details?.value);
  
  if (typeof window.clarity !== 'undefined') {
    window.clarity('event', `${element}_${action}`, details);
  }
};

// Track conversion events
export const trackConversion = (conversionType: string, value?: number) => {
  trackEvent('conversion', 'engagement', conversionType, value);
  
  if (typeof window.clarity !== 'undefined') {
    window.clarity('event', 'conversion', { type: conversionType, value });
  }
};