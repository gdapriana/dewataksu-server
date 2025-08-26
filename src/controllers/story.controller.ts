import { NextFunction, Request, Response } from "express";
import { StoryServices } from "src/services/story.service";
import { ACTIONS, DB_SCHEMA } from "src/utils/error-response";
import { UserRequest } from "src/utils/types";

export class StoryControllers {
  static readonly service = StoryServices;
  static readonly schema: DB_SCHEMA = "story";
  static readonly response = (action: ACTIONS) => {
    return {
      success: true,
      message: `${action} ${this.schema} successfully`,
    };
  };
  static async GET(req: Request, res: Response, next: NextFunction) {
    try {
      const { slug } = req.params;
      const result = await this.service.GET(slug);
      res.status(200).json({
        ...this.response("get"),
        result,
      });
    } catch (e) {
      console.error(e);
      next(e);
    }
  }
  static async GETs(req: Request, res: Response, next: NextFunction) {
    try {
      const query = req.query as any;
      const { stories, pagination } = await this.service.GETs(query);
      res.status(200).json({
        ...this.response("gets"),
        result: {
          stories,
          pagination,
        },
      });
    } catch (e) {
      console.error(e);
      next(e);
    }
  }
  static async POST(req: UserRequest, res: Response, next: NextFunction) {
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
  }
  static async PATCH(req: UserRequest, res: Response, next: NextFunction) {
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
  }
  static async DELETE(req: UserRequest, res: Response, next: NextFunction) {
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
  }
}
