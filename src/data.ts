
export interface Hotel {
  name: string;
  city: string;
  budget: 'Budget' | 'Mid-Range' | 'Luxury';
  description: string;
  cost: number;
}

export interface Activity {
  name: string;
  city: string;
  type: 'Beach' | 'Mountain' | 'Culture' | 'Nightlife' | 'Exploration' | 'Fun';
  description: string;
  budget: 'Budget' | 'Mid-Range' | 'Luxury';
  imageUrl: string;
  videoUrl?: string;
  durationHours: number;
  bestTime: 'Morning' | 'Afternoon' | 'Evening';
  cost: number;
}

export interface Restaurant {
  name: string;
  city: string;
  cuisine: string;
  budget: 'Budget' | 'Mid-Range' | 'Luxury';
  bestTime: 'Breakfast' | 'Lunch' | 'Dinner';
  cost: number;
}

export interface Transportation {
  type: string;
  costPerTrip: number;
  budget: 'Budget' | 'Mid-Range' | 'Luxury';
}

export const hotels: Hotel[] = [
  { name: 'Hotel Ivoire', city: 'Abidjan', budget: 'Luxury', description: 'A luxurious hotel with a pool and a view of the lagoon.', cost: 300 },
  { name: 'Pullman Abidjan', city: 'Abidjan', budget: 'Luxury', description: 'A 5-star hotel in the heart of the business district.', cost: 250 },
  { name: 'Sofitel Abidjan Hotel Ivoire', city: 'Abidjan', budget: 'Luxury', description: 'An iconic hotel with luxurious rooms, a spa, and multiple restaurants.', cost: 400 },
  { name: 'Seen Hotel Abidjan Plateau', city: 'Abidjan', budget: 'Mid-Range', description: 'A modern and stylish hotel in the city center.', cost: 150 },
  { name: 'Ibis Abidjan Plateau', city: 'Abidjan', budget: 'Budget', description: 'A comfortable and affordable hotel.', cost: 80 },
  { name: 'Azalaï Hotel Abidjan', city: 'Abidjan', budget: 'Mid-Range', description: 'A popular choice for business and leisure travelers, with a rooftop pool.', cost: 180 },
  { name: 'Leparticulier Hotel', city: 'Abidjan', budget: 'Budget', description: 'A charming boutique hotel with a unique design.', cost: 100 },
  { name: 'Hotel President', city: 'Yamoussoukro', budget: 'Luxury', description: 'A grand hotel with a golf course and impressive architecture.', cost: 280 },
  { name: 'Le Rocher', city: 'Man', budget: 'Mid-Range', description: 'A hotel with stunning views of the surrounding mountains.', cost: 120 },
  { name: 'Etoile du Sud', city: 'Grand-Bassam', budget: 'Mid-Range', description: 'A beachfront hotel with a relaxed atmosphere.', cost: 130 },
  { name: 'La Maison de la Lagune', city: 'Assinie', budget: 'Luxury', description: 'An exclusive resort on the shores of the Aby Lagoon.', cost: 350 },
];

