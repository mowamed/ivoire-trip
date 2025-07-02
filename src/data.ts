export interface Geolocation {
  lat: number;
  lng: number;
}

export interface Hotel {
  name: string;
  city: string;
  budget: 'Budget' | 'Mid-Range' | 'Luxury';
  description: string;
  cost: number; // Cost per night in USD
  geolocation: Geolocation;
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
  cost: number; // Cost per person in USD
  geolocation: Geolocation;
}

export interface Restaurant {
  name: string;
  city: string;
  cuisine: string;
  budget: 'Budget' | 'Mid-Range' | 'Luxury';
  bestTime: 'Breakfast' | 'Lunch' | 'Dinner';
  cost: number; // Average cost per person in USD
  geolocation: Geolocation;
}

export interface Transportation {
  type: string;
  costPerTrip: number; // Average cost in USD for a trip within a city
  budget: 'Budget' | 'Mid-Range' | 'Luxury';
}

export const hotels: Hotel[] = [
  { name: 'Sofitel Abidjan Hotel Ivoire', city: 'Abidjan', budget: 'Luxury', description: 'An iconic hotel with luxurious rooms, a spa, and multiple restaurants.', cost: 400, geolocation: { lat: 5.3285, lng: -4.0415 } },
  { name: 'Pullman Abidjan', city: 'Abidjan', budget: 'Luxury', description: 'A 5-star hotel in the heart of the business district.', cost: 250, geolocation: { lat: 5.3255, lng: -4.0205 } },
  { name: 'Radisson Blu Hotel, Abidjan Airport', city: 'Abidjan', budget: 'Luxury', description: 'A stylish, modern hotel conveniently located next to the airport.', cost: 280, geolocation: { lat: 5.2570, lng: -3.9280 } },
  { name: 'Azalaï Hotel Abidjan', city: 'Abidjan', budget: 'Mid-Range', description: 'A popular choice for business and leisure travelers, with a rooftop pool.', cost: 180, geolocation: { lat: 5.3089, lng: -3.9934 } },
  { name: 'Seen Hotel Abidjan Plateau', city: 'Abidjan', budget: 'Mid-Range', description: 'A modern and stylish hotel in the city center.', cost: 150, geolocation: { lat: 5.3258, lng: -4.0197 } },
  { name: 'Ibis Abidjan Plateau', city: 'Abidjan', budget: 'Budget', description: 'A comfortable and affordable hotel, great for practical stays.', cost: 80, geolocation: { lat: 5.3248, lng: -4.0199 } },
  { name: 'Leparticulier Hotel', city: 'Abidjan', budget: 'Budget', description: 'A charming boutique hotel with a unique design and a cozy atmosphere.', cost: 100, geolocation: { lat: 5.3138, lng: -4.0044 } },
  { name: 'Nomad Hotel Abidjan', city: 'Abidjan', budget: 'Budget', description: 'A trendy and affordable option in the lively Zone 4 district.', cost: 90, geolocation: { lat: 5.2977, lng: -4.0021 } },
  { name: 'Hotel President', city: 'Yamoussoukro', budget: 'Luxury', description: 'A grand hotel with a golf course and impressive architecture.', cost: 280, geolocation: { lat: 6.8041, lng: -5.2974 } },
  { name: 'Le Rocher', city: 'Man', budget: 'Mid-Range', description: 'A hotel with stunning views of the surrounding mountains.', cost: 120, geolocation: { lat: 7.4110, lng: -7.5500 } },
  { name: 'Hôtel Mont Korhogo', city: 'Korhogo', budget: 'Budget', description: 'Simple and clean accommodation, a perfect base for exploring the Senufo region.', cost: 60, geolocation: { lat: 9.4450, lng: -5.6200 } },
  { name: 'Etoile du Sud', city: 'Grand-Bassam', budget: 'Mid-Range', description: 'A beachfront hotel with a relaxed atmosphere in the historic town.', cost: 130, geolocation: { lat: 5.2001, lng: -3.7432 } },
  { name: 'La Maison de la Lagune', city: 'Assinie', budget: 'Luxury', description: 'An exclusive resort on the shores of the Aby Lagoon.', cost: 350, geolocation: { lat: 5.1325, lng: -3.2890 } },
  { name: 'Villa Anakao', city: 'Assinie', budget: 'Luxury', description: 'A luxurious boutique hotel offering private villas and direct beach access.', cost: 420, geolocation: { lat: 5.1320, lng: -3.2985 } },
  { name: 'Hôtel Le Wharf', city: 'San-Pédro', budget: 'Mid-Range', description: 'A comfortable hotel known for its sea views and proximity to the port.', cost: 110, geolocation: { lat: 4.7450, lng: -6.6300 } },
];

