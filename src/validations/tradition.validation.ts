import z from "zod";

export class TraditionValidations {
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
    sortBy: z.enum(["favorited", "liked", "createdAt", "updatedAt"]).optional().default("createdAt"),
    orderBy: z.enum(["asc", "desc"]).optional().default("desc"),
  });
  static readonly POST = z.object({
    name: z.string().min(2).max(400).trim(),
    content: z.string().min(10).max(1000000).trim(),
    coverId: z.string().cuid().nullable().optional(),
    isPublished: z.boolean().optional(),
  });
  static readonly PATCH = z.object({
    name: z.string().min(2).max(400).trim().optional(),
    content: z.string().min(10).max(1000000).trim().optional(),
    coverId: z.string().cuid().nullable().optional(),
    isPublished: z.boolean().optional(),
  });
  static readonly DELETE = z.string().cuid();
}
