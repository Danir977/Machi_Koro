import { useState, useEffect } from 'react';
import io, { Socket } from 'socket.io-client';

function App() {
    const [, setSocket] = useState<Socket | null>(null);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        const newSocket = io('http://localhost:3000');
        setSocket(newSocket);

        newSocket.on('connect', () => {
            setIsConnected(true);
            console.log('Connected to server');
        });

        newSocket.on('disconnect', () => {
            setIsConnected(false);
        });

        return () => {
            newSocket.close();
        };
    }, []);

    return (
        <div>
            <h1>Machi Koro Online</h1>
            <p>Status: {isConnected ? 'Connected to server' : 'Disconnected'}</p>
        </div>
    );
}

export default App;