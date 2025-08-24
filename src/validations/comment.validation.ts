import z from "zod";

export class CommentValidations {
  static readonly POST = z.object({
    body: z.string().min(1).max(400).trim(),
    schemaId: z.string().cuid(),
    schema: z.enum(["destinations", "traditions", "stories"]),
    parentId: z.string().cuid().nullable().optional(),
  });

  static readonly DELETE = z.string().cuid();
}
