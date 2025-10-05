import { useState, useEffect } from 'react';
import io, { Socket } from 'socket.io-client';
import { appStyle } from './styles/globals';
import {
    screenStyle,
    titleStyle,
    statusStyle,
    buttonContainerStyle,
    buttonStyle,
    buttonDisabledStyle,
    buttonBackStyle,
    inputStyle,
    gameStatusStyle
} from './styles/components/App.styles';

type Screen = 'main-menu' | 'create-game' | 'join-game' | 'game';

function App() {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [currentScreen, setCurrentScreen] = useState<Screen>('main-menu');
    const [roomCode, setRoomCode] = useState('');
    const [gameStatus, setGameStatus] = useState('');

    useEffect(() => {
        const newSocket = io('http://localhost:3000', {
            autoConnect: true,
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
        });
        setSocket(newSocket);

        newSocket.on('connect', () => {
            setIsConnected(true);
            console.log('Connected to server');
        });

        newSocket.on("connect_error", (error) => {
            console.log("Connection error:", error);
            setIsConnected(false);
        });

        newSocket.on('disconnect', () => {
            setIsConnected(false);
        });

        newSocket.on('roomCreated', (code: string) => {
            setGameStatus(`Комната создана! Код: ${code}`);
            setCurrentScreen('game');
        });

        newSocket.on('roomJoined', (code: string) => {
            setGameStatus(`Подключились к комнате: ${code}`);
            setCurrentScreen('game');
        });

        newSocket.on('error', (message: string) => {
            setGameStatus(`Ошибка: ${message}`);
        });

        return () => {
            newSocket.close();
        };
    }, []);

    const createGame = () => {
        socket?.emit('createRoom');
        setCurrentScreen('create-game');
    };

    const joinGame = () => {
        if (roomCode.trim()) {
            socket?.emit('joinRoom', roomCode.trim());
        }
    };

    const renderScreen = () => {
        switch (currentScreen) {
            case 'main-menu':
                return (
                    <div style={screenStyle}>
                        <h1 style={titleStyle}>🎮 Machi Koro Online</h1>
                        <p style={statusStyle}>
                            Status: {isConnected ? 'Connected' : 'Disconnected'}
                        </p>

                        <div style={buttonContainerStyle}>
                            <button
                                onClick={createGame}
                                style={buttonStyle}
                            >
                                Создать игру
                            </button>
                            <button
                                onClick={() => setCurrentScreen('join-game')}
                                style={buttonStyle}
                            >
                                Присоединиться к игре
                            </button>
                        </div>
                    </div>
                );

            case 'create-game':
                return (
                    <div style={screenStyle}>
                        <h2 style={titleStyle}>Создание игры...</h2>
                        <p>Пожалуйста, подождите</p>
                        <button
                            onClick={() => setCurrentScreen('main-menu')}
                            style={buttonBackStyle}
                        >
                            Назад
                        </button>
                    </div>
                );

            case 'join-game':
                return (
                    <div style={screenStyle}>
                        <h2 style={titleStyle}>Присоединиться к игре</h2>
                        <input
                            type="text"
                            placeholder="Введите код комнаты"
                            value={roomCode}
                            onChange={(e) => setRoomCode(e.target.value)}
                            style={inputStyle}
                        />
                        <button
                            onClick={joinGame}
                            style={!roomCode.trim() ? buttonDisabledStyle : buttonStyle}
                            disabled={!roomCode.trim()}
                        >
                            Подключиться
                        </button>
                        <button
                            onClick={() => setCurrentScreen('main-menu')}
                            style={buttonBackStyle}
                        >
                            Назад
                        </button>
                    </div>
                );

            case 'game':
                return (
                    <div style={screenStyle}>
                        <h2 style={titleStyle}>Игровая комната</h2>
                        <p style={gameStatusStyle}>{gameStatus}</p>
                        <p>Ожидаем начала игры...</p>
                        <button
                            onClick={() => {
                                setCurrentScreen('main-menu');
                                setGameStatus('');
                            }}
                            style={buttonBackStyle}
                        >
                            Выйти в меню
                        </button>
                    </div>
                );

            default:
                return (
                    <div style={screenStyle}>
                        <p>Неизвестный экран</p>
                        <button
                            onClick={() => setCurrentScreen('main-menu')}
                            style={buttonBackStyle}
                        >
                            В главное меню
                        </button>
                    </div>
                );
        }
    };

    return (
        <div style={appStyle}>
            {renderScreen()}
        </div>
    );
}

export default App;