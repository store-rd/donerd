export interface Movie {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  category: string;
}

export interface Game {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  category: string;
}

export interface Activity {
  id: string;
  contentTitle: string;
  action: 'شاهد' | 'لعب';
  timestamp: string;
}

export enum View {
  Movies = 'MOVIES',
  Games = 'GAMES',
  Log = 'LOG'
}

export enum ContentType {
  Movie = 'فيلم',
  Game = 'لعبة'
}
