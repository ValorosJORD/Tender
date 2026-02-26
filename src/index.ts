import 'dotenv/config';
import express, { Express } from 'express';

const app: Express = express();

app.use(express.json());

// --- Your routes will go below this line ---

import { createPet, deletePet, getPet, getPets, updatePetName } from './controllers/pets.js';

app.post('/pets', createPet);
app.get('/pets', getPets);
app.get('/pets/:petId', getPet);
app.put('/pets/:petId', updatePetName);
app.delete('/pets/:petId', deletePet);

import { createHabit, getHabits } from './controllers/habits.js';

app.post('/pets/:petId/habits', createHabit);
app.get('/pets/:petId/habits', getHabits);

import { createLog } from './controllers/logs.js';

app.post('/pets/:petId/logs', createLog);

// --- Your routes will go above this line ---

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Tender listening on http://localhost:${PORT}`);
});
