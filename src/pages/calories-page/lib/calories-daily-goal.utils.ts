import type { MealEntry } from "../../../entities/meal/model/mealTypes";
import type { ProgressResult } from "../interfaces/calories-daily-goal.interface";

export function calculateProgress(
  meals: MealEntry[],
  calorieGoal: number,
): ProgressResult {
  const totalToday = meals.reduce((sum, meal) => sum + meal.totalCalories, 0);

  const progressPct = Math.min(
    Math.round((totalToday / calorieGoal) * 100),
    100,
  );

  const progressColor =
    progressPct >= 100
      ? "#5c9475"
      : progressPct >= 75
        ? "#e0cc56"
        : progressPct >= 50
          ? "#e4b636"
          : progressPct >= 25
            ? "#fa8c16"
            : "#fd131f";

  return { totalToday, progressPct, progressColor };
}
