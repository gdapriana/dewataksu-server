import { NextFunction, Request, Response } from "express";
import { DestinationServices } from "src/services/destination.service";
import { TraditionServices } from "src/services/tradition.service";
import { UserRequest } from "src/utils/types";

export class TraditionControllers {
  static async GET(req: Request, res: Response, next: NextFunction) {
    try {
      const { slug } = req.params;
      const result = await TraditionServices.GET(slug);
      res.status(200).json({
        success: true,
        result,
        message: "Get tradition successfully",
      });
    } catch (e) {
      console.error(e);
      next(e);
    }
  }
  static async GETs(req: Request, res: Response, next: NextFunction) {
    try {
      const query = req.query as any;
      const { traditions, pagination } = await TraditionServices.GETs(query);
      res.status(200).json({
        success: true,
        result: {
          traditions,
          pagination,
        },
        message: "Get traditions successfully",
      });
    } catch (e) {
      console.error(e);
      next(e);
    }
  }
  static async POST(req: UserRequest, res: Response, next: NextFunction) {
    try {
      const body = req.body;
      const result = await TraditionServices.POST(req.user!, body);
      res.status(200).json({
        success: true,
        result,
        message: "Create tradition successfully",
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
      const result = await TraditionServices.PATCH(req.user!, id, body);
      res.status(200).json({
        success: true,
        result,
        message: "Tradition updated successfully",
      });
    } catch (e) {
      console.error(e);
      next(e);
    }
  }
  static async DELETE(req: UserRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await TraditionServices.DELETE(req.user!, id);
      res.status(200).json({
        success: true,
        result,
        message: "Tradition deleted successfully",
      });
    } catch (e) {
      console.error(e);
      next(e);
    }
  }
}
