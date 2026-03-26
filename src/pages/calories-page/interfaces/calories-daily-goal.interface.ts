import type { MealEntry } from "../../../entities/meal/model/mealTypes";

export interface CaloriesDailyGoalProps {
  meals: MealEntry[];
  calorieGoal: number;
  editingGoal: boolean;
  goalInput: number;
  setGoalInput: (value: number) => void;
  setEditingGoal: (value: boolean) => void;
  saveGoal: () => void;
}

export interface CaloriesSummaryProps {
  meals: MealEntry[];
  calorieGoal: number;
}

export interface ProgressResult {
  totalToday: number;
  progressPct: number;
  progressColor: string;
}
