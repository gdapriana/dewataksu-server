import { NextFunction, Response } from "express";
import { BookmarkServices } from "src/services/bookmark.service";
import { ACTIONS, DB_SCHEMA } from "src/utils/error-response";
import { UserRequest } from "src/utils/types";

export class BookmarkControllers {
  static readonly service = BookmarkServices;
  static readonly schema: DB_SCHEMA = "bookmark";

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
        ...this.response("create", "Bookmarked successfully"),
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
        ...this.response("delete", "Unbookmarked successfully"),
        result,
      });
    } catch (e) {
      console.error(e);
      next(e);
    }
  };
}
