import { z, TypeOf } from "zod";
export const GetMessageHandlerSchema = z.object({
  params: z
    .object({
      id: z.string({ required_error: "Id must be provided" }),
    })
    .strict(),
});

export type GetMessageHandlerInput = TypeOf<typeof GetMessageHandlerSchema>;

export const SendMessageHandlerSchema = z.object({
  params: z
    .object({
      id: z.string({ required_error: "Id must be provided" }),
    })
    .strict(),
  body: z
    .object({
      text: z.string().optional(),
      image: z
        .string()
        .optional()
        .refine(
          (val) => {
            if (!val) return true; // Optional field
            // Allow both URLs and base64 data URLs
            return (
              val.startsWith("http://") ||
              val.startsWith("https://") ||
              val.startsWith("data:image/")
            );
          },
          {
            message: "Image must be a valid URL or base64 data URL",
          },
        ),
    })
    .strict()
    .refine((data) => data.text || data.image, {
      message: "Either text or image must be provided",
    }),
});

export type SendMessageHandlerInput = TypeOf<typeof SendMessageHandlerSchema>;
