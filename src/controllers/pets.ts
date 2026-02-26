import { Request, Response } from 'express';
import { Pet } from '../entities/Pet.js';
import { Stage } from '../entities/Stage.js';
import { petIdCounter, pets } from '../models/pets.js';
import { computeStage } from '../utils/computeStage.js';
import {
  CreatePetSchema,
  GetPetsQuerySchema,
  UpdatePetNameSchema,
  ValidateIdSchema,
} from '../validators/pets.js';

export function createPet(req: Request, res: Response): void {
  const result = CreatePetSchema.safeParse(req.body);

  if (!result.success) {
    res.status(400).json({ errors: result.error });
    return;
  }

  const newPet: Pet = {
    id: petIdCounter.value++,
    name: result.data.name,
    species: result.data.species,
    happiness: 50,
    hunger: 50,
    energy: 50,
    lastFedAt: new Date(),
  };

  const newStage: Stage = computeStage(newPet.id);

  pets.push(newPet);
  res.status(201).json({ newPet, newStage });
}

export function getPets(req: Request, res: Response): void {
  const result = GetPetsQuerySchema.safeParse(req.query);

  if (!result.success) {
    res.status(400).json({ errors: result.error });
    return;
  }

  const { species, minHappiness } = result.data;

  let filtered = [...pets];
  if (species) {
    filtered = filtered.filter((u) => u.species === species);
  }

  if (minHappiness) {
    filtered = filtered.filter((u) => u.happiness >= minHappiness);
  }

  const filterWithStage: { pet: Pet; stage: Stage }[] = [];

  for (let i = 0; i < filtered.length; ++i) {
    filterWithStage.push({ pet: filtered[i], stage: computeStage(filtered[i].id) });
  }

  res.status(200).json(filterWithStage);
}

export function getPet(req: Request, res: Response): void {
  const result = ValidateIdSchema.safeParse(req.params);

  if (!result.success) {
    res.status(400).json({ errors: result.error });
    return;
  }

  const { petId } = result.data;
  const pet = pets.find((u) => u.id === petId);

  if (!pet) {
    res.status(404).json({ error: 'Pet Not Found.' });
    return;
  }

  const newStage: Stage = computeStage(pet.id);

  res.status(200).json({ pet, newStage });
}

export function updatePetName(req: Request, res: Response): void {
  const paramResult = ValidateIdSchema.safeParse(req.params);
  const result = UpdatePetNameSchema.safeParse(req.body);

  if (!paramResult.success) {
    res.status(400).json({ errors: paramResult.error });
    return;
  }

  if (!result.success) {
    res.status(400).json({ errors: result.error });
    return;
  }

  const { petId } = paramResult.data;
  const pet = pets.find((u) => u.id === petId);

  if (!pet) {
    res.status(404).json({ error: 'Pet Not Found.' });
    return;
  }

  pet.name = result.data.name;

  res.status(200).end();
}

export function deletePet(req: Request, res: Response): void {
  const result = ValidateIdSchema.safeParse(req.params);

  if (!result.success) {
    res.status(400).json({ errors: result.error });
    return;
  }

  const { petId } = result.data;
  const petIndex = pets.findIndex((u) => u.id === petId);

  if (petIndex < 0) {
    res.status(404).json({ error: 'Pet Not Found.' });
    return;
  }

  pets.splice(petIndex, 1);

  res.status(204).end();
}