export const activities: Activity[] = [
  { name: 'Assinie-Mafia Beach', city: 'Assinie', type: 'Beach', description: 'A beautiful beach resort town, perfect for relaxation and water sports.', budget: 'Mid-Range', imageUrl: 'https://picsum.photos/seed/assinie/400/300', videoUrl: 'https://www.youtube.com/embed/7_n4_s4fKxM', durationHours: 6, bestTime: 'Morning', cost: 50 },
  { name: 'Grand-Bassam Historic Town', city: 'Grand-Bassam', type: 'Culture', description: 'Explore the historic colonial architecture and vibrant art scene.', budget: 'Budget', imageUrl: 'https://picsum.photos/seed/bassam/400/300', durationHours: 4, bestTime: 'Morning', cost: 20 },
  { name: 'Mount Tonkoui Hike', city: 'Man', type: 'Mountain', description: 'Hike to the highest peak in Ivory Coast for breathtaking views.', budget: 'Mid-Range', imageUrl: 'https://picsum.photos/seed/man/400/300', durationHours: 8, bestTime: 'Morning', cost: 30 },
  { name: 'Basilica of Our Lady of Peace', city: 'Yamoussoukro', type: 'Culture', description: "Visit the world's largest church, a stunning architectural marvel.", budget: 'Mid-Range', imageUrl: 'https://picsum.photos/seed/yamoussoukro/400/300', durationHours: 3, bestTime: 'Afternoon', cost: 15 },
  { name: 'Taï National Park Safari', city: 'Taï', type: 'Exploration', description: 'Discover diverse wildlife, including pygmy hippos, in this UNESCO site.', budget: 'Luxury', imageUrl: 'https://picsum.photos/seed/tai/400/300', durationHours: 10, bestTime: 'Morning', cost: 100 },
  { name: 'Zone 4 Nightlife', city: 'Abidjan', type: 'Nightlife', description: "Experience the vibrant bars, clubs, and live music of Abidjan's entertainment district.", budget: 'Mid-Range', imageUrl: 'https://picsum.photos/seed/zone4/400/300', durationHours: 4, bestTime: 'Evening', cost: 40 },
  { name: "St. Paul's Cathedral Abidjan", city: 'Abidjan', type: 'Culture', description: "Admire the unique and modern architecture of Abidjan's iconic cathedral.", budget: 'Budget', imageUrl: 'https://picsum.photos/seed/cathedral/400/300', durationHours: 2, bestTime: 'Afternoon', cost: 0 },
  { name: 'Jardin Botanique de Bingerville', city: 'Abidjan', type: 'Exploration', description: 'Enjoy a peaceful stroll through this beautiful botanical garden.', budget: 'Budget', imageUrl: 'https://picsum.photos/seed/jardin/400/300', durationHours: 3, bestTime: 'Morning', cost: 10 },
  { name: 'Sassandra Beaches', city: 'Sassandra', type: 'Beach', description: 'Relax on the pristine beaches and visit the historic Governor\'s Palace.', budget: 'Mid-Range', imageUrl: 'https://picsum.photos/seed/sassandra/400/300', durationHours: 5, bestTime: 'Morning', cost: 25 },
  { name: 'Banco National Park', city: 'Abidjan', type: 'Exploration', description: 'A rainforest park within Abidjan, great for a quick nature escape.', budget: 'Budget', imageUrl: 'https://picsum.photos/seed/banco/400/300', durationHours: 3, bestTime: 'Afternoon', cost: 5 },
  { name: 'Marché de Treichville', city: 'Abidjan', type: 'Culture', description: 'Immerse yourself in the bustling local market, a sensory experience.', budget: 'Budget', imageUrl: 'https://picsum.photos/seed/treichville/400/300', durationHours: 2, bestTime: 'Morning', cost: 0 },
  { name: 'Cocody Residential Area', city: 'Abidjan', type: 'Exploration', description: 'Drive through or walk around the upscale residential area with beautiful villas.', budget: 'Budget', imageUrl: 'https://picsum.photos/seed/cocody/400/300', durationHours: 2, bestTime: 'Afternoon', cost: 0 },
  { name: 'La Cascade Waterfall', city: 'Man', type: 'Exploration', description: 'A beautiful waterfall near Man, perfect for a refreshing dip.', budget: 'Budget', imageUrl: 'https://picsum.photos/seed/cascade/400/300', durationHours: 3, bestTime: 'Afternoon', cost: 10 },
  { name: 'Comoe National Park', city: 'Bouna', type: 'Exploration', description: 'One of the largest protected areas in West Africa, with diverse ecosystems.', budget: 'Luxury', imageUrl: 'https://picsum.photos/seed/comoe/400/300', durationHours: 12, bestTime: 'Morning', cost: 120 },
  { name: 'Life Star', city: 'Abidjan', type: 'Nightlife', description: 'An upscale bar in Plateau known for its great cocktails and vibrant nightlife.', budget: 'Luxury', imageUrl: 'https://picsum.photos/seed/lifestar/400/300', durationHours: 3, bestTime: 'Evening', cost: 60 },
  { name: 'The Pharmacy Abidjan', city: 'Abidjan', type: 'Nightlife', description: 'A unique cocktail bar with an innovative drink menu and a stylish lounge atmosphere.', budget: 'Mid-Range', imageUrl: 'https://picsum.photos/seed/pharmacy/400/300', durationHours: 2, bestTime: 'Evening', cost: 30 },
  { name: 'Le Bar Blanc', city: 'Abidjan', type: 'Nightlife', description: 'A popular spot in Abidjan for cocktails, music, and a lively atmosphere.', budget: 'Mid-Range', imageUrl: 'https://picsum.photos/seed/barblanc/400/300', durationHours: 3, bestTime: 'Evening', cost: 35 },
  { name: 'Bushman Café', city: 'Abidjan', type: 'Fun', description: 'A unique establishment with a rooftop, art gallery, and live music.', budget: 'Mid-Range', imageUrl: 'https://picsum.photos/seed/bushman/400/300', durationHours: 4, bestTime: 'Evening', cost: 45 },
  { name: 'Doraville', city: 'Abidjan', type: 'Fun', description: 'A large amusement park with a variety of rides and attractions.', budget: 'Mid-Range', imageUrl: 'https://picsum.photos/seed/doraville/400/300', durationHours: 5, bestTime: 'Afternoon', cost: 25 },
];

