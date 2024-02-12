import io, { Socket } from 'socket.io-client';

let socket: Socket;

export const initSocket = () => {
  socket = io('http://localhost:5000'); // Replace with your server URL
};

export const getSocket = () => {
  if (!socket) {
    throw new Error('Socket is not initialized');
  }
  return socket;
};
