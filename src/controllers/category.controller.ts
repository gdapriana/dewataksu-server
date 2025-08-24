import { NextFunction, Request, Response } from "express";
import { CategoryServices } from "src/services/category.service";
import { UserRequest } from "src/utils/types";

export class CategoryControllers {
  static async GETs(req: Request, res: Response, next: NextFunction) {
    try {
      const query = req.query as any;
      const { categories, pagination } = await CategoryServices.GETs(query);
      res.status(200).json({
        success: true,
        result: {
          categories,
          pagination,
        },
        message: "Gets categories successfully",
      });
    } catch (e) {
      console.error(e);
      next(e);
    }
  }
  static async POST(req: UserRequest, res: Response, next: NextFunction) {
    try {
      const body = req.body;
      const result = await CategoryServices.POST(req.user!, body);
      res.status(200).json({
        success: true,
        result,
        message: "Create category successfully",
      });
    } catch (e) {
      console.error(e);
      next(e);
    }
  }
  static async PATCH(req: UserRequest, res: Response, next: NextFunction) {
    try {
      const body = req.body;
      const { id } = req.params;
      const result = await CategoryServices.PATCH(req.user!, id, body);
      res.status(200).json({
        success: true,
        result,
        message: "Update category successfully",
      });
    } catch (e) {
      console.error(e);
      next(e);
    }
  }
  static async DELETE(req: UserRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await CategoryServices.DELETE(req.user!, id);
      res.status(200).json({
        success: true,
        result,
        message: "Delete category successfully",
      });
    } catch (e) {
      console.error(e);
      next(e);
    }
  }
}
