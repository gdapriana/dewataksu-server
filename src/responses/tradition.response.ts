import { Prisma } from "@prisma/client";

export class TraditionResponses {
  static readonly GET: Prisma.TraditionSelect = {
    id: true,
    name: true,
    slug: true,
    _count: true,
    comments: {
      select: {
        id: true,
        body: true,
        author: {
          select: {
            id: true,
            name: true,
            profileImage: {
              select: {
                url: true,
              },
            },
          },
        },
        replies: true,
        createdAt: true,
      },
    },
    cover: {
      select: {
        url: true,
      },
    },
    content: true,
    createdAt: true,
    updatedAt: true,
  };
  static readonly GETs: Prisma.TraditionSelect = {
    id: true,
    name: true,
    slug: true,
    _count: true,
    cover: {
      select: {
        url: true,
      },
    },
    content: true,
    createdAt: true,
    updatedAt: true,
  };
  static readonly POST: Prisma.TraditionSelect = {
    id: true,
  };
  static readonly PATCH: Prisma.TraditionSelect = {
    id: true,
  };
  static readonly DELETE: Prisma.TraditionSelect = {
    id: true,
  };
}
