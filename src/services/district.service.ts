import { Prisma } from "@prisma/client";
import slugify from "slugify";
import { DistrictResponses } from "src/responses/district.response";
import { db } from "src/utils/db";
import { DB_SCHEMA, ErrorResponseMessage, ResponseError } from "src/utils/error-response";
import { slugOptions } from "src/utils/slugify";
import { UserPayload } from "src/utils/types";
import { DistrictValidations } from "src/validations/district.validation";
import Validation from "src/validations/validation";
import z from "zod";

export class DistrictServices {
  static readonly table = db.district;
  static readonly schema: DB_SCHEMA = "district";
  static readonly validation = DistrictValidations;
  static readonly response = DistrictResponses;
  static async GET(slug: z.infer<typeof this.validation.GET>) {
    const validatedSlug = Validation.validate(this.validation.GET, slug);
    const checkItem = await this.table.findUnique({
      where: {
        slug: validatedSlug,
      },
      select: this.response.GET,
    });
    if (!checkItem) throw new ResponseError(ErrorResponseMessage.NOT_FOUND(this.schema));
    return checkItem;
  }
  static async GETs(query: z.infer<typeof this.validation.QUERY>) {
    const validatedQuery = Validation.validate(this.validation.QUERY, query);
    const page = validatedQuery.page || 1;
    const limit = validatedQuery.limit || 10;
    const skip = (page - 1) * limit;
    const where: Prisma.DistrictWhereInput = {};
    if (validatedQuery.search) {
      where.OR = [{ name: { contains: validatedQuery.search, mode: "insensitive" } }, { description: { contains: validatedQuery.search, mode: "insensitive" } }];
    }
    let orderBy: Prisma.DistrictOrderByWithRelationInput = {};
    if (validatedQuery.sortBy === "popular") {
      orderBy = {
        destinations: {
          _count: validatedQuery.orderBy,
        },
      };
    } else {
      orderBy = {
        [validatedQuery.sortBy]: validatedQuery.orderBy,
      };
    }

    const [total, districts] = await db.$transaction([
      db.district.count({ where }),
      db.district.findMany({
        where,
        take: limit,
        skip,
        orderBy,
        select: this.response.GETs,
      }),
    ]);

    const totalPages = Math.ceil(total / limit);
    const pagination = {
      page,
      limit,
      total,
      pages: totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    };
    return { districts, pagination };
  }
  static async POST(user: UserPayload, body: z.infer<typeof this.validation.POST>) {
    const validatedBody = Validation.validate(this.validation.POST, body);
    const slug = slugify(validatedBody.name, slugOptions);
    const checkSlug = await this.table.findUnique({ where: { slug }, select: { id: true } });
    if (checkSlug) throw new ResponseError(ErrorResponseMessage.ALREADY_EXISTS(this.schema));
    const newItem = await this.table.create({
      data: { slug, ...validatedBody },
      select: this.response.POST,
    });
    await db.activityLog.create({
      data: {
        action: "CREATE",
        schema: "DISTRICT",
        schemaId: newItem.id,
        userId: user.id,
      },
    });
    return newItem;
  }
  static async PATCH(user: UserPayload, id: string, body: z.infer<typeof this.validation.PATCH>) {
    const validatedBody = Validation.validate(this.validation.PATCH, body);
    const checkItem = await this.table.findUnique({ where: { id }, select: { id: true } });
    if (!checkItem) throw new ResponseError(ErrorResponseMessage.NOT_FOUND(this.schema));
    let newSlug = undefined;
    if (validatedBody.name) {
      newSlug = slugify(validatedBody.name, slugOptions);
      const checkSlug = await this.table.findUnique({ where: { slug: newSlug } });
      if (checkSlug) throw new ResponseError(ErrorResponseMessage.ALREADY_EXISTS(this.schema));
    }
    const updatedItem = await this.table.update({
      where: { id },
      data: {
        slug: newSlug,
        ...validatedBody,
      },
      select: this.response.PATCH,
    });

    await db.activityLog.create({
      data: {
        action: "UPDATE",
        schema: "DISTRICT",
        schemaId: updatedItem.id,
        userId: user.id,
      },
    });
    return updatedItem;
  }
  static async DELETE(user: UserPayload, id: z.infer<typeof this.validation.DELETE>) {
    const validatedId = Validation.validate(this.validation.DELETE, id);
    const checkItem = await this.table.findUnique({ where: { id: validatedId }, select: { id: true } });
    if (!checkItem) throw new ResponseError(ErrorResponseMessage.NOT_FOUND(this.schema));
    const deletedItem = await this.table.delete({ where: { id: validatedId }, select: this.response.DELETE });
    await db.activityLog.create({
      data: {
        action: "DELETE",
        schema: "DISTRICT",
        schemaId: deletedItem.id,
        userId: user.id,
      },
    });
    return deletedItem;
  }
}
