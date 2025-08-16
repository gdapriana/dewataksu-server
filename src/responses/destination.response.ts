import { Prisma } from "@prisma/client";

export class DestinationResponses {
  static readonly GETs: Prisma.DestinationSelect = {
    id: true,
    name: true,
    slug: true,
    content: true,
    address: true,
    price: true,
    isPublished: true,
    cover: {
      select: {
        id: true,
        url: true,
        publicId: true,
      },
    },
    category: {
      select: {
        id: true,
        name: true,
        slug: true,
      },
    },
    district: {
      select: {
        id: true,
        name: true,
        slug: true,
      },
    },
    tags: {
      select: {
        id: true,
        name: true,
        slug: true,
      },
    },
    _count: true,
  };
}
