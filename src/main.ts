import './style.css';
import {
  filterByIngredient,
  parseIngredients,
  parseRecipeRoute,
  recipeCountLabel,
  toggleFavorite,
  type Recipe,
} from './recipes';

const list = document.querySelector<HTMLUListElement>('#list')!;
const count = document.querySelector<HTMLParagraphElement>('#count')!;
const form = document.querySelector<HTMLFormElement>('#add-form')!;
const errorBox = document.querySelector<HTMLParagraphElement>('#error')!;
const detail = document.querySelector<HTMLElement>('#detail')!;
const search = document.querySelector<HTMLInputElement>('#search')!;

const FAVORITES_KEY = 'favorites';

function loadFavorites(): number[] {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(FAVORITES_KEY) ?? '[]');
    return Array.isArray(parsed) ? parsed.filter((x): x is number => typeof x === 'number') : [];
  } catch {
    return [];
  }
}

function favoriteButton(id: number): HTMLButtonElement {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'fav';
  const paint = (on: boolean) => {
    btn.textContent = on ? '★' : '☆';
    btn.setAttribute('aria-pressed', String(on));
    btn.setAttribute('aria-label', on ? 'Quitar de favoritos' : 'Marcar favorito');
  };
  paint(loadFavorites().includes(id));
  btn.addEventListener('click', () => {
    const next = toggleFavorite(loadFavorites(), id);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(next));
    paint(next.includes(id));
  });
  return btn;
}

let all: Recipe[] = [];

function render(): void {
  count.textContent = recipeCountLabel(all.length);
  list.replaceChildren(
    ...filterByIngredient(all, search.value).map((r) => {
      const li = document.createElement('li');
      li.dataset.testid = 'recipe';
      const name = document.createElement('a');
      name.href = `#/receta/${r.id}`;
      name.textContent = r.name;
      const ingredients = document.createElement('span');
      ingredients.textContent = ` ${r.ingredients.join(', ')}`;
      li.append(favoriteButton(r.id), name, ingredients);
      return li;
    }),
  );
}

async function load(): Promise<void> {
  const res = await fetch('/api/recipes');
  all = (await res.json()) as Recipe[];
  render();
}

search.addEventListener('input', render);

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

async function showDetail(id: number): Promise<void> {
  const back = document.createElement('a');
  back.href = '#/';
  back.textContent = 'Volver';
  const res = await fetch(`/api/recipes/${id}`);
  if (!res.ok) {
    const missing = document.createElement('p');
    missing.textContent = 'Receta no encontrada';
    detail.replaceChildren(missing, back);
    return;
  }
  const recipe = (await res.json()) as Recipe;
  const title = document.createElement('h2');
  title.textContent = recipe.name;
  const ingredients = document.createElement('ul');
  ingredients.append(
    ...recipe.ingredients.map((i) => {
      const li = document.createElement('li');
      li.dataset.testid = 'detail-ingredient';
      li.textContent = i;
      return li;
    }),
  );
  detail.replaceChildren(title, ingredients, back);
}

function route(): void {
  const id = parseRecipeRoute(location.hash);
  const inDetail = id !== null;
  detail.hidden = !inDetail;
  form.hidden = inDetail;
  list.hidden = inDetail;
  count.hidden = inDetail;
  search.hidden = inDetail;
  errorBox.hidden = true;
  void (inDetail ? showDetail(id) : load());
}

window.addEventListener('hashchange', route);
route();
