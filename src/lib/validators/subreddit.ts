import { TypeOf, z } from "zod";

export const subredditValidator = z.object({
  name: z.string().max(21).min(3),
});

export const subredditSubscriptionValidator = z.object({subredditId: z.string()})

export type createSubRedPayload = z.infer<typeof subredditValidator>
export type subRedSubscriptPayload = z.infer<typeof subredditSubscriptionValidator>