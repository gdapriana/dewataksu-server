import z from "zod";

export class BookmarkValidations {
  static readonly POST = z.object({
    userId: z.string().cuid(),
    schema: z.enum(["destinations", "traditions", "stories"]),
    schemaId: z.string().cuid(),
  });
  static readonly DELETE = z.string().cuid();
}
