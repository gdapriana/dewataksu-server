import { NextFunction, Request, Response } from "express";
import { UserAuthServices, UserServices } from "src/services/user.service";
import { ACTIONS, DB_SCHEMA } from "src/utils/error-response";
import { UserRequest } from "src/utils/types";

export class UserAuthController {
  static readonly service = UserAuthServices;
  static readonly schema: DB_SCHEMA = "user";

  static readonly response = (action: ACTIONS, message?: string) => {
    return {
      success: true,
      message: message || `${action} ${this.schema} successfully`,
    };
  };

  static REGISTER = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body = req.body;
      const result = await this.service.REGISTER(body);
      res.status(200).json({
        ...this.response("create", "User created successfully"),
        result,
      });
    } catch (e) {
      console.error(e);
      next(e);
    }
  };

  static LOGIN = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body = req.body;
      const result: { accessToken: string; refreshToken: string } = await this.service.LOGIN(body);
      res.cookie("refreshToken", result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
      });

      res.status(200).json({
        ...this.response("get", "User login successfully"),
        result: { accessToken: result.accessToken },
      });
    } catch (e) {
      console.error(e);
      next(e);
    }
  };

  static REFRESH_TOKEN = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const refreshToken = req.cookies.refreshToken;
      const newAccessToken = await this.service.REFRESH_TOKEN(refreshToken);
      res.status(200).json({
        ...this.response("update", "New token generated successfully"),
        result: {
          accessToken: newAccessToken,
        },
      });
    } catch (e) {
      console.error(e);
      next(e);
    }
  };

  static ME = async (req: UserRequest, res: Response, next: NextFunction) => {
    try {
      const id = req.user?.id;
      const result = await this.service.ME(id);
      res.status(200).json({
        success: true,
        result,
      });
    } catch (e) {
      console.error(e);
      next(e);
    }
  };
}

export class UserController {
  static readonly service = UserServices;
  static readonly schema: DB_SCHEMA = "user";

  static readonly response = (action: ACTIONS) => {
    return {
      success: true,
      message: `${action} ${this.schema} successfully`,
    };
  };

  static GET = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name } = req.params;
      const result = await this.service.GET(name);
      res.status(200).json({
        ...this.response("get"),
        result,
      });
    } catch (e) {
      console.error(e);
      next(e);
    }
  };

  static GETs = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const query = req.query as any;
      const result = await this.service.GETs(query);
      res.status(200).json({
        ...this.response("gets"),
        result,
      });
    } catch (e) {
      console.error(e);
      next(e);
    }
  };

  static PATCH = async (req: UserRequest, res: Response, next: NextFunction) => {
    try {
      let id: string;
      if (req.user?.role === "ADMIN") {
        id = req.params.id;
      } else {
        id = req.user?.id!;
      }
      const body = req.body;
      const result = await this.service.PATCH(req.user!, id, body);
      res.status(200).json({
        ...this.response("update"),
        result,
      });
    } catch (e) {
      console.error(e);
      next(e);
    }
  };

  static DELETE = async (req: UserRequest, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const result = await this.service.DELETE(req.user!, id);
      res.status(200).json({
        ...this.response("delete"),
        result,
      });
    } catch (e) {
      console.error(e);
      next(e);
    }
  };
}
