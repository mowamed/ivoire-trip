
export interface Hotel {
  name: string;
  budget: 'Budget' | 'Mid-Range' | 'Luxury';
  description: string;
}

export interface Activity {
  name: string;
  type: 'Beach' | 'Mountain' | 'Culture' | 'Nightlife' | 'Exploration';
  description: string;
  budget: 'Budget' | 'Mid-Range' | 'Luxury';
  imageUrl: string;
  videoUrl?: string;
  durationHours: number;
  bestTime: 'Morning' | 'Afternoon' | 'Evening';
}

export interface Restaurant {
  name: string;
  cuisine: string;
  budget: 'Budget' | 'Mid-Range' | 'Luxury';
  bestTime: 'Breakfast' | 'Lunch' | 'Dinner';
}

export interface Transportation {
  type: string;
  costPerTrip: number;
  budget: 'Budget' | 'Mid-Range' | 'Luxury';
}

export const hotels: Hotel[] = [
  { name: 'Hotel Ivoire', budget: 'Luxury', description: 'A luxurious hotel with a pool and a view of the lagoon.' },
  { name: 'Pullman Abidjan', budget: 'Luxury', description: 'A 5-star hotel in the heart of the business district.' },
  { name: 'Sofitel Abidjan Hotel Ivoire', budget: 'Luxury', description: 'An iconic hotel with luxurious rooms, a spa, and multiple restaurants.'},
  { name: 'Seen Hotel Abidjan Plateau', budget: 'Mid-Range', description: 'A modern and stylish hotel in the city center.' },
  { name: 'Ibis Abidjan Plateau', budget: 'Budget', description: 'A comfortable and affordable hotel.' },
  { name: 'Azalaï Hotel Abidjan', budget: 'Mid-Range', description: 'A popular choice for business and leisure travelers, with a rooftop pool.'},
  { name: 'Leparticulier Hotel', budget: 'Budget', description: 'A charming boutique hotel with a unique design.'},
];

export const activities: Activity[] = [
  { name: 'Assinie-Mafia Beach', type: 'Beach', description: 'A beautiful beach resort town, perfect for relaxation and water sports.', budget: 'Mid-Range', imageUrl: 'https://picsum.photos/seed/assinie/400/300', videoUrl: 'https://www.youtube.com/embed/7_n4_s4fKxM', durationHours: 6, bestTime: 'Morning' },
  { name: 'Grand-Bassam Historic Town', type: 'Culture', description: 'Explore the historic colonial architecture and vibrant art scene.', budget: 'Budget', imageUrl: 'https://picsum.photos/seed/bassam/400/300', durationHours: 4, bestTime: 'Morning' },
  { name: 'Mount Tonkoui Hike (Man)', type: 'Mountain', description: 'Hike to the highest peak in Ivory Coast for breathtaking views.', budget: 'Mid-Range', imageUrl: 'https://picsum.photos/seed/man/400/300', durationHours: 8, bestTime: 'Morning' },
  { name: 'Basilica of Our Lady of Peace (Yamoussoukro)', type: 'Culture', description: 'Visit the world's largest church, a stunning architectural marvel.', budget: 'Mid-Range', imageUrl: 'https://picsum.photos/seed/yamoussoukro/400/300', durationHours: 3, bestTime: 'Afternoon' },
  { name: 'Taï National Park Safari', type: 'Exploration', description: 'Discover diverse wildlife, including pygmy hippos, in this UNESCO site.', budget: 'Luxury', imageUrl: 'https://picsum.photos/seed/tai/400/300', durationHours: 10, bestTime: 'Morning' },
  { name: 'Zone 4 Nightlife', type: 'Nightlife', description: 'Experience the vibrant bars, clubs, and live music of Abidjan's entertainment district.', budget: 'Mid-Range', imageUrl: 'https://picsum.photos/seed/zone4/400/300', durationHours: 4, bestTime: 'Evening' },
  { name: 'St. Paul's Cathedral Abidjan', type: 'Culture', description: 'Admire the unique and modern architecture of Abidjan's iconic cathedral.', budget: 'Budget', imageUrl: 'https://picsum.photos/seed/cathedral/400/300', durationHours: 2, bestTime: 'Afternoon' },
  { name: 'Jardin Botanique de Bingerville', type: 'Exploration', description: 'Enjoy a peaceful stroll through this beautiful botanical garden.', budget: 'Budget', imageUrl: 'https://picsum.photos/seed/jardin/400/300', durationHours: 3, bestTime: 'Morning' },
  { name: 'Sassandra Beaches', type: 'Beach', description: 'Relax on the pristine beaches and visit the historic Governor's Palace.', budget: 'Mid-Range', imageUrl: 'https://picsum.photos/seed/sassandra/400/300', durationHours: 5, bestTime: 'Morning' },
  { name: 'Banco National Park', type: 'Exploration', description: 'A rainforest park within Abidjan, great for a quick nature escape.', budget: 'Budget', imageUrl: 'https://picsum.photos/seed/banco/400/300', durationHours: 3, bestTime: 'Afternoon' },
  { name: 'Marché de Treichville', type: 'Culture', description: 'Immerse yourself in the bustling local market, a sensory experience.', budget: 'Budget', imageUrl: 'https://picsum.photos/seed/treichville/400/300', durationHours: 2, bestTime: 'Morning' },
  { name: 'Cocody Residential Area', type: 'Exploration', description: 'Drive through or walk around the upscale residential area with beautiful villas.', budget: 'Budget', imageUrl: 'https://picsum.photos/seed/cocody/400/300', durationHours: 2, bestTime: 'Afternoon' },
];

export const restaurants: Restaurant[] = [
  { name: "Le Toit d'Abidjan", cuisine: 'French', budget: 'Luxury', bestTime: 'Dinner' },
  { name: 'Chez Ambroise', cuisine: 'Ivorian', budget: 'Mid-Range', bestTime: 'Lunch' },
  { name: 'Maquis du Val', cuisine: 'Ivorian', budget: 'Budget', bestTime: 'Dinner' },
  { name: 'Le Bavarois', cuisine: 'German', budget: 'Mid-Range', bestTime: 'Dinner' },
  { name: 'La Croisette', cuisine: 'French', budget: 'Luxury', bestTime: 'Lunch' },
  { name: 'Abidjan Cafe', cuisine: 'International', budget: 'Mid-Range', bestTime: 'Breakfast' },
  { name: 'Restaurant Universitaire', cuisine: 'Ivorian', budget: 'Budget', bestTime: 'Lunch' },
  { name: 'La Taverne Romaine', cuisine: 'Italian', budget: 'Mid-Range', bestTime: 'Dinner' },
];

export const transportationOptions: Transportation[] = [
  { type: 'Taxi', costPerTrip: 10, budget: 'Budget' },
  { type: 'VTC (Ride-sharing)', costPerTrip: 15, budget: 'Mid-Range' },
  { type: 'Private Car with Driver', costPerTrip: 50, budget: 'Luxury' },
];
