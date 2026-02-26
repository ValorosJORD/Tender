import { Request, Response } from 'express';
import { Habit } from '../entities/Habit.js';
import { habitIdCounter, habits } from '../models/habits.js';
import { pets } from '../models/pets.js';
import { computeStage } from '../utils/computeStage.js';
import { CreateHabitSchema, GetHabitsSchema } from '../validators/habits.js';
import { ValidateIdSchema } from '../validators/pets.js';

export function createHabit(req: Request, res: Response): void {
  const result = CreateHabitSchema.safeParse(req.body);
  const paramResult = ValidateIdSchema.safeParse(req.params);

  if (!result.success) {
    res.status(400).json({ errors: result.error });
    return;
  }

  if (!paramResult.success) {
    res.status(400).json({ errors: paramResult.error });
    return;
  }

  const { petId } = paramResult.data;
  const pet = pets.find((u) => u.id === petId);

  if (computeStage(petId).name === 'Cooked') {
    res.status(400).json({ message: 'This pet has been cooked. Adopt a new one.' });
    return;
  }

  if (!pet) {
    res.status(404).json({ error: 'Pet Not Found.' });
    return;
  }

  const newHabit: Habit = {
    id: habitIdCounter.value++,
    petId: petId,
    name: result.data.name,
    category: result.data.category,
    targetFrequency: result.data.targetFrequency,
    statBoost: result.data.statBoost,
  };

  habits.push(newHabit);
  res.status(201).json(newHabit);
}

export function getHabits(req: Request, res: Response): void {
  const result = GetHabitsSchema.safeParse(req.query);
  const paramResult = ValidateIdSchema.safeParse(req.params);

  if (!result.success) {
    res.status(400).json({ errors: result.error });
    return;
  }

  if (!paramResult.success) {
    res.status(400).json({ errors: paramResult.error });
    return;
  }

  const { petId } = paramResult.data;
  const pet = pets.find((u) => u.id === petId);

  if (!pet) {
    res.status(404).json({ error: 'Pet Not Found.' });
    return;
  }

  const { category } = result.data;

  let filtered = [...habits].filter((u) => u.petId === petId);
  if (category) {
    filtered = filtered.filter((u) => u.category === category);
  }

  res.status(200).json(filtered);
}
