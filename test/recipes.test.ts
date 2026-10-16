import { describe, expect, it } from 'vitest';
import {
  filterByIngredient,
  parseIngredients,
  parseRecipeRoute,
  recipeCountLabel,
  toggleFavorite,
  validateRecipe,
} from '../src/recipes';

describe('parseIngredients', () => {
  it('trims, lowercases and de-duplicates', () => {
    expect(parseIngredients(' Papa, huevo ,papa,, Cebolla ')).toEqual(['papa', 'huevo', 'cebolla']);
  });
});

describe('validateRecipe', () => {
  it('requires a name and at least one ingredient', () => {
    expect(validateRecipe({ name: '', ingredients: ['x'] })).toBe('El nombre es obligatorio');
    expect(validateRecipe({ name: 'Flan', ingredients: [] })).toBe('Falta al menos un ingrediente');
    expect(validateRecipe({ name: 'Flan', ingredients: ['huevo'] })).toBeNull();
  });

  it('ignores surrounding spaces when checking the 80-character name limit', () => {
    const name = 'a'.repeat(80);
    expect(validateRecipe({ name: `  ${name}  `, ingredients: ['x'] })).toBeNull();
    expect(validateRecipe({ name: `  ${name}a  `, ingredients: ['x'] })).toBe(
      'El nombre es demasiado largo',
    );
  });
});

describe('recipeCountLabel', () => {
  it('shows the empty state, singular and plural', () => {
    expect(recipeCountLabel(0)).toBe('No hay recetas');
    expect(recipeCountLabel(1)).toBe('1 receta');
    expect(recipeCountLabel(3)).toBe('3 recetas');
  });
});

describe('parseRecipeRoute', () => {
  it('extracts the id from #/receta/:id and ignores other hashes', () => {
    expect(parseRecipeRoute('#/receta/2')).toBe(2);
    expect(parseRecipeRoute('')).toBeNull();
    expect(parseRecipeRoute('#/receta/abc')).toBeNull();
  });
});

describe('filterByIngredient', () => {
  const recipes = [
    { id: 1, name: 'Tortilla', ingredients: ['papa', 'huevo'] },
    { id: 2, name: 'Guiso', ingredients: ['lentejas', 'Cebolla'] },
  ];

  it('matches partially and case-insensitively', () => {
    expect(filterByIngredient(recipes, 'HUE').map((r) => r.id)).toEqual([1]);
    expect(filterByIngredient(recipes, 'ceb').map((r) => r.id)).toEqual([2]);
    expect(filterByIngredient(recipes, 'pollo')).toEqual([]);
  });

  it('returns everything for a blank query', () => {
    expect(filterByIngredient(recipes, '  ')).toEqual(recipes);
  });
});

describe('toggleFavorite', () => {
  it('adds a missing id and removes an existing one', () => {
    expect(toggleFavorite([], 2)).toEqual([2]);
    expect(toggleFavorite([1, 2, 3], 2)).toEqual([1, 3]);
  });
});
