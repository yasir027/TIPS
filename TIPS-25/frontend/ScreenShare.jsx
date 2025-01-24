import React, { useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('http://192.168.31.10:3000'); // Connect to local server

const ScreenShare = () => {
    useEffect(() => {
        const startScreenShare = async () => {
            try {
                // Get screen media
                const stream = await navigator.mediaDevices.getDisplayMedia({
                    video: true,
                    audio: false,
                });

                const videoElement = document.createElement('video');
                videoElement.srcObject = stream;
                videoElement.play();

                // Create a canvas to draw video frames
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');

                // Dynamically capture frames
                const captureFrame = () => {
                    if (videoElement.videoWidth > 0 && videoElement.videoHeight > 0) {
                        // Adjust canvas size based on video size
                        canvas.width = videoElement.videoWidth;
                        canvas.height = videoElement.videoHeight;
                    }

                    // Draw the video frame on the canvas
                    ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

                    // Compress and send the frame as WebP image (lower latency)
                    const frameData = canvas.toDataURL('image/webp', 0.5); // WebP for better compression

                    // Send the frame data to the server using socket
                    socket.emit('screen-data', frameData);

                    // Request next animation frame
                    requestAnimationFrame(captureFrame);
                };

                captureFrame(); // Start capturing frames
            } catch (err) {
                console.error('Error capturing screen:', err);
            }
        };

        startScreenShare(); // Initiate screen sharing
    }, []);

    return <h1>Screen Sharing...</h1>;
};

export default ScreenShare;
