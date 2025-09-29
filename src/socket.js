// socket.js
import { io } from "socket.io-client";

const socket = io("https://hrms-backend-9qzj.onrender.com", {
  autoConnect: true,
  transports: ["websocket"], // force websocket for better performance
});

export default socket;
