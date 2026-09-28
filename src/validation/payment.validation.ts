// src/validation/payment.validation.ts
import { z } from "zod";

const initiateRefundValidationSchema = z.object({
  reason: z.string().optional(),
});

export const PaymentValidation = {
  initiateRefundValidationSchema,
};
