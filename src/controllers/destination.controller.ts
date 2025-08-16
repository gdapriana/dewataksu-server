import { NextFunction, Request, Response } from "express";
import { DestinationServices } from "src/services/destination.service";

export class DestinationControllers {
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
}
