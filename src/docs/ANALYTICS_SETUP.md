# Analytics Setup Guide

This guide will help you set up Google Analytics and Microsoft Clarity for your Ivory Coast Trip Planner application.

## Prerequisites

1. Google Analytics account
2. Microsoft Clarity account
3. Your deployed application URL

## Google Analytics Setup

### Step 1: Create a Google Analytics Property

1. Go to [Google Analytics](https://analytics.google.com/)
2. Sign in with your Google account
3. Click "Start measuring" or "Create Property"
4. Fill in your property details:
   - Property name: "Ivory Coast Trip Planner"
   - Reporting time zone: Choose your preferred timezone
   - Currency: USD (or your preferred currency)
5. Choose "Web" as your platform
6. Enter your website URL (e.g., `https://ivorycoasttrips.com`)
7. Copy your **Measurement ID** (format: G-XXXXXXXXXX)

### Step 2: Configure Environment Variables

1. Create a `.env.local` file in your project root (if it doesn't exist)
2. Add your Google Analytics Measurement ID:
   ```
   VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
   ```

## Microsoft Clarity Setup

### Step 1: Create a Clarity Project

1. Go to [Microsoft Clarity](https://clarity.microsoft.com/)
2. Sign in with your Microsoft account
3. Click "Create new project"
4. Fill in your project details:
   - Project name: "Ivory Coast Trip Planner"
   - Website URL: Your application URL
5. Copy your **Project ID** (format: xxxxxxxxxx)

### Step 2: Configure Environment Variables

Add your Microsoft Clarity Project ID to your `.env.local` file:
```
VITE_CLARITY_PROJECT_ID=xxxxxxxxxx
```

## Complete Environment Variables File

Your `.env.local` file should look like this:

```env
# Google Analytics Configuration
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# Microsoft Clarity Configuration
VITE_CLARITY_PROJECT_ID=xxxxxxxxxx
```

## Verification

### Google Analytics
1. Deploy your application with the environment variables
2. Visit your website
3. Go to Google Analytics > Reports > Realtime
4. You should see your visit in real-time data

### Microsoft Clarity
1. Deploy your application with the environment variables
2. Visit your website and interact with it
3. Go to Microsoft Clarity dashboard
4. You should see session recordings and heatmaps (may take a few minutes to appear)

## Analytics Events Being Tracked

### Trip Planning Events
- **Plan Generation**: When users generate a trip plan
  - Cities count, duration, budget, currency, interests
- **Plan Export**: When users export their plan to PDF
- **City Selection**: When users select cities
- **Budget Changes**: When users modify their budget
- **Interest Selection**: When users select interests
- **Language Changes**: When users switch languages
- **Currency Changes**: When users change currency

### User Interaction Events
- Page views
- Button clicks
- Form submissions
- Export actions

## Privacy Considerations

1. **Google Analytics**: Automatically anonymizes IP addresses
2. **Microsoft Clarity**: Records user sessions but masks sensitive data
3. **GDPR Compliance**: Consider adding a cookie consent banner for EU users
4. **Data Retention**: Both services have configurable data retention periods

## Troubleshooting

### Google Analytics Not Working
1. Check that your Measurement ID is correct in `.env.local`
2. Verify the environment variable is loaded: `console.log(import.meta.env.VITE_GA_MEASUREMENT_ID)`
3. Check browser console for any JavaScript errors
4. Ensure your website is accessible and not blocked by ad blockers

### Microsoft Clarity Not Working
1. Check that your Project ID is correct in `.env.local`
2. Verify the environment variable is loaded: `console.log(import.meta.env.VITE_CLARITY_PROJECT_ID)`
3. Check browser console for any JavaScript errors
4. Wait a few minutes for data to appear in the dashboard

### Environment Variables Not Loading
1. Restart your development server after adding environment variables
2. Ensure your `.env.local` file is in the project root
3. Verify variable names start with `VITE_` prefix
4. Check that `.env.local` is not in your `.gitignore` for local development

## Security Notes

1. **Never commit** your `.env.local` file to version control
2. Use different Analytics properties for development, staging, and production
3. Consider using environment-specific configuration for different deployments
4. Regularly review your analytics data and access permissions

## Additional Resources

- [Google Analytics 4 Documentation](https://developers.google.com/analytics/devguides/collection/ga4)
- [Microsoft Clarity Documentation](https://docs.microsoft.com/en-us/clarity/)
- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)