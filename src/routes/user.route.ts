import express from "express";
import { UserController } from "src/controllers/user.controller";
import verifyMiddleware from "src/middlewares/verify.middleware";

const userRoute = express.Router();
userRoute.use(verifyMiddleware);

userRoute.patch("/users/:id", UserController.PATCH);

export default userRoute;
