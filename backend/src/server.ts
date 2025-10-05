import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { RoomManager } from "./game/RoomManager";
import { GameManager } from "./game/GameManager";

const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"]
    }
});

const port = 3000;
const roomManager = new RoomManager();
const gameManager = new GameManager();

const activeConnections = new Set<string>();

app.get("/ping", (_req, res) => {
    res.send("pong");
});

app.get("/rooms", (_req, res) => {
    const rooms = Array.from(roomManager['rooms'].values());
    res.json({
        rooms,
        activeConnections: Array.from(activeConnections),
        totalConnections: activeConnections.size
    });
});

io.on("connection", (socket) => {
    console.log("User connected:", socket.id);
    activeConnections.add(socket.id);
    console.log(`Active connections: ${activeConnections.size}`);

    socket.on("createRoom", () => {
        try {
            const roomCode = roomManager.createRoom(socket.id);
            socket.join(roomCode);

            const room = roomManager.getRoom(roomCode);
            if (room) {
                const gameState = gameManager.getGameState(room);

                socket.emit("roomCreated", roomCode);
                socket.emit("gameStateUpdate", gameState);

                console.log(`Room ${roomCode} created successfully. Players: ${room.players.length}`);
            }
        } catch (error) {
            console.error("Error creating room:", error);
            socket.emit("error", "Ошибка при создании комнаты");
        }
    });

    socket.on("joinRoom", (roomCode: string) => {
        try {
            const room = roomManager.joinRoom(roomCode, socket.id);

            if (!room) {
                socket.emit("error", "Комната не найдена или заполнена");
                return;
            }

            socket.join(roomCode);
            const gameState = gameManager.getGameState(room);

            socket.emit("roomJoined", roomCode);
            socket.emit("gameStateUpdate", gameState);

            socket.to(roomCode).emit("playerJoined", socket.id);
            socket.to(roomCode).emit("gameStateUpdate", gameState);

            console.log(`User ${socket.id} successfully joined room ${roomCode}. Total players: ${room.players.length}`);
        } catch (error) {
            console.error("Error joining room:", error);
            socket.emit("error", "Ошибка при присоединении к комнате");
        }
    });

    socket.on("getGameState", () => {
        const room = roomManager.getRoomByPlayer(socket.id);
        if (room) {
            const gameState = gameManager.getGameState(room);
            socket.emit("gameStateUpdate", gameState);
        }
    });

    socket.on("disconnect", (reason) => {
        console.log(`User disconnected: ${socket.id}. Reason: ${reason}`);
        activeConnections.delete(socket.id);

        const deletedRooms = roomManager.removePlayerFromAllRooms(socket.id);

        if (deletedRooms.length > 0) {
            console.log(`Deleted rooms due to disconnect: ${deletedRooms.join(', ')}`);
        }

        console.log(`Active connections: ${activeConnections.size}`);
    });

    socket.on("leaveRoom", () => {
        roomManager.removePlayerFromAllRooms(socket.id);
        socket.emit("roomLeft");
    });
});

server.listen(port, () => {
    console.log(`Machi Koro server running on http://localhost:${port}`);
    console.log(`Debug: http://localhost:${port}/rooms`);
});