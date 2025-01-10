import { Router } from "express";
import * as AgentKitController from "./controllers/AgentKitController.js";

const routes = new Router();

routes.get("/agentkit/run", AgentKitController.run);

export default routes;
