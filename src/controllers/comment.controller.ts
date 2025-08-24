import { NextFunction, Response } from "express";
import { CommentServices } from "src/services/comment.service";
import { UserRequest } from "src/utils/types";

export class CommentControllers {
  static async POST(req: UserRequest, res: Response, next: NextFunction) {
    try {
      const body = req.body;
      const result = await CommentServices.POST(req.user!, body);
      res.status(200).json({
        success: true,
        result,
        message: "Comment successfully",
      });
    } catch (e) {
      console.error(e);
      next(e);
    }
  }
  static async DELETE(req: UserRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await CommentServices.DELETE(req.user!, id);
      res.status(200).json({
        success: true,
        result,
        message: "Uncomment successfully",
      });
    } catch (e) {
      console.error(e);
      next(e);
    }
  }
}
