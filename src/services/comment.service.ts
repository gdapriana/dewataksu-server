import { CommentResponses } from "src/responses/comment.response";
import { db } from "src/utils/db";
import { DB_SCHEMA, ErrorResponseMessage, ResponseError } from "src/utils/error-response";
import { UserPayload } from "src/utils/types";
import { CommentValidations } from "src/validations/comment.validation";
import Validation from "src/validations/validation";
import z from "zod";

export class CommentServices {
  static readonly table = db.comment;
  static readonly schema: DB_SCHEMA = "comment";
  static readonly validation = CommentValidations;
  static readonly response = CommentResponses;

  static async POST(user: UserPayload, body: z.infer<typeof this.validation.POST>) {
    const validatedBody = Validation.validate(this.validation.POST, body);
    let checkSchema;
    if (validatedBody.schema === "destinations") {
      checkSchema = await db.destination.findUnique({ where: { id: validatedBody.schemaId }, select: { id: true } });
    } else if (validatedBody.schema === "traditions") {
      checkSchema = await db.tradition.findUnique({ where: { id: validatedBody.schemaId }, select: { id: true } });
    } else {
      checkSchema = await db.story.findUnique({ where: { id: validatedBody.schemaId }, select: { id: true } });
    }

    if (!checkSchema) throw new ResponseError(ErrorResponseMessage.NOT_FOUND("schema"));

    if (validatedBody.parentId) {
      const checkParrent = await this.table.findUnique({ where: { id: validatedBody.parentId } });
      if (!checkParrent) throw new ResponseError(ErrorResponseMessage.NOT_FOUND("comment"));
    }

    return this.table.create({
      data: {
        body: validatedBody.body,
        userId: user.id,
        destinationId: validatedBody.schema === "destinations" ? validatedBody.schemaId : undefined,
        storyId: validatedBody.schema === "stories" ? validatedBody.schemaId : undefined,
        traditionId: validatedBody.schema === "traditions" ? validatedBody.schemaId : undefined, 
        parentId: validatedBody.parentId,
      },
      select: this.response.POST,
    });
  }
  static async DELETE(user: UserPayload, id: z.infer<typeof this.validation.DELETE>) {
    const validatedId = Validation.validate(this.validation.DELETE, id);
    const chechItem = await this.table.findFirst({ where: { id: validatedId }, select: { id: true, userId: true } });
    if (!chechItem) throw new ResponseError(ErrorResponseMessage.NOT_FOUND("comment"));
    if (user.id !== chechItem.userId) throw new ResponseError(ErrorResponseMessage.FORBIDDEN());
    return this.table.findUnique({
      where: {
        id: validatedId,
      },
      select: this.response.DELETE,
    });
  }
}
