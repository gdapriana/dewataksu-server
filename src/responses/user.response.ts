import { Prisma } from "@prisma/client";

export class UserAuthResponse {
  static readonly REGISTER: Prisma.UserSelect = {
    id: true,
  };
  static readonly LOGIN: Prisma.UserSelect = {
    refreshToken: true,
  };
}

export class UserResponse {
  static readonly GET: Prisma.UserSelect = {
    name: true,
    _count: true,
    bio: true,
    email: true,
    stories: {
      select: {
        id: true,
        name: true,
        slug: true,
        createdAt: true,
        updatedAt: true,
      },
    },
    createdAt: true,
    updatedAt: true,
    role: true,
  };
  static readonly GETs: Prisma.UserSelect = {
    id: true,
    email: true,
    name: true,
    fullName: true,
    bio: true,
    role: true,
    createdAt: true,
    updatedAt: true,
    profileImage: {
      select: {
        id: true,
        url: true,
      },
    },
  };
}
