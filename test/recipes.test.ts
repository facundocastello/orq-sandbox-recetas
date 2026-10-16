import { describe, expect, it } from 'vitest';
import { parseIngredients, validateRecipe } from '../src/recipes';

describe('parseIngredients', () => {
  it('trims, lowercases and de-duplicates', () => {
    expect(parseIngredients(' Papa, huevo ,papa,, Cebolla ')).toEqual(['papa', 'huevo', 'cebolla']);
  });
});

describe('orq U6 probe', () => {
  it('fails on purpose', () => {
    expect(parseIngredients('papa')).toEqual(['batata']);
  });
});

describe('validateRecipe', () => {
  it('requires a name and at least one ingredient', () => {
    expect(validateRecipe({ name: '', ingredients: ['x'] })).toBe('El nombre es obligatorio');
    expect(validateRecipe({ name: 'Flan', ingredients: [] })).toBe('Falta al menos un ingrediente');
    expect(validateRecipe({ name: 'Flan', ingredients: ['huevo'] })).toBeNull();
  });
});
