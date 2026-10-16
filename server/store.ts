import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';
import type { NewRecipe, Recipe } from '../src/recipes';

/** Tiny JSON-file store. Seeds from `seedFile` the first time it is read. */
export class RecipeStore {
  constructor(
    private readonly file: string,
    private readonly seedFile: string,
  ) {}

  all(): Recipe[] {
    if (!existsSync(this.file)) {
      mkdirSync(dirname(this.file), { recursive: true });
      writeFileSync(this.file, readFileSync(this.seedFile, 'utf8'));
    }
    return JSON.parse(readFileSync(this.file, 'utf8')) as Recipe[];
  }

  add(input: NewRecipe): Recipe {
    const recipes = this.all();
    const recipe: Recipe = { id: Math.max(0, ...recipes.map((r) => r.id)) + 1, ...input };
    writeFileSync(this.file, JSON.stringify([...recipes, recipe], null, 2) + '\n');
    return recipe;
  }
}
