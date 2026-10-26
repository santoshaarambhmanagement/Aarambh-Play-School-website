// export const CATEGORIES = [
//   {
//     id: "all",
//     label: "All",
//     color: "#F7D117",
//     shade: "#B8960B",
//     textOnColor: "ink",
//   },
//   {
//     id: "classrooms",
//     label: "Classrooms",
//     color: "#1F4FB5",
//     shade: "#143478",
//     textOnColor: "white",
//   },
//   {
//     id: "playground",
//     label: "Playground",
//     color: "#2E8B3A",
//     shade: "#1D5C25",
//     textOnColor: "white",
//   },
//   {
//     id: "events",
//     label: "Events",
//     color: "#B01E2E",
//     shade: "#771420",
//     textOnColor: "white",
//   },
//   {
//     id: "crafts",
//     label: "Crafts",
//     color: "#F28C28",
//     shade: "#A65C12",
//     textOnColor: "ink",
//   },
// ];

// export const MOCK_GALLERY = Array.from({ length: 24 }).map((_, i) => {
//   const cats = ["classrooms", "playground", "events", "crafts"];
//   const width = 800;
//   // Mix up aspects: 1:1, 4:5, 4:3, 3:4
//   const heights = [800, 1000, 600, 1066];
//   return {
//     id: `p${String(i + 1).padStart(2, "0")}`,
//     url: `/gallery/g${String((i % 12) + 1).padStart(2, "0")}.jpeg`,
//     alt: `Gallery photo ${i + 1}`,
//     caption: `Draft caption ${i + 1}`, // TODO: Replace with real content
//     category: cats[i % cats.length],
//     width,
//     height: heights[i % heights.length],
//   };
// });

// // export const getImageUrl = (item, width) => item.url;
// // SANITY VERSION:
// export const getImageUrl = (item, width) => `${item.url}?w=${width}&auto=format`;

// export const tiltFor = (id) => {
//   const tilts = [-2.5, 1.5, -1, 2.5, -2, 1, -1.5, 2];
//   let hash = 0;
//   for (let i = 0; i < id.length; i++)
//     hash = id.charCodeAt(i) + ((hash << 5) - hash);
//   return tilts[Math.abs(hash) % tilts.length];
// };

export const CATEGORIES = [
  {
    id: "all",
    label: "All",
    color: "#F7D117",
    shade: "#B8960B",
    textOnColor: "ink",
  },
  {
    id: "classrooms",
    label: "Classrooms",
    color: "#1F4FB5",
    shade: "#143478",
    textOnColor: "white",
  },
  {
    id: "playground",
    label: "Playground",
    color: "#2E8B3A",
    shade: "#1D5C25",
    textOnColor: "white",
  },
  {
    id: "events",
    label: "Events",
    color: "#B01E2E",
    shade: "#771420",
    textOnColor: "white",
  },
  {
    id: "crafts",
    label: "Crafts",
    color: "#F28C28",
    shade: "#A65C12",
    textOnColor: "ink",
  },
];

export const MOCK_GALLERY = Array.from({ length: 24 }).map((_, i) => {
  const cats = ["classrooms", "playground", "events", "crafts"];
  const width = 800;
  // Mix up aspects: 1:1, 4:5, 4:3, 3:4
  const heights = [800, 1000, 600, 1066];
  return {
    id: `p${String(i + 1).padStart(2, "0")}`,
    url: `/gallery/g${String((i % 12) + 1).padStart(2, "0")}.jpeg`,
    alt: `Gallery photo ${i + 1}`,
    caption: `Draft caption ${i + 1}`, // TODO: Replace with real content
    category: cats[i % cats.length],
    width,
    height: heights[i % heights.length],
  };
});

// Smart Helper: Handles both Local Mock URLs and Sanity URLs safely
export const getImageUrl = (item, width) => {
  if (!item || !item.url) return "";
  if (item.url.startsWith("/")) return item.url; // Local fallback
  if (item.url.includes("sanity.io"))
    return `${item.url}?w=${width}&auto=format`; // Live Sanity optimized
  return item.url;
};

export const tiltFor = (id) => {
  const tilts = [-2.5, 1.5, -1, 2.5, -2, 1, -1.5, 2];
  let hash = 0;
  for (let i = 0; i < id.length; i++)
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  return tilts[Math.abs(hash) % tilts.length];
};
