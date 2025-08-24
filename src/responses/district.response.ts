import { Prisma } from "@prisma/client";

export class DistrictResponses {
  static readonly GET: Prisma.DistrictSelect = {
    id: true,
    _count: true,
    cover: {
      select: {
        url: true,
      },
    },
    description: true,
    destinations: {
      select: {
        _count: true,
        name: true,
        cover: {
          select: {
            url: true,
          },
        },
        address: true,
        content: true,
        id: true,
        slug: true,
      },
    },
    name: true,
  };
  static readonly GETs: Prisma.DistrictSelect = {
    id: true,
    name: true,
    description: true,
    cover: {
      select: {
        url: true,
      },
    },
    _count: true,
    slug: true,
  };
  static readonly POST: Prisma.DistrictSelect = {
    id: true,
  };
  static readonly PATCH: Prisma.DistrictSelect = {
    id: true,
  };
  static readonly DELETE: Prisma.DistrictSelect = {
    id: true,
  };
}
