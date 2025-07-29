// src/socket.ts
import { io } from 'socket.io-client';

const socket = io('http://localhost:4000'); // Asegurate de usar el puerto del servidor de sockets

export default socket;
