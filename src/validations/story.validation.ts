import z from "zod";

export class StoryValidations {
  static readonly GET = z.string();
  static readonly QUERY = z.object({
    page: z
      .string()
      .regex(/^\d+$/, "Page must be a positive integer")
      .transform((val) => Number(val))
      .refine((val) => val > 0, "Page must be greater than 0")
      .optional(),
    limit: z
      .string()
      .regex(/^\d+$/, "Limit must be a positive integer")
      .transform((val) => Number(val))
      .refine((val) => val > 0, "Limit must be greater than 0")
      .optional(),
    search: z.string().optional(),
    isPublished: z.enum(["0", "1"]).optional(),
    sortBy: z.enum(["liked", "favorited", "createdAt", "updatedAt"]).optional().default("createdAt"),
    orderBy: z.enum(["asc", "desc"]).optional().default("desc"),
  });
  static readonly POST = z.object({
    name: z
      .string({
        required_error: "Name is required",
        invalid_type_error: "Name must be a string",
      })
      .trim(),
    content: z.string().trim(),
    coverId: z.string().trim().cuid("Invalid coverId format").optional(),
    isPublished: z.boolean().optional(),
  });
  static readonly PATCH = z.object({
    name: z
      .string({
        required_error: "Name is required",
        invalid_type_error: "Name must be a string",
      })
      .trim()
      .optional(),
    content: z.string().trim().optional(),
    coverId: z.string().trim().cuid("Invalid coverId format").nullable().optional(),
    isPublished: z.boolean().optional(),
  });
  static readonly DELETE = z.string().cuid();
}
