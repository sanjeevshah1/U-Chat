import { TypeOf, z } from "zod";
export const SignUpSchema = z.object({
  body: z
    .object({
      email: z
        .string({ required_error: "Email is required" })
        .email("Must be a valid email."),
      fullname: z.string({ required_error: "Fullname is required" }),
      password: z
        .string({ required_error: "Password is required" })
        .min(6, "Should be alteast 6 characters"),
      confirmPassword: z
        .string({ required_error: "Confirm Password is required" })
        .min(6, "Should be alteast 6 characters"),
      profilePicture: z.string().optional(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords do not match",
      path: ["passwordConfirmation"],
    }),
});

export type SignUpSchemaType = TypeOf<typeof SignUpSchema>;

export const LoginSchema = z.object({
  body: z.object({
    email: z
      .string({ required_error: "Email is required" })
      .email("Must be a valid email."),
    password: z
      .string({ required_error: "Password is required" })
      .min(6, "Should be alteast 6 characters"),
  }),
});

export type LoginSchemaType = TypeOf<typeof LoginSchema>;

export const deleteUserSchema = z.object({
  body: z.object({
    email: z
      .string({
        required_error: "Email is required",
      })
      .email("Not a valid email"),
    password: z
      .string({
        required_error: "Password is required",
      })
      .min(6, "Password must be at least 6 characters"),
  }),
});

export type DeleteUserInput = TypeOf<typeof deleteUserSchema>;

export const updateProfileSchema = z.object({
  body: z.object({
    updates: z
      .object({
        email: z.string().email("Not a valid email").optional(),
        password: z
          .string()
          .min(6, "Password must be atleast 6 characters")
          .optional(),
        name: z.string().optional(),
        bio: z.string().optional(),
      })
      .refine((data) => Object.keys(data).length > 0, {
        message: "Atleast one update should be provided.",
      }),
  }),
});

export type UpdateProfileSchemaType = TypeOf<typeof updateProfileSchema>;

export const SearchUserSchema = z.object({
  query: z.object({
    q: z.string().min(1, "Query is required"),
  }),
});
export type SearchUserInput = TypeOf<typeof SearchUserSchema>;
