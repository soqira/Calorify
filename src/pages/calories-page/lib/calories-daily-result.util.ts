import type { MealEntry } from "../../../entities/meal/model/mealTypes";
import { MEAL_TYPE_META } from "../../../entities/meal/model/mealTypes";
import type { MealStat } from "../interfaces/calories-daily-result.interface";

export function calculateMealStats(meals: MealEntry[]): MealStat[] {
  const total = meals.reduce((s, m) => s + m.totalCalories, 0);

  if (total === 0) return [];

  return Object.entries(MEAL_TYPE_META)
    .map(([type, meta]) => {
      const typeMeals = meals.filter((m) => m.type === type);
      const calories = typeMeals.reduce((s, m) => s + m.totalCalories, 0);

      if (calories === 0) return null;

      const percent = Math.round((calories / total) * 100);

      const color =
        percent >= 40
          ? "#fd131f" // много — красный
          : percent >= 30
            ? "#fa8c16"
            : percent >= 20
              ? "#e4b636"
              : percent >= 10
                ? "#e0cc56"
                : "#5c9475"; // мало — зеленый

      return {
        type,
        label: meta.label,
        calories,
        percent,
        color,
      };
    })
    .filter(Boolean) as MealStat[];
}
