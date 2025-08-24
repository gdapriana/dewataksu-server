import express from "express";
import { BookmarkControllers } from "src/controllers/bookmark.controller";
import { CommentControllers } from "src/controllers/comment.controller";
import { LikeControllers } from "src/controllers/like.controller";
import { UserAuthController, UserController } from "src/controllers/user.controller";
import verifyMiddleware from "src/middlewares/verify.middleware";

const userRoute = express.Router();
userRoute.use(verifyMiddleware);
userRoute.get("/me", UserAuthController.ME);
userRoute.patch("/users/:id", UserController.PATCH);
userRoute.post("/like", LikeControllers.POST);
userRoute.delete("/like/:id", LikeControllers.DELETE);
userRoute.post("/bookmark", BookmarkControllers.POST);
userRoute.delete("/bookmark/:id", BookmarkControllers.DELETE);
userRoute.post("/comment", CommentControllers.POST);
userRoute.delete("/comment/:id", CommentControllers.DELETE);
export default userRoute;
