export interface FoodItem {
  id: string;
  name: string;
  calories: number;
  weight: number;
}

export interface MealEntry {
  id: string;
  userId: string;
  type: MealType;
  foods: FoodItem[];
  totalCalories: number;
  note: string;
  date: string;
  createdAt: string;
  photoUrl: string | null;
}

export type MealTag = 
 | "dessert"
 | "drink"
 | "nosugar"
 | "fastfood"
 | "fried"
 | "raw"

export type MealType = "breakfast" | "lunch" | "dinner" | "snack";

export const MEAL_TYPE_META: Record<
  MealType,
  { label: string; color: string; variant: string }
> = {
  breakfast: { label: "Завтрак", color: "cyan", variant: "outlined" },
  lunch: { label: "Обед", color: "gold", variant: "outlined" },
  dinner: { label: "Ужин", color: "purple", variant: "outlined" },
  snack: { label: "Перекус", color: "darkred", variant: "outlined" },
};

export type CreateMealDTO = Omit<
  MealEntry,
  "id" | "totalCalories" | "createdAt"
>;
