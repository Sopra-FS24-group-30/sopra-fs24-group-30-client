import io, { Socket } from 'socket.io-client';

// Define the type for the socket variable, which can be a Socket or null.
let socket: Socket | null = null;

/**
 * Function to get or create the WebSocket connection.
 * @returns {Socket} The Socket instance to be used for WebSocket communication.
 */
const getWebSocket = (): Socket => {
    if (!socket) {
        // Establish the WebSocket connection only if it has not been created yet.
        socket = io('wss://localhost:3000'); // Specify your WebSocket server URL.
    }
    return socket;
};

export default getWebSocket;
