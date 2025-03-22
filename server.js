const app = require("./src/app");
const http = require("http");
const server = http.createServer(app);
const PORT = process.env.PORT || 3000;
const socketIo = require("socket.io");

const io = socketIo(server, {
  cors: {
    origin: ["http://localhost:5173", "http://localhost:8081"],
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

const reservationSocket = require("./utility/reservationSocket");
reservationSocket(io);

app.locals.io = io;

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
