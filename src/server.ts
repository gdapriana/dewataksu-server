import express, { type Express } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import swaggerUi from "swagger-ui-express";
import router from "src/routes/user.route";

const web: Express = express();
web.use(express.json());
web.use(cookieParser());
web.use(cors({ credentials: true, origin: true }));

web.use(router);
export { web };
