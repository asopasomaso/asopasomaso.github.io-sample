const ingredients = [
  { name: '鶏むね肉', carbs: 0, protein: 23.3, fat: 1.9 },
  { name: '卵', carbs: 0.3, protein: 12.2, fat: 10.2 },
  { name: 'オートミール', carbs: 66.1, protein: 13.7, fat: 5.7 },
  { name: '白米', carbs: 35.6, protein: 2.5, fat: 0.3 },
  { name: '玄米', carbs: 34.2, protein: 2.8, fat: 1.0 },
  { name: '鮭', carbs: 0.1, protein: 22.3, fat: 4.1 },
  { name: 'ブロッコリー', carbs: 5.2, protein: 4.3, fat: 0.5 },
  { name: '無脂肪ヨーグルト', carbs: 5.4, protein: 4.0, fat: 0.1 },
  { name: 'バナナ', carbs: 22.5, protein: 1.1, fat: 0.2 },
  { name: 'アーモンド', carbs: 20.7, protein: 19.6, fat: 51.8 },
];

const state = {
  currentMeal: [],
  savedMeals: [],
};

const ingredientSelect = document.getElementById('ingredient-select');
const ingredientTableBody = document.getElementById('ingredient-table-body');
const mealItems = document.getElementById('meal-items');
const ingredientCount = document.getElementById('ingredient-count');
const totalCarbs = document.getElementById('total-carbs');
const totalProtein = document.getElementById('total-protein');
const totalFat = document.getElementById('total-fat');
const saveMealButton = document.getElementById('save-meal');
const savedMeals = document.getElementById('saved-meals');
const savedCount = document.getElementById('saved-count');
const mealNameInput = document.getElementById('meal-name');
const mealTimeInput = document.getElementById('meal-time');

function formatMacro(value) {
  return value.toFixed(1);
}

function renderIngredientOptions() {
  ingredientSelect.innerHTML = ingredients
    .map((ingredient, index) => `<option value="${index}">${ingredient.name}</option>`)
    .join('');
}

function renderIngredientTable() {
  ingredientTableBody.innerHTML = ingredients
    .map(
      (item) => `
        <tr>
          <td>${item.name}</td>
          <td>${formatMacro(item.carbs)} g</td>
          <td>${formatMacro(item.protein)} g</td>
          <td>${formatMacro(item.fat)} g</td>
        </tr>
      `,
    )
    .join('');
}

function calcTotals(items) {
  return items.reduce(
    (total, item) => {
      total.carbs += item.carbs;
      total.protein += item.protein;
      total.fat += item.fat;
      return total;
    },
    { carbs: 0, protein: 0, fat: 0 },
  );
}

function renderCurrentMeal() {
  const template = document.getElementById('meal-item-template');
  mealItems.innerHTML = '';

  state.currentMeal.forEach((item, index) => {
    const clone = template.content.cloneNode(true);
    clone.querySelector('.name').textContent = item.name;
    clone.querySelector('.macro-line').textContent = `炭水化物 ${formatMacro(item.carbs)}g / タンパク質 ${formatMacro(item.protein)}g / 脂質 ${formatMacro(item.fat)}g`;
    clone.querySelector('.remove-btn').addEventListener('click', () => {
      state.currentMeal.splice(index, 1);
      renderCurrentMeal();
    });
    mealItems.appendChild(clone);
  });

  const totals = calcTotals(state.currentMeal);
  totalCarbs.textContent = formatMacro(totals.carbs);
  totalProtein.textContent = formatMacro(totals.protein);
  totalFat.textContent = formatMacro(totals.fat);
  ingredientCount.textContent = `${state.currentMeal.length} 品目`;
}

function renderSavedMeals() {
  if (state.savedMeals.length === 0) {
    savedMeals.innerHTML = '<p class="description">まだ保存されたメニューはありません。</p>';
    savedCount.textContent = '0 件';
    return;
  }

  savedMeals.innerHTML = state.savedMeals
    .map((meal) => {
      const itemNames = meal.items.map((item) => item.name).join(' / ');
      return `
        <div class="saved-card">
          <h3>${meal.name}</h3>
          <p>時間: ${meal.time}</p>
          <p>食材: ${itemNames}</p>
          <p>炭水化物 ${formatMacro(meal.total.carbs)}g ・ タンパク質 ${formatMacro(meal.total.protein)}g ・ 脂質 ${formatMacro(meal.total.fat)}g</p>
        </div>
      `;
    })
    .join('');

  savedCount.textContent = `${state.savedMeals.length} 件`;
}

function addIngredient() {
  const selected = ingredients[Number(ingredientSelect.value)];
  if (!selected) return;

  state.currentMeal.push({ ...selected });
  renderCurrentMeal();
}

function saveMeal() {
  if (state.currentMeal.length === 0) {
    window.alert('食材を1つ以上追加してください。');
    return;
  }

  const name = mealNameInput.value.trim() || 'カスタムメニュー';
  const time = mealTimeInput.value || '--:--';
  const total = calcTotals(state.currentMeal);

  state.savedMeals.unshift({
    name,
    time,
    items: [...state.currentMeal],
    total,
  });

  state.currentMeal = [];
  mealNameInput.value = '';
  renderCurrentMeal();
  renderSavedMeals();
}

function init() {
  renderIngredientOptions();
  renderIngredientTable();
  renderCurrentMeal();
  renderSavedMeals();

  document.getElementById('add-ingredient').addEventListener('click', addIngredient);
  saveMealButton.addEventListener('click', saveMeal);
}

init();
