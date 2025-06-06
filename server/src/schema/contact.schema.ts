import { z, TypeOf } from "zod";
export const AddContactHandlerSchema = z.object({
  body: z
    .object({
      email: z
        .string({ required_error: "Email must be provided" })
        .email("Must be a valid email"),
    })
    .strict(),
});
export type AddContactHandlerInput = TypeOf<typeof AddContactHandlerSchema>;

export const AcceptContactRequestHandlerSchema = z.object({
  params: z
    .object({
      id: z.string({ required_error: "Id must be provided" }),
    })
    .strict(),
});
export type AcceptContactRequestHandlerInput = TypeOf<
  typeof AcceptContactRequestHandlerSchema
>;
