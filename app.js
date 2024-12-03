import express from "express";
import cors from "cors";
import routes from "./routes.js";
import bodyParser from "body-parser";

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use("/api", routes);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
