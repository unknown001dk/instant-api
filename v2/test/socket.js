import { io } from "socket.io-client";
const socket = io("http://localhost:8001");

// Join user-specific project room
socket.emit("joinRoom", "92de45f9516ab68fc0ac545015c2d50d:4f0c18a87f801cb7308dfb638f135769fa4776c27c176a34_hashstartacademy1");

// Listen for document created event
socket.on("document:created", (data) => {
  console.log("New Document:", data);
});
