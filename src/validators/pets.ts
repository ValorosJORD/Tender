import { z } from 'zod';

export const CreatePetSchema = z.object({
  name: z.string().min(1, 'Name is required').max(20, 'Name must be 20 characters or less'),
  species: z.enum(['cat', 'dragon', 'blob', 'plant', 'rock']),
});

export const GetPetsQuerySchema = z.object({
  species: z.enum(['cat', 'dragon', 'blob', 'plant', 'rock']).optional(),
  minHappiness: z.string().transform(Number).optional(),
});

export const ValidateIdSchema = z.object({
  petId: z.string().transform(Number),
});

export const UpdatePetNameSchema = z.object({
  name: z.string().min(1, 'Name is required').max(20, 'Name must be 20 characters or less'),
});

export type CreatePetBody = z.infer<typeof CreatePetSchema>;
