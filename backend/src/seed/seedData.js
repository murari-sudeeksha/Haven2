/**
 * HAVEN Real Estate Dataset - Demo Data for Hyderabad localities.
 * Clearly identified as sample listings for demonstration and evaluation purposes.
 */

const sampleProperties = [
  {
    title: "Aura Celestial Highs - 2BHK Smart Home",
    description: "Elegant 2BHK modern apartment situated in the heart of HITEC City. Features automated smart home lighting, Italian marble flooring, spacious modular kitchen, and scenic views of the tech corridor skyline. Ideal for IT professionals and small families.",
    location: {
      address: "Tower 3, Cyber Gateway Enclave, Near Mindspace",
      locality: "HITEC City",
      city: "Hyderabad",
      pincode: "500081",
      landmarks: ["Mindspace Tech Park", "Raidurg Metro", "Inorbit Mall"]
    },
    price: 5800000,
    priceDisplay: "₹58 Lakhs",
    propertyType: "Apartment",
    bhk: 2,
    bathrooms: 2,
    balconies: 2,
    area: 1220,
    furnishing: "Semi-Furnished",
    possessionStatus: "Ready to Move",
    isGatedCommunity: true,
    floor: "8th of 18 Floors",
    facing: "East",
    amenities: ["Gym", "Swimming Pool", "Clubhouse", "24/7 Security", "Power Backup", "Lift", "Covered Parking", "Children Play Area", "EV Charging Station"],
    nearbyFacilities: [
      { name: "Raidurg Metro Station", facilityType: "Metro", distanceKm: 0.9 },
      { name: "Oakridge International School", facilityType: "School", distanceKm: 1.4 },
      { name: "AIG Hospitals", facilityType: "Hospital", distanceKm: 2.1 },
      { name: "Mindspace IT Park", facilityType: "IT Park", distanceKm: 0.6 },
      { name: "Inorbit Mall", facilityType: "Shopping Mall", distanceKm: 1.8 }
    ],
    images: [
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1000&q=80"
    ],
    tags: ["Under ₹60L", "Near Metro", "Smart Home", "HITEC City"],
    isFeatured: true,
    isDemo: true
  },
  {
    title: "Greenwood Palms - 3BHK Gated Residence",
    description: "Spacious 3BHK luxury flat in a premium gated society in Gachibowli. Offers world-class clubhouse amenities, Olympic size swimming pool, zero traffic on ground level, and rapid connectivity to Outer Ring Road and Financial District.",
    location: {
      address: "Greenwood Boulevard, Financial District Road",
      locality: "Gachibowli",
      city: "Hyderabad",
      pincode: "500032",
      landmarks: ["Continental Hospital", "Wipro Circle", "ORR Junction"]
    },
    price: 6900000,
    priceDisplay: "₹69 Lakhs",
    propertyType: "Apartment",
    bhk: 3,
    bathrooms: 3,
    balconies: 2,
    area: 1780,
    furnishing: "Semi-Furnished",
    possessionStatus: "Ready to Move",
    isGatedCommunity: true,
    floor: "12th of 25 Floors",
    facing: "North-East",
    amenities: ["Gym", "Swimming Pool", "Clubhouse", "24/7 Security", "Power Backup", "Lift", "Covered Parking", "Tennis Court", "Jogging Track", "Landscaped Garden"],
    nearbyFacilities: [
      { name: "Gachibowli Metro Proposed", facilityType: "Metro", distanceKm: 1.2 },
      { name: "DPS Hyderabad", facilityType: "School", distanceKm: 1.8 },
      { name: "Continental Hospital", facilityType: "Hospital", distanceKm: 1.1 },
      { name: "Wipro SEZ & Microsoft", facilityType: "IT Park", distanceKm: 1.5 },
      { name: "Sarath City Capital Mall", facilityType: "Shopping Mall", distanceKm: 3.2 }
    ],
    images: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1600573472550-8090b5e0745e?auto=format&fit=crop&w=1000&q=80"
    ],
    tags: ["Under ₹70L", "Gated Community", "3BHK", "Gachibowli"],
    isFeatured: true,
    isDemo: true
  },
  {
    title: "Serene Heights - Budget 2BHK Near Botanical Garden",
    description: "Sunlit 2BHK apartment in Kondapur located close to Botanical Gardens. Well-ventilated living room, modern fittings, intercom facility, and dedicated basement parking. Walking distance to supermarkets, cafes, and healthcare centers.",
    location: {
      address: "Raghavendra Colony, Near Botanical Garden Road",
      locality: "Kondapur",
      city: "Hyderabad",
      pincode: "500084",
      landmarks: ["Botanical Garden", "Sarath City Mall", "Kothaguda Junction"]
    },
    price: 5200000,
    priceDisplay: "₹52 Lakhs",
    propertyType: "Apartment",
    bhk: 2,
    bathrooms: 2,
    balconies: 1,
    area: 1100,
    furnishing: "Unfurnished",
    possessionStatus: "Ready to Move",
    isGatedCommunity: true,
    floor: "4th of 8 Floors",
    facing: "East",
    amenities: ["Power Backup", "24/7 Security", "Lift", "Covered Parking", "Intercom", "Children Play Area"],
    nearbyFacilities: [
      { name: "Hitec City Metro", facilityType: "Metro", distanceKm: 2.4 },
      { name: "Chirec International School", facilityType: "School", distanceKm: 1.5 },
      { name: "Kims Cuddles Kondapur", facilityType: "Hospital", distanceKm: 0.9 },
      { name: "Sarath City Capital Mall", facilityType: "Shopping Mall", distanceKm: 1.2 },
      { name: "DLF Cyber City", facilityType: "IT Park", distanceKm: 2.8 }
    ],
    images: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1000&q=80"
    ],
    tags: ["Budget Friendly", "Under ₹60L", "Kondapur", "2BHK"],
    isFeatured: false,
    isDemo: true
  },
  {
    title: "The Urban Haven - Furnished 2BHK In Madhapur",
    description: "Fully designer-furnished 2BHK flat in Madhapur with wooden paneling, custom wardrobes, German kitchen fittings, and 55-inch smart TV setup. 5 minutes from Durgam Cheruvu Lake & cable bridge. Perfect rental yield or ready-to-move-in residence.",
    location: {
      address: "Ayyappa Society Main Road",
      locality: "Madhapur",
      city: "Hyderabad",
      pincode: "500081",
      landmarks: ["Durgam Cheruvu Cable Bridge", "Madhapur Metro", "Inorbit Mall"]
    },
    price: 7400000,
    priceDisplay: "₹74 Lakhs",
    propertyType: "Apartment",
    bhk: 2,
    bathrooms: 2,
    balconies: 1,
    area: 1250,
    furnishing: "Furnished",
    possessionStatus: "Ready to Move",
    isGatedCommunity: false,
    floor: "3rd of 5 Floors",
    facing: "North",
    amenities: ["Power Backup", "Lift", "Covered Parking", "24/7 Security", "CCTV", "Intercom"],
    nearbyFacilities: [
      { name: "Madhapur Metro Station", facilityType: "Metro", distanceKm: 0.7 },
      { name: "Venkateshwara Hospital", facilityType: "Hospital", distanceKm: 0.8 },
      { name: "Inorbit Mall", facilityType: "Shopping Mall", distanceKm: 1.5 },
      { name: "Cyber Towers", facilityType: "IT Park", distanceKm: 1.1 }
    ],
    images: [
      "https://images.unsplash.com/photo-1502005229762-ae1b46000e58?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1000&q=80"
    ],
    tags: ["Fully Furnished", "Near Metro", "Madhapur"],
    isFeatured: true,
    isDemo: true
  },
  {
    title: "Miyapur Metro Springs - Affordable 2BHK",
    description: "Exceptional value 2BHK apartment in Miyapur located just 600 meters from Miyapur Terminal Metro Station. Peaceful residential area with abundant water supply, clean surroundings, and fast connectivity to Kukatpally and Outer Ring Road.",
    location: {
      address: "Allwyn X Roads, Near Metro Terminal",
      locality: "Miyapur",
      city: "Hyderabad",
      pincode: "500049",
      landmarks: ["Miyapur Metro Terminal", "Allwyn Colony", "GSM Mall"]
    },
    price: 4200000,
    priceDisplay: "₹42 Lakhs",
    propertyType: "Apartment",
    bhk: 2,
    bathrooms: 2,
    balconies: 1,
    area: 1040,
    furnishing: "Semi-Furnished",
    possessionStatus: "Ready to Move",
    isGatedCommunity: true,
    floor: "2nd of 6 Floors",
    facing: "East",
    amenities: ["Lift", "Power Backup", "Covered Parking", "24/7 Security", "Children Play Area"],
    nearbyFacilities: [
      { name: "Miyapur Metro Terminal", facilityType: "Metro", distanceKm: 0.6 },
      { name: "Silver Oaks International School", facilityType: "School", distanceKm: 2.2 },
      { name: "Pranaam Wellness Hospital", facilityType: "Hospital", distanceKm: 1.0 },
      { name: "GSM Mall & Multiplex", facilityType: "Shopping Mall", distanceKm: 0.8 }
    ],
    images: [
      "https://images.unsplash.com/photo-1560185127-6ed189bf02f4?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1000&q=80"
    ],
    tags: ["Under ₹50L", "Near Metro", "Miyapur", "Affordable"],
    isFeatured: false,
    isDemo: true
  },
  {
    title: "Royal Grandeur 3BHK - Kukatpally Housing Board",
    description: "Premium 3BHK apartment in Kukatpally (KPHB) close to Forum Sujana Mall and JNTU Metro. Highly vibrant residential zone with top-rated schools, multi-speciality clinics, and bustling shopping avenues.",
    location: {
      address: "Phase 3, KPHB Colony, Near Forum Mall",
      locality: "Kukatpally",
      city: "Hyderabad",
      pincode: "500072",
      landmarks: ["Forum Sujana Mall", "KPHB Metro Station", "JNTU University"]
    },
    price: 6500000,
    priceDisplay: "₹65 Lakhs",
    propertyType: "Apartment",
    bhk: 3,
    bathrooms: 3,
    balconies: 2,
    area: 1550,
    furnishing: "Semi-Furnished",
    possessionStatus: "Ready to Move",
    isGatedCommunity: true,
    floor: "6th of 12 Floors",
    facing: "North",
    amenities: ["Gym", "Clubhouse", "24/7 Security", "Power Backup", "Lift", "Covered Parking", "Intercom"],
    nearbyFacilities: [
      { name: "KPHB Colony Metro", facilityType: "Metro", distanceKm: 0.8 },
      { name: "Sanghamitra School", facilityType: "School", distanceKm: 1.1 },
      { name: "Omni Hospitals", facilityType: "Hospital", distanceKm: 1.3 },
      { name: "Nexus Hyderabad Mall", facilityType: "Shopping Mall", distanceKm: 0.9 },
      { name: "Hitec City Tech Zone", facilityType: "IT Park", distanceKm: 3.5 }
    ],
    images: [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1000&q=80"
    ],
    tags: ["Kukatpally", "3BHK", "Under ₹70L", "Family Friendly"],
    isFeatured: true,
    isDemo: true
  },
  {
    title: "Financial District Panorama - 3BHK High-Rise",
    description: "Ultra-modern 3BHK flat on the 21st floor overlooking Nanakramguda Financial District. Features floor-to-ceiling soundproof glass windows, concierge reception, rooftop infinity pool, and high-speed elevators.",
    location: {
      address: "Waverock Road, Nanakramguda",
      locality: "Financial District",
      city: "Hyderabad",
      pincode: "500032",
      landmarks: ["US Consulate", "WaveRock SEZ", "ORR Exit 1"]
    },
    price: 11500000,
    priceDisplay: "₹1.15 Cr",
    propertyType: "Apartment",
    bhk: 3,
    bathrooms: 3,
    balconies: 2,
    area: 2150,
    furnishing: "Furnished",
    possessionStatus: "Ready to Move",
    isGatedCommunity: true,
    floor: "21st of 32 Floors",
    facing: "East",
    amenities: ["Gym", "Swimming Pool", "Clubhouse", "24/7 Security", "Power Backup", "Lift", "Covered Parking", "EV Charging Station", "Rooftop Lounge", "Concierge"],
    nearbyFacilities: [
      { name: "Financial District Metro Proposed", facilityType: "Metro", distanceKm: 1.5 },
      { name: "Oakridge International School", facilityType: "School", distanceKm: 2.5 },
      { name: "Continental Hospitals", facilityType: "Hospital", distanceKm: 1.4 },
      { name: "WaveRock SEZ & Amazon HQ", facilityType: "IT Park", distanceKm: 0.5 }
    ],
    images: [
      "https://images.unsplash.com/photo-1567496898669-ee935f5f647a?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=1000&q=80"
    ],
    tags: ["High Rise", "Luxury", "Financial District", "Rooftop Pool"],
    isFeatured: true,
    isDemo: true
  },
  {
    title: "Jubilee Crown - 4BHK Grand Penthouse",
    description: "Exquisite 4BHK duplex penthouse in Road No. 36 Jubilee Hills with private terrace plunge pool, jacuzzi, Italian designer kitchen, double-height ceiling living hall, and private elevator access.",
    location: {
      address: "Road No. 36, Near Jubilee Hills Check Post",
      locality: "Jubilee Hills",
      city: "Hyderabad",
      pincode: "500033",
      landmarks: ["Jubilee Check Post", "Peddamma Temple Metro", "KBR Park"]
    },
    price: 38000000,
    priceDisplay: "₹3.80 Cr",
    propertyType: "Penthouse",
    bhk: 4,
    bathrooms: 5,
    balconies: 3,
    area: 4200,
    furnishing: "Furnished",
    possessionStatus: "Ready to Move",
    isGatedCommunity: true,
    floor: "10th & 11th Duplex",
    facing: "North-East",
    amenities: ["Private Pool", "Gym", "Clubhouse", "24/7 Security", "Power Backup", "Lift", "Covered Parking", "Landscaped Garden", "Concierge"],
    nearbyFacilities: [
      { name: "Peddamma Temple Metro", facilityType: "Metro", distanceKm: 0.5 },
      { name: "Apollo Hospitals Jubilee Hills", facilityType: "Hospital", distanceKm: 1.8 },
      { name: "Jubilee Hills Public School", facilityType: "School", distanceKm: 1.2 },
      { name: "KBR National Park", facilityType: "Park", distanceKm: 0.9 }
    ],
    images: [
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1000&q=80"
    ],
    tags: ["Penthouse", "Ultra Luxury", "Jubilee Hills", "Private Pool"],
    isFeatured: true,
    isDemo: true
  },
  {
    title: "Palm Meadows - 4BHK Independent Luxury Villa",
    description: "Sprawling 4BHK triplex villa with private lawn, home theater room, 3 covered car ports, solar water heating, and servant quarters in Gachibowli outskirts.",
    location: {
      address: "Villas Enclave, Near ISB Campus",
      locality: "Gachibowli",
      city: "Hyderabad",
      pincode: "500032",
      landmarks: ["ISB Hyderabad", "GMC Balayogi Stadium", "ORR Entry"]
    },
    price: 24500000,
    priceDisplay: "₹2.45 Cr",
    propertyType: "Villa",
    bhk: 4,
    bathrooms: 4,
    balconies: 3,
    area: 3600,
    furnishing: "Semi-Furnished",
    possessionStatus: "Ready to Move",
    isGatedCommunity: true,
    floor: "G+2 Triplex",
    facing: "East",
    amenities: ["Gym", "Swimming Pool", "Clubhouse", "24/7 Security", "Power Backup", "Private Garden", "Covered Parking", "Tennis Court"],
    nearbyFacilities: [
      { name: "ISB Hyderabad", facilityType: "School", distanceKm: 1.0 },
      { name: "Continental Hospital", facilityType: "Hospital", distanceKm: 2.2 },
      { name: "Wipro Junction", facilityType: "IT Park", distanceKm: 2.0 },
      { name: "Gachibowli Stadium", facilityType: "Sports", distanceKm: 1.5 }
    ],
    images: [
      "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1613977257592-4871e5fcd7c4?auto=format&fit=crop&w=1000&q=80"
    ],
    tags: ["Villa", "Independent", "Gachibowli", "Private Garden"],
    isFeatured: true,
    isDemo: true
  },
  {
    title: "Silicon Springs - 2BHK Near Tech Mahindra",
    description: "Compact and well-crafted 2BHK apartment in HITEC City. Equipped with solar water heating, piped gas connection, high speed fiber optic, and 100% DG power backup.",
    location: {
      address: "Plot 45, Phase 2, Silicon Valley",
      locality: "HITEC City",
      city: "Hyderabad",
      pincode: "500081",
      landmarks: ["Tech Mahindra", "Cyber Towers", "Hitec City Metro"]
    },
    price: 5950000,
    priceDisplay: "₹59.5 Lakhs",
    propertyType: "Apartment",
    bhk: 2,
    bathrooms: 2,
    balconies: 1,
    area: 1180,
    furnishing: "Semi-Furnished",
    possessionStatus: "Ready to Move",
    isGatedCommunity: true,
    floor: "7th of 14 Floors",
    facing: "North",
    amenities: ["Gym", "Power Backup", "24/7 Security", "Lift", "Covered Parking", "Clubhouse", "Children Play Area"],
    nearbyFacilities: [
      { name: "Hitec City Metro Station", facilityType: "Metro", distanceKm: 0.8 },
      { name: "Cyber Towers", facilityType: "IT Park", distanceKm: 1.0 },
      { name: "Medicover Hospitals", facilityType: "Hospital", distanceKm: 1.6 },
      { name: "Shilparamam Cultural Village", facilityType: "Park", distanceKm: 1.2 }
    ],
    images: [
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1000&q=80"
    ],
    tags: ["Under ₹60L", "HITEC City", "2BHK", "Ready to Move"],
    isFeatured: false,
    isDemo: true
  },
  {
    title: "Kondapur Oasis - 3BHK Serene Living",
    description: "3BHK modern flat in Kondapur situated in a calm residential lane away from noise, yet only 5 minutes from Kondapur RTO and Google office. Abundant natural light and cross ventilation.",
    location: {
      address: "Whitefields, Near Kondapur Junction",
      locality: "Kondapur",
      city: "Hyderabad",
      pincode: "500084",
      landmarks: ["Google Office", "Kondapur RTO", "KIMS Cuddles"]
    },
    price: 6800000,
    priceDisplay: "₹68 Lakhs",
    propertyType: "Apartment",
    bhk: 3,
    bathrooms: 3,
    balconies: 2,
    area: 1620,
    furnishing: "Semi-Furnished",
    possessionStatus: "Ready to Move",
    isGatedCommunity: true,
    floor: "5th of 10 Floors",
    facing: "East",
    amenities: ["Gym", "Swimming Pool", "Clubhouse", "24/7 Security", "Power Backup", "Lift", "Covered Parking", "Children Play Area"],
    nearbyFacilities: [
      { name: "Botanical Garden", facilityType: "Park", distanceKm: 0.9 },
      { name: "Chirec International School", facilityType: "School", distanceKm: 1.6 },
      { name: "Kims Hospital", facilityType: "Hospital", distanceKm: 1.0 },
      { name: "Google Hyderabad", facilityType: "IT Park", distanceKm: 1.3 }
    ],
    images: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80"
    ],
    tags: ["Under ₹70L", "3BHK", "Kondapur", "Near Google"],
    isFeatured: false,
    isDemo: true
  },
  {
    title: "Cyber View Residency - 1BHK Executive Studio",
    description: "Smart 1BHK executive home in Madhapur close to cyber gateway. Low maintenance, high rental returns, modular pantry, centralized RO water, and high-speed Wi-Fi infrastructure.",
    location: {
      address: "Kavuri Hills, Near Jubilee Ridge",
      locality: "Madhapur",
      city: "Hyderabad",
      pincode: "500081",
      landmarks: ["Kavuri Hills Park", "Madhapur Police Station", "Cyber Towers"]
    },
    price: 3600000,
    priceDisplay: "₹36 Lakhs",
    propertyType: "Apartment",
    bhk: 1,
    bathrooms: 1,
    balconies: 1,
    area: 680,
    furnishing: "Furnished",
    possessionStatus: "Ready to Move",
    isGatedCommunity: false,
    floor: "2nd of 5 Floors",
    facing: "East",
    amenities: ["Lift", "Power Backup", "24/7 Security", "Covered Parking", "CCTV"],
    nearbyFacilities: [
      { name: "Madhapur Metro", facilityType: "Metro", distanceKm: 1.1 },
      { name: "Cyber Towers", facilityType: "IT Park", distanceKm: 1.4 },
      { name: "Apollo Cradle", facilityType: "Hospital", distanceKm: 1.0 }
    ],
    images: [
      "https://images.unsplash.com/photo-1502005229762-ae1b46000e58?auto=format&fit=crop&w=1000&q=80"
    ],
    tags: ["1BHK", "Under ₹40L", "Studio", "Madhapur"],
    isFeatured: false,
    isDemo: true
  },
  {
    title: "Miyapur Green Terraces - 3BHK Family Suite",
    description: "Generously spaced 3BHK apartment in Miyapur featuring wide double balconies overlooking serene greenery. Includes club amenities, indoor badminton court, and yoga deck.",
    location: {
      address: "Miyapur-Bollaram Road, Near Mayuri Nagar",
      locality: "Miyapur",
      city: "Hyderabad",
      pincode: "500049",
      landmarks: ["Mayuri Park", "Miyapur X Roads", "Talkie Town"]
    },
    price: 5400000,
    priceDisplay: "₹54 Lakhs",
    propertyType: "Apartment",
    bhk: 3,
    bathrooms: 3,
    balconies: 2,
    area: 1480,
    furnishing: "Semi-Furnished",
    possessionStatus: "Ready to Move",
    isGatedCommunity: true,
    floor: "4th of 9 Floors",
    facing: "West",
    amenities: ["Gym", "Clubhouse", "24/7 Security", "Power Backup", "Lift", "Covered Parking", "Children Play Area", "Badminton Court"],
    nearbyFacilities: [
      { name: "Miyapur Metro Station", facilityType: "Metro", distanceKm: 1.3 },
      { name: "Sentia Global School", facilityType: "School", distanceKm: 1.7 },
      { name: "Srikara Hospitals", facilityType: "Hospital", distanceKm: 1.5 }
    ],
    images: [
      "https://images.unsplash.com/photo-1560185127-6ed189bf02f4?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1000&q=80"
    ],
    tags: ["Under ₹60L", "3BHK", "Miyapur", "Family Friendly"],
    isFeatured: false,
    isDemo: true
  },
  {
    title: "Kukatpally Elite Towers - 2BHK Near Metro",
    description: "Contemporary 2BHK flat in Kukatpally with premium tile work, chimney in kitchen, and 24-hr security. Steps away from supermarkets, coaching centers, and metro transit.",
    location: {
      address: "Vivekananda Nagar, Kukatpally",
      locality: "Kukatpally",
      city: "Hyderabad",
      pincode: "500072",
      landmarks: ["Kukatpally Metro", "KPHB Main Road"]
    },
    price: 4900000,
    priceDisplay: "₹49 Lakhs",
    propertyType: "Apartment",
    bhk: 2,
    bathrooms: 2,
    balconies: 1,
    area: 1120,
    furnishing: "Semi-Furnished",
    possessionStatus: "Ready to Move",
    isGatedCommunity: true,
    floor: "3rd of 7 Floors",
    facing: "East",
    amenities: ["Lift", "Power Backup", "24/7 Security", "Covered Parking", "Intercom"],
    nearbyFacilities: [
      { name: "Kukatpally Metro Station", facilityType: "Metro", distanceKm: 0.5 },
      { name: "DAV Public School", facilityType: "School", distanceKm: 1.4 },
      { name: "Remedy Hospital", facilityType: "Hospital", distanceKm: 0.9 },
      { name: "Nexus Mall", facilityType: "Shopping Mall", distanceKm: 2.0 }
    ],
    images: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1000&q=80"
    ],
    tags: ["Under ₹50L", "Near Metro", "Kukatpally", "2BHK"],
    isFeatured: false,
    isDemo: true
  },
  {
    title: "Gachibowli Heights - 2BHK Budget Apartment",
    description: "Cozy 2BHK flat in Gachibowli near Telecom Nagar. Excellent budget option for IT professionals seeking short commute to DLF Cybercity and IIIT Hyderabad.",
    location: {
      address: "Telecom Nagar, Near Gachibowli Flyover",
      locality: "Gachibowli",
      city: "Hyderabad",
      pincode: "500032",
      landmarks: ["IIIT Hyderabad", "DLF Cybercity", "Gachibowli Stadium"]
    },
    price: 5700000,
    priceDisplay: "₹57 Lakhs",
    propertyType: "Apartment",
    bhk: 2,
    bathrooms: 2,
    balconies: 1,
    area: 1150,
    furnishing: "Semi-Furnished",
    possessionStatus: "Ready to Move",
    isGatedCommunity: true,
    floor: "5th of 10 Floors",
    facing: "North",
    amenities: ["Gym", "Power Backup", "24/7 Security", "Lift", "Covered Parking", "Clubhouse"],
    nearbyFacilities: [
      { name: "DLF Cybercity", facilityType: "IT Park", distanceKm: 1.1 },
      { name: "IIIT Hyderabad", facilityType: "School", distanceKm: 0.8 },
      { name: "Care Hospitals Hi-tech", facilityType: "Hospital", distanceKm: 1.5 }
    ],
    images: [
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1000&q=80"
    ],
    tags: ["Under ₹60L", "Gachibowli", "2BHK", "Near DLF"],
    isFeatured: false,
    isDemo: true
  },
  {
    title: "Emerald Woods - 3BHK Premium Villa",
    description: "Independent 3BHK designer villa with private courtyard, landscaped terrace garden, modular fittings, and double car porch in peaceful Gachibowli enclave.",
    location: {
      address: "Gowlidoddy Road, Near Q-City",
      locality: "Gachibowli",
      city: "Hyderabad",
      pincode: "500075",
      landmarks: ["Q-City IT Park", "Financial District Entry"]
    },
    price: 18500000,
    priceDisplay: "₹1.85 Cr",
    propertyType: "Villa",
    bhk: 3,
    bathrooms: 3,
    balconies: 2,
    area: 2800,
    furnishing: "Semi-Furnished",
    possessionStatus: "Ready to Move",
    isGatedCommunity: true,
    floor: "G+1 Duplex",
    facing: "East",
    amenities: ["Gym", "Swimming Pool", "Clubhouse", "24/7 Security", "Power Backup", "Private Garden", "Covered Parking", "Jogging Track"],
    nearbyFacilities: [
      { name: "Q-City IT Park", facilityType: "IT Park", distanceKm: 0.8 },
      { name: "Keystone International School", facilityType: "School", distanceKm: 1.5 },
      { name: "Continental Hospital", facilityType: "Hospital", distanceKm: 2.8 }
    ],
    images: [
      "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1000&q=80"
    ],
    tags: ["Villa", "Luxury", "Gachibowli", "Private Garden"],
    isFeatured: true,
    isDemo: true
  },
  {
    title: "Skyline Pinnacle - 4BHK Sky Mansion",
    description: "Iconic 4BHK sky residence in HITEC City with breathtaking panoramic views of Durgam Cheruvu lake. Boasts Italian marble, smart automation, temperature-controlled pool access, and private wine cellar.",
    location: {
      address: "Inorbit Mall Road, Madhapur-Hitec Corridor",
      locality: "HITEC City",
      city: "Hyderabad",
      pincode: "500081",
      landmarks: ["Inorbit Mall", "Durgam Cheruvu", "Knowledge City"]
    },
    price: 27500000,
    priceDisplay: "₹2.75 Cr",
    propertyType: "Apartment",
    bhk: 4,
    bathrooms: 4,
    balconies: 3,
    area: 3450,
    furnishing: "Furnished",
    possessionStatus: "Ready to Move",
    isGatedCommunity: true,
    floor: "18th of 30 Floors",
    facing: "North-East",
    amenities: ["Gym", "Swimming Pool", "Clubhouse", "24/7 Security", "Power Backup", "Lift", "Covered Parking", "Tennis Court", "Concierge", "EV Charging Station"],
    nearbyFacilities: [
      { name: "Durgam Cheruvu Metro", facilityType: "Metro", distanceKm: 1.0 },
      { name: "Knowledge City IT Park", facilityType: "IT Park", distanceKm: 0.7 },
      { name: "Inorbit Mall", facilityType: "Shopping Mall", distanceKm: 0.5 },
      { name: "AIG Hospitals", facilityType: "Hospital", distanceKm: 2.4 }
    ],
    images: [
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1000&q=80"
    ],
    tags: ["Sky Mansion", "Lake View", "Luxury", "HITEC City"],
    isFeatured: true,
    isDemo: true
  },
  {
    title: "Prime Crest - 2BHK In Madhapur IT Core",
    description: "Well-appointed 2BHK flat nestled behind Cyber Towers. Offers seamless pedestrian access to major tech firms, co-working hubs, metro station, and gourmet dining.",
    location: {
      address: "HUDA Techno Enclave, Sector 1",
      locality: "Madhapur",
      city: "Hyderabad",
      pincode: "500081",
      landmarks: ["Cyber Towers", "Hitec Metro", "Shilparamam"]
    },
    price: 6400000,
    priceDisplay: "₹64 Lakhs",
    propertyType: "Apartment",
    bhk: 2,
    bathrooms: 2,
    balconies: 1,
    area: 1210,
    furnishing: "Semi-Furnished",
    possessionStatus: "Ready to Move",
    isGatedCommunity: true,
    floor: "4th of 8 Floors",
    facing: "East",
    amenities: ["Power Backup", "Lift", "24/7 Security", "Covered Parking", "Gym", "Intercom"],
    nearbyFacilities: [
      { name: "Hitec City Metro Station", facilityType: "Metro", distanceKm: 0.6 },
      { name: "Cyber Towers", facilityType: "IT Park", distanceKm: 0.4 },
      { name: "Medicover Hospitals", facilityType: "Hospital", distanceKm: 1.3 }
    ],
    images: [
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1000&q=80"
    ],
    tags: ["Under ₹70L", "Near Metro", "Madhapur", "2BHK"],
    isFeatured: false,
    isDemo: true
  },
  {
    title: "Kondapur Green Haven - 3BHK Gated Society",
    description: "Vastu-compliant 3BHK residence in Kondapur near Sanskriti Global School. Features solar rooftop lighting, dedicated club, amphitheater, and 2 covered parking slots.",
    location: {
      address: "Silpa Park, Hafeezpet Road",
      locality: "Kondapur",
      city: "Hyderabad",
      pincode: "500084",
      landmarks: ["Sanskriti School", "Hafeezpet MMTS", "Kondapur Masjid"]
    },
    price: 7200000,
    priceDisplay: "₹72 Lakhs",
    propertyType: "Apartment",
    bhk: 3,
    bathrooms: 3,
    balconies: 2,
    area: 1680,
    furnishing: "Semi-Furnished",
    possessionStatus: "Ready to Move",
    isGatedCommunity: true,
    floor: "7th of 15 Floors",
    facing: "East",
    amenities: ["Gym", "Swimming Pool", "Clubhouse", "24/7 Security", "Power Backup", "Lift", "Covered Parking", "Children Play Area", "Amphitheater"],
    nearbyFacilities: [
      { name: "Hafeezpet MMTS Station", facilityType: "Metro", distanceKm: 1.1 },
      { name: "Sanskriti Global School", facilityType: "School", distanceKm: 0.5 },
      { name: "Kims Hospital", facilityType: "Hospital", distanceKm: 1.8 }
    ],
    images: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80"
    ],
    tags: ["Kondapur", "3BHK", "Gated Society", "Vastu Compliant"],
    isFeatured: false,
    isDemo: true
  },
  {
    title: "Miyapur Symphony - 1BHK Starter Home",
    description: "Compact 1BHK apartment ideal for singles, students, or young professionals. Clean design, low monthly maintenance, lift, and reliable municipal water connection.",
    location: {
      address: "Deepthisree Nagar, Miyapur",
      locality: "Miyapur",
      city: "Hyderabad",
      pincode: "500049",
      landmarks: ["Deepthisree Arch", "Calvary Temple", "Miyapur Lake"]
    },
    price: 3200000,
    priceDisplay: "₹32 Lakhs",
    propertyType: "Apartment",
    bhk: 1,
    bathrooms: 1,
    balconies: 1,
    area: 620,
    furnishing: "Unfurnished",
    possessionStatus: "Ready to Move",
    isGatedCommunity: false,
    floor: "1st of 4 Floors",
    facing: "North",
    amenities: ["Lift", "Power Backup", "Covered Parking", "24/7 Security"],
    nearbyFacilities: [
      { name: "Miyapur Metro Station", facilityType: "Metro", distanceKm: 1.5 },
      { name: "Genesis International School", facilityType: "School", distanceKm: 1.0 },
      { name: "Mirra Hospital", facilityType: "Hospital", distanceKm: 0.8 }
    ],
    images: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1000&q=80"
    ],
    tags: ["Under ₹35L", "1BHK", "Miyapur", "Budget"],
    isFeatured: false,
    isDemo: true
  },
  {
    title: "Financial District Horizon - 2BHK Executive Flat",
    description: "Modern 2BHK flat near Microsoft and Apple campuses in Financial District. Features automated biometric locks, EV car charging bays, modern fitness center, and co-working lounge.",
    location: {
      address: "ISB Road, Nanakramguda",
      locality: "Financial District",
      city: "Hyderabad",
      pincode: "500032",
      landmarks: ["Microsoft Campus", "Apple Office", "ORR Exit 1"]
    },
    price: 7800000,
    priceDisplay: "₹78 Lakhs",
    propertyType: "Apartment",
    bhk: 2,
    bathrooms: 2,
    balconies: 1,
    area: 1320,
    furnishing: "Semi-Furnished",
    possessionStatus: "Ready to Move",
    isGatedCommunity: true,
    floor: "9th of 22 Floors",
    facing: "North",
    amenities: ["Gym", "Swimming Pool", "Clubhouse", "24/7 Security", "Power Backup", "Lift", "Covered Parking", "EV Charging Station"],
    nearbyFacilities: [
      { name: "Microsoft Campus", facilityType: "IT Park", distanceKm: 0.4 },
      { name: "Continental Hospital", facilityType: "Hospital", distanceKm: 1.6 },
      { name: "Oakridge International", facilityType: "School", distanceKm: 2.1 }
    ],
    images: [
      "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=1000&q=80"
    ],
    tags: ["Financial District", "2BHK", "Near Microsoft"],
    isFeatured: false,
    isDemo: true
  },
  {
    title: "Kukatpally Boulevard - 3BHK Spacious Flat",
    description: "Substantial 3BHK home in Kukatpally near JNTU. Quiet neighborhood setting with broad roads, excellent municipal water, nearby temples, schools, and quick access to Balanagar industrial corridor.",
    location: {
      address: "Nizampet Road, Near JNTU Metro",
      locality: "Kukatpally",
      city: "Hyderabad",
      pincode: "500072",
      landmarks: ["JNTU Metro Station", "Nizampet X Roads"]
    },
    price: 6100000,
    priceDisplay: "₹61 Lakhs",
    propertyType: "Apartment",
    bhk: 3,
    bathrooms: 3,
    balconies: 2,
    area: 1510,
    furnishing: "Semi-Furnished",
    possessionStatus: "Ready to Move",
    isGatedCommunity: true,
    floor: "5th of 11 Floors",
    facing: "East",
    amenities: ["Gym", "Power Backup", "24/7 Security", "Lift", "Covered Parking", "Clubhouse", "Children Play Area"],
    nearbyFacilities: [
      { name: "JNTU College Metro", facilityType: "Metro", distanceKm: 0.9 },
      { name: "Vignan School", facilityType: "School", distanceKm: 0.7 },
      { name: "Anupama Hospital", facilityType: "Hospital", distanceKm: 1.2 }
    ],
    images: [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1000&q=80"
    ],
    tags: ["Under ₹65L", "3BHK", "Kukatpally", "Near JNTU"],
    isFeatured: false,
    isDemo: true
  }
];

module.exports = sampleProperties;