export const activities: Activity[] = [
  { name: 'St. Paul\'s Cathedral', city: 'Abidjan', type: 'Culture', description: 'Admire the unique and modern architecture of this iconic cathedral.', budget: 'Budget', imageUrl: 'https://picsum.photos/seed/cathedral/400/300', durationHours: 2, bestTime: 'Afternoon', cost: 0, geolocation: { lat: 5.3317, lng: -4.0206 } },
  { name: 'Musée des Civilisations de Côte d\'Ivoire', city: 'Abidjan', type: 'Culture', description: 'Explore a vast collection of Ivorian art and historical artifacts.', budget: 'Budget', imageUrl: 'https://picsum.photos/seed/musee/400/300', durationHours: 3, bestTime: 'Afternoon', cost: 10, geolocation: { lat: 5.3290, lng: -4.0225 } },
  { name: 'Galerie Cécile Fakhoury', city: 'Abidjan', type: 'Culture', description: 'A leading contemporary art gallery showcasing talented African artists.', budget: 'Budget', imageUrl: 'https://picsum.photos/seed/gallery/400/300', durationHours: 2, bestTime: 'Afternoon', cost: 0, geolocation: { lat: 5.3145, lng: -4.0040 } },
  { name: 'Marché de Treichville', city: 'Abidjan', type: 'Culture', description: 'Immerse yourself in the bustling local market, a true sensory experience.', budget: 'Budget', imageUrl: 'https://picsum.photos/seed/treichville/400/300', durationHours: 2, bestTime: 'Morning', cost: 0, geolocation: { lat: 5.3050, lng: -4.0150 } },
  { name: 'Banco National Park', city: 'Abidjan', type: 'Exploration', description: 'A primary rainforest within Abidjan, great for a quick nature escape and canopy walks.', budget: 'Budget', imageUrl: 'https://picsum.photos/seed/banco/400/300', durationHours: 3, bestTime: 'Morning', cost: 5, geolocation: { lat: 5.3900, lng: -4.0450 } },
  { name: 'Jardin Botanique de Bingerville', city: 'Abidjan', type: 'Exploration', description: 'Enjoy a peaceful stroll through these lush, historic botanical gardens.', budget: 'Budget', imageUrl: 'https://picsum.photos/seed/jardin/400/300', durationHours: 3, bestTime: 'Morning', cost: 10, geolocation: { lat: 5.3615, lng: -3.8900 } },
  { name: 'Zone 4 Nightlife', city: 'Abidjan', type: 'Nightlife', description: 'Experience the vibrant bars, clubs, and live music of Abidjan\'s top entertainment district.', budget: 'Mid-Range', imageUrl: 'https://picsum.photos/seed/zone4/400/300', durationHours: 4, bestTime: 'Evening', cost: 40, geolocation: { lat: 5.2950, lng: -4.0050 } },
  { name: 'Bushman Café', city: 'Abidjan', type: 'Fun', description: 'A unique establishment with a rooftop, art gallery, and live music.', budget: 'Mid-Range', imageUrl: 'https://picsum.photos/seed/bushman/400/300', durationHours: 4, bestTime: 'Evening', cost: 45, geolocation: { lat: 5.3340, lng: -3.9820 } },
  { name: 'Doraville Amusement Park', city: 'Abidjan', type: 'Fun', description: 'A large amusement park with a variety of rides, a water park, and attractions for all ages.', budget: 'Mid-Range', imageUrl: 'https://picsum.photos/seed/doraville/400/300', durationHours: 5, bestTime: 'Afternoon', cost: 25, geolocation: { lat: 5.2980, lng: -3.9350 } },
  { name: 'Grand-Bassam Historic Town', city: 'Grand-Bassam', type: 'Culture', description: 'Explore the colonial architecture and vibrant art scene of this UNESCO World Heritage site.', budget: 'Budget', imageUrl: 'https://picsum.photos/seed/bassam/400/300', durationHours: 4, bestTime: 'Morning', cost: 20, geolocation: { lat: 5.1965, lng: -3.7380 } },
  { name: 'Grand-Bassam Beach', city: 'Grand-Bassam', type: 'Beach', description: 'Relax on the wide, sandy beaches of this historic coastal town and enjoy fresh seafood.', budget: 'Budget', imageUrl: 'https://picsum.photos/seed/gbbeach/400/300', durationHours: 4, bestTime: 'Morning', cost: 15, geolocation: { lat: 5.1950, lng: -3.7350 } },
  { name: 'Assinie-Mafia Beach', city: 'Assinie', type: 'Beach', description: 'A beautiful beach resort town, perfect for relaxation and water sports on the lagoon and ocean.', budget: 'Mid-Range', imageUrl: 'https://picsum.photos/seed/assinie/400/300', durationHours: 6, bestTime: 'Morning', cost: 50, geolocation: { lat: 5.1340, lng: -3.2845 } },
  { name: 'Îles Ehotilé National Park', city: 'Assinie', type: 'Exploration', description: 'Explore this archipelago by boat, known for its biodiversity and cultural significance.', budget: 'Mid-Range', imageUrl: 'https://picsum.photos/seed/ehotile/400/300', durationHours: 5, bestTime: 'Morning', cost: 40, geolocation: { lat: 5.1760, lng: -3.2250 } },
  { name: 'Basilica of Our Lady of Peace', city: 'Yamoussoukro', type: 'Culture', description: 'Visit the world\'s largest church, a stunning architectural marvel of marble and stained glass.', budget: 'Mid-Range', imageUrl: 'https://picsum.photos/seed/yamoussoukro/400/300', durationHours: 3, bestTime: 'Afternoon', cost: 15, geolocation: { lat: 6.8097, lng: -5.2964 } },
  { name: 'Mount Tonkoui Hike', city: 'Man', type: 'Mountain', description: 'Hike to the highest peak in Ivory Coast for breathtaking views of the lush landscape.', budget: 'Mid-Range', imageUrl: 'https://picsum.photos/seed/man/400/300', durationHours: 8, bestTime: 'Morning', cost: 30, geolocation: { lat: 7.4567, lng: -7.6333 } },
  { name: 'La Cascade Waterfall', city: 'Man', type: 'Exploration', description: 'A beautiful waterfall near Man, surrounded by bamboo forest. Perfect for a refreshing dip.', budget: 'Budget', imageUrl: 'https://picsum.photos/seed/cascade/400/300', durationHours: 3, bestTime: 'Afternoon', cost: 10, geolocation: { lat: 7.4125, lng: -7.5400 } },
  { name: 'Taï National Park Safari', city: 'Taï', type: 'Exploration', description: 'Discover incredible biodiversity, including chimpanzees and pygmy hippos, in this UNESCO site.', budget: 'Luxury', imageUrl: 'https://picsum.photos/seed/tai/400/300', durationHours: 10, bestTime: 'Morning', cost: 100, geolocation: { lat: 5.8667, lng: -7.3500 } },
  { name: 'Comoe National Park', city: 'Bouna', type: 'Exploration', description: 'One of the largest protected areas in West Africa, with diverse ecosystems from savannah to forest.', budget: 'Luxury', imageUrl: 'https://picsum.photos/seed/comoe/400/300', durationHours: 12, bestTime: 'Morning', cost: 120, geolocation: { lat: 9.0917, lng: -3.7833 } },
  { name: 'Monogaga Beach', city: 'Sassandra', type: 'Beach', description: 'A picturesque and secluded beach with golden sand and clear waters, ideal for tranquility.', budget: 'Budget', imageUrl: 'https://picsum.photos/seed/monogaga/400/300', durationHours: 4, bestTime: 'Afternoon', cost: 20, geolocation: { lat: 4.9358, lng: -6.4675 } },
  { name: 'Port of San-Pédro Tour', city: 'San-Pédro', type: 'Exploration', description: 'Discover the operations of the world\'s leading cocoa exporting port.', budget: 'Budget', imageUrl: 'https://picsum.photos/seed/sanpedroport/400/300', durationHours: 2, bestTime: 'Morning', cost: 10, geolocation: { lat: 4.7380, lng: -6.6200 } },
  { name: 'Village des Tisserands', city: 'Korhogo', type: 'Culture', description: 'Visit the weavers\' village of Waraniéné to see artisans create famous Senufo textiles.', budget: 'Budget', imageUrl: 'https://picsum.photos/seed/korhogo/400/300', durationHours: 3, bestTime: 'Morning', cost: 5, geolocation: { lat: 9.3800, lng: -5.6000 } },
];

