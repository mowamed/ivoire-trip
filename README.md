# 🇨🇮 Ivory Coast Trip Planner

[![React](https://img.shields.io/badge/React-19.1.0-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue.svg)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.4.0-blue.svg)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-7.0.0-purple.svg)](https://vitejs.dev/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

A modern, intelligent trip planning application for Côte d'Ivoire (Ivory Coast) that creates personalized itineraries featuring beaches, nightlife, cultural experiences, and local cuisine. Built with React, TypeScript, and powered by geolocation-based optimization.

## ✨ Features

### 🎯 **Smart Trip Planning**
- **Geolocation-Based Optimization**: Activities are intelligently grouped by proximity to minimize travel time
- **Multi-Currency Support**: USD, EUR, and XOF (CFA Franc) with real-time conversion
- **Budget-Aware Planning**: Automatically adjusts recommendations based on your budget category
- **Duration Flexibility**: Plans from 1-30 days with optimized city routing

### 🏖️ **Comprehensive Experiences**
- **Beach Activities**: Premium coastal experiences in Assinie, Grand-Bassam, and Sassandra
- **Nightlife & Clubbing**: Curated evening entertainment in Abidjan's vibrant districts
- **Cultural Immersion**: Historic sites, museums, and local markets
- **Culinary Journey**: Restaurant recommendations with proximity-based selection

### 🌍 **Internationalization**
- **Bilingual Support**: Full French and English localization
- **Cultural Adaptation**: Localized content and currency preferences
- **Accessibility**: Mobile-first design with touch-friendly interfaces

### 📱 **Modern UI/UX**
- **Responsive Design**: Seamless experience across all devices
- **Glass Morphism**: Modern aesthetic with backdrop blur effects
- **Smooth Animations**: Loading states and micro-interactions
- **Dark/Light Themes**: Gradient-based color schemes

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/ivory-coast-trip-planner.git
cd ivory-coast-trip-planner

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🏗️ Tech Stack

### **Frontend Framework**
- **React 19.1.0** - Latest React with concurrent features
- **TypeScript 5.8.3** - Type-safe development
- **Vite 7.0.0** - Lightning-fast build tool

### **Styling & UI**
- **Tailwind CSS 3.4.0** - Utility-first CSS framework
- **shadcn/ui** - High-quality component library
- **Lucide React** - Beautiful icon library
- **Custom CSS** - Advanced animations and effects

### **State Management & Utils**
- **React Hooks** - Built-in state management
- **i18next** - Internationalization framework
- **clsx & tailwind-merge** - Conditional styling utilities

### **Development Tools**
- **ESLint** - Code linting and quality
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixes

## 📂 Project Structure

```
src/
├── components/           # React components
│   ├── ui/              # Reusable UI components
│   │   ├── button.tsx   # Button component
│   │   ├── card.tsx     # Card component
│   │   ├── input.tsx    # Input component
│   │   ├── select.tsx   # Select component
│   │   ├── badge.tsx    # Badge component
│   │   ├── label.tsx    # Label component
│   │   └── loading.tsx  # Loading component
│   ├── PlannerForm.tsx  # Trip planning form
│   ├── TripPlan.tsx     # Trip display component
│   └── SettingsPanel.tsx # Language/currency settings
├── contexts/            # React contexts
│   └── CurrencyContext.tsx # Currency management
├── i18n/               # Internationalization
│   ├── index.ts        # i18n configuration
│   └── locales/        # Translation files
│       ├── en.json     # English translations
│       └── fr.json     # French translations
├── lib/                # Utility functions
│   └── utils.ts        # Common utilities
├── data.ts             # Static data and types
├── App.tsx             # Main application component
├── main.tsx            # Application entry point
└── index.css           # Global styles
```

## 🎨 Key Features Deep Dive

### **Geolocation-Based Planning**
The app uses the Haversine formula to calculate real distances between locations and intelligently groups activities:

```typescript
// Example: Activities within 3km are grouped together
const activityGroups = groupActivitiesByProximity(activities, 3);

// Restaurants are selected based on proximity to last activity
const nearbyRestaurant = findClosestRestaurant(lastLocation, restaurants, 10);
```

### **Multi-Currency System**
Real-time currency conversion with support for:
- **USD** (US Dollar) - Base currency
- **EUR** (Euro) - European travelers
- **XOF** (CFA Franc) - Local currency

### **Smart Routing Algorithm**
- **Short trips (1-3 days)**: Focus on Abidjan and nearby beaches
- **Medium trips (4-7 days)**: Mix of beaches, culture, and nightlife
- **Long trips (8+ days)**: Comprehensive tour with emphasis on variety

### **Responsive Timeline**
Interactive timeline with:
- Proximity indicators for nearby activities
- Budget and duration badges
- Mobile-optimized layout
- Smooth animations

## 🌐 Internationalization

The app supports full localization:

```json
// English (en.json)
{
  "app": {
    "title": "Ivory Coast Trip Planner",
    "subtitle": "Discover the beauty and culture..."
  }
}

// French (fr.json)
{
  "app": {
    "title": "Planificateur de Voyage en Côte d'Ivoire",
    "subtitle": "Découvrez la beauté et la culture..."
  }
}
```

## 📱 Mobile Optimization

- **Touch-friendly**: 44px minimum touch targets
- **Responsive typography**: Scales from mobile to desktop
- **Optimized images**: Proper sizing and loading
- **Smooth scrolling**: Native scroll behavior
- **Prevent zoom**: 16px input font size

## 🎯 SEO Features

- **Semantic HTML**: Proper heading hierarchy
- **Meta tags**: Comprehensive meta information
- **Open Graph**: Social media sharing optimization
- **Performance**: Optimized bundle size and loading
- **Accessibility**: WCAG compliant design

## 🚀 Deployment

### **Vercel (Recommended)**
```bash
npm install -g vercel
vercel --prod
```

### **Netlify**
```bash
npm run build
# Upload dist/ folder to Netlify
```

### **GitHub Pages**
```bash
npm run build
# Deploy dist/ folder to gh-pages branch
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### **Development Workflow**
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### **Code Style**
- Use TypeScript for all new code
- Follow existing component patterns
- Add proper type definitions
- Include responsive design considerations
- Write meaningful commit messages

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Côte d'Ivoire Tourism Board** - For destination inspiration
- **React Team** - For the amazing framework
- **Tailwind CSS** - For the utility-first approach
- **shadcn/ui** - For beautiful components
- **Lucide** - For the icon library

## 📞 Support

For support, questions, or suggestions:
- 📧 Email: [contact@ivorycoasttrips.com](mailto:contact@ivorycoasttrips.com)
- 🐛 Issues: [GitHub Issues](https://github.com/yourusername/ivory-coast-trip-planner/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/yourusername/ivory-coast-trip-planner/discussions)

---

**Made with ❤️ for travelers exploring the beauty of Côte d'Ivoire**
