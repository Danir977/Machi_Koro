import { Room, Player } from '../types/game.types';

export class RoomManager {
    private rooms: Map<string, Room> = new Map();

    createRoom(hostSocketId: string): string {
        const roomCode = this.generateRoomCode();

        const room: Room = {
            code: roomCode,
            players: [{
                id: hostSocketId,
                coins: 3,
                cards: []
            }],
            host: hostSocketId,
            gameState: 'waiting',
            createdAt: new Date()
        };

        this.rooms.set(roomCode, room);
        console.log(`Room created: ${roomCode} by ${hostSocketId}`);
        return roomCode;
    }

    joinRoom(roomCode: string, playerSocketId: string): Room | null {
        const room = this.rooms.get(roomCode);

        if (!room) {
            return null;
        }

        if (room.players.length >= 4) {
            return null;
        }

        const existingPlayer = room.players.find(p => p.id === playerSocketId);
        if (existingPlayer) {
            return room;
        }

        room.players.push({
            id: playerSocketId,
            coins: 3,
            cards: []
        });

        console.log(`Player ${playerSocketId} joined room ${roomCode}`);
        return room;
    }

    getRoom(roomCode: string): Room | undefined {
        return this.rooms.get(roomCode);
    }

    removePlayerFromAllRooms(playerSocketId: string): string[] {
        const deletedRooms: string[] = [];

        this.rooms.forEach((room, roomCode) => {
            const initialPlayerCount = room.players.length;

            room.players = room.players.filter(player => player.id !== playerSocketId);

            if (room.players.length === 0) {
                this.rooms.delete(roomCode);
                deletedRooms.push(roomCode);
                console.log(`Room ${roomCode} deleted (empty)`);
            }

            else if (room.host === playerSocketId) {
                room.host = room.players[0].id;
                console.log(`New host appointed for room ${roomCode}: ${room.host}`);
            }

            if (initialPlayerCount !== room.players.length) {
                console.log(`Player ${playerSocketId} removed from room ${roomCode}`);
            }
        });

        return deletedRooms;
    }

    getRoomByPlayer(playerSocketId: string): Room | undefined {
        for (const room of this.rooms.values()) {
            if (room.players.some(player => player.id === playerSocketId)) {
                return room;
            }
        }
        return undefined;
    }

    private generateRoomCode(): string {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let result = '';

        for (let i = 0; i < 6; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }

        if (this.rooms.has(result)) {
            return this.generateRoomCode();
        }

        return result;
    }
}