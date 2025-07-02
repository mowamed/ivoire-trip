export interface Geolocation {
  lat: number;
  lng: number;
}

export interface Hotel {
  name:string;
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
  costPerTrip: number; // Average cost in USD for a trip/journey
  budget: 'Budget' | 'Mid-Range' | 'Luxury';
}

export const hotels: Hotel[] = [
  // Abidjan
  { name: 'Sofitel Abidjan Hotel Ivoire', city: 'Abidjan', budget: 'Luxury', description: 'An iconic hotel with luxurious rooms, a spa, 3D cinema, and multiple restaurants.', cost: 400, geolocation: { lat: 5.3285, lng: -4.0415 } },
  { name: 'Pullman Abidjan', city: 'Abidjan', budget: 'Luxury', description: 'A 5-star hotel in the heart of the business district with fantastic city views.', cost: 250, geolocation: { lat: 5.3255, lng: -4.0205 } },
  { name: 'Heden Golf Hotel', city: 'Abidjan', budget: 'Luxury', description: 'A serene resort-style hotel with a large pool complex and golf course access.', cost: 220, geolocation: { lat: 5.3345, lng: -3.9870 } },
  { name: 'Radisson Blu Hotel, Abidjan Airport', city: 'Abidjan', budget: 'Luxury', description: 'Conveniently located by the airport with high-end amenities and a pool.', cost: 300, geolocation: { lat: 5.2575, lng: -3.9301 } },
  { name: 'La Maison Palmier', city: 'Abidjan', budget: 'Luxury', description: 'A chic and intimate boutique hotel known for its design and personalized service.', cost: 350, geolocation: { lat: 5.3412, lng: -3.9998 } },
  { name: 'Noom Hotel Abidjan Plateau', city: 'Abidjan', budget: 'Luxury', description: 'A contemporary 5-star hotel known for its vibrant atmosphere, nightclub, and outdoor pool.', cost: 280, geolocation: { lat: 5.3267, lng: -4.0211 } },
  { name: 'Mövenpick Hotel Abidjan', city: 'Abidjan', budget: 'Luxury', description: 'Offers Swiss hospitality and premium services in a prime central location in Le Plateau.', cost: 320, geolocation: { lat: 5.3271, lng: -4.0235 } },
  { name: 'Azalaï Hotel Abidjan', city: 'Abidjan', budget: 'Mid-Range', description: 'A popular choice for business and leisure travelers, with a rooftop pool.', cost: 180, geolocation: { lat: 5.3089, lng: -3.9934 } },
  { name: 'Seen Hotel Abidjan Plateau', city: 'Abidjan', budget: 'Mid-Range', description: 'A modern and stylish hotel in the city center.', cost: 150, geolocation: { lat: 5.3258, lng: -4.0197 } },
  { name: 'Hotel Particulier', city: 'Abidjan', budget: 'Mid-Range', description: 'A stylish and intimate boutique hotel in the heart of Cocody.', cost: 160, geolocation: { lat: 5.3408, lng: -3.9985 } },
  { name: 'Villa Jaddis', city: 'Abidjan', budget: 'Mid-Range', description: 'A charming guesthouse with a beautiful garden and a tranquil atmosphere.', cost: 140, geolocation: { lat: 5.3488, lng: -4.0005 } },
  { name: 'Le Wafou', city: 'Abidjan', budget: 'Mid-Range', description: 'Unique resort-like hotel with an African-themed garden, outdoor pool, and a water park.', cost: 130, geolocation: { lat: 5.2781, lng: -3.9842 } },
  { name: 'Ibis Abidjan Plateau', city: 'Abidjan', budget: 'Budget', description: 'A comfortable and affordable hotel, great for practical stays.', cost: 80, geolocation: { lat: 5.3248, lng: -4.0199 } },
  { name: 'Nomad Hotel Abidjan', city: 'Abidjan', budget: 'Budget', description: 'A trendy and affordable option in the lively Zone 4 district.', cost: 90, geolocation: { lat: 5.2977, lng: -4.0021 } },
  { name: 'The People Hostel - Abidjan', city: 'Abidjan', budget: 'Budget', description: 'A modern hostel offering both private rooms and dorms, with a friendly social vibe.', cost: 40, geolocation: { lat: 5.3155, lng: -4.0082 } },
  // Yamoussoukro
  { name: 'Hotel President', city: 'Yamoussoukro', budget: 'Luxury', description: 'A grand hotel with a golf course and impressive architecture.', cost: 280, geolocation: { lat: 6.8041, lng: -5.2974 } },
  { name: 'Hotel Akraya', city: 'Yamoussoukro', budget: 'Mid-Range', description: 'A comfortable hotel with modern amenities and a central location.', cost: 100, geolocation: { lat: 6.8210, lng: -5.2785 } },
  { name: 'Le Brennus', city: 'Yamoussoukro', budget: 'Mid-Range', description: 'A welcoming hotel with a restaurant and bar, known for its friendly service.', cost: 90, geolocation: { lat: 6.8195, lng: -5.2810 } },
  // Man
  { name: 'Le Rocher', city: 'Man', budget: 'Mid-Range', description: 'A hotel with stunning views of the surrounding mountains.', cost: 120, geolocation: { lat: 7.4110, lng: -7.5500 } },
  { name: 'Hôtel Les Cascades', city: 'Man', budget: 'Mid-Range', description: 'Located near the famous waterfalls, offering a scenic and relaxing stay.', cost: 110, geolocation: { lat: 7.4020, lng: -7.5590 } },
  // Korhogo
  { name: 'Hôtel Mont Korhogo', city: 'Korhogo', budget: 'Budget', description: 'Simple and clean accommodation, a perfect base for exploring the Senufo region.', cost: 60, geolocation: { lat: 9.4450, lng: -5.6200 } },
  { name: 'Olympe Hotel', city: 'Korhogo', budget: 'Mid-Range', description: 'A comfortable hotel with a swimming pool and restaurant, considered one of the best in the city.', cost: 75, geolocation: { lat: 9.4550, lng: -5.6300 } },
  // Grand-Bassam
  { name: 'Etoile du Sud', city: 'Grand-Bassam', budget: 'Mid-Range', description: 'A beachfront hotel with a relaxed atmosphere in the historic town.', cost: 130, geolocation: { lat: 5.2001, lng: -3.7432 } },
  { name: 'Koral Beach Hotel', city: 'Grand-Bassam', budget: 'Mid-Range', description: 'A friendly hotel with direct beach access and a popular restaurant.', cost: 110, geolocation: { lat: 5.1985, lng: -3.7401 } },
  { name: 'Assoyam Beach', city: 'Grand-Bassam', budget: 'Mid-Range', description: 'A well-regarded beachfront hotel with a large pool and spacious rooms.', cost: 125, geolocation: { lat: 5.1995, lng: -3.7415 } },
  // Assinie
  { name: 'La Maison de la Lagune', city: 'Assinie', budget: 'Luxury', description: 'An exclusive resort on the shores of the Aby Lagoon.', cost: 350, geolocation: { lat: 5.1325, lng: -3.2890 } },
  { name: 'Coucoué Lodge', city: 'Assinie', budget: 'Mid-Range', description: 'Charming bungalows located between the lagoon and the sea.', cost: 140, geolocation: { lat: 5.1378, lng: -3.4012 } },
  { name: 'African Queen Lodge', city: 'Assinie', budget: 'Mid-Range', description: 'A beautiful lodge with a private beach area, pool, and restaurant.', cost: 160, geolocation: { lat: 5.1355, lng: -3.3510 } },
  // San-Pédro
  { name: 'Hôtel Le Wharf', city: 'San-Pédro', budget: 'Mid-Range', description: 'A comfortable hotel known for its sea views and proximity to the port.', cost: 110, geolocation: { lat: 4.7450, lng: -6.6300 } },
  { name: 'Hotel Palm Rock Beach', city: 'San-Pédro', budget: 'Mid-Range', description: 'A relaxing beachfront hotel with a pool and restaurant.', cost: 100, geolocation: { lat: 4.7310, lng: -6.6550 } },
  // Bouaké
  { name: 'Hotel Mon Afrik', city: 'Bouaké', budget: 'Mid-Range', description: 'A well-regarded hotel in Bouaké, offering comfortable rooms and a restaurant.', cost: 85, geolocation: { lat: 7.6880, lng: -5.0350 } },
  { name: 'Hôtel Le Bahut', city: 'Bouaké', budget: 'Budget', description: 'A simple and affordable option for travelers visiting Bouaké.', cost: 55, geolocation: { lat: 7.6910, lng: -5.0320 } },
  // Sassandra
  { name: 'Le Pollet', city: 'Sassandra', budget: 'Mid-Range', description: 'Charming beachfront bungalows offering a peaceful retreat with beautiful ocean views.', cost: 95, geolocation: { lat: 4.9480, lng: -6.0910 } },
  { name: 'Hôtel La Paillote', city: 'Sassandra', budget: 'Budget', description: 'Simple and clean accommodation, perfectly located for exploring the historic town and beaches.', cost: 50, geolocation: { lat: 4.9525, lng: -6.0820 } },
  // Daloa
  { name: 'La Résidence Hôtelière', city: 'Daloa', budget: 'Mid-Range', description: 'A modern hotel offering comfortable rooms, a restaurant, and conference facilities.', cost: 80, geolocation: { lat: 6.8850, lng: -6.4550 } },
  // Bondoukou
  { name: 'Hôtel Eléphant', city: 'Bondoukou', budget: 'Budget', description: 'A basic but functional hotel, providing a convenient base for exploring the historic city.', cost: 45, geolocation: { lat: 8.0400, lng: -2.8040 } },
  // Aboisso
  { name: 'Hotel le Rocher', city: 'Aboisso', budget: 'Budget', description: 'A simple hotel offering affordable lodging for travelers passing through the region.', cost: 40, geolocation: { lat: 5.4710, lng: -3.2100 } },
];

