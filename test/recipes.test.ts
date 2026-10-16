import { describe, expect, it } from 'vitest';
import { parseIngredients, validateRecipe } from '../src/recipes';

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
});

describe('pilot (orquestador S15b)', () => {
  it('fails on purpose until fixed', () => {
    expect(parseIngredients('Ajo')).toEqual(['AJO']);
  });
});
