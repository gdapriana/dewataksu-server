import { NextFunction, Response } from "express";
import { CommentServices } from "src/services/comment.service";
import { ACTIONS, DB_SCHEMA } from "src/utils/error-response";
import { UserRequest } from "src/utils/types";

export class CommentControllers {
  static readonly service = CommentServices;
  static readonly schema: DB_SCHEMA = "comment";

  static readonly response = (action: ACTIONS, message?: string) => {
    return {
      success: true,
      message: message || `${action} ${this.schema} successfully`,
    };
  };

  static POST = async (req: UserRequest, res: Response, next: NextFunction) => {
    try {
      const body = req.body;
      const result = await this.service.POST(req.user!, body);
      res.status(200).json({
        ...this.response("create", "Commented successfully"),
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
        ...this.response("delete", "Uncommented successfully"),
        result,
      });
    } catch (e) {
      console.error(e);
      next(e);
    }
  };
}