export const activities: Activity[] = [
  // Abidjan
  { name: 'St. Paul\'s Cathedral', city: 'Abidjan', type: 'Culture', description: 'Admire the unique and modern architecture of this iconic cathedral.', budget: 'Budget', imageUrl: 'https://picsum.photos/seed/cathedral/400/300', durationHours: 2, bestTime: 'Afternoon', cost: 0, geolocation: { lat: 5.3317, lng: -4.0206 } },
  { name: 'Musée des Civilisations', city: 'Abidjan', type: 'Culture', description: 'Explore a vast collection of Ivorian art and historical artifacts.', budget: 'Budget', imageUrl: 'https://picsum.photos/seed/musee/400/300', durationHours: 3, bestTime: 'Afternoon', cost: 10, geolocation: { lat: 5.3290, lng: -4.0225 } },
  { name: 'CVAO - Centre Artisanal', city: 'Abidjan', type: 'Culture', description: 'A large artisanal market perfect for souvenir shopping for masks, fabrics, and crafts.', budget: 'Budget', imageUrl: 'https://picsum.photos/seed/cvao/400/300', durationHours: 2, bestTime: 'Morning', cost: 0, geolocation: { lat: 5.3025, lng: -4.0100 } },
  { name: 'Banco National Park', city: 'Abidjan', type: 'Exploration', description: 'A primary rainforest within Abidjan, great for a quick nature escape and canopy walks.', budget: 'Budget', imageUrl: 'https://picsum.photos/seed/banco/400/300', durationHours: 3, bestTime: 'Morning', cost: 5, geolocation: { lat: 5.3900, lng: -4.0450 } },
  { name: 'Parc Dahliafleur', city: 'Abidjan', type: 'Fun', description: 'A beautifully landscaped park and event space, perfect for a relaxing afternoon.', budget: 'Budget', imageUrl: 'https://picsum.photos/seed/dahlia/400/300', durationHours: 2, bestTime: 'Afternoon', cost: 8, geolocation: { lat: 5.3620, lng: -3.9650 } },
  { name: 'Jardin Botanique de Bingerville', city: 'Abidjan', type: 'Exploration', description: 'A historic botanical garden offering a peaceful escape with diverse plant species.', budget: 'Budget', imageUrl: 'https://picsum.photos/seed/bingerville/400/300', durationHours: 3, bestTime: 'Morning', cost: 5, geolocation: { lat: 5.3560, lng: -3.8950 } },
  { name: 'Galerie Cécile Fakhoury', city: 'Abidjan', type: 'Culture', description: 'A leading contemporary art gallery showcasing talented African artists.', budget: 'Budget', imageUrl: 'https://picsum.photos/seed/fakhoury/400/300', durationHours: 1.5, bestTime: 'Afternoon', cost: 0, geolocation: { lat: 5.3425, lng: -3.9975 } },
  { name: 'Le Saint-Germain', city: 'Abidjan', type: 'Nightlife', description: 'A chic and popular nightclub in the heart of Zone 4, known for its vibrant atmosphere and international crowd.', budget: 'Luxury', imageUrl: 'https://picsum.photos/seed/stgermain/400/300', durationHours: 5, bestTime: 'Evening', cost: 60, geolocation: { lat: 5.2960, lng: -4.0075 } },
  { name: 'Mix Night Club', city: 'Abidjan', type: 'Nightlife', description: 'A high-energy club in Zone 4 playing a mix of international and African hits.', budget: 'Mid-Range', imageUrl: 'https://picsum.photos/seed/mixclub/400/300', durationHours: 5, bestTime: 'Evening', cost: 45, geolocation: { lat: 5.2955, lng: -4.0060 } },
  { name: 'Parker Place', city: 'Abidjan', type: 'Nightlife', description: 'A legendary venue in Marcory for live music, especially reggae, and a lively party scene.', budget: 'Mid-Range', imageUrl: 'https://picsum.photos/seed/parkerplace/400/300', durationHours: 4, bestTime: 'Evening', cost: 35, geolocation: { lat: 5.2970, lng: -4.0040 } },
  { name: 'Code Barre', city: 'Abidjan', type: 'Nightlife', description: 'A trendy lounge and bar in Zone 4, perfect for cocktails and a more relaxed evening before it gets busy.', budget: 'Mid-Range', imageUrl: 'https://picsum.photos/seed/codebarre/400/300', durationHours: 4, bestTime: 'Evening', cost: 40, geolocation: { lat: 5.2982, lng: -4.0095 } },
  { name: 'Le Vélodrome (Yopougon)', city: 'Abidjan', type: 'Nightlife', description: 'An iconic open-air *maquis* on the "Rue des Princes" in Yopougon, famous for live Zouglou music.', budget: 'Budget', imageUrl: 'https://picsum.photos/seed/velodrome/400/300', durationHours: 4, bestTime: 'Evening', cost: 15, geolocation: { lat: 5.3310, lng: -4.0820 } },
  { name: 'Le Monde Arabe (Yopougon)', city: 'Abidjan', type: 'Nightlife', description: 'A legendary *maquis* in Yopougon, a hotspot for discovering new Coupé-Décalé and Zouglou artists.', budget: 'Budget', imageUrl: 'https://picsum.photos/seed/mondearabe/400/300', durationHours: 4, bestTime: 'Evening', cost: 15, geolocation: { lat: 5.3305, lng: -4.0815 } },
  { name: 'Zino Club (Cocody)', city: 'Abidjan', type: 'Nightlife', description: 'A popular and trendy nightclub in the upscale Cocody neighborhood, offering a chic atmosphere.', budget: 'Luxury', imageUrl: 'https://picsum.photos/seed/zinoclub/400/300', durationHours: 5, bestTime: 'Evening', cost: 55, geolocation: { lat: 5.3450, lng: -3.9980 } },
  { name: 'Life Star (Cocody)', city: 'Abidjan', type: 'Nightlife', description: 'A vibrant club in Cocody known for its great music and energetic crowd.', budget: 'Mid-Range', imageUrl: 'https://picsum.photos/seed/lifestar/400/300', durationHours: 4, bestTime: 'Evening', cost: 40, geolocation: { lat: 5.3480, lng: -4.0010 } },
  { name: 'Espace Acoustic (Cocody)', city: 'Abidjan', type: 'Nightlife', description: 'A dedicated live music venue in Cocody, perfect for enjoying acoustic sets and local bands in an intimate setting.', budget: 'Mid-Range', imageUrl: 'https://picsum.photos/seed/acoustic/400/300', durationHours: 3, bestTime: 'Evening', cost: 30, geolocation: { lat: 5.3430, lng: -3.9950 } },
  // Grand-Bassam
  { name: 'Grand-Bassam Historic Town', city: 'Grand-Bassam', type: 'Culture', description: 'Explore the colonial architecture and vibrant art scene of this UNESCO World Heritage site.', budget: 'Budget', imageUrl: 'https://picsum.photos/seed/bassam/400/300', durationHours: 4, bestTime: 'Morning', cost: 20, geolocation: { lat: 5.1965, lng: -3.7380 } },
  { name: 'Musée National du Costume', city: 'Grand-Bassam', type: 'Culture', description: 'Discover the rich history of Ivorian ceremonial dress and adornments.', budget: 'Budget', imageUrl: 'https://picsum.photos/seed/costume/400/300', durationHours: 1.5, bestTime: 'Afternoon', cost: 8, geolocation: { lat: 5.2011, lng: -3.7445 } },
  // Assinie
  { name: 'Assinie-Mafia Beach', city: 'Assinie', type: 'Beach', description: 'A beautiful beach resort town, perfect for relaxation and water sports on the lagoon and ocean.', budget: 'Mid-Range', imageUrl: 'https://picsum.photos/seed/assinie/400/300', durationHours: 6, bestTime: 'Morning', cost: 50, geolocation: { lat: 5.1340, lng: -3.2845 } },
  { name: 'La Passe - Assinie', city: 'Assinie', type: 'Beach', description: 'Visit the point where the lagoon meets the ocean. Ideal for photos and enjoying the view.', budget: 'Budget', imageUrl: 'https://picsum.photos/seed/lapasse/400/300', durationHours: 2, bestTime: 'Afternoon', cost: 10, geolocation: { lat: 5.1310, lng: -3.2800 } },
  // Yamoussoukro
  { name: 'Basilica of Our Lady of Peace', city: 'Yamoussoukro', type: 'Culture', description: 'Visit the world\'s largest church, a stunning architectural marvel of marble and stained glass.', budget: 'Mid-Range', imageUrl: 'https://picsum.photos/seed/yamoussoukro/400/300', durationHours: 3, bestTime: 'Afternoon', cost: 15, geolocation: { lat: 6.8097, lng: -5.2964 } },
  { name: 'Sacred Crocodile Lake', city: 'Yamoussoukro', type: 'Exploration', description: 'Witness the daily feeding of the sacred crocodiles at the lake by the Presidential Palace.', budget: 'Budget', imageUrl: 'https://picsum.photos/seed/crocodiles/400/300', durationHours: 1, bestTime: 'Evening', cost: 5, geolocation: { lat: 6.8167, lng: -5.2750 } },
  // Man
  { name: 'Mount Tonkoui Hike', city: 'Man', type: 'Mountain', description: 'Hike to the highest peak in Ivory Coast for breathtaking views of the lush landscape.', budget: 'Mid-Range', imageUrl: 'https://picsum.photos/seed/man/400/300', durationHours: 8, bestTime: 'Morning', cost: 30, geolocation: { lat: 7.4567, lng: -7.6333 } },
  { name: 'Gbêpleu Monkey Forest', city: 'Man', type: 'Exploration', description: 'A sacred forest where you can interact with and feed friendly monkeys.', budget: 'Budget', imageUrl: 'https://picsum.photos/seed/monkeys/400/300', durationHours: 2, bestTime: 'Morning', cost: 10, geolocation: { lat: 7.3500, lng: -7.5833 } },
  { name: 'La Cascade de Man', city: 'Man', type: 'Exploration', description: 'Visit the beautiful waterfall near the city of Man, a perfect spot for a refreshing swim.', budget: 'Budget', imageUrl: 'https://picsum.photos/seed/cascade/400/300', durationHours: 3, bestTime: 'Afternoon', cost: 5, geolocation: { lat: 7.4000, lng: -7.5600 } },
  // National Parks
  { name: 'Taï National Park Safari', city: 'Taï', type: 'Exploration', description: 'Discover incredible biodiversity, including chimpanzees and pygmy hippos, in this UNESCO site.', budget: 'Luxury', imageUrl: 'https://picsum.photos/seed/tai/400/300', durationHours: 10, bestTime: 'Morning', cost: 100, geolocation: { lat: 5.8667, lng: -7.3500 } },
  { name: 'Comoe National Park', city: 'Bouna', type: 'Exploration', description: 'One of the largest protected areas in West Africa, with diverse ecosystems from savannah to forest.', budget: 'Luxury', imageUrl: 'https://picsum.photos/seed/comoe/400/300', durationHours: 12, bestTime: 'Morning', cost: 120, geolocation: { lat: 9.0917, lng: -3.7833 } },
  { name: 'Marahoué National Park', city: 'Bouaflé', type: 'Exploration', description: 'A critical conservation area transitioning from coastal forest to interior savanna.', budget: 'Luxury', imageUrl: 'https://picsum.photos/seed/marahoue/400/300', durationHours: 8, bestTime: 'Morning', cost: 80, geolocation: { lat: 7.0833, lng: -6.0500 } },
  { name: 'Mount Nimba Strict Nature Reserve', city: 'Nimba', type: 'Mountain', description: 'A UNESCO World Heritage site, home to a unique variety of flora and fauna, including the viviparous toad.', budget: 'Luxury', imageUrl: 'https://picsum.photos/seed/nimba/400/300', durationHours: 10, bestTime: 'Morning', cost: 150, geolocation: { lat: 7.6083, lng: -8.4333 } },
  // Korhogo
  { name: 'Village des Tisserands', city: 'Korhogo', type: 'Culture', description: 'Visit the weavers\' village of Waraniéné to see artisans create famous Senufo textiles.', budget: 'Budget', imageUrl: 'https://picsum.photos/seed/korhogo/400/300', durationHours: 3, bestTime: 'Morning', cost: 5, geolocation: { lat: 9.3800, lng: -5.6000 } },
  { name: 'Senufo Artisan Villages', city: 'Korhogo', type: 'Culture', description: 'Explore the villages around Korhogo to see blacksmiths, painters, and other traditional Senufo artisans at work.', budget: 'Budget', imageUrl: 'https://picsum.photos/seed/senufo/400/300', durationHours: 4, bestTime: 'Morning', cost: 15, geolocation: { lat: 9.4200, lng: -5.6500 } },
  // Bouaké
  { name: 'Grand Marché de Bouaké', city: 'Bouaké', type: 'Culture', description: 'Experience one of the largest and most vibrant markets in Côte d\'Ivoire.', budget: 'Budget', imageUrl: 'https://picsum.photos/seed/bouakemarket/400/300', durationHours: 2, bestTime: 'Morning', cost: 0, geolocation: { lat: 7.6895, lng: -5.0290 } },
  // Tiassalé
  { name: 'Bandama River Boat Trip', city: 'Tiassalé', type: 'Exploration', description: 'Take a scenic boat trip on the Bandama River, observing local life and nature.', budget: 'Mid-Range', imageUrl: 'https://picsum.photos/seed/bandama/400/300', durationHours: 3, bestTime: 'Afternoon', cost: 30, geolocation: { lat: 5.8980, lng: -4.8250 } },
  // Sassandra
  { name: 'Sassandra Beaches', city: 'Sassandra', type: 'Beach', description: 'Explore the stunning and historic beaches, known for their natural beauty and tranquility.', budget: 'Budget', imageUrl: 'https://picsum.photos/seed/sassandrabeach/400/300', durationHours: 5, bestTime: 'Morning', cost: 0, geolocation: { lat: 4.9500, lng: -6.0800 } },
  { name: 'Fanti Fishermen Village', city: 'Sassandra', type: 'Culture', description: 'Visit a traditional Fanti fishing village to see the local way of life and the colorful fishing boats.', budget: 'Budget', imageUrl: 'https://picsum.photos/seed/fanti/400/300', durationHours: 2, bestTime: 'Morning', cost: 5, geolocation: { lat: 4.9555, lng: -6.0750 } },
  // San-Pédro
  { name: 'Monogaga Beach', city: 'San-Pédro', type: 'Beach', description: 'A beautiful and pristine beach known for its golden sands and clear waters, perfect for a day of relaxation.', budget: 'Budget', imageUrl: 'https://picsum.photos/seed/monogaga/400/300', durationHours: 6, bestTime: 'Morning', cost: 10, geolocation: { lat: 4.9000, lng: -6.5000 } },
  // Bondoukou
  { name: 'La Mosquée de Samatiguila', city: 'Bondoukou', type: 'Culture', description: 'Visit a historic Sudanese-style mosque, a fine example of traditional earthen architecture in the region.', budget: 'Budget', imageUrl: 'https://picsum.photos/seed/samatiguila/400/300', durationHours: 1.5, bestTime: 'Afternoon', cost: 5, geolocation: { lat: 8.0416, lng: -2.8000 } },
  // Daloa
  { name: 'Marché Central de Daloa', city: 'Daloa', type: 'Culture', description: 'Immerse yourself in the bustling atmosphere of one of the region\'s most important trading hubs.', budget: 'Budget', imageUrl: 'https://picsum.photos/seed/dalomarket/400/300', durationHours: 2, bestTime: 'Morning', cost: 0, geolocation: { lat: 6.8773, lng: -6.4502 } },
];

