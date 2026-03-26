import { useState } from "react";
import type {
  MealEntry,
  FoodItem,
  MealType,
  MealFormValues,
} from "../model/mealTypes";
import { createMeal, updateMeal } from "../model/mealService";

export const useMealModal = (userId: string, selectedDate: string) => {
  const [saving, setSaving] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingMeal, setEditingMeal] = useState<MealEntry | null>(null);
  const [pendingPhoto, setPendingPhoto] = useState<string | null>(null);

  const openAdd = () => {
    setEditingMeal(null);
    setPendingPhoto(null);
    setModalOpen(true);
  };

  const openEdit = (meal: MealEntry) => {
    setEditingMeal(meal);
    setPendingPhoto(meal.photoUrl);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const handleSave = async (values: MealFormValues) => {
    setSaving(true);

    const foods: FoodItem[] = values.foods.map((f) => ({
      id: crypto.randomUUID(),
      name: f.name,
      calories: f.calories,
      weight: f.weight,
    }));

    try {
      if (editingMeal) {
        const updated = await updateMeal(editingMeal.id, {
          type: values.type as MealType,
          note: values.note,
          foods,
          photoUrl: pendingPhoto,
        });

        return updated;
      } else {
        const created = await createMeal({
          userId,
          type: values.type as MealType,
          note: values.note,
          foods,
          date: selectedDate,
          photoUrl: pendingPhoto,
          mealTags: [],
        });

        return created;
      }
    } finally {
      setSaving(false);
      setModalOpen(false);
    }
  };
  return {
    modalOpen,
    saving,
    editingMeal,
    pendingPhoto,

    setPendingPhoto,

    openAdd,
    openEdit,
    closeModal,
    handleSave,
  };
};
