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

  it('ignores surrounding spaces when checking the 80-character name limit', () => {
    const name = 'a'.repeat(80);
    expect(validateRecipe({ name: `  ${name}  `, ingredients: ['x'] })).toBeNull();
    expect(validateRecipe({ name: `  ${name}a  `, ingredients: ['x'] })).toBe(
      'El nombre es demasiado largo',
    );
  });
});
