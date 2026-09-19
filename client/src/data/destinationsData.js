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
};

export default destinationsData;