export const restaurants: Restaurant[] = [
  { name: 'Le Toit d\'Abidjan', city: 'Abidjan', cuisine: 'French', budget: 'Luxury', bestTime: 'Dinner', cost: 100, geolocation: { lat: 5.3285, lng: -4.0415 } },
  { name: 'Kajazoma', city: 'Abidjan', cuisine: 'Ivorian', budget: 'Luxury', bestTime: 'Dinner', cost: 110, geolocation: { lat: 5.2750, lng: -3.9650 } },
  { name: 'Le Marlin Bleu', city: 'Abidjan', cuisine: 'Seafood', budget: 'Luxury', bestTime: 'Dinner', cost: 95, geolocation: { lat: 5.2760, lng: -3.9660 } },
  { name: 'Saakan', city: 'Abidjan', cuisine: 'African', budget: 'Mid-Range', bestTime: 'Dinner', cost: 45, geolocation: { lat: 5.3250, lng: -4.0180 } },
  { name: 'Chez Ambroise', city: 'Abidjan', cuisine: 'Ivorian', budget: 'Mid-Range', bestTime: 'Lunch', cost: 30, geolocation: { lat: 5.2934, lng: -4.0016 } },
  { name: 'La Taverne Romaine', city: 'Abidjan', cuisine: 'Italian', budget: 'Mid-Range', bestTime: 'Dinner', cost: 50, geolocation: { lat: 5.2945, lng: -4.0042 } },
  { name: 'Maquis du Val', city: 'Abidjan', cuisine: 'Ivorian', budget: 'Budget', bestTime: 'Dinner', cost: 15, geolocation: { lat: 5.3198, lng: -3.9855 } },
  { name: 'Le Débarcadère', city: 'Abidjan', cuisine: 'Ivorian', budget: 'Budget', bestTime: 'Lunch', cost: 12, geolocation: { lat: 5.3040, lng: -4.0185 } },
  { name: 'Nounou', city: 'Abidjan', cuisine: 'Ivorian', budget: 'Budget', bestTime: 'Lunch', cost: 8, geolocation: { lat: 5.2989, lng: -3.9875 } },
  { name: 'Le Grand Large', city: 'Assinie', cuisine: 'Seafood', budget: 'Luxury', bestTime: 'Dinner', cost: 90, geolocation: { lat: 5.1330, lng: -3.2870 } },
  { name: 'Chez Georges', city: 'Grand-Bassam', cuisine: 'Ivorian', budget: 'Mid-Range', bestTime: 'Lunch', cost: 25, geolocation: { lat: 5.2005, lng: -3.7445 } },
  { name: 'Le Wafou', city: 'Yamoussoukro', cuisine: 'Ivorian', budget: 'Mid-Range', bestTime: 'Dinner', cost: 35, geolocation: { lat: 6.8180, lng: -5.2780 } },
  { name: 'Le Maquis', city: 'Man', cuisine: 'Ivorian', budget: 'Budget', bestTime: 'Lunch', cost: 10, geolocation: { lat: 7.4050, lng: -7.5540 } },
  { name: 'Le Beaujolais', city: 'San-Pédro', cuisine: 'French', budget: 'Mid-Range', bestTime: 'Dinner', cost: 40, geolocation: { lat: 4.7465, lng: -6.6320 } },
  { name: 'Le Bon Koin', city: 'Korhogo', cuisine: 'Ivorian', budget: 'Budget', bestTime: 'Lunch', cost: 7, geolocation: { lat: 9.4550, lng: -5.6300 } },
];

