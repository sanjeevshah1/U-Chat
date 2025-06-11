import { z, TypeOf } from "zod";
export const AddContactHandlerSchema = z.object({
  body: z
    .object({
      recipientId: z.string({ required_error: "Recipien id must be provided" }),
    })
    .strict(),
});
export type AddContactHandlerInput = TypeOf<typeof AddContactHandlerSchema>;

export const HandleContactRequestHandlerSchema = z.object({
  params: z
    .object({
      requestId: z.string({ required_error: "Request ID must be provided" }),
      action: z.enum(["accept", "reject"], {
        required_error: "Action must be either 'accept' or 'reject'",
      }),
    })
    .strict(),
});

export type HandleContactRequestHandlerInput = z.infer<
  typeof HandleContactRequestHandlerSchema
>;
