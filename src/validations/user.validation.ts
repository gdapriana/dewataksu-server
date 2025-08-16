import { z } from "zod";

export class UserAuthValidation {
  static readonly LOGIN = z.object({
    name: z
      .string()
      .min(3, "Username must be at least 3 characters long")
      .max(30, "Username must be at most 30 characters long")
      .trim(),
    password: z
      .string()
      // .min(8, "Password must be at least 8 characters long")
      // .max(128, "Password must be at most 128 characters long")
      // .regex(
      //   /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).+$/,
      //   "Password must include at least one uppercase letter, one lowercase letter, and one number"
      // )
      .trim(),
  });

  static readonly REGISTER = z.object({
    email: z
      .string()
      .email("Invalid email format")
      .optional()
      .transform((val) => val?.trim()),
    name: z
      .string()
      .min(3, "Username must be at least 3 characters long")
      .max(30, "Username must be at most 30 characters long")
      .trim(),
    fullName: z
      .string()
      .min(3, "Full name must be at least 3 characters long")
      .max(50, "Full name must be at most 50 characters long")
      .optional()
      .transform((val) => val?.trim()),
    password: z
      .string()
      // .min(8, "Password must be at least 8 characters long")
      // .max(128, "Password must be at most 128 characters long")
      // .regex(
      //   /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).+$/,
      //   "Password must include at least one uppercase letter, one lowercase letter, and one number"
      // )
      .trim(),
    bio: z
      .string()
      .max(200, "Bio must be at most 200 characters long")
      .optional()
      .transform((val) => val?.trim()),
  });
}

export class UserValidation {
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
    role: z.enum(["USER", "ADMIN"]).optional(),
    sortBy: z.enum(["createdAt", "updatedAt"]).optional().default("createdAt"),
    orderBy: z.enum(["asc", "desc"]).optional().default("desc"),
  });

  static readonly PATCH = z.object({
    fullName: z
      .string()
      .trim()
      .min(3, "Full name must be at least 3 characters long")
      .max(50, "Full name must be at most 50 characters long")
      .optional()
      .transform((val) => (val?.trim() === "" ? undefined : val)),
    bio: z
      .string()
      .trim()
      .max(200, "Bio must be at most 200 characters long")
      .optional()
      .transform((val) => (val?.trim() === "" ? undefined : val)),
    profileImageId: z
      .string()
      .cuid("Invalid profile image ID format")
      .optional(),
  });

  static readonly DELETE = z.string().cuid();
}