export const restaurants: Restaurant[] = [
  // Abidjan
  { name: 'Le Toit d\'Abidjan', city: 'Abidjan', cuisine: 'French', budget: 'Luxury', bestTime: 'Dinner', cost: 100, geolocation: { lat: 5.3285, lng: -4.0415 } },
  { name: 'Le Marlin Bleu', city: 'Abidjan', cuisine: 'Seafood', budget: 'Luxury', bestTime: 'Dinner', cost: 95, geolocation: { lat: 5.2760, lng: -3.9660 } },
  { name: 'Le Méchoui', city: 'Abidjan', cuisine: 'Lebanese', budget: 'Luxury', bestTime: 'Dinner', cost: 80, geolocation: { lat: 5.2975, lng: -4.0080 } },
  { name: 'La Case d\'Ivoire', city: 'Abidjan', cuisine: 'African', budget: 'Luxury', bestTime: 'Dinner', cost: 75, geolocation: { lat: 5.3395, lng: -3.9955 } },
  { name: 'Le Jardin Gourmand', city: 'Abidjan', cuisine: 'French', budget: 'Luxury', bestTime: 'Dinner', cost: 60, geolocation: { lat: 5.2945, lng: -3.9998 } },
  { name: 'La Gourmandise', city: 'Abidjan', cuisine: 'International', budget: 'Luxury', bestTime: 'Dinner', cost: 70, geolocation: { lat: 5.3288, lng: -4.0418 } },
  { name: 'Le Montparnasse', city: 'Abidjan', cuisine: 'French', budget: 'Luxury', bestTime: 'Dinner', cost: 85, geolocation: { lat: 5.3265, lng: -4.0225 } },
  { name: 'La Villa Alfira (Cocody)', city: 'Abidjan', cuisine: 'Ivorian', budget: 'Luxury', bestTime: 'Dinner', cost: 65, geolocation: { lat: 5.3465, lng: -3.9990 } },
  { name: 'Saakan', city: 'Abidjan', cuisine: 'African', budget: 'Mid-Range', bestTime: 'Dinner', cost: 45, geolocation: { lat: 5.3250, lng: -4.0180 } },
  { name: 'Chez Ambroise', city: 'Abidjan', cuisine: 'Ivorian', budget: 'Mid-Range', bestTime: 'Lunch', cost: 30, geolocation: { lat: 5.2934, lng: -4.0016 } },
  { name: 'Nushi.sushi', city: 'Abidjan', cuisine: 'Japanese', budget: 'Mid-Range', bestTime: 'Dinner', cost: 55, geolocation: { lat: 5.3142, lng: -4.0048 } },
  { name: 'Le Grand Large', city: 'Abidjan', cuisine: 'French', budget: 'Mid-Range', bestTime: 'Lunch', cost: 40, geolocation: { lat: 5.2755, lng: -3.9655 } },
  { name: 'Kaiten', city: 'Abidjan', cuisine: 'Japanese', budget: 'Mid-Range', bestTime: 'Dinner', cost: 50, geolocation: { lat: 5.2968, lng: -4.0071 } },
  { name: 'Norima', city: 'Abidjan', cuisine: 'American-Asian Fusion', budget: 'Mid-Range', bestTime: 'Dinner', cost: 35, geolocation: { lat: 5.2965, lng: -4.0065 } },
  { name: 'La Taverne Romaine', city: 'Abidjan', cuisine: 'Italian', budget: 'Mid-Range', bestTime: 'Dinner', cost: 40, geolocation: { lat: 5.2980, lng: -4.0090 } },
  { name: 'Oishii Sushi', city: 'Abidjan', cuisine: 'Japanese', budget: 'Mid-Range', bestTime: 'Dinner', cost: 45, geolocation: { lat: 5.3050, lng: -4.0020 } },
  { name: 'Le Pêcheur', city: 'Abidjan', cuisine: 'Seafood', budget: 'Mid-Range', bestTime: 'Lunch', cost: 35, geolocation: { lat: 5.3080, lng: -4.0300 } },
  { name: 'Le Pékin (Cocody)', city: 'Abidjan', cuisine: 'Chinese', budget: 'Mid-Range', bestTime: 'Dinner', cost: 30, geolocation: { lat: 5.3470, lng: -4.0025 } },
  { name: 'Bao Café (Cocody)', city: 'Abidjan', cuisine: 'International', budget: 'Mid-Range', bestTime: 'Dinner', cost: 35, geolocation: { lat: 5.3440, lng: -3.9960 } },
  { name: 'Chez Hélène', city: 'Abidjan', cuisine: 'Ivorian', budget: 'Budget', bestTime: 'Lunch', cost: 12, geolocation: { lat: 5.3188, lng: -4.0102 } },
  { name: 'Chez Tantie Alice', city: 'Abidjan', cuisine: 'Ivorian', budget: 'Budget', bestTime: 'Lunch', cost: 10, geolocation: { lat: 5.3360, lng: -4.0850 } },
  { name: 'Maquis du Val', city: 'Abidjan', cuisine: 'Ivorian', budget: 'Budget', bestTime: 'Dinner', cost: 15, geolocation: { lat: 5.3198, lng: -3.9855 } },
  { name: 'Allo-Co', city: 'Abidjan', cuisine: 'Street Food', budget: 'Budget', bestTime: 'Lunch', cost: 5, geolocation: { lat: 5.3011, lng: -4.0123 } },
  { name: 'Maquis Le Cailcedrat', city: 'Abidjan', cuisine: 'Ivorian', budget: 'Budget', bestTime: 'Dinner', cost: 10, geolocation: { lat: 5.3590, lng: -4.0050 } },
  // Assinie
  { name: 'Le Carre Blanc', city: 'Assinie', cuisine: 'Seafood', budget: 'Luxury', bestTime: 'Dinner', cost: 90, geolocation: { lat: 5.1330, lng: -3.2870 } },
  { name: 'La Voile Blanche', city: 'Assinie', cuisine: 'French', budget: 'Luxury', bestTime: 'Dinner', cost: 80, geolocation: { lat: 5.1345, lng: -3.3210 } },
  { name: 'Le Quai', city: 'Assinie', cuisine: 'International', budget: 'Mid-Range', bestTime: 'Lunch', cost: 45, geolocation: { lat: 5.1365, lng: -3.3820 } },
  // Grand-Bassam
  { name: 'L\'Annexe Plage', city: 'Grand-Bassam', cuisine: 'International', budget: 'Mid-Range', bestTime: 'Lunch', cost: 35, geolocation: { lat: 5.1975, lng: -3.7388 } },
  { name: 'Le Wharf du Bicot', city: 'Grand-Bassam', cuisine: 'Seafood', budget: 'Mid-Range', bestTime: 'Lunch', cost: 30, geolocation: { lat: 5.1955, lng: -3.7365 } },
  { name: 'La Paillote', city: 'Grand-Bassam', cuisine: 'Ivorian', budget: 'Budget', bestTime: 'Lunch', cost: 15, geolocation: { lat: 5.1980, lng: -3.7395 } },
  { name: 'Le Quai', city: 'Grand-Bassam', cuisine: 'Seafood', budget: 'Mid-Range', bestTime: 'Dinner', cost: 40, geolocation: { lat: 5.1960, lng: -3.7370 } },
  // Yamoussoukro
  { name: 'Le Wafou', city: 'Yamoussoukro', cuisine: 'Ivorian', budget: 'Mid-Range', bestTime: 'Dinner', cost: 35, geolocation: { lat: 6.8180, lng: -5.2780 } },
  { name: 'Chez Mario', city: 'Yamoussoukro', cuisine: 'International', budget: 'Mid-Range', bestTime: 'Dinner', cost: 40, geolocation: { lat: 6.8150, lng: -5.2760 } },
  { name: 'Bangui', city: 'Yamoussoukro', cuisine: 'Ivorian', budget: 'Budget', bestTime: 'Lunch', cost: 10, geolocation: { lat: 6.8225, lng: -5.2795 } },
  { name: 'La Brise', city: 'Yamoussoukro', cuisine: 'Ivorian', budget: 'Budget', bestTime: 'Lunch', cost: 8, geolocation: { lat: 6.8170, lng: -5.2820 } },
  // Man
  { name: 'Le Maquis', city: 'Man', cuisine: 'Ivorian', budget: 'Budget', bestTime: 'Lunch', cost: 10, geolocation: { lat: 7.4050, lng: -7.5540 } },
  { name: 'Chez Tonton', city: 'Man', cuisine: 'Ivorian', budget: 'Budget', bestTime: 'Lunch', cost: 7, geolocation: { lat: 7.4080, lng: -7.5520 } },
  // Bouaké
  { name: 'Le Calao', city: 'Bouaké', cuisine: 'International', budget: 'Mid-Range', bestTime: 'Dinner', cost: 25, geolocation: { lat: 7.6900, lng: -5.0300 } },
  { name: 'Maquis Le Bafing', city: 'Bouaké', cuisine: 'Ivorian', budget: 'Budget', bestTime: 'Dinner', cost: 12, geolocation: { lat: 7.6855, lng: -5.0310 } },
  { name: 'L\'Escale', city: 'Bouaké', cuisine: 'Ivorian', budget: 'Budget', bestTime: 'Lunch', cost: 8, geolocation: { lat: 7.6870, lng: -5.0280 } },
  // Sassandra
  { name: 'Restaurant Le Wharf', city: 'Sassandra', cuisine: 'Seafood', budget: 'Mid-Range', bestTime: 'Lunch', cost: 25, geolocation: { lat: 4.9510, lng: -6.0830 } },
  // San-Pédro
  { name: 'Le Rive Gauche', city: 'San-Pédro', cuisine: 'French', budget: 'Mid-Range', bestTime: 'Dinner', cost: 40, geolocation: { lat: 4.7480, lng: -6.6350 } },
  { name: 'Le Marlin Bleu', city: 'San-Pédro', cuisine: 'Seafood', budget: 'Mid-Range', bestTime: 'Dinner', cost: 35, geolocation: { lat: 4.7460, lng: -6.6320 } },
  // Korhogo
  { name: 'Le Bon Goût', city: 'Korhogo', cuisine: 'Ivorian', budget: 'Budget', bestTime: 'Lunch', cost: 7, geolocation: { lat: 9.4520, lng: -5.6280 } },
  // Daloa
  { name: 'Le Gôzô', city: 'Daloa', cuisine: 'Ivorian', budget: 'Budget', bestTime: 'Lunch', cost: 8, geolocation: { lat: 6.8790, lng: -6.4520 } },
  // Bondoukou
  { name: 'Chez Maman Africa', city: 'Bondoukou', cuisine: 'Ivorian', budget: 'Budget', bestTime: 'Lunch', cost: 6, geolocation: { lat: 8.0430, lng: -2.8010 } },
  // Aboisso
  { name: 'Maquis Le Bambou', city: 'Aboisso', cuisine: 'Ivorian', budget: 'Budget', bestTime: 'Dinner', cost: 9, geolocation: { lat: 5.4700, lng: -3.2085 } },
];

