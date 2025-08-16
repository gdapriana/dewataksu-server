import { db } from "src/utils/db";
import { UserAuthValidation, UserValidation } from "src/validations/user.validation";
import Validation from "src/validations/validation";
import bcrypt from "bcrypt";
import { DB_SCHEMA, ErrorResponseMessage, ResponseError } from "src/utils/error-response";
import z from "zod";
import { UserAuthResponse, UserResponse } from "src/responses/user.response";
import { UserPayload } from "src/utils/types";
import { generateAccessToken, generateRefreshToken } from "src/utils/token";
import { Prisma } from "@prisma/client";

export class UserAuthServices {
  static readonly table = db.user;
  static readonly schema: DB_SCHEMA = "user";
  static readonly validation = UserAuthValidation;

  static async REGISTER(body: z.infer<typeof this.validation.REGISTER>): Promise<{ id: string }> {
    const validatedBody = Validation.validate(this.validation.REGISTER, body);
    const checkItem = this.table.findUnique({
      where: { name: validatedBody.name },
    });
    if (!checkItem) throw new ResponseError(ErrorResponseMessage.NOT_FOUND(this.schema));
    validatedBody.password = await bcrypt.hash(validatedBody.password, 10);
    const response = await this.table.create({
      data: validatedBody,
      select: UserAuthResponse.REGISTER,
    });
    return response;
  }

  static async LOGIN(body: z.infer<typeof UserAuthValidation.LOGIN>): Promise<{ accessToken: string; refreshToken: string }> {
    const validatedBody = Validation.validate(this.validation.LOGIN, body);
    const checkItem = await this.table.findUnique({
      where: { name: validatedBody.name },
    });
    if (!checkItem) throw new ResponseError(ErrorResponseMessage.INVALID_USERNAME_PASSWORD());

    const isPasswordValid = await bcrypt.compare(validatedBody.password, checkItem.password!);

    if (!isPasswordValid) throw new ResponseError(ErrorResponseMessage.INVALID_USERNAME_PASSWORD());

    const userPayload: UserPayload = {
      id: checkItem.id,
      name: checkItem.name,
      role: checkItem.role,
    };
    const accessToken = generateAccessToken(userPayload);
    const refreshToken = generateRefreshToken(userPayload);
    const response = await this.table.update({
      where: { name: validatedBody.name },
      data: { refreshToken },
      select: UserAuthResponse.LOGIN,
    });
    return { refreshToken: response.refreshToken!, accessToken };
  }
}

export class UserServices {
  static readonly table = db.user;
  static readonly schema: DB_SCHEMA = "user";
  static readonly validation = UserValidation;

  static async GET(name: string) {
    const validatedSlug = Validation.validate(this.validation.GET, name);
    const checkItem = await this.table.findUnique({
      where: { name: validatedSlug },
      select: UserResponse.GET,
    });
    if (!checkItem) throw new ResponseError(ErrorResponseMessage.NOT_FOUND(this.schema));

    return checkItem;
  }

  static async GETs(query: z.infer<typeof this.validation.QUERY>) {
    const validatedQuery = Validation.validate(this.validation.QUERY, query);
    const { sortBy, orderBy, ...filters } = validatedQuery;
    const page = filters.page || 1;
    const limit = filters.limit || 10;
    const skip = (page - 1) * limit;
    const where: Prisma.UserWhereInput = {};
    if (filters.role) where.role = filters.role;
    if (filters.search) {
      const searchQuery = filters.search;
      where.OR = [{ name: { contains: searchQuery, mode: "insensitive" } }, { email: { contains: searchQuery, mode: "insensitive" } }, { fullName: { contains: searchQuery, mode: "insensitive" } }];
    }

    const [totalUsers, users] = await db.$transaction([
      this.table.count({ where }),
      this.table.findMany({
        where,
        skip,
        take: limit,
        select: UserResponse.GETs,
        orderBy: { [sortBy]: orderBy },
      }),
    ]);
    const totalPages = Math.ceil(totalUsers / limit);
    return {
      users: users,
      pagination: {
        page: page,
        limit: limit,
        total: totalUsers,
        pages: totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    };
  }

  static async PATCH(user: UserPayload, id: string, body: z.infer<typeof this.validation.PATCH>) {
    const checkItem = await this.table.findUnique({ where: { id }, select: { id: true } });
    if (!checkItem) throw new ResponseError(ErrorResponseMessage.NOT_FOUND(this.schema));
    const validatedBody = Validation.validate(this.validation.PATCH, body);
    const updatedItem = await this.table.update({
      where: { id },
      data: validatedBody,
      select: { id: true },
    });
    await db.activityLog.create({
      data: {
        userId: user.id,
        schema: "USER",
        schemaId: updatedItem.id,
        action: "UPDATE",
      },
    });
    return updatedItem;
  }

  static async DELETE(user: UserPayload, id: z.infer<typeof this.validation.DELETE>) {
    const validatedId = Validation.validate(this.validation.DELETE, id);
    const checkItem = await this.table.findUnique({ where: { id: validatedId } });
    if (!checkItem) throw new ResponseError(ErrorResponseMessage.NOT_FOUND(this.schema));
    const deletedItem = await this.table.delete({ where: { id: validatedId }, select: { id: true } });
    await db.activityLog.create({
      data: {
        action: "DELETE",
        schema: "USER",
        schemaId: deletedItem.id,
        userId: user.id,
      },
    });
    return deletedItem;
  }
}
