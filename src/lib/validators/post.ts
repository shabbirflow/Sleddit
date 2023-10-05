import { TypeOf, z } from "zod";

export const PostValidator = z.object({
    title: z.string().min(3, "title should be longer than 3 characters").max(128, "title should be less than 3 characters"),
    subredditId: z.string(),
    content: z.any()
})

export type PostCreateRequest = z.infer<typeof PostValidator>