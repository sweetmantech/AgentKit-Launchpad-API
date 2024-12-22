import express from "express";
import cors from "cors";
import routes from "./routes.js";
import bodyParser from "body-parser";
import getTikTokAnalysis from "./agents/getTikTokAnalysis.js";
import { Server } from "socket.io";

const app = express();
const port = 3000;

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: false, limit: "10mb" }));
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use("/api", routes);

const server = app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

const socketIo = new Server(server, {
  cors: {
    origin: "*",
  },
});

global.io = socketIo;

socketIo.on("connection", async (socket) => {
  console.log("New client connected: " + socket.id);
  socket.emit("getId", socket.id);

  socket.on("Tiktok Analysis", async (_, msg) => {
    console.log("ZIAD RUN Tiktok Analysis", msg);
    if (!msg?.handle || !msg?.chat_id) getTikTokAnalysis(handle, chat_id);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});
