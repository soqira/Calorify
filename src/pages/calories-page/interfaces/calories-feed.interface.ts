import type {
  MealEntry,
  MealTag,
} from "../../../entities/meal/model/mealTypes";

export interface CaloriesFeedProps {
  meals: MealEntry[];
  loading: boolean;
  onAdd: () => void;
  onEdit: (meal: MealEntry) => void;
  onDelete: (id: string) => void;
  onTagsChange: (mealId: string, tags: MealTag[]) => void;
}

export interface CaloriesFeedItemProps {
  meal: MealEntry;
  onEdit: (meal: MealEntry) => void;
  onDelete: (mealId: string) => void;
  onTagsChange: (mealId: string, tags: MealTag[]) => void;
}
