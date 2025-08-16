import express from "express";
import { UserController } from "src/controllers/user.controller";
import adminMiddleware from "src/middlewares/admin.middleware";

const adminRoute = express.Router();

adminRoute.use(adminMiddleware);
adminRoute.delete("/users/:id", UserController.DELETE);

export default adminRoute;
