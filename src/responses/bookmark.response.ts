import { Prisma } from "@prisma/client";

export class BookmarkResponses {
  static readonly POST: Prisma.BookmarkSelect = {
    id: true,
  };
  static readonly DELETE: Prisma.BookmarkSelect = {
    id: true,
  };
}
