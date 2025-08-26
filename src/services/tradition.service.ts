import { Prisma } from "@prisma/client";
import { db } from "src/utils/db";
import { DB_SCHEMA, ErrorResponseMessage, ResponseError } from "src/utils/error-response";
import Validation from "src/validations/validation";
import z from "zod";
import slugify from "slugify";
import { slugOptions } from "src/utils/slugify";
import { UserPayload } from "src/utils/types";
import { TraditionValidations } from "src/validations/tradition.validation";
import { TraditionResponses } from "src/responses/tradition.response";

export class TraditionServices {
  static readonly table = db.tradition;
  static readonly schema: DB_SCHEMA = "tradition";
  static readonly validation = TraditionValidations;
  static readonly response = TraditionResponses;

  static async GET(slug: z.infer<typeof this.validation.GET>) {
    const validatedSlug = Validation.validate(this.validation.GET, slug);
    const checkItem = await this.table.findUnique({ where: { slug: validatedSlug }, select: this.response.GET });
    if (!checkItem) throw new ResponseError(ErrorResponseMessage.NOT_FOUND(this.schema));
    return checkItem;
  }

  static async GETs(query: z.infer<typeof this.validation.QUERY>) {
    const validatedQuery = Validation.validate(this.validation.QUERY, query);

    const page = validatedQuery.page || 1;
    const limit = validatedQuery.limit || 10;
    const skip = (page - 1) * limit;

    const where: Prisma.TraditionWhereInput = {};

    if (query.isPublished) {
      where.isPublished = query.isPublished === "1";
    }

    if (validatedQuery.search) {
      where.OR = [{ name: { contains: validatedQuery.search, mode: "insensitive" } }, { content: { contains: validatedQuery.search, mode: "insensitive" } }];
    }

    let orderBy: Prisma.TraditionOrderByWithRelationInput = {};

    if (validatedQuery.sortBy === "bookmarked") orderBy = { bookmarks: { _count: validatedQuery.orderBy } };
    else if (validatedQuery.sortBy === "liked") orderBy = { likes: { _count: validatedQuery.orderBy } };
    else orderBy = { [query.sortBy]: query.orderBy };

    const [total, traditions] = await db.$transaction([
      db.tradition.count({ where }),
      db.tradition.findMany({
        where,
        skip,
        take: limit,
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
    return { traditions, pagination };
  }

  static async POST(user: UserPayload, body: z.infer<typeof this.validation.POST>) {
    const validatedBody = Validation.validate(this.validation.POST, body);
    const slug = slugify(validatedBody.name, slugOptions);

    const checkItem = await this.table.findUnique({ where: { slug } });
    if (checkItem) throw new ResponseError(ErrorResponseMessage.ALREADY_EXISTS(this.schema));

    const createData: Prisma.TraditionCreateInput = {
      ...validatedBody,
      slug,
    };

    const newItem = await this.table.create({
      data: { ...createData },
      select: this.response.POST,
    });

    await db.activityLog.create({
      data: {
        action: "CREATE",
        userId: user.id,
        schemaId: newItem.id,
        schema: "TRADITION",
      },
    });

    return newItem;
  }
  static async PATCH(user: UserPayload, id: string, body: z.infer<typeof this.validation.PATCH>) {
    const validatedBody: z.infer<typeof this.validation.PATCH> = Validation.validate(this.validation.PATCH, body);
    const checkItem = await this.table.findUnique({ where: { id } });
    if (!checkItem) throw new ResponseError(ErrorResponseMessage.NOT_FOUND(this.schema));

    Object.keys(validatedBody).forEach((key) => {
      const typedKey = key as keyof typeof validatedBody;
      const checkItemKey = key as keyof typeof checkItem;
      if (validatedBody[typedKey] === checkItem[checkItemKey]) {
        validatedBody[typedKey] = undefined;
      }
    });

    const updatedItem = await db.$transaction(async (tx) => {
      let newSlug = undefined;
      if (validatedBody.name) {
        newSlug = slugify(validatedBody.name, slugOptions);
        const checkSlug = await tx.tradition.findUnique({
          where: { slug: newSlug },
          select: { slug: true },
        });
        if (checkSlug) throw new ResponseError(ErrorResponseMessage.ALREADY_EXISTS(this.schema));
      }

      return tx.tradition.update({
        where: { id: id },
        data: {
          ...validatedBody,
          slug: newSlug,
        },
        select: this.response.PATCH,
      });
    });
    await db.activityLog.create({
      data: {
        userId: user.id,
        action: "UPDATE",
        schema: "DISTRICT",
        schemaId: updatedItem.id,
      },
    });
    return updatedItem;
  }
  static async DELETE(user: UserPayload, id: z.infer<typeof this.validation.DELETE>) {
    const idValidation = Validation.validate(this.validation.DELETE, id);
    const checkItem = await this.table.findUnique({ where: { id: idValidation }, select: { id: true } });
    if (!checkItem) throw new ResponseError(ErrorResponseMessage.NOT_FOUND(this.schema));
    const deletedItem = await this.table.delete({ where: { id: idValidation }, select: { id: true } });
    await db.activityLog.create({
      data: {
        action: "DELETE",
        schema: "TRADITION",
        schemaId: deletedItem.id,
        userId: user.id,
      },
    });
    return deletedItem;
  }
}
