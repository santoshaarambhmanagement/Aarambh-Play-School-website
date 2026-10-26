export const UNIFORMS = {
  "boys-regular": {
    key: "boys-regular", gender: "boys", season: "regular",
    src: "/uniforms/boys_regular.jpeg", width: 1659, height: 2212,
    alt: "Boys regular uniform laid flat: yellow half-sleeve shirt, red check bib shorts, belt, navy socks.",
    items: [
      { id: "br-1", name: "Yellow half-sleeve shirt", note: "Breathable cotton", x: 36, y: 15 },
      { id: "br-2", name: "School emblem on pocket", note: "", x: 58, y: 27 },
      { id: "br-3", name: "Red check bib shorts", note: "Adjustable straps", x: 45, y: 62 },
      { id: "br-4", name: "Belt with school buckle", note: "", x: 48, y: 37 },
      { id: "br-5", name: "Navy socks with yellow bands", note: "", x: 35, y: 90 }
    ]
  },
  "girls-regular": {
    key: "girls-regular", gender: "girls", season: "regular",
    src: "/uniforms/girls_regular.jpeg", width: 1659, height: 2212,
    alt: "Girls regular uniform laid flat: yellow half-sleeve shirt, red check pinafore, belt, navy socks.",
    items: [
      { id: "gr-1", name: "Yellow half-sleeve shirt", note: "Breathable cotton", x: 36, y: 15 },
      { id: "gr-2", name: "School emblem", note: "", x: 43, y: 24 },
      { id: "gr-3", name: "Red check pinafore dress", note: "", x: 45, y: 52 },
      { id: "gr-4", name: "Belt with school buckle", note: "", x: 41, y: 33 },
      { id: "gr-5", name: "Navy socks with yellow bands", note: "", x: 48, y: 87 }
    ]
  },
  "boys-winter": {
    key: "boys-winter", gender: "boys", season: "winter",
    src: "/uniforms/boys_winter.jpeg", width: 1131, height: 2576,
    alt: "Boys winter uniform: Navy cap, Navy V-neck sweater, Red check trousers, Navy socks.",
    items: [
      { id: "bw-1", name: "Navy woollen cap", note: "Stay warm!", x: 51, y: 10 },
      { id: "bw-2", name: "Navy V-neck sweater", note: "Yellow trim", x: 46, y: 30 },
      { id: "bw-3", name: "School emblem on sweater", note: "", x: 55, y: 28 },
      { id: "bw-4", name: "Red check trousers", note: "Full length", x: 48, y: 69 },
      { id: "bw-5", name: "Navy socks with yellow bands", note: "", x: 44, y: 91 }
    ]
  },
  "girls-winter": {
    key: "girls-winter", gender: "girls", season: "winter",
    src: "/uniforms/girls_winter.jpeg", width: 1377, height: 2576,
    alt: "Girls winter uniform: Navy cap, Navy V-neck sweater, Red check skirt, Navy tights.",
    items: [
      { id: "gw-1", name: "Navy woollen cap", note: "", x: 50, y: 10 },
      { id: "gw-2", name: "Navy V-neck sweater", note: "Yellow trim", x: 45, y: 31 },
      { id: "gw-3", name: "School emblem on sweater", note: "", x: 55, y: 27 },
      { id: "gw-4", name: "Red check skirt", note: "", x: 39, y: 51 },
      { id: "gw-5", name: "Navy tights", note: "Extra warmth", x: 43, y: 72 }
    ]
  }
};

export const UNIFORM_INFO = {
  whereToBuy: "Available at School Office",
  priceNote: "", 
  sizeNote: "Available in all sizes from Nursery to Class 1",
  whatsappNumber: "918709189974" // TODO: Change this to your real number
};