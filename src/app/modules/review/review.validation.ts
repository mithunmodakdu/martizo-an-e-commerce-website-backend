import z from "zod";
import { EReviewStatus, EVoteType } from "./review.interface";

const reviewImageZodSchema = z.object({
  url: z.url(),
  publicId: z.string().optional(),
});

export const createReviewZodSchema = z.object({
  productId: z.string({ message: "Product id is required" }),
  rating: z
    .number({ message: "Rating is required" })
    .min(1, "Rating must be at least 1")
    .max(5, "Rating cannot exceed 5"),
  title: z.string().max(120).optional(),
  comment: z
    .string({ message: "Comment is required" })
    .min(5, "Comment must be at least 5 characters")
    .max(2000),
  images: z
    .array(reviewImageZodSchema)
    .max(5, "Maximum 5 images allowed")
    .optional(),
});

export const updateReviewZodSchema = z.object({
  rating: z
    .number({ message: "Rating is required" })
    .min(1, "Rating must be at least 1")
    .max(5, "Rating cannot exceed 5")
    .optional(),
  title: z.string().max(120).optional(),
  comment: z
    .string({ message: "Comment is required" })
    .min(5, "Comment must be at least 5 characters")
    .max(2000)
    .optional(),
  images: z
    .array(reviewImageZodSchema)
    .max(5, "Maximum 5 images allowed")
    .optional(),
});

export const voteReviewZodSchema = z.object({
  voteType: z.enum([EVoteType.HELPFUL, EVoteType.UNHELPFUL], {message: "Vote type must be either HELPFUL or UNHELPFUL."})
})

export const moderateReviewZodSchema = z.object({
  status: z.enum([EReviewStatus.APPROVED, EReviewStatus.REJECTED], {message: "Review status must be either APPROVED or REJECTED"})
})

export const addAdminReplyZodSchema = z.object({
  comment: z.string({message:  'Reply comment is required'}).min(2).max(1000)
})
