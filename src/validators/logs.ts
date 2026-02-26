import { z } from 'zod';

export const CreateLogSchema = z.object({
  habitId: z.number(),
  note: z.string().max(200).optional(),
});
