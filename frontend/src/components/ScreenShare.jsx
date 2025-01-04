import React, { useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('http://192.168.127.117:3000'); // Replace with your backend URL

const ScreenShare = () => {
    useEffect(() => {
        const startScreenShare = async () => {
            try {
                const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
                const videoElement = document.createElement('video');
                videoElement.srcObject = stream;
                videoElement.play();

                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');

                const sendFrame = () => {
                    if (stream.active) {
                        canvas.width = videoElement.videoWidth;
                        canvas.height = videoElement.videoHeight;
                        ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
                        const frame = canvas.toDataURL('image/webp', 0.8);
                        socket.emit('screen-data', frame);
                        requestAnimationFrame(sendFrame);
                    }
                };
                sendFrame();
            } catch (err) {
                console.error('Error sharing screen:', err);
            }
        };
        startScreenShare();
    }, []);

    return <h1>Sharing Screen...</h1>;
};

export default ScreenShare;
