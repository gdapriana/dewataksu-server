import { Prisma } from "@prisma/client";

export class DestinationResponses {
  static readonly GET: Prisma.DestinationSelect = {
    id: true,
    name: true,
    address: true,
    isPublished: true,
    content: true,
    mapUrl: true,
    slug: true,
    price: true,
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
    galleries: {
      select: {
        id: true,
        image: {
          select: {
            id: true,
            url: true,
          },
        },
      },
    },
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
    _count: true,
  };
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
  static readonly POST: Prisma.DestinationSelect = {
    id: true,
  };
  static readonly PATCH: Prisma.DestinationSelect = {
    id: true,
  };
}
