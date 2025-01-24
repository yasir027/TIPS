import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

const socket = io('http://192.168.31.10:3000'); // Local network IP

const ScreenView = () => {
    const [frame, setFrame] = useState(null);

    useEffect(() => {
        socket.emit('viewer'); // Notify the server that a viewer is connected

        socket.on('screen-data', (data) => {
            setFrame(data); // Update the frame with the received data
        });

        return () => {
            socket.off('screen-data');
        };
    }, []);

    return (
        <div>
            <h1>Screen Viewer</h1>
            {frame ? (
                <img src={frame} alt="Live Screen Share" style={{ width: '100%', height: 'auto' }} />
            ) : (
                <p>Waiting for the screen share...</p>
            )}
        </div>
    );
};

export default ScreenView;
