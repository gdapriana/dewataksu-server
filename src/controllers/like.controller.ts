import { NextFunction, Response } from "express";
import { LikeServices } from "src/services/like.service";
import { ACTIONS, DB_SCHEMA } from "src/utils/error-response";
import { UserRequest } from "src/utils/types";

export class LikeControllers {
  static readonly service = LikeServices;
  static readonly schema: DB_SCHEMA = "like";

  static readonly response = (action: ACTIONS, message?: string) => {
    return {
      success: true,
      message: message || `${action} ${this.schema} successfully`,
    };
  };

  static POST = async (req: UserRequest, res: Response, next: NextFunction) => {
    try {
      const body = req.body;
      const result = await this.service.POST({ userId: req.user?.id!, ...body });
      res.status(200).json({
        ...this.response("create", "Liked successfully"),
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
      const result = await this.service.DELETE(id);
      res.status(200).json({
        ...this.response("delete", "Unliked successfully"),
        result,
      });
    } catch (e) {
      console.error(e);
      next(e);
    }
  };
}
