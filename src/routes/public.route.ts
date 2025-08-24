import express from "express";
import { CategoryControllers } from "src/controllers/category.controller";
import { DestinationControllers } from "src/controllers/destination.controller";
import { UserAuthController, UserController } from "src/controllers/user.controller";

const publicRoute = express.Router();

publicRoute.post("/register", UserAuthController.REGISTER);
publicRoute.post("/login", UserAuthController.LOGIN);
publicRoute.get("/token", UserAuthController.REFRESH_TOKEN);

publicRoute.get("/users", UserController.GETs);
publicRoute.get("/users/:name", UserController.GET);

publicRoute.get("/destinations/:slug", DestinationControllers.GET);
publicRoute.get("/destinations", DestinationControllers.GETs);

publicRoute.get("/categories", CategoryControllers.GETs);

export default publicRoute;
