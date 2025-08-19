import { NextFunction, Request, Response } from "express";
import { LikeServices } from "src/services/like.service";
import { UserRequest } from "src/utils/types";

export class LikeControllers {
  static async POST(req: UserRequest, res: Response, next: NextFunction) {
    try {
      const body = req.body;
      const result = await LikeServices.POST({ userId: req.user?.id!, ...body });
      res.status(200).json({
        success: true,
        result,
        message: "Like successfully",
      });
    } catch (e) {
      console.error(e);
      next(e);
    }
  }
  static async DELETE(req: UserRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await LikeServices.DELETE(id, req.user!);
      res.status(200).json({
        success: true,
        result,
        message: "Unlike successfully",
      });
    } catch (e) {
      console.error(e);
      next(e);
    }
  }
}
