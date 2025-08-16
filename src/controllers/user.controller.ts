import { NextFunction, Request, Response } from "express";
import { UserAuthServices, UserServices } from "src/services/user.service";
import { UserRequest } from "src/utils/types";

export class UserAuthController {
  static async REGISTER(req: Request, res: Response, next: NextFunction) {
    try {
      const body = req.body;
      const result = await UserAuthServices.REGISTER(body);
      res.status(200).json({
        status: "success",
        result,
        message: "User created successfully",
      });
    } catch (e) {
      console.error(e);
      next(e);
    }
  }
  static async LOGIN(req: Request, res: Response, next: NextFunction) {
    try {
      const body = req.body;
      const result: { accessToken: string; refreshToken: string } = await UserAuthServices.LOGIN(body);

      res.cookie("refreshToken", result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
      });

      res.status(200).json({
        status: "success",
        result: { accessToken: result.accessToken },
        message: "User login successfully",
      });
    } catch (e) {
      console.error(e);
      next(e);
    }
  }
}

export class UserController {
  static async GET(req: Request, res: Response, next: NextFunction) {
    try {
      const { name } = req.params;
      const result = await UserServices.GET(name);
      res.status(200).json({
        success: true,
        result,
        message: "Get user success",
      });
    } catch (e) {
      console.error(e);
      next(e);
    }
  }

  static async GETs(req: Request, res: Response, next: NextFunction) {
    try {
      const query = req.query as any;
      const result = await UserServices.GETs(query);
      res.status(200).json({
        success: true,
        result,
        message: "Get users success",
      });
    } catch (e) {
      console.error(e);
      next(e);
    }
  }
  static async PATCH(req: UserRequest, res: Response, next: NextFunction) {
    try {
      let id: string;

      if (req.user?.role === "ADMIN") {
        id = req.params.id;
      } else {
        id = req.user?.id!;
      }
      const body = req.body;
      const result = await UserServices.PATCH(req.user!, id, body);
      res.status(200).json({
        success: true,
        result,
        message: "User updated successfully",
      });
    } catch (e) {
      console.error(e);
      next(e);
    }
  }

  static async DELETE(req: UserRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await UserServices.DELETE(req.user!, id);
      res.status(200).json({
        success: true,
        result,
        message: "User deleted successfully",
      });
    } catch (e) {
      console.error(e);
      next(e);
    }
  }
}
