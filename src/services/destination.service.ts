import { Prisma } from "@prisma/client";
import { DestinationResponses } from "src/responses/destination.response";
import { db } from "src/utils/db";
import { DB_SCHEMA } from "src/utils/error-response";
import { DestinationValidations } from "src/validations/destination.validation";
import Validation from "src/validations/validation";
import z from "zod";

export class DestinationServices {
  static readonly table = db.destination;
  static readonly schema: DB_SCHEMA = "destination";
  static readonly validation = DestinationValidations;
  static async GETs(query: z.infer<typeof this.validation.QUERY>) {
    const validatedQuery = Validation.validate(this.validation.QUERY, query);

    const page = validatedQuery.page || 1;
    const limit = validatedQuery.limit || 10;
    const skip = (page - 1) * limit;

    const where: Prisma.DestinationWhereInput = {};

    if (validatedQuery.search) {
      where.name = {
        contains: query.search,
        mode: "insensitive",
      };
    }

    if (query.isPublished) {
      where.isPublished = query.isPublished === "1";
    }

    if (validatedQuery.search) {
      const searchCondition = {
        contains: query.search,
        mode: "insensitive" as const,
      };

      where.OR = [
        { name: searchCondition },
        { content: searchCondition },
        { address: searchCondition },
        {
          category: {
            slug: searchCondition,
          },
        },
        {
          district: {
            slug: searchCondition,
          },
        },
        {
          tags: {
            some: {
              name: searchCondition,
            },
          },
        },
      ];
    }

    const [total, destinations] = await db.$transaction([
      db.destination.count({ where }),
      db.destination.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          [query.sortBy]: query.orderBy,
        },
        select: DestinationResponses.GETs,
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
}
