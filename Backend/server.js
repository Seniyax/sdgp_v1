const app = require("./src/app");
const http = require("http");
const server = http.createServer(app);
const PORT = process.env.PORT || 3000;
const socketIo = require("socket.io");

// Attach Socket.IO and allow CORS (adjust origins as needed)
const io = socketIo(server, {
  cors: {
    origin: ["http://localhost:5173", "http://localhost:8081"],
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

// Make the socket instance available to your routes/controllers
app.locals.io = io;

io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);
  socket.on("disconnect", () => {
    console.log("Socket disconnected:", socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
