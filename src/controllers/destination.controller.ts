import { NextFunction, Request, Response } from "express";
import { DestinationServices } from "src/services/destination.service";
import { UserRequest } from "src/utils/types";

export class DestinationControllers {
  static async GET(req: Request, res: Response, next: NextFunction) {
    try {
      const { slug } = req.params;
      const result = await DestinationServices.GET(slug);
      res.status(200).json({
        success: true,
        result,
        message: "Get destination successfully",
      });
    } catch (e) {
      console.error(e);
      next(e);
    }
  }
  static async GETs(req: Request, res: Response, next: NextFunction) {
    try {
      const query = req.query as any;
      const { destinations, pagination } = await DestinationServices.GETs(query);
      res.status(200).json({
        success: true,
        result: {
          destinations,
          pagination,
        },
        message: "Get destinations success",
      });
    } catch (e) {
      console.error(e);
      next(e);
    }
  }
  static async POST(req: UserRequest, res: Response, next: NextFunction) {
    try {
      const body = req.body;
      const result = await DestinationServices.POST(req.user!, body);
      res.status(200).json({
        success: true,
        result,
        message: "Create destination success",
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
      const result = await DestinationServices.PATCH(req.user!, id, body);
      res.status(200).json({
        success: true,
        result,
        message: "Destination updated successfully",
      });
    } catch (e) {
      console.error(e);
      next(e);
    }
  }
  static async DELETE(req: UserRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await DestinationServices.DELETE(req.user!, id);
      res.status(200).json({
        success: true,
        result,
        message: "Destination deleted successfully",
      });
    } catch (e) {
      console.error(e);
      next(e);
    }
  }
}
