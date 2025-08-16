import { Response, Request, NextFunction } from "express";
import { ErrorResponseMessage, ResponseError } from "../utils/error-response";
import { ZodError } from "zod";
import { TokenExpiredError } from "jsonwebtoken";

const errorMiddleware = async (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (error instanceof ZodError) {
    const simplifiedErrors = error.errors.map((err) => ({
      form: err.path.join("."),
      message: err.message,
    }));
    const response = ErrorResponseMessage.ZOD_ERROR(simplifiedErrors);
    res
      .status(response.status)
      .json({ success: false, errors: response.message });
  } else if (error instanceof ResponseError) {
    res.status(error.data.status).json({
      success: false,
      errors: error.data.message,
    });
  } else if (error instanceof TokenExpiredError) {
    const { status, message } =
      ErrorResponseMessage.UNAUTHORIZED("token has expired");
    res.status(status).json({ success: false, errors: message });
  } else {
    console.error(error);
    const { status, message } = ErrorResponseMessage.INTERNAL_SERVER_ERROR();
    res.status(status).json({
      success: true,
      errors: message,
    });
  }
};

export default errorMiddleware;
