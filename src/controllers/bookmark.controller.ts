import { NextFunction, Response } from "express";
import { BookmarkServices } from "src/services/bookmark.service";
import { LikeServices } from "src/services/like.service";
import { UserRequest } from "src/utils/types";

export class BookmarkControllers {
  static async POST(req: UserRequest, res: Response, next: NextFunction) {
    try {
      const body = req.body;
      const result = await BookmarkServices.POST({ userId: req.user?.id!, ...body });
      res.status(200).json({
        success: true,
        result,
        message: "Bookmarked successfully",
      });
    } catch (e) {
      console.error(e);
      next(e);
    }
  }
  static async DELETE(req: UserRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await BookmarkServices.DELETE(id);
      res.status(200).json({
        success: true,
        result,
        message: "Unbookmarked successfully",
      });
    } catch (e) {
      console.error(e);
      next(e);
    }
  }
}
