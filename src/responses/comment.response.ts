import { Prisma } from "@prisma/client";

export class CommentResponses {
  static readonly POST: Prisma.CommentSelect = {
    id: true,
  };
  static readonly DELETE: Prisma.CommentSelect = {
    id: true,
  };
}
