require("dotenv").config(); // Load env variables first

const app = require("./src/app");
const http = require("http");
const server = http.createServer(app);
const socketIo = require("socket.io");

const PORT = process.env.PORT || 3000;
const BASE_SERVER_URL =
  process.env.BASE_SERVER_URL || `http://localhost:${PORT}`;
const CLIENT_ORIGIN =
  process.env.CLIENT_WEB_1 ||
  process.env.CLIENT_WEB_2 ||
  process.env.CLIENT_WEB_3 ||
  process.env.CLIENT_MOBILE_1 ||
  process.env.CLIENT_MOBILE_2 ||
  "*";

const io = socketIo(server, {
  cors: {
    origin: ["*"],
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

const reservationSocket = require("./utility/reservationSocket");
reservationSocket(io);

app.locals.io = io;

server.listen(PORT, () => {
  console.log(`Server running on ${BASE_SERVER_URL}`);
});
