import { Prisma } from "@prisma/client";

export class LikeResponses {
  static readonly POST: Prisma.LikeSelect = {
    id: true,
  };
  static readonly DELETE: Prisma.LikeSelect = {
    id: true,
  };
}
