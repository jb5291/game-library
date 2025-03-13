export interface Game {
  _id?: string;
  title: string;
  description: string;
  platform: string;
  genre: string;
  releaseYear: number;
  developer: string;
  publisher: string;
  rating: number;
  imageUrl?: string;
  completed: boolean;
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

  export const PLATFORMS = [
    'PC',
    'PlayStation 5',
    'PlayStation 4',
    'PlayStation 3',
    'Xbox Series X/S',
    'Xbox One',
    'Xbox 360',
    'Nintendo Switch',
    'Nintendo Wii U',
    'Nintendo Wii',
    'Nintendo 3DS',
    'Mobile',
    'Other'
  ];
  
  export const GENRES = [
    'Action',
    'Adventure',
    'RPG',
    'Strategy',
    'Simulation',
    'Sports',
    'Racing',
    'Puzzle',
    'Fighting',
    'Shooter',
    'Platformer',
    'Survival Horror',
    'Stealth',
    'MMORPG',
    'Visual Novel',
    'Other'
  ];