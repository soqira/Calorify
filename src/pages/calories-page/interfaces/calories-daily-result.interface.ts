import type { MealEntry } from "../../../entities/meal/model/mealTypes";

export interface MealStat {
  type: string;
  label: string;
  calories: number;
  percent: number;
  color: string;
}

export interface CaloriesDailyResultProps {
  meals: MealEntry[];
}
