export interface GalleryItem {
  id: string;
  src: string;
  alt: string;
  caption?: string;
  category: 'Travel' | 'Portraits' | 'Documentary' | 'Hobbies' | 'AI & Digital' | 'Videos';
  type: 'image' | 'video';
  width?: number;
  height?: number;
}

export const galleryItems: GalleryItem[] = [
  // Travel
  { id: 't1', src: '/selfie/travel/bangkok.jpeg', alt: 'Bangkok Cityscape', category: 'Travel', type: 'image' },
  { id: 't2', src: '/selfie/travel/kapadokya.jpeg', alt: 'Cappadocia Landscapes', category: 'Travel', type: 'image' },
  { id: 't3', src: '/selfie/travel/kyoto.jpeg', alt: 'Kyoto Streets', category: 'Travel', type: 'image' },
  { id: 't4', src: '/selfie/travel/osaka.jpeg', alt: 'Osaka Vibes', category: 'Travel', type: 'image' },
  { id: 't5', src: '/selfie/travel/sf.jpeg', alt: 'San Francisco Views', category: 'Travel', type: 'image' },
  { id: 't6', src: '/selfie/travel/taiwan.JPG', alt: 'Taiwan Scenery', category: 'Travel', type: 'image' },

  // Portraits
  { id: 'p1', src: '/selfie/portraits/portrait1.jpg', alt: 'Portrait Session', category: 'Portraits', type: 'image' },
  { id: 'p2', src: '/selfie/portraits/portrait2.JPG', alt: 'Portrait Session', category: 'Portraits', type: 'image' },
  { id: 'p3', src: '/selfie/portraits/portrait3.JPG', alt: 'Portrait Session', category: 'Portraits', type: 'image' },
  { id: 'p4', src: '/selfie/portraits/portrait4.JPG', alt: 'Portrait Session', category: 'Portraits', type: 'image' },
  { id: 'p5', src: '/selfie/portraits/portrait5.JPG', alt: 'Portrait Session', category: 'Portraits', type: 'image' },
  { id: 'p6', src: '/selfie/portraits/portrait6.jpg', alt: 'Portrait Session', category: 'Portraits', type: 'image' },

  // Documentary
  { id: 'd1', src: '/selfie/documentary/IMG_0062.JPG', alt: 'Documentary Shot', category: 'Documentary', type: 'image' },
  { id: 'd2', src: '/selfie/documentary/IMG_0090.JPG', alt: 'Documentary Shot', category: 'Documentary', type: 'image' },
  { id: 'd3', src: '/selfie/documentary/IMG_0348.JPG', alt: 'Documentary Shot', category: 'Documentary', type: 'image' },
  { id: 'd4', src: '/selfie/documentary/IMG_0352.JPG', alt: 'Documentary Shot', category: 'Documentary', type: 'image' },
  { id: 'd5', src: '/selfie/documentary/IMG_0380.JPG', alt: 'Documentary Shot', category: 'Documentary', type: 'image' },
  { id: 'd6', src: '/selfie/documentary/IMG_8393.JPG', alt: 'Documentary Shot', category: 'Documentary', type: 'image' },
  { id: 'd7', src: '/selfie/documentary/IMG_8513.JPG', alt: 'Documentary Shot', category: 'Documentary', type: 'image' },
  { id: 'd8', src: '/selfie/documentary/IMG_8534.JPG', alt: 'Documentary Shot', category: 'Documentary', type: 'image' },
  { id: 'd9', src: '/selfie/documentary/IMG_8554.JPG', alt: 'Documentary Shot', category: 'Documentary', type: 'image' },
  { id: 'd10', src: '/selfie/documentary/IMG_9338.JPG', alt: 'Documentary Shot', category: 'Documentary', type: 'image' },

  // Hobbies
  { id: 'h1', src: '/selfie/hobbies/motorcycle1.jpeg', alt: 'Motorcycle Ride', category: 'Hobbies', type: 'image' },
  { id: 'h2', src: '/selfie/hobbies/motorcycle2.jpeg', alt: 'Motorcycle Ride', category: 'Hobbies', type: 'image' },

  // AI & Digital
  { id: 'ai1', src: '/selfie/ai_generated/ai_bruce_lee1.PNG', alt: 'AI Art - Bruce Lee Concept', category: 'AI & Digital', type: 'image' },
  { id: 'ai2', src: '/selfie/ai_generated/ai_bruce_lee2.PNG', alt: 'AI Art - Bruce Lee Concept', category: 'AI & Digital', type: 'image' },
  { id: 'ai3', src: '/selfie/ai_generated/ai_bruce_lee3.PNG', alt: 'AI Art - Bruce Lee Concept', category: 'AI & Digital', type: 'image' },

  // Videos
  { id: 'v1', src: '/selfie/videos/video1.mp4', alt: 'Video Clip 1', category: 'Videos', type: 'video' },
  { id: 'v2', src: '/selfie/videos/video2.mp4', alt: 'Video Clip 2', category: 'Videos', type: 'video' },
];
