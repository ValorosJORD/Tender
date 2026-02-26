import { z } from 'zod';

export const CreateHabitSchema = z.object({
  name: z.string().min(1, 'Name is required').max(50, 'Name must be 50 characters or less'),
  category: z.enum(['health', 'fitness', 'mindfulness', 'learning', 'social']),
  targetFrequency: z
    .number()
    .min(1, 'Must happen at least one a week')
    .max(7, 'Cannot happen more than twice a day'),
  statBoost: z.enum(['happiness', 'hunger', 'energy']),
});

export const GetHabitsSchema = z.object({
  category: z.enum(['health', 'fitness', 'mindfulness', 'learning', 'social']).optional(),
});
