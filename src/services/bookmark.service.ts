import { BookmarkResponses } from "src/responses/bookmark.response";
import { LikeResponses } from "src/responses/like.response";
import { db } from "src/utils/db";
import { DB_SCHEMA, ErrorResponseMessage, ResponseError } from "src/utils/error-response";
import { BookmarkValidations } from "src/validations/bookmark.validation";
import Validation from "src/validations/validation";
import z from "zod";

export class BookmarkServices {
  static readonly table = db.bookmark;
  static readonly schema: DB_SCHEMA = "bookmark";
  static readonly validation = BookmarkValidations;
  static readonly response = BookmarkResponses;
  static async POST(body: z.infer<typeof this.validation.POST>) {
    const validatedRequest = Validation.validate(this.validation.POST, body);

    let checkUser;
    if (validatedRequest.schema === "destinations") checkUser = await this.table.findFirst({ where: { AND: { userId: validatedRequest.userId, destinationId: validatedRequest.schemaId } } });
    else if (validatedRequest.schema === "traditions") checkUser = await this.table.findFirst({ where: { AND: { userId: validatedRequest.userId, traditionId: validatedRequest.schemaId } } });
    else checkUser = await this.table.findFirst({ where: { AND: { userId: validatedRequest.userId, storyId: validatedRequest.schemaId } } });
    if (checkUser) throw new ResponseError(ErrorResponseMessage.ALREADY_EXISTS(this.schema));

    if (validatedRequest.schema === "destinations") return this.table.create({ data: { userId: validatedRequest.userId, destinationId: validatedRequest.schemaId }, select: LikeResponses.POST });
    if (validatedRequest.schema === "traditions") return await this.table.create({ data: { userId: validatedRequest.userId, traditionId: validatedRequest.schemaId }, select: LikeResponses.POST });
    return this.table.create({ data: { userId: validatedRequest.userId, storyId: validatedRequest.schemaId }, select: LikeResponses.POST });
  }

  static async DELETE(id: string) {
    const validatedId = Validation.validate(this.validation.DELETE, id);
    const checkItem = await this.table.findUnique({ where: { id: validatedId }, select: { id: true } });
    if (!checkItem) throw new ResponseError(ErrorResponseMessage.NOT_FOUND(this.schema));
    const deleted = await this.table.delete({ where: { id: validatedId }, select: this.response.DELETE });
    return deleted;
  }
}
