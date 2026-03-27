import type { MealEntry } from "../../model/mealTypes";
import type { MealFormValues } from "../../model/mealTypes";

export interface MealModalProps {
  open: boolean;
  editingMeal: MealEntry | null;
  loading: boolean;
  pendingPhoto: string | null;
  setPendingPhoto: (v: string | null) => void;
  onCancel: () => void;
  onSubmit: (values: MealFormValues) => void; //
}
