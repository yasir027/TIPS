import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

const socket = io('http://192.168.1.16:3000'); // Replace with your backend IP

const ScreenView = () => {
    const [frame, setFrame] = useState('');
    const [error, setError] = useState(null);

    useEffect(() => {
        // Emit the 'viewer' event to the backend to establish the viewer connection
        socket.emit('viewer');
    
        socket.on('screen-data', (data) => {
            if (data) {
                console.log('Received frame data size:', data.length);
                setFrame(data);
            } else {
                console.error('Received empty frame data');
                setError('Failed to receive valid frame data');
            }
        });
    
        socket.on('connect_error', (err) => {
            console.error('Socket connection error:', err);
            setError('Unable to connect to the server');
        });
    
        socket.on('disconnect', () => {
            console.log('Disconnected from server');
            setError('Disconnected from server');
        });
    
        // Cleanup socket event listeners
        return () => {
            socket.off('screen-data');
            socket.off('connect_error');
            socket.off('disconnect');
        };
    }, []); 
    

    return (
        <div>
            <h1>Viewing Screen...</h1>
            {error ? (
                <p style={{ color: 'red' }}>{error}</p>
            ) : (
                frame ? (
                    <img src={frame} alt="Shared Screen" style={{ width: '100%', height: 'auto' }} />
                ) : (
                    <p>Waiting for screen data...</p>
                )
            )}
        </div>
    );
};

export default ScreenView;
