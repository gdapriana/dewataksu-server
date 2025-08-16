import { Role } from "@prisma/client";
import { Request } from "express";

export interface UserPayload {
  id: string;
  name: string;
  role: Role;
}

export interface UserRequest extends Request {
  user?: UserPayload;
}