export const restaurants: Restaurant[] = [
  { name: "Le Toit d'Abidjan", city: 'Abidjan', cuisine: 'French', budget: 'Luxury', bestTime: 'Dinner', cost: 100 },
  { name: 'Chez Ambroise', city: 'Abidjan', cuisine: 'Ivorian', budget: 'Mid-Range', bestTime: 'Lunch', cost: 30 },
  { name: 'Maquis du Val', city: 'Abidjan', cuisine: 'Ivorian', budget: 'Budget', bestTime: 'Dinner', cost: 15 },
  { name: 'Le Bavarois', city: 'Abidjan', cuisine: 'German', budget: 'Mid-Range', bestTime: 'Dinner', cost: 40 },
  { name: 'La Croisette', city: 'Abidjan', cuisine: 'French', budget: 'Luxury', bestTime: 'Lunch', cost: 80 },
  { name: 'Abidjan Cafe', city: 'Abidjan', cuisine: 'International', budget: 'Mid-Range', bestTime: 'Breakfast', cost: 20 },
  { name: 'Restaurant Universitaire', city: 'Abidjan', cuisine: 'Ivorian', budget: 'Budget', bestTime: 'Lunch', cost: 5 },
  { name: 'La Taverne Romaine', city: 'Abidjan', cuisine: 'Italian', budget: 'Mid-Range', bestTime: 'Dinner', cost: 50 },
  { name: 'Le Grand Large', city: 'Assinie', cuisine: 'Seafood', budget: 'Luxury', bestTime: 'Dinner', cost: 90 },
  { name: 'Chez Georges', city: 'Grand-Bassam', cuisine: 'Ivorian', budget: 'Mid-Range', bestTime: 'Lunch', cost: 25 },
  { name: 'Le Wafou', city: 'Yamoussoukro', cuisine: 'Ivorian', budget: 'Mid-Range', bestTime: 'Dinner', cost: 35 },
  { name: 'Le Maquis', city: 'Man', cuisine: 'Ivorian', budget: 'Budget', bestTime: 'Lunch', cost: 10 },
  { name: 'Saakan', city: 'Abidjan', cuisine: 'African', budget: 'Mid-Range', bestTime: 'Dinner', cost: 45 },
  { name: 'Le Débarcadère', city: 'Abidjan', cuisine: 'Ivorian', budget: 'Budget', bestTime: 'Lunch', cost: 12 },
];

export const transportationOptions: Transportation[] = [
  { type: 'Taxi', costPerTrip: 15, budget: 'Budget' },
  { type: 'VTC (Ride-sharing)', costPerTrip: 20, budget: 'Mid-Range' },
  { type: 'Private Car with Driver', costPerTrip: 70, budget: 'Luxury' },
];

export const travelTimes: { [key: string]: { [key: string]: number } } = {
  Abidjan: { 'Grand-Bassam': 1, Assinie: 2, Yamoussoukro: 3, Man: 8, Taï: 10, Sassandra: 6, Bouna: 9 },
  'Grand-Bassam': { Abidjan: 1, Assinie: 1, Yamoussoukro: 4, Man: 9, Taï: 11, Sassandra: 7, Bouna: 10 },
  Assinie: { Abidjan: 2, 'Grand-Bassam': 1, Yamoussoukro: 5, Man: 10, Taï: 12, Sassandra: 8, Bouna: 11 },
  Yamoussoukro: { Abidjan: 3, 'Grand-Bassam': 4, Assinie: 5, Man: 5, Taï: 7, Sassandra: 9, Bouna: 6 },
  Man: { Abidjan: 8, 'Grand-Bassam': 9, Assinie: 10, Yamoussoukro: 5, Taï: 6, Sassandra: 12, Bouna: 11 },
  Taï: { Abidjan: 10, 'Grand-Bassam': 11, Assinie: 12, Yamoussoukro: 7, Man: 6, Sassandra: 14, Bouna: 13 },
  Sassandra: { Abidjan: 6, 'Grand-Bassam': 7, Assinie: 8, Yamoussoukro: 9, Man: 12, Taï: 14, Bouna: 15 },
  Bouna: { Abidjan: 9, 'Grand-Bassam': 10, Assinie: 11, Yamoussoukro: 6, Man: 11, Taï: 13, Sassandra: 15 },
};
