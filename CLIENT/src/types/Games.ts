import { ReactNode } from "react";

export interface Game {
  title: string;
  description: string;
  icon: ReactNode;
  available: boolean;
}

export interface GameCardProps {
  game: Game;
}
