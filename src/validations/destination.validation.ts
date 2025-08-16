import z from "zod";

export class DestinationValidations {
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
    sortBy: z.enum(["price", "createdAt", "updatedAt"]).optional().default("createdAt"),
    orderBy: z.enum(["asc", "desc"]).optional().default("desc"),
  });
}
