import { Room, GameState } from '../types/game.types';

export class GameManager {
    getGameState(room: Room): GameState {
        return {
            players: room.players,
            currentPlayer: room.players[0]?.id || null,
            gameStatus: room.gameState === 'waiting' ? 'waiting' : 'active'
        };
    }

    // Написать логику игры
}