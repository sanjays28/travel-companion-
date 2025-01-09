// Static location data for Thailand destinations
const locations = [
  {
    id: "bkk-001",
    name: "Bangkok",
    coordinates: {
      lat: 13.7563,
      lng: 100.5018
    },
    type: "city",
    description: "Thailand's vibrant capital city, known for its ornate temples, modern shopping centers, and bustling street life.",
    photos: [
      {
        url: "https://example.com/bangkok/grand-palace.jpg",
        caption: "The magnificent Grand Palace complex"
      },
      {
        url: "https://example.com/bangkok/wat-arun.jpg",
        caption: "Wat Arun temple at sunset"
      },
      {
        url: "https://example.com/bangkok/chatuchak.jpg",
        caption: "Bustling Chatuchak Weekend Market"
      }
    ],
    videos: [
      {
        url: "https://example.com/bangkok/city-tour.mp4",
        title: "Bangkok City Tour Highlights"
      },
      {
        url: "https://example.com/bangkok/food-tour.mp4",
        title: "Street Food Adventure in Bangkok"
      }
    ],
    reviews: [
      {
        rating: 5,
        comment: "Amazing city with so much to explore! The temples are breathtaking.",
        author: "John D."
      },
      {
        rating: 4,
        comment: "Great food and shopping, but be prepared for the heat and traffic.",
        author: "Sarah M."
      }
    ],
    highlights: [
      "Visit the Grand Palace complex",
      "Experience the vibrant street food scene",
      "Shop at floating markets",
      "Explore ancient temples"
    ],
    features: [
      "Cultural attractions",
      "Shopping districts",
      "Street food",
      "Nightlife",
      "Temple tours"
    ],
    pointsOfInterest: [
      {
        name: "Grand Palace",
        coordinates: {
          lat: 13.7500,
          lng: 100.4913
        },
        description: "Historic complex of buildings serving as the official residence of the Kings of Thailand."
      },
      {
        name: "Wat Arun",
        coordinates: {
          lat: 13.7437,
          lng: 100.4888
        },
        description: "Buddhist temple on the west bank of the Chao Phraya River, known for its distinctive spires."
      },
      {
        name: "Chatuchak Weekend Market",
        coordinates: {
          lat: 13.7999,
          lng: 100.5505
        },
        description: "One of the world's largest weekend markets, featuring local crafts, food, and clothing."
      }
    ]
  },
  {
    id: "cmi-001",
    name: "Chiang Mai",
    coordinates: {
      lat: 18.7883,
      lng: 98.9853
    },
    type: "city",
    description: "Historic city in northern Thailand, famous for its ancient temples, traditional crafts, and mountain scenery.",
    photos: [
      {
        url: "https://example.com/chiangmai/doi-suthep.jpg",
        caption: "Doi Suthep temple at sunset"
      },
      {
        url: "https://example.com/chiangmai/old-city.jpg",
        caption: "Ancient temples in the Old City"
      }
    ],
    videos: [
      {
        url: "https://example.com/chiangmai/temple-tour.mp4",
        title: "Exploring Chiang Mai's Ancient Temples"
      }
    ],
    reviews: [
      {
        rating: 5,
        comment: "Perfect blend of culture and nature. Loved the temples and mountain views!",
        author: "Mike R."
      },
      {
        rating: 5,
        comment: "The best place to experience Thai culture and traditions.",
        author: "Emma L."
      }
    ],
    highlights: [
      "Visit ancient temples",
      "Experience traditional markets",
      "Enjoy mountain views",
      "Learn Thai cooking"
    ],
    features: [
      "Cultural heritage",
      "Mountain scenery",
      "Traditional crafts",
      "Cooking schools",
      "Night markets"
    ],
    pointsOfInterest: [
      {
        name: "Doi Suthep",
        coordinates: {
          lat: 18.8047,
          lng: 98.9219
        },
        description: "Sacred temple offering panoramic views of Chiang Mai from its mountain-top location."
      },
      {
        name: "Old City Temples",
        coordinates: {
          lat: 18.7884,
          lng: 98.9853
        },
        description: "Historic district featuring numerous ancient temples within the old city walls."
      },
      {
        name: "Night Bazaar",
        coordinates: {
          lat: 18.7870,
          lng: 98.9933
        },
        description: "Popular night market featuring local handicrafts, food, and entertainment."
      }
    ]
  },
  {
    id: "hkt-001",
    name: "Phuket",
    coordinates: {
      lat: 7.8804,
      lng: 98.3923
    },
    type: "island",
    description: "Thailand's largest island, known for its beautiful beaches, clear waters, and vibrant nightlife.",
    photos: [
      {
        url: "https://example.com/phuket/phang-nga.jpg",
        caption: "Stunning limestone cliffs of Phang Nga Bay"
      },
      {
        url: "https://example.com/phuket/beaches.jpg",
        caption: "Beautiful beaches of Phuket"
      }
    ],
    videos: [
      {
        url: "https://example.com/phuket/island-tour.mp4",
        title: "Phuket Island Paradise Tour"
      }
    ],
    reviews: [
      {
        rating: 4,
        comment: "Beautiful beaches and great nightlife. Can be crowded during peak season.",
        author: "Tom H."
      },
      {
        rating: 5,
        comment: "Perfect beach holiday destination with lots of activities!",
        author: "Lisa P."
      }
    ],
    highlights: [
      "Relax on beautiful beaches",
      "Explore Phang Nga Bay",
      "Visit the Big Buddha",
      "Experience nightlife"
    ],
    features: [
      "Beaches",
      "Water sports",
      "Nightlife",
      "Island tours",
      "Cultural sites"
    ],
    pointsOfInterest: [
      {
        name: "Phang Nga Bay",
        coordinates: {
          lat: 8.2742,
          lng: 98.5012
        },
        description: "Dramatic bay featuring limestone cliffs and clear waters, perfect for kayaking and boat tours."
      },
      {
        name: "Old Phuket Town",
        coordinates: {
          lat: 7.8858,
          lng: 98.3875
        },
        description: "Historic district featuring Sino-Portuguese architecture and local culture."
      },
      {
        name: "Big Buddha",
        coordinates: {
          lat: 7.8276,
          lng: 98.3116
        },
        description: "Large Buddha statue offering panoramic views of the island."
      }
    ]
  },
  {
    id: "kbi-001",
    name: "Krabi",
    coordinates: {
      lat: 8.0863,
      lng: 98.9063
    },
    type: "coastal",
    description: "Coastal province known for its stunning limestone cliffs, beaches, and islands.",
    photos: [
      {
        url: "https://example.com/krabi/railay.jpg",
        caption: "Stunning Railay Beach"
      },
      {
        url: "https://example.com/krabi/phi-phi.jpg",
        caption: "Crystal clear waters of Phi Phi Islands"
      }
    ],
    videos: [
      {
        url: "https://example.com/krabi/island-hopping.mp4",
        title: "Island Hopping Adventure in Krabi"
      }
    ],
    reviews: [
      {
        rating: 5,
        comment: "Paradise on Earth! The beaches and limestone cliffs are incredible.",
        author: "David W."
      },
      {
        rating: 5,
        comment: "Perfect for rock climbing and beach activities.",
        author: "Anna K."
      }
    ],
    highlights: [
      "Rock climbing at Railay",
      "Island hopping tours",
      "Kayaking adventures",
      "Beach relaxation"
    ],
    features: [
      "Rock climbing",
      "Island hopping",
      "Beaches",
      "Kayaking",
      "Snorkeling"
    ],
    pointsOfInterest: [
      {
        name: "Railay Beach",
        coordinates: {
          lat: 8.0119,
          lng: 98.8374
        },
        description: "Beautiful beach accessible only by boat, famous for rock climbing and scenic views."
      },
      {
        name: "Tiger Cave Temple",
        coordinates: {
          lat: 8.1267,
          lng: 98.9242
        },
        description: "Buddhist temple complex featuring a challenging climb to a mountaintop shrine."
      },
      {
        name: "Phi Phi Islands",
        coordinates: {
          lat: 7.7407,
          lng: 98.7784
        },
        description: "Group of islands known for their beautiful beaches and marine life."
      }
    ]
  }
];

export default locations;
