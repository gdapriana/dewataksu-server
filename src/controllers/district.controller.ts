import { NextFunction, Request, Response } from "express";
import { DistrictServices } from "src/services/district.service";
import { UserRequest } from "src/utils/types";

export class DistrictControllers {
  static async GET(req: Request, res: Response, next: NextFunction) {
    try {
      const { slug } = req.params;
      const result = await DistrictServices.GET(slug);
      res.status(200).json({
        success: true,
        result,
        message: "Get district successfully",
      });
    } catch (e) {
      console.error(e);
      next(e);
    }
  }
  static async GETs(req: Request, res: Response, next: NextFunction) {
    try {
      const query = req.query as any;
      const { districts, pagination } = await DistrictServices.GETs(query);
      res.status(200).json({
        success: true,
        result: {
          districts,
          pagination,
        },
        message: "Gets districts successfully",
      });
    } catch (e) {
      console.error(e);
      next(e);
    }
  }
  static async POST(req: UserRequest, res: Response, next: NextFunction) {
    try {
      const body = req.body;
      const result = await DistrictServices.POST(req.user!, body);
      res.status(200).json({
        success: true,
        result,
        message: "Create district successfully",
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
      const result = await DistrictServices.PATCH(req.user!, id, body);
      res.status(200).json({
        success: true,
        result,
        message: "Update district successfully",
      });
    } catch (e) {
      console.error(e);
      next(e);
    }
  }
  static async DELETE(req: UserRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await DistrictServices.DELETE(req.user!, id);
      res.status(200).json({
        success: true,
        result,
        message: "Delete district successfully",
      });
    } catch (e) {
      console.error(e);
      next(e);
    }
  }
}
