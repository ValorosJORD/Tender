import { Request, Response } from 'express';
import { Log } from '../entities/Log.js';
import { habits } from '../models/habits.js';
import { logIdCounter, logs } from '../models/logs.js';
import { pets } from '../models/pets.js';
import { computeStage } from '../utils/computeStage.js';
import { CreateLogSchema } from '../validators/logs.js';
import { ValidateIdSchema } from '../validators/pets.js';

export function createLog(req: Request, res: Response): void {
  const result = CreateLogSchema.safeParse(req.body);
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

  const habitId = result.data.habitId;
  const habit = habits.find((u) => u.id === habitId);

  if (!habit) {
    res.status(404).json({ error: 'Habit Not Found.' });
    return;
  }

  if (habit.petId != petId) {
    res.status(400).json({ message: 'Habit does not belong to this pet' });
    return;
  }

  pet.lastFedAt = new Date();

  if (habit.statBoost === 'happiness') {
    if (pet.happiness <= 90) {
      pet.happiness += 10;
    } else {
      pet.happiness = 100;
    }
  } else if (habit.statBoost === 'energy') {
    if (pet.energy <= 90) {
      pet.energy += 10;
    } else {
      pet.energy = 100;
    }
  } else if (habit.statBoost === 'hunger') {
    if (pet.hunger <= 90) {
      pet.hunger += 10;
    } else {
      pet.hunger = 100;
    }
  }

  const newLog: Log = {
    id: logIdCounter.value++,
    petId: petId,
    habitId: habitId,
    date: new Date().toISOString(),
    note: result.data.note,
  };

  logs.push(newLog);
  res.status(201).json(newLog);
}
