import { LikeResponses } from "src/responses/like.response";
import { db } from "src/utils/db";
import { DB_SCHEMA, ErrorResponseMessage, ResponseError } from "src/utils/error-response";
import { UserPayload } from "src/utils/types";
import { LikeValidations } from "src/validations/like.validation";
import Validation from "src/validations/validation";
import z from "zod";

export class LikeServices {
  static readonly table = db.like;
  static readonly schema: DB_SCHEMA = "like";
  static readonly validation = LikeValidations;
  static readonly response = LikeResponses;
  static async POST(body: z.infer<typeof this.validation.POST>) {
    const validatedRequest = Validation.validate(this.validation.POST, body);

    let checkUser;
    if (validatedRequest.schema === "destinations") checkUser = await this.table.findFirst({ where: { AND: { userId: validatedRequest.userId, destinationId: validatedRequest.schemaId } } });
    else if (validatedRequest.schema === "traditions") checkUser = await this.table.findFirst({ where: { AND: { userId: validatedRequest.userId, traditionId: validatedRequest.schemaId } } });
    else checkUser = await this.table.findFirst({ where: { AND: { userId: validatedRequest.userId, storyId: validatedRequest.schemaId } } });
    if (checkUser) throw new ResponseError(ErrorResponseMessage.ALREADY_EXISTS("like"));

    let liked;
    if (validatedRequest.schema === "destinations")
      liked = await this.table.create({ data: { userId: validatedRequest.userId, destinationId: validatedRequest.schemaId }, select: LikeResponses.POST });
    else if (validatedRequest.schema === "traditions")
      liked = await this.table.create({ data: { userId: validatedRequest.userId, traditionId: validatedRequest.schemaId }, select: LikeResponses.POST });
    else liked = await this.table.create({ data: { userId: validatedRequest.userId, storyId: validatedRequest.schemaId }, select: LikeResponses.POST });

    return liked;
  }

  static async DELETE(id: string, user: UserPayload) {
    const validatedId = Validation.validate(this.validation.DELETE, id);
    const checkItem = await this.table.findUnique({ where: { id: validatedId }, select: { id: true } });
    if (!checkItem) throw new ResponseError(ErrorResponseMessage.NOT_FOUND("like"));
    const deleted = await this.table.delete({ where: { id: validatedId }, select: { id: true } });
    return deleted;
  }
}
