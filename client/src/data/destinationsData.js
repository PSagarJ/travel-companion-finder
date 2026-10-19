// Hardcoded demo data for the three featured destinations on the home page.
// No backend/database involved — this powers the "explore destination"
// experience (stays, cuisines, flights) as a self-contained demo dataset.

const destinationsData = {
  "dest-1": {
    title: "The Ultimate Bali Escape",
    location: "Bali, Indonesia",
    heroImg:
      "https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=85&w=1600&auto=format&fit=crop",
    description:
      "Volcanic hillsides, rice terraces, and beach towns that range from surf-loud to temple-quiet. Bali rewards travelers who mix a little adventure with a lot of downtime.",
    airportCode: "DPS",
    cuisines: [
      {
        name: "Nasi Goreng",
        description:
          "Indonesia's smoky, deeply savory fried rice — usually topped with a fried egg and prawn crackers.",
        img: "https://images.unsplash.com/photo-1512058564366-18510be2db19?q=80&w=800&auto=format&fit=crop",
      },
      {
        name: "Babi Guling",
        description:
          "Balinese spit-roasted suckling pig, stuffed with turmeric, lemongrass, and chili paste.",
        img: "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=800&auto=format&fit=crop",
      },
      {
        name: "Sate Lilit",
        description:
          "Minced spiced fish or chicken satay, wrapped around lemongrass or bamboo skewers and grilled.",
        img: "https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?q=80&w=800&auto=format&fit=crop",
      },
    ],
    stays: [
      {
        name: "Ubud Jungle Villa",
        type: "Private villa",
        pricePerNight: 62,
        rating: 4.8,
        img: "https://images.unsplash.com/photo-1602343168117-bb8ffe3e2e9f?q=80&w=800&auto=format&fit=crop",
      },
      {
        name: "Canggu Surf Hostel",
        type: "Hostel dorm",
        pricePerNight: 14,
        rating: 4.5,
        img: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?q=80&w=800&auto=format&fit=crop",
      },
      {
        name: "Seminyak Beachfront Resort",
        type: "Resort",
        pricePerNight: 145,
        rating: 4.9,
        img: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?q=80&w=800&auto=format&fit=crop",
      },
    ],
    flights: [
      {
        airline: "Garuda Indonesia",
        flightNumber: "GA 411",
        from: "Your city",
        to: "Denpasar (DPS)",
        departTime: "22:10",
        arriveTime: "14:35 +1",
        duration: "16h 25m • 1 stop",
        price: 612,
      },
      {
        airline: "Singapore Airlines",
        flightNumber: "SQ 938",
        from: "Your city",
        to: "Denpasar (DPS)",
        departTime: "09:45",
        arriveTime: "23:50",
        duration: "14h 05m • 1 stop",
        price: 749,
      },
    ],
  },

  "dest-2": {
    title: "Kyoto Temple Tour",
    location: "Kyoto, Japan",
    heroImg:
      "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=85&w=1600&auto=format&fit=crop",
    description:
      "A thousand years as Japan's capital left Kyoto layered with temples, machiya wooden townhouses, and quiet gardens — a slower, more contemplative counterpart to Tokyo.",
    airportCode: "KIX",
    cuisines: [
      {
        name: "Kaiseki",
        description:
          "A multi-course seasonal tasting menu built around balance, presentation, and precise technique.",
        img: "https://images.unsplash.com/photo-1553621042-f6e147245754?q=80&w=800&auto=format&fit=crop",
      },
      {
        name: "Yudofu",
        description:
          "Simmered tofu hot pot, a Kyoto specialty tied to the city's Buddhist temple cuisine.",
        img: "https://images.unsplash.com/photo-1617196034183-421b4917c92d?q=80&w=800&auto=format&fit=crop",
      },
      {
        name: "Matcha Sweets",
        description:
          "Kyoto is Japan's matcha capital — expect it in everything from soft serve to delicate wagashi.",
        img: "https://images.unsplash.com/photo-1622597467836-f3285f2131b8?q=80&w=800&auto=format&fit=crop",
      },
    ],
    stays: [
      {
        name: "Gion Ryokan Stay",
        type: "Traditional ryokan",
        pricePerNight: 98,
        rating: 4.9,
        img: "https://images.unsplash.com/photo-1578469645742-46cae010e5d4?q=80&w=800&auto=format&fit=crop",
      },
      {
        name: "Kyoto Station Capsule Hotel",
        type: "Capsule hotel",
        pricePerNight: 28,
        rating: 4.4,
        img: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=800&auto=format&fit=crop",
      },
      {
        name: "Arashiyama Riverside Inn",
        type: "Boutique inn",
        pricePerNight: 76,
        rating: 4.7,
        img: "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?q=80&w=800&auto=format&fit=crop",
      },
    ],
    flights: [
      {
        airline: "ANA",
        flightNumber: "NH 106",
        from: "Your city",
        to: "Osaka Kansai (KIX)",
        departTime: "11:20",
        arriveTime: "15:05 +1",
        duration: "13h 45m • Nonstop",
        price: 890,
      },
      {
        airline: "Japan Airlines",
        flightNumber: "JL 62",
        from: "Your city",
        to: "Osaka Kansai (KIX)",
        departTime: "18:30",
        arriveTime: "21:55 +1",
        duration: "13h 25m • Nonstop",
        price: 855,
      },
    ],
  },

  "dest-3": {
    title: "Roads of Ladakh",
    location: "Ladakh, India",
    heroImg:
      "https://images.unsplash.com/photo-1518005020951-eccb494ad742?q=85&w=1600&auto=format&fit=crop",
    description:
      "High-altitude desert, Buddhist monasteries clinging to cliffs, and some of the most dramatic mountain roads on earth. Ladakh is for travelers chasing wide-open, thin-air landscapes.",
    airportCode: "IXL",
    cuisines: [
      {
        name: "Thukpa",
        description:
          "A hearty Tibetan-influenced noodle soup, the go-to warm-up after a cold mountain day.",
        img: "https://images.unsplash.com/photo-1626804475297-411290840f5f?q=80&w=800&auto=format&fit=crop",
      },
      {
        name: "Momos",
        description:
          "Steamed or fried dumplings filled with spiced vegetables or meat, served with a fiery chili dip.",
        img: "https://images.unsplash.com/photo-1601050690597-df0568f70950?q=80&w=800&auto=format&fit=crop",
      },
      {
        name: "Butter Tea (Gur Gur Cha)",
        description:
          "Salted, buttery tea traditionally churned in a wooden cylinder — an acquired taste worth trying once.",
        img: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?q=80&w=800&auto=format&fit=crop",
      },
    ],
    stays: [
      {
        name: "Leh Old Town Homestay",
        type: "Homestay",
        pricePerNight: 22,
        rating: 4.7,
        img: "https://images.unsplash.com/photo-1568084680786-a84f91d1153c?q=80&w=800&auto=format&fit=crop",
      },
      {
        name: "Nubra Valley Camp",
        type: "Desert camp",
        pricePerNight: 45,
        rating: 4.6,
        img: "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?q=80&w=800&auto=format&fit=crop",
      },
      {
        name: "Pangong Lakeside Cottage",
        type: "Cottage",
        pricePerNight: 58,
        rating: 4.8,
        img: "https://images.unsplash.com/photo-1601701119533-fe718b95a151?q=80&w=800&auto=format&fit=crop",
      },
    ],
    flights: [
      {
        airline: "IndiGo",
        flightNumber: "6E 2043",
        from: "Your city",
        to: "Leh (IXL)",
        departTime: "06:15",
        arriveTime: "09:40",
        duration: "3h 25m • 1 stop",
        price: 118,
      },
      {
        airline: "Air India",
        flightNumber: "AI 442",
        from: "Your city",
        to: "Leh (IXL)",
        departTime: "07:50",
        arriveTime: "10:20",
        duration: "2h 30m • Nonstop",
        price: 145,
      },
    ],
  },

  "dest-4": {
    title: "Swiss Alps & Lakes Expedition",
    location: "Interlaken, Switzerland",
    heroImg:
      "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?q=85&w=1600&auto=format&fit=crop",
    description:
      "Glacial peaks, mirror-like alpine lakes, and cogwheel railways winding through emerald meadows. Switzerland is the gold standard for crisp mountain air and high-altitude hiking.",
    airportCode: "ZRH",
    cuisines: [
      {
        name: "Fondue Moitié-Moitié",
        description:
          "Bubbling Gruyère and Vacherin Fribourgeois melted with white wine and kirsch, served with crusty bread.",
        img: "https://images.unsplash.com/photo-1541544741938-0af808871cc0?q=80&w=800&auto=format&fit=crop",
      },
      {
        name: "Crispy Rösti",
        description:
          "Golden, pan-fried grated potato cakes topped with melted cheese, fried egg, and local bacon.",
        img: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?q=80&w=800&auto=format&fit=crop",
      },
      {
        name: "Swiss Alpine Chocolate",
        description:
          "Handcrafted truffles and pralines created from rich mountain milk and slow-conched cocoa.",
        img: "https://images.unsplash.com/photo-1549007994-cb92caebd54b?q=80&w=800&auto=format&fit=crop",
      },
    ],
    stays: [
      {
        name: "Grindelwald Alpine Chalet",
        type: "Traditional chalet",
        pricePerNight: 118,
        rating: 4.9,
        img: "https://images.unsplash.com/photo-1502784444187-359ac186c5bb?q=80&w=800&auto=format&fit=crop",
      },
      {
        name: "Interlaken Adventure Hostel",
        type: "Hostel dorm",
        pricePerNight: 32,
        rating: 4.6,
        img: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?q=80&w=800&auto=format&fit=crop",
      },
      {
        name: "Lake Brienz Panorama Resort",
        type: "Luxury resort",
        pricePerNight: 185,
        rating: 4.9,
        img: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=800&auto=format&fit=crop",
      },
    ],
    flights: [
      {
        airline: "Swiss International Air Lines",
        flightNumber: "LX 18",
        from: "Your city",
        to: "Zurich (ZRH)",
        departTime: "17:40",
        arriveTime: "08:15 +1",
        duration: "8h 35m • Nonstop",
        price: 780,
      },
      {
        airline: "Lufthansa",
        flightNumber: "LH 430",
        from: "Your city",
        to: "Zurich (ZRH)",
        departTime: "14:15",
        arriveTime: "07:30 +1",
        duration: "11h 15m • 1 stop",
        price: 695,
      },
    ],
  },

  "dest-5": {
    title: "Amalfi Coast & Capri Dream",
    location: "Positano, Italy",
    heroImg:
      "https://images.unsplash.com/photo-1533105079780-92b9be482077?q=85&w=1600&auto=format&fit=crop",
    description:
      "Pastel houses clinging to sheer sea cliffs, sun-drenched lemon terraces, and deep azure Mediterranean waters. The Amalfi Coast is an unforgettable journey of taste, coastal walks, and boat trips.",
    airportCode: "NAP",
    cuisines: [
      {
        name: "Spaghetti alle Vongole",
        description:
          "Al dente pasta tossed with fresh Tyrrhenian clams, garlic, olive oil, and fresh parsley.",
        img: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?q=80&w=800&auto=format&fit=crop",
      },
      {
        name: "Neapolitan Wood-Fired Pizza",
        description:
          "San Marzano tomatoes, fresh Buffalo Mozzarella, and basil on a smoky, charred leopard-spotted crust.",
        img: "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=800&auto=format&fit=crop",
      },
      {
        name: "Limoncello & Delizia al Limone",
        description:
          "Chilled organic Sorrento lemon liqueur paired with an airy, dome-shaped sponge cake filled with lemon cream.",
        img: "https://images.unsplash.com/photo-1587314168485-3236d6710814?q=80&w=800&auto=format&fit=crop",
      },
    ],
    stays: [
      {
        name: "Positano Cliffside Boutique Hotel",
        type: "Boutique hotel",
        pricePerNight: 165,
        rating: 4.9,
        img: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?q=80&w=800&auto=format&fit=crop",
      },
      {
        name: "Praiano Seaview Guesthouse",
        type: "Guesthouse",
        pricePerNight: 64,
        rating: 4.7,
        img: "https://images.unsplash.com/photo-1568084680786-a84f91d1153c?q=80&w=800&auto=format&fit=crop",
      },
      {
        name: "Anacapri Villa Retreat",
        type: "Private villa",
        pricePerNight: 210,
        rating: 4.9,
        img: "https://images.unsplash.com/photo-1602343168117-bb8ffe3e2e9f?q=80&w=800&auto=format&fit=crop",
      },
    ],
    flights: [
      {
        airline: "ITA Airways",
        flightNumber: "AZ 610",
        from: "Your city",
        to: "Naples (NAP)",
        departTime: "19:05",
        arriveTime: "11:45 +1",
        duration: "10h 40m • 1 stop",
        price: 720,
      },
      {
        airline: "Emirates",
        flightNumber: "EK 205",
        from: "Your city",
        to: "Naples (NAP)",
        departTime: "21:30",
        arriveTime: "14:10 +1",
        duration: "12h 40m • 1 stop",
        price: 810,
      },
    ],
  },

  "dest-6": {
    title: "Patagonia Wilderness Odyssey",
    location: "Torres del Paine, Chile",
    heroImg:
      "https://images.unsplash.com/photo-1527004013197-933c4bb611b3?q=85&w=1600&auto=format&fit=crop",
    description:
      "Jagged granite horns piercing the southern sky, turquoise glacial lakes, and sweeping Andean plains where guanacos roam freely. Patagonia is the bucket-list trek for true adventurers.",
    airportCode: "PUQ",
    cuisines: [
      {
        name: "Cordero al Palo",
        description:
          "Traditional Patagonian lamb slow-roasted over an open beechwood fire pit until melt-in-your-mouth tender.",
        img: "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=800&auto=format&fit=crop",
      },
      {
        name: "Centolla Patagónica",
        description:
          "Wild-caught southern king crab served with freshly squeezed lemon butter and warm artisanal bread.",
        img: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?q=80&w=800&auto=format&fit=crop",
      },
      {
        name: "Calafate Berry Pie",
        description:
          "Sweet-tart wild berries baked in a flaky crust. Legend says anyone who eats a calafate berry will return to Patagonia.",
        img: "https://images.unsplash.com/photo-1464305795204-6f5bbfc7fb81?q=80&w=800&auto=format&fit=crop",
      },
    ],
    stays: [
      {
        name: "EcoCamp Geodesic Domes",
        type: "Eco dome suite",
        pricePerNight: 135,
        rating: 4.9,
        img: "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?q=80&w=800&auto=format&fit=crop",
      },
      {
        name: "Puerto Natales Trekker Hostel",
        type: "Hostel dorm",
        pricePerNight: 24,
        rating: 4.6,
        img: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?q=80&w=800&auto=format&fit=crop",
      },
      {
        name: "Grey Glacier Wilderness Lodge",
        type: "Mountain lodge",
        pricePerNight: 160,
        rating: 4.8,
        img: "https://images.unsplash.com/photo-1601701119533-fe718b95a151?q=80&w=800&auto=format&fit=crop",
      },
    ],
    flights: [
      {
        airline: "LATAM Airlines",
        flightNumber: "LA 532",
        from: "Your city",
        to: "Punta Arenas (PUQ)",
        departTime: "23:15",
        arriveTime: "16:20 +1",
        duration: "15h 05m • 1 stop",
        price: 940,
      },
      {
        airline: "American Airlines",
        flightNumber: "AA 945",
        from: "Your city",
        to: "Punta Arenas (PUQ)",
        departTime: "20:45",
        arriveTime: "15:10 +1",
        duration: "16h 25m • 2 stops",
        price: 890,
      },
    ],
  },

  "dest-7": {
    title: "Santorini Caldera & Aegean Sunsets",
    location: "Santorini, Greece",
    heroImg:
      "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?q=85&w=1600&auto=format&fit=crop",
    description:
      "White-washed cliffside cubist villages, brilliant cobalt-blue church domes, and dramatic volcanic caldera vistas overlooking the Aegean Sea. An unmatched romantic and photography paradise.",
    airportCode: "JTR",
    cuisines: [
      {
        name: "Tomatokeftedes",
        description:
          "Crispy Santorini tomato fritters bursting with wild mint, local volcanic herbs, and sweet onions.",
        img: "https://images.unsplash.com/photo-1540420773420-3366772f4999?q=80&w=800&auto=format&fit=crop",
      },
      {
        name: "Charcoal Grilled Octopus",
        description:
          "Sun-dried octopus grilled over glowing coals and dressed with extra virgin Cretan olive oil, oregano, and lemon.",
        img: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?q=80&w=800&auto=format&fit=crop",
      },
      {
        name: "Baklava with Thyme Honey",
        description:
          "Crispy golden layers of phyllo pastry filled with crushed walnuts and drenched in aromatic Greek thyme honey syrup.",
        img: "https://images.unsplash.com/photo-1519869325930-281384150729?q=80&w=800&auto=format&fit=crop",
      },
    ],
    stays: [
      {
        name: "Oia Sunset Cave Villa",
        type: "Cave villa",
        pricePerNight: 155,
        rating: 4.9,
        img: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?q=80&w=800&auto=format&fit=crop",
      },
      {
        name: "Fira Cliffside Boutique Inn",
        type: "Boutique hotel",
        pricePerNight: 85,
        rating: 4.7,
        img: "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?q=80&w=800&auto=format&fit=crop",
      },
      {
        name: "Perissa Black Beach Hostel",
        type: "Beach hostel",
        pricePerNight: 22,
        rating: 4.5,
        img: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?q=80&w=800&auto=format&fit=crop",
      },
    ],
    flights: [
      {
        airline: "Aegean Airlines",
        flightNumber: "A3 354",
        from: "Your city",
        to: "Santorini (JTR)",
        departTime: "10:30",
        arriveTime: "22:15",
        duration: "10h 45m • 1 stop",
        price: 640,
      },
      {
        airline: "British Airways",
        flightNumber: "BA 652",
        from: "Your city",
        to: "Santorini (JTR)",
        departTime: "08:15",
        arriveTime: "19:50",
        duration: "10h 35m • 1 stop",
        price: 710,
      },
    ],
  },

  "dest-8": {
    title: "Serengeti & Zanzibar Safari",
    location: "Serengeti & Zanzibar, Tanzania",
    heroImg:
      "https://images.unsplash.com/photo-1516426122078-c23e76319801?q=85&w=1600&auto=format&fit=crop",
    description:
      "The thundering hooves of the Great Migration across acacia-dotted plains, followed by turquoise coral lagoons and spice bazaars on the historic island of Zanzibar.",
    airportCode: "JRO",
    cuisines: [
      {
        name: "Zanzibar Seafood Curry",
        description:
          "Succulent prawns, calamari, and reef fish slow-simmered in rich coconut milk, cardamom, and fresh turmeric.",
        img: "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?q=80&w=800&auto=format&fit=crop",
      },
      {
        name: "Nyama Choma & Kachumbari",
        description:
          "Char-grilled spiced meat served alongside a fresh chopped tomato, onion, chili, and cilantro salad.",
        img: "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=800&auto=format&fit=crop",
      },
      {
        name: "Cardamom Mandazi",
        description:
          "Fluffy Swahili-style triangle donuts delicately infused with ground cardamom and coconut milk.",
        img: "https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=800&auto=format&fit=crop",
      },
    ],
    stays: [
      {
        name: "Serengeti Migration Tented Camp",
        type: "Safari tented camp",
        pricePerNight: 140,
        rating: 4.9,
        img: "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?q=80&w=800&auto=format&fit=crop",
      },
      {
        name: "Stone Town Heritage Palace",
        type: "Heritage boutique",
        pricePerNight: 50,
        rating: 4.7,
        img: "https://images.unsplash.com/photo-1568084680786-a84f91d1153c?q=80&w=800&auto=format&fit=crop",
      },
      {
        name: "Nungwi Beachfront Bungalows",
        type: "Beach bungalow",
        pricePerNight: 72,
        rating: 4.8,
        img: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?q=80&w=800&auto=format&fit=crop",
      },
    ],
    flights: [
      {
        airline: "Qatar Airways",
        flightNumber: "QR 1357",
        from: "Your city",
        to: "Kilimanjaro (JRO)",
        departTime: "01:25",
        arriveTime: "14:50",
        duration: "13h 25m • 1 stop",
        price: 880,
      },
      {
        airline: "Ethiopian Airlines",
        flightNumber: "ET 815",
        from: "Your city",
        to: "Kilimanjaro (JRO)",
        departTime: "11:00",
        arriveTime: "21:30",
        duration: "10h 30m • 1 stop",
        price: 790,
      },
    ],
  },
};

export default destinationsData;