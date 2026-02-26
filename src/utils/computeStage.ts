import { differenceInMilliseconds } from 'date-fns';
import { Stage } from '../entities/Stage.js';
import { logs } from '../models/logs.js';
import { pets } from '../models/pets.js';
import { NEGLECT_THRESHOLD_MS } from './config.js';

export function computeStage(petId: number): Stage {
  const pet = pets.find((u) => u.id === petId);
  if (pet && differenceInMilliseconds(new Date(), pet.lastFedAt) >= NEGLECT_THRESHOLD_MS) {
    return { name: 'Cooked', emoji: '🍗' };
  }

  const filter = logs.filter((u) => u.petId === petId);

  const logCount = filter.length;

  if (logCount >= 15) {
    return { name: 'Grown', emoji: '🐓' };
  } else if (logCount >= 5) {
    return { name: 'Growing', emoji: '🐥' };
  } else if (logCount >= 1) {
    return { name: 'Hatching', emoji: '🐣' };
  } else {
    return { name: 'Egg', emoji: '🥚' };
  }
}
