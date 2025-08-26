import { NextFunction, Request, Response } from "express";
import { CategoryServices } from "src/services/category.service";
import { ACTIONS, DB_SCHEMA } from "src/utils/error-response";
import { UserRequest } from "src/utils/types";

export class CategoryControllers {
  static readonly service = CategoryServices;
  static readonly schema: DB_SCHEMA = "category";

  static readonly response = (action: ACTIONS) => {
    return {
      success: true,
      message: `${action} ${this.schema} successfully`,
    };
  };

  static GETs = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const query = req.query as any;
      const { categories, pagination } = await this.service.GETs(query);
      res.status(200).json({
        ...this.response("gets"),
        result: {
          categories,
          pagination,
        },
      });
    } catch (e) {
      console.error(e);
      next(e);
    }
  };

  static POST = async (req: UserRequest, res: Response, next: NextFunction) => {
    try {
      const body = req.body;
      const result = await this.service.POST(req.user!, body);
      res.status(200).json({
        ...this.response("create"),
        result,
      });
    } catch (e) {
      console.error(e);
      next(e);
    }
  };

  static PATCH = async (req: UserRequest, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
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
