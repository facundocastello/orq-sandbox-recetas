import express from 'express';
import { fileURLToPath } from 'node:url';
import { validateRecipe, type NewRecipe } from '../src/recipes';
import { RecipeStore } from './store';

const root = fileURLToPath(new URL('..', import.meta.url));
const store = new RecipeStore(
  process.env.DATA_FILE ?? `${root}data/recipes.json`,
  `${root}data/seed.json`,
);

const app = express();
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ ok: true });
});

app.get('/api/recipes', (_req, res) => {
  res.json(store.all());
});

app.get('/api/recipes/:id', (req, res) => {
  const recipe = store.get(Number(req.params.id));
  if (!recipe) {
    res.status(404).json({ error: 'Receta no encontrada' });
    return;
  }
  res.json(recipe);
});

app.post('/api/recipes', (req, res) => {
  const body = (req.body ?? {}) as Partial<NewRecipe>;
  const error = validateRecipe(body);
  if (error) {
    res.status(400).json({ error });
    return;
  }
  res.status(201).json(store.add({ name: body.name!.trim(), ingredients: body.ingredients! }));
});

const port = Number(process.env.API_PORT ?? 3001);
app.listen(port, '127.0.0.1', () => {
  console.log(`api listening on http://127.0.0.1:${port}`);
});