export const transportationOptions: Transportation[] = [
  { type: 'Woro-Woro (Shared Taxi)', costPerTrip: 2, budget: 'Budget' },
  { type: 'Taxi (Metered)', costPerTrip: 15, budget: 'Budget' },
  { type: 'VTC (Ride-sharing e.g. Yango)', costPerTrip: 20, budget: 'Mid-Range' },
  { type: 'Private Car with Driver', costPerTrip: 70, budget: 'Luxury' },
];

// Travel times in hours by road between major cities
export const travelTimes: { [key: string]: { [key: string]: number } } = {
  Abidjan: { 'Grand-Bassam': 1, Assinie: 2, Yamoussoukro: 3, Man: 8, Taï: 10, Sassandra: 6, 'San-Pédro': 5, Bouna: 9, Korhogo: 8 },
  'Grand-Bassam': { Abidjan: 1, Assinie: 1, Yamoussoukro: 4, Man: 9, Taï: 11, Sassandra: 7, 'San-Pédro': 6, Bouna: 10, Korhogo: 9 },
  Assinie: { Abidjan: 2, 'Grand-Bassam': 1, Yamoussoukro: 5, Man: 10, Taï: 12, Sassandra: 8, 'San-Pédro': 7, Bouna: 11, Korhogo: 10 },
  Yamoussoukro: { Abidjan: 3, 'Grand-Bassam': 4, Assinie: 5, Man: 5, Taï: 7, Sassandra: 9, 'San-Pédro': 8, Bouna: 6, Korhogo: 5 },
  Man: { Abidjan: 8, 'Grand-Bassam': 9, Assinie: 10, Yamoussoukro: 5, Taï: 6, Sassandra: 12, 'San-Pédro': 11, Bouna: 11, Korhogo: 6 },
  Taï: { Abidjan: 10, 'Grand-Bassam': 11, Assinie: 12, Yamoussoukro: 7, Man: 6, Sassandra: 8, 'San-Pédro': 7, Bouna: 13, Korhogo: 12 },
  Sassandra: { Abidjan: 6, 'Grand-Bassam': 7, Assinie: 8, Yamoussoukro: 9, Man: 12, Taï: 8, 'San-Pédro': 1, Bouna: 15, Korhogo: 14 },
  'San-Pédro': { Abidjan: 5, 'Grand-Bassam': 6, Assinie: 7, Yamoussoukro: 8, Man: 11, Taï: 7, Sassandra: 1, Bouna: 14, Korhogo: 13 },
  Bouna: { Abidjan: 9, 'Grand-Bassam': 10, Assinie: 11, Yamoussoukro: 6, Man: 11, Taï: 13, Sassandra: 15, 'San-Pédro': 14, Korhogo: 5 },
  Korhogo: { Abidjan: 8, 'Grand-Bassam': 9, Assinie: 10, Yamoussoukro: 5, Man: 6, Taï: 12, Sassandra: 14, 'San-Pédro': 13, Bouna: 5 },
};