import express from "express";
import { CategoryControllers } from "src/controllers/category.controller";
import { DestinationControllers } from "src/controllers/destination.controller";
import { UserController } from "src/controllers/user.controller";
import adminMiddleware from "src/middlewares/admin.middleware";

const adminRoute = express.Router();

adminRoute.use(adminMiddleware);
adminRoute.delete("/users/:id", UserController.DELETE);
adminRoute.post("/destinations", DestinationControllers.POST);
adminRoute.patch("/destinations/:id", DestinationControllers.PATCH);
adminRoute.delete("/destinations/:id", DestinationControllers.DELETE);

adminRoute.post("/categories", CategoryControllers.POST);
adminRoute.patch("/categories/:id", CategoryControllers.PATCH);
adminRoute.delete("/categories/:id", CategoryControllers.DELETE);

export default adminRoute;
