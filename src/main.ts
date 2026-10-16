import './style.css';
import { parseIngredients, recipeCountLabel, type Recipe } from './recipes';

const list = document.querySelector<HTMLUListElement>('#list')!;
const count = document.querySelector<HTMLParagraphElement>('#count')!;
const form = document.querySelector<HTMLFormElement>('#add-form')!;
const errorBox = document.querySelector<HTMLParagraphElement>('#error')!;

function render(recipes: Recipe[]): void {
  count.textContent = recipeCountLabel(recipes.length);
  list.replaceChildren(
    ...recipes.map((r) => {
      const li = document.createElement('li');
      li.dataset.testid = 'recipe';
      const name = document.createElement('strong');
      name.textContent = r.name;
      const ingredients = document.createElement('span');
      ingredients.textContent = ` ${r.ingredients.join(', ')}`;
      li.append(name, ingredients);
      return li;
    }),
  );
}

async function load(): Promise<void> {
  const res = await fetch('/api/recipes');
  render((await res.json()) as Recipe[]);
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const data = new FormData(form);
  const body = {
    name: String(data.get('name') ?? ''),
    ingredients: parseIngredients(String(data.get('ingredients') ?? '')),
  };
  void (async () => {
    const res = await fetch('/api/recipes', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      errorBox.hidden = false;
      errorBox.textContent = ((await res.json()) as { error: string }).error;
      return;
    }
    errorBox.hidden = true;
    form.reset();
    await load();
  })();
});

void load();