export const transportationOptions: Transportation[] = [
  { type: 'Domestic Flight (Air Côte d\'Ivoire)', costPerTrip: 150, budget: 'Luxury' },
  { type: 'Private Car with Driver', costPerTrip: 70, budget: 'Luxury' },
  { type: 'VTC (Ride-sharing e.g. Yango)', costPerTrip: 20, budget: 'Mid-Range' },
  { type: 'Inter-city Coach (UTB, etc.)', costPerTrip: 15, budget: 'Mid-Range' },
  { type: 'Taxi (Metered)', costPerTrip: 10, budget: 'Budget' },
  { type: 'Sotra Bateau-Bus (Abidjan Lagoon)', costPerTrip: 1, budget: 'Budget' },
  { type: 'Woro-Woro (Shared Taxi)', costPerTrip: 2, budget: 'Budget' },
];

// Travel times in hours by road between major locations
export const travelTimes: { [key: string]: { [key: string]: number } } = {
  Abidjan: { 'Grand-Bassam': 1, Assinie: 2, Yamoussoukro: 3, Man: 8, Taï: 10, Sassandra: 6, 'San-Pédro': 5, Bouna: 9, Korhogo: 8, Bouaké: 4.5, Tiassalé: 2, Daloa: 6, Bondoukou: 7, Aboisso: 2.5 },
  'Grand-Bassam': { Abidjan: 1, Assinie: 1, Yamoussoukro: 4, Man: 9, Taï: 11, Sassandra: 7, 'San-Pédro': 6, Bouna: 10, Korhogo: 9, Bouaké: 5.5, Tiassalé: 3, Daloa: 7, Bondoukou: 8, Aboisso: 1.5 },
  Assinie: { Abidjan: 2, 'Grand-Bassam': 1, Yamoussoukro: 5, Man: 10, Taï: 12, Sassandra: 8, 'San-Pédro': 7, Bouna: 11, Korhogo: 10, Bouaké: 6.5, Tiassalé: 4, Daloa: 8, Bondoukou: 9, Aboisso: 0.5 },
  Yamoussoukro: { Abidjan: 3, 'Grand-Bassam': 4, Assinie: 5, Man: 5, Taï: 7, Sassandra: 9, 'San-Pédro': 8, Bouna: 6, Korhogo: 5, Bouaké: 1.5, Tiassalé: 2, Daloa: 2.5, Bondoukou: 4, Aboisso: 5.5 },
  Man: { Abidjan: 8, 'Grand-Bassam': 9, Assinie: 10, Yamoussoukro: 5, Taï: 6, Sassandra: 12, 'San-Pédro': 11, Bouna: 11, Korhogo: 6, Bouaké: 6.5, Tiassalé: 7, Daloa: 3, Bondoukou: 11, Aboisso: 10.5 },
  Taï: { Abidjan: 10, 'Grand-Bassam': 11, Assinie: 12, Yamoussoukro: 7, Man: 6, Sassandra: 8, 'San-Pédro': 7, Bouna: 13, Korhogo: 12, Bouaké: 8.5, Tiassalé: 9, Daloa: 5, Bondoukou: 13, Aboisso: 12.5 },
  Sassandra: { Abidjan: 6, 'Grand-Bassam': 7, Assinie: 8, Yamoussoukro: 9, Man: 12, Taï: 8, 'San-Pédro': 1, Bouna: 15, Korhogo: 14, Bouaké: 10, Tiassalé: 7, Daloa: 7, Bondoukou: 15, Aboisso: 8.5 },
  'San-Pédro': { Abidjan: 5, 'Grand-Bassam': 6, Assinie: 7, Yamoussoukro: 8, Man: 11, Taï: 7, Sassandra: 1, Bouna: 14, Korhogo: 13, Bouaké: 9, Tiassalé: 6, Daloa: 6, Bondoukou: 14, Aboisso: 7.5 },
  Bouna: { Abidjan: 9, 'Grand-Bassam': 10, Assinie: 11, Yamoussoukro: 6, Man: 11, Taï: 13, Sassandra: 15, 'San-Pédro': 14, Korhogo: 5, Bouaké: 4.5, Tiassalé: 8, Daloa: 8.5, Bondoukou: 2, Aboisso: 11.5 },
  Korhogo: { Abidjan: 8, 'Grand-Bassam': 9, Assinie: 10, Yamoussoukro: 5, Man: 6, Taï: 12, Sassandra: 14, 'San-Pédro': 13, Bouna: 5, Bouaké: 3.5, Tiassalé: 7, Daloa: 7.5, Bondoukou: 7, Aboisso: 10.5 },
  Bouaké: { Abidjan: 4.5, 'Grand-Bassam': 5.5, Assinie: 6.5, Yamoussoukro: 1.5, Man: 6.5, Taï: 8.5, Sassandra: 10, 'San-Pédro': 9, Bouna: 4.5, Korhogo: 3.5, Tiassalé: 3.5, Daloa: 4, Bondoukou: 5.5, Aboisso: 7 },
  Tiassalé: { Abidjan: 2, 'Grand-Bassam': 3, Assinie: 4, Yamoussoukro: 2, Man: 7, Taï: 9, Sassandra: 7, 'San-Pédro': 6, Bouna: 8, Korhogo: 7, Bouaké: 3.5, Daloa: 4, Bondoukou: 6, Aboisso: 4.5 },
  Daloa: { Abidjan: 6, 'Grand-Bassam': 7, Assinie: 8, Yamoussoukro: 2.5, Man: 3, Taï: 5, Sassandra: 7, 'San-Pédro': 6, Bouna: 8.5, Korhogo: 7.5, Bouaké: 4, Tiassalé: 4, Bondoukou: 6.5, Aboisso: 8.5 },
  Bondoukou: { Abidjan: 7, 'Grand-Bassam': 8, Assinie: 9, Yamoussoukro: 4, Man: 11, Taï: 13, Sassandra: 15, 'San-Pédro': 14, Bouna: 2, Korhogo: 7, Bouaké: 5.5, Tiassalé: 6, Daloa: 6.5, Aboisso: 9.5 },
  Aboisso: { Abidjan: 2.5, 'Grand-Bassam': 1.5, Assinie: 0.5, Yamoussoukro: 5.5, Man: 10.5, Taï: 12.5, Sassandra: 8.5, 'San-Pédro': 7.5, Bouna: 11.5, Korhogo: 10.5, Bouaké: 7, Tiassalé: 4.5, Daloa: 8.5, Bondoukou: 9.5 },
};
