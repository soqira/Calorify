// Будущие endpoints:
//   GET /api/meals?date=YYYY-MM-DD → getMealsByDate()
//   GET /api/meals/days → getMealDays()
//   POST /api/meals → createMeal()
//   PUT /api/meals/:id → updateMeal()
//   DELETE /api/meals/:id → deleteMeal()
//   POST /api/meals/:id/photo → uploadMealPhoto()

import type { MealEntry, CreateMealDTO } from "./mealTypes";

const STORAGE_KEY = "calorify_meals";

function readAll(): MealEntry[] {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? (JSON.parse(raw) as MealEntry[]) : [];
}

function writeAll(meals: MealEntry[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(meals));
}

//sumarry of all foods in modal
export function calcTotalCalories(foods: MealEntry["foods"]): number {
  return foods.reduce((sum, f) => sum + f.calories, 0);
}

//sort in left sb
export async function getMealDays(userId: string): Promise<string[]> {
  const all = readAll().filter((m) => m.userId === userId);
  const days = [...new Set(all.map((m) => m.date))];
  return days.sort((a, b) => b.localeCompare(a));
}

//sort in feed
export async function getMealsByDate(
  userId: string,
  date: string,
): Promise<MealEntry[]> {
  const all = readAll();
  return (
    all
      // can be inverted but it cause bugs
      .filter((m) => m.userId === userId && m.date === date)
      .sort((a, b) => a.createdAt.localeCompare(b.createdAt))
  );
}

//create new food object with unique UUID (+ удаляет ненужное)
export async function createMeal(dto: CreateMealDTO): Promise<MealEntry> {
  const entry: MealEntry = {
    ...dto,
    id: crypto.randomUUID(),
    totalCalories: calcTotalCalories(dto.foods),
    createdAt: new Date().toISOString(),
  };
  //adding meal into the localStorage
  writeAll([...readAll(), entry]);
  return entry;
}

//update meal by ID + пересчет калорий
export async function updateMeal(
  id: string,
  dto: Partial<CreateMealDTO>,
): Promise<MealEntry> {
  const all = readAll();
  const updated = all.map((m) => {
    if (m.id !== id) return m;
    const merged = { ...m, ...dto };
    return { ...merged, totalCalories: calcTotalCalories(merged.foods) };
  });
  writeAll(updated);
  return updated.find((m) => m.id === id)!;
}

export async function deleteMeal(id: string): Promise<void> {
  writeAll(readAll().filter((m) => m.id !== id));
}

export async function uploadMealPhoto(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
