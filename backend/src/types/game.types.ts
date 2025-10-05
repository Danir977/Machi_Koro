export interface Player {
    id: string;
    name?: string;
    coins: number;
    cards: number[];
}

export interface Room {
    code: string;
    players: Player[];
    host: string;
    gameState: 'waiting' | 'playing' | 'finished';
    createdAt: Date;
}

export interface GameState {
    players: Player[];
    currentPlayer: string | null;
    gameStatus: 'waiting' | 'active' | 'finished';
}