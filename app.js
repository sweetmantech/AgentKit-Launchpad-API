import express from "express";
import cors from "cors";
import routes from "./routes.js";
import bodyParser from "body-parser";

const app = express();
const port = 3001;

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: false, limit: "10mb" }));
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use("/api", routes);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
