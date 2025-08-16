import express, { type Express } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import errorMiddleware from "src/middlewares/error.middleware";
import publicRoute from "src/routes/public.route";
import { ResponseError } from "src/utils/error-response";
import userRoute from "src/routes/user.route";
import adminRoute from "src/routes/admin.route";

const web: Express = express();
web.use(express.json());
web.use(cookieParser());
web.use(cors({ credentials: true, origin: true }));
web.use(publicRoute);
web.use(userRoute);
web.use(adminRoute);
web.use((req, res, next) => {
  const error = new ResponseError({
    status: 500,
    message: "routing not found",
  });
  next(error);
});
web.use(errorMiddleware);

export { web };
