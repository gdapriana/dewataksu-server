import express from "express";
import {
  UserAuthController,
  UserController,
} from "src/controllers/user.controller";

const publicRoute = express.Router();

publicRoute.post("/register", UserAuthController.REGISTER);
publicRoute.post("/login", UserAuthController.LOGIN);

publicRoute.get("/users", UserController.GETs);
publicRoute.get("/users/:name", UserController.GET);

export default publicRoute;
