import { Response, NextFunction } from "express";
import jwt, { TokenExpiredError } from "jsonwebtoken";
import { ErrorResponseMessage, ResponseError } from "../utils/error-response";
import { UserPayload, UserRequest } from "../utils/types";

const verifyMiddleware = async (req: UserRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    next(new ResponseError(ErrorResponseMessage.UNAUTHORIZED()));
  } else {
    try {
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!) as UserPayload;
      req.user = decoded;
      console.log({ decoded });
      next();
    } catch (err) {
      console.error(err);
      if (err instanceof TokenExpiredError) {
        const { status, message } = ErrorResponseMessage.UNAUTHORIZED("token has expired");
        return res.status(status).json({ success: false, errors: message });
      }
      next(new ResponseError(ErrorResponseMessage.FORBIDDEN()));
    }
  }
};

export default verifyMiddleware;
