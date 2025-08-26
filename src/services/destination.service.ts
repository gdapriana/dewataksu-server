import { Prisma } from "@prisma/client";
import { DestinationResponses } from "src/responses/destination.response";
import { db } from "src/utils/db";
import { DB_SCHEMA, ErrorResponseMessage, ResponseError } from "src/utils/error-response";
import { DestinationValidations } from "src/validations/destination.validation";
import Validation from "src/validations/validation";
import z from "zod";
import slugify from "slugify";
import { slugOptions } from "src/utils/slugify";
import { UserPayload } from "src/utils/types";

export class DestinationServices {
  static readonly table = db.destination;
  static readonly schema: DB_SCHEMA = "destination";
  static readonly validation = DestinationValidations;
  static readonly response = DestinationResponses;

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

    const where: Prisma.DestinationWhereInput = {};

    if (query.isPublished) {
      where.isPublished = query.isPublished === "1";
    }

    if (validatedQuery.search) {
      where.OR = [
        { name: { contains: validatedQuery.search, mode: "insensitive" } },
        { content: { contains: validatedQuery.search, mode: "insensitive" } },
        { address: { contains: validatedQuery.search, mode: "insensitive" } },
        { category: { name: { contains: validatedQuery.search, mode: "insensitive" } } },
        { district: { name: { contains: validatedQuery.search, mode: "insensitive" } } },
        { tags: { some: { name: { contains: validatedQuery.search, mode: "insensitive" } } } },
      ];
    }
    let orderBy: Prisma.DestinationOrderByWithRelationInput = {};

    if (validatedQuery.sortBy === "bookmarked") orderBy = { bookmarks: { _count: validatedQuery.orderBy } };
    else if (validatedQuery.sortBy === "liked") orderBy = { likes: { _count: validatedQuery.orderBy } };
    else orderBy = { [query.sortBy]: query.orderBy };

    const [total, destinations] = await db.$transaction([
      db.destination.count({ where }),
      db.destination.findMany({
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
    return { destinations, pagination };
  }

  static async POST(user: UserPayload, body: z.infer<typeof this.validation.POST>) {
    const validatedBody = Validation.validate(this.validation.POST, body);
    const { tags, categoryId, districtId, ...destinationData } = validatedBody;
    const slug = slugify(validatedBody.name, slugOptions);

    const checkItem = await this.table.findUnique({ where: { slug } });
    if (checkItem) throw new ResponseError(ErrorResponseMessage.ALREADY_EXISTS(this.schema));

    const checkCategory = await db.category.findUnique({ where: { id: validatedBody.categoryId }, select: { id: true } });
    if (!checkCategory) throw new ResponseError(ErrorResponseMessage.NOT_FOUND("category"));

    const checkDistrict = await db.district.findUnique({ where: { id: validatedBody.districtId }, select: { id: true } });
    if (!checkDistrict) throw new ResponseError(ErrorResponseMessage.NOT_FOUND("district"));

    const createData: Prisma.DestinationCreateInput = {
      ...destinationData,
      slug,
      category: {
        connect: { id: validatedBody.categoryId },
      },
      district: {
        connect: { id: validatedBody.districtId },
      },
    };

    if (tags && tags.length > 0) {
      createData.tags = {
        connectOrCreate: tags.map((tagName) => {
          const slug = slugify(tagName, slugOptions);
          return {
            where: { slug: slug },
            create: { name: tagName, slug: slug },
          };
        }),
      };
    }

    const newItem = await this.table.create({
      data: { ...createData },
      select: this.response.POST,
    });

    await db.activityLog.create({
      data: {
        action: "CREATE",
        userId: user.id,
        schemaId: newItem.id,
        schema: "DESTINATION",
      },
    });

    return newItem;
  }
  static async PATCH(user: UserPayload, id: string, body: z.infer<typeof this.validation.PATCH>) {
    const validatedBody: z.infer<typeof this.validation.PATCH> = Validation.validate(this.validation.PATCH, body);
    const checkItem = await this.table.findUnique({ where: { id }, include: { tags: true } });
    if (!checkItem) throw new ResponseError(ErrorResponseMessage.NOT_FOUND(this.schema));

    Object.keys(validatedBody).forEach((key) => {
      const typedKey = key as keyof typeof validatedBody;
      if (typedKey === "tags" && validatedBody.tags) {
        const existingTagIds = checkItem.tags.map((tag) => tag.id);
        const newTagIds = validatedBody.tags;
        if (existingTagIds.sort().toString() === newTagIds.sort().toString()) {
          validatedBody.tags = undefined;
        }
      } else {
        const checkItemKey = key as keyof typeof checkItem;
        if (validatedBody[typedKey] === checkItem[checkItemKey]) {
          validatedBody[typedKey] = undefined;
        }
      }
    });
    const { tags, ...otherData } = validatedBody;

    const updatedItem = await db.$transaction(async (tx) => {
      let newSlug = undefined;
      if (otherData.categoryId) {
        const checkCategory = await tx.category.findUnique({ where: { id: otherData.categoryId } });
        if (!checkCategory) throw new ResponseError(ErrorResponseMessage.NOT_FOUND("category"));
      }
      if (otherData.name) {
        newSlug = slugify(otherData.name, slugOptions);
        const checkSlug = await tx.destination.findUnique({
          where: { slug: newSlug },
          select: { slug: true },
        });
        if (checkSlug) throw new ResponseError(ErrorResponseMessage.ALREADY_EXISTS(this.schema));
      }

      if (tags) {
        const tagIds = await Promise.all(
          tags.map(async (tagName) => {
            const slug = slugify(tagName);
            const tag = await tx.tag.upsert({
              where: { slug },
              update: {},
              create: { name: tagName, slug },
            });
            return tag.id;
          }),
        );
        return tx.destination.update({
          where: { id },
          data: {
            slug: newSlug,
            ...otherData,
            tags: {
              set: tagIds.map((id) => ({ id })),
            },
          },
          select: this.response.PATCH,
        });
      } else {
        return tx.destination.update({
          where: { id: id },
          data: {
            ...otherData,
          },
          select: this.response.PATCH,
        });
      }
    });
    await db.activityLog.create({
      data: {
        userId: user.id,
        action: "UPDATE",
        schema: "DESTINATION",
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
        schema: "DESTINATION",
        schemaId: deletedItem.id,
        userId: user.id,
      },
    });
    return deletedItem;
  }
}
