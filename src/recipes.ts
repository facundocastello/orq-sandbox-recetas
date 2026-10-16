export interface Recipe {
  id: number;
  name: string;
  ingredients: string[];
}

export type NewRecipe = Omit<Recipe, 'id'>;

/** Parse the "a, b , c" ingredients field into a clean, de-duplicated list. */
export function parseIngredients(raw: string): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const part of raw.split(',')) {
    const item = part.trim().toLowerCase();
    if (item && !seen.has(item)) {
      seen.add(item);
      out.push(item);
    }
  }
  return out;
}

/** Returns an error message, or null when the recipe is valid. */
export function validateRecipe(input: Partial<NewRecipe>): string | null {
  if (typeof input.name !== 'string' || input.name.trim().length === 0)
    return 'El nombre es obligatorio';
  if (input.name.trim().length > 80) return 'El nombre es demasiado largo';
  if (!Array.isArray(input.ingredients) || input.ingredients.length === 0)
    return 'Falta al menos un ingrediente';
  if (!input.ingredients.every((i) => typeof i === 'string' && i.trim().length > 0))
    return 'Ingrediente inválido';
  return null;
}
