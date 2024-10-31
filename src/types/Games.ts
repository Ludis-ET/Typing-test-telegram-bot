export interface Game {
  title: string;
  description: string;
  icon: React.ReactNode;
  available: boolean;
}

export interface GameCardProps {
  game: Game;
}
