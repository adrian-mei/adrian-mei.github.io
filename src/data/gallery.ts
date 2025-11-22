export interface GalleryItem {
  id: string;
  src: string;
  alt: string;
  caption?: string;
  category: 'Travel' | 'Portraits' | 'Documentary' | 'Hobbies' | 'AI & Digital';
  type: 'image' | 'video';
  width?: number;
  height?: number;
}

export const galleryItems: GalleryItem[] = [
  // Travel
  { id: 't1', src: '/images/travel/bangkok.webp', alt: 'Bangkok Cityscape', category: 'Travel', type: 'image' },
  { id: 't2', src: '/images/travel/kapadokya.webp', alt: 'Cappadocia Landscapes', category: 'Travel', type: 'image' },
  { id: 't3', src: '/images/travel/kyoto.webp', alt: 'Kyoto Streets', category: 'Travel', type: 'image' },
  { id: 't4', src: '/images/travel/osaka.webp', alt: 'Osaka Vibes', category: 'Travel', type: 'image' },
  { id: 't5', src: '/images/travel/sf.webp', alt: 'San Francisco Views', category: 'Travel', type: 'image' },
  { id: 't6', src: '/images/travel/taiwan.webp', alt: 'Taiwan Scenery', category: 'Travel', type: 'image' },

  // Portraits
  { id: 'p1', src: '/images/portraits/portrait1.webp', alt: 'Portrait Session', category: 'Portraits', type: 'image' },
  { id: 'p2', src: '/images/portraits/portrait2.webp', alt: 'Portrait Session', category: 'Portraits', type: 'image' },
  { id: 'p3', src: '/images/portraits/portrait3.webp', alt: 'Portrait Session', category: 'Portraits', type: 'image' },
  { id: 'p4', src: '/images/portraits/portrait4.webp', alt: 'Portrait Session', category: 'Portraits', type: 'image' },
  { id: 'p5', src: '/images/portraits/portrait5.webp', alt: 'Portrait Session', category: 'Portraits', type: 'image' },
  { id: 'p6', src: '/images/portraits/portrait6.webp', alt: 'Portrait Session', category: 'Portraits', type: 'image' },

  // Documentary
  { id: 'd1', src: '/images/documentary/IMG_0062.webp', alt: 'Documentary Shot', category: 'Documentary', type: 'image' },
  { id: 'd2', src: '/images/documentary/IMG_0090.webp', alt: 'Documentary Shot', category: 'Documentary', type: 'image' },
  { id: 'd3', src: '/images/documentary/IMG_0348.webp', alt: 'Documentary Shot', category: 'Documentary', type: 'image' },
  { id: 'd4', src: '/images/documentary/IMG_0352.webp', alt: 'Documentary Shot', category: 'Documentary', type: 'image' },
  { id: 'd5', src: '/images/documentary/IMG_0380.webp', alt: 'Documentary Shot', category: 'Documentary', type: 'image' },
  { id: 'd6', src: '/images/documentary/IMG_2600.webp', alt: 'Documentary Shot', category: 'Documentary', type: 'image' },
  { id: 'd7', src: '/images/documentary/IMG_5058.webp', alt: 'Documentary Shot', category: 'Documentary', type: 'image' },
  { id: 'd8', src: '/images/documentary/IMG_5114_Original.webp', alt: 'Documentary Shot', category: 'Documentary', type: 'image' },
  { id: 'd9', src: '/images/documentary/IMG_5119_Original.webp', alt: 'Documentary Shot', category: 'Documentary', type: 'image' },
  { id: 'd10', src: '/images/documentary/IMG_5453.webp', alt: 'Documentary Shot', category: 'Documentary', type: 'image' },
  { id: 'd11', src: '/images/documentary/IMG_8393.webp', alt: 'Documentary Shot', category: 'Documentary', type: 'image' },
  { id: 'd12', src: '/images/documentary/IMG_8513.webp', alt: 'Documentary Shot', category: 'Documentary', type: 'image' },
  { id: 'd13', src: '/images/documentary/IMG_8534.webp', alt: 'Documentary Shot', category: 'Documentary', type: 'image' },
  { id: 'd14', src: '/images/documentary/IMG_8554.webp', alt: 'Documentary Shot', category: 'Documentary', type: 'image' },
  { id: 'd15', src: '/images/documentary/IMG_9338.webp', alt: 'Documentary Shot', category: 'Documentary', type: 'image' },

  // Hobbies
  { id: 'h1', src: '/images/hobbies/motorcycle1.webp', alt: 'Motorcycle Ride', category: 'Hobbies', type: 'image' },
  { id: 'h2', src: '/images/hobbies/motorcycle2.webp', alt: 'Motorcycle Ride', category: 'Hobbies', type: 'image' },

  // AI & Digital
  { id: 'ai1', src: '/images/ai_generated/ai_bruce_lee1.webp', alt: 'AI Art - Bruce Lee Concept', category: 'AI & Digital', type: 'image' },
  { id: 'ai2', src: '/images/ai_generated/ai_bruce_lee2.webp', alt: 'AI Art - Bruce Lee Concept', category: 'AI & Digital', type: 'image' },
  { id: 'ai3', src: '/images/ai_generated/ai_bruce_lee3.webp', alt: 'AI Art - Bruce Lee Concept', category: 'AI & Digital', type: 'image' },
];
