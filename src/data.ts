export interface Hotel {
  name: string;
  budget: 'Budget' | 'Mid-Range' | 'Luxury';
  description: string;
}

export interface Activity {
  name: string;
  type: 'Beach' | 'Mountain' | 'Culture' | 'Nightlife';
  description: string;
  budget: 'Budget' | 'Mid-Range' | 'Luxury';
  imageUrl: string;
  videoUrl?: string;
}

export interface Restaurant {
  name: string;
  cuisine: string;
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
  { name: 'Assinie-Mafia', type: 'Beach', description: 'A beautiful beach resort town, perfect for relaxation.', budget: 'Mid-Range', imageUrl: 'https://picsum.photos/seed/assinie/400/300', videoUrl: 'https://www.youtube.com/embed/7_n4_s4fKxM' },
  { name: 'Grand-Bassam', type: 'Beach', description: 'A historic town with a beautiful beach and colonial architecture.', budget: 'Budget', imageUrl: 'https://picsum.photos/seed/bassam/400/300' },
  { name: 'Man', type: 'Mountain', description: 'A town in the western mountains, known for its waterfalls and lush scenery.', budget: 'Budget', imageUrl: 'https://picsum.photos/seed/man/400/300' },
  { name: 'Yamoussoukro', type: 'Culture', description: 'The political capital, home to the impressive Basilica of Our Lady of Peace.', budget: 'Mid-Range', imageUrl: 'https://picsum.photos/seed/yamoussoukro/400/300' },
  { name: 'Parc National de Taï', type: 'Culture', description: 'A UNESCO World Heritage site with a rich biodiversity, including pygmy hippos.', budget: 'Luxury', imageUrl: 'https://picsum.photos/seed/tai/400/300' },
  { name: 'Zone 4', type: 'Nightlife', description: 'A vibrant area in Abidjan with many bars, restaurants, and clubs.', budget: 'Mid-Range', imageUrl: 'https://picsum.photos/seed/zone4/400/300' },
  { name: "St. Paul's Cathedral", type: 'Culture', description: 'A unique and modern cathedral in Abidjan with stunning architecture.', budget: 'Budget', imageUrl: 'https://picsum.photos/seed/cathedral/400/300' },
  { name: 'Jardin Botanique de Bingerville', type: 'Culture', description: 'A beautiful botanical garden, perfect for a peaceful stroll.', budget: 'Budget', imageUrl: 'https://picsum.photos/seed/jardin/400/300' },
  { name: 'Sassandra', type: 'Beach', description: "A coastal town with pristine beaches and the historic Governor's Palace.", budget: 'Mid-Range', imageUrl: 'https://picsum.photos/seed/sassandra/400/300' },
];

export const restaurants: Restaurant[] = [
  { name: "Le Toit d'Abidjan", cuisine: 'French', budget: 'Luxury' },
  { name: 'Chez Ambroise', cuisine: 'Ivorian', budget: 'Mid-Range' },
  { name: 'Maquis du Val', cuisine: 'Ivorian', budget: 'Budget' },
  { name: 'Le Bavarois', cuisine: 'German', budget: 'Mid-Range' },
  { name: 'La Croisette', cuisine: 'French', budget: 'Luxury' },
  { name: 'Abidjan Cafe', cuisine: 'International', budget: 'Mid-Range' },
];