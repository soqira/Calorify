import React, { useEffect, useState, useCallback } from "react";
import { message, ConfigProvider } from "antd";
import dayjs from "dayjs";
import "dayjs/locale/ru";
import {
  fetchProfile,
  updateProfile,
} from "../../entities/user/model/profileService.ts";
import {
  getMealsByDate,
  getMealDays,
  updateMeal,
  deleteMeal,
} from "../../entities/meal/model/mealService.ts";

import type {
  MealEntry,
  MealTag,
} from "../../entities/meal/model/mealTypes.ts";
import { CaloriesFeed } from "./ui/feed/calories-feed.tsx";
import { MealModal } from "../../shared/ui/meal-modal/meal-modal.tsx";
import { useMealModal } from "../../entities/meal/hooks/useMealModal.ts";

import styles from "./calories-page.module.css";

import CaloriesHeader from "./ui/header/calories-header.tsx";
import CaloriesSummary from "./ui/summary/calories-summary.tsx";
import CaloriesHistory from "./ui/history/calories-history.tsx";
import CaloriesDailyGoal from "./ui/daily-goal/calories-daily-goal.tsx";
import CaloriesDailyResult from "./ui/daily-result/calories-daily-result.tsx";

dayjs.locale("ru");

export const CaloriesPage: React.FC = () => {
  const [meals, setMeals] = useState<MealEntry[]>([]);
  const [mealDays, setMealDays] = useState<string[]>([]);
  const [calorieGoal, setCalorieGoal] = useState(0);
  const [userId, setUserId] = useState("1");

  const [loadingFeed, setLoadingFeed] = useState(true);
  const [loadingSide, setLoadingSide] = useState(true);

  const [editingGoal, setEditingGoal] = useState(false);
  const [goalInput, setGoalInput] = useState<number>(0);

  const [selectedDate, setSelectedDate] = useState(
    dayjs().format("YYYY-MM-DD"),
  );

  const loadDays = useCallback(async (uid: string) => {
    setLoadingSide(true);
    const days = await getMealDays(uid);
    const today = dayjs().format("YYYY-MM-DD");
    setMealDays(days.includes(today) ? days : [today, ...days]);
    setLoadingSide(false);
  }, []);

  const loadFeed = useCallback(async (uid: string, date: string) => {
    setLoadingFeed(true);
    setMeals(await getMealsByDate(uid, date));
    setLoadingFeed(false);
  }, []);

  const saveGoal = async () => {
    if (!goalInput || goalInput < 500 || goalInput > 10000) {
      message.error("Цель должна быть от 500 до 10 000 ккал");
      return;
    }
    await updateProfile({ calorieGoal: goalInput });
    setCalorieGoal(goalInput);
    setEditingGoal(false);
    message.success("Цель обновлена!");
  };

  const handleDelete = async (id: string) => {
    await deleteMeal(id);
    const remaining = meals.filter((m) => m.id !== id);
    setMeals(remaining);
    const today = dayjs().format("YYYY-MM-DD");
    if (remaining.length === 0 && selectedDate !== today) {
      setMealDays((prev) => prev.filter((d) => d !== selectedDate));
      setSelectedDate(today);
    }
    message.success("Запись удалена");
  };

  const handleTagsChange = async (mealId: string, tags: MealTag[]) => {
    const updated = await updateMeal(mealId, { mealTags: tags });
    setMeals((prev) =>
      prev.map((meal) => (meal.id === mealId ? updated : meal)),
    );
  };

  const {
    modalOpen,
    saving,
    editingMeal,
    pendingPhoto,
    setPendingPhoto,
    openAdd,
    openEdit,
    closeModal,
    handleSave,
  } = useMealModal(userId, selectedDate);

  useEffect(() => {
    fetchProfile().then((p) => {
      setCalorieGoal(p.calorieGoal);
      setGoalInput(p.calorieGoal);
      setUserId(p.id);
      loadDays(p.id);
      loadFeed(p.id, selectedDate);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!userId) return;

    loadFeed(userId, selectedDate);
  }, [selectedDate, userId, loadFeed]);

  return (
    <div className={styles.calorify_page_layout}>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: "#5c9475",
            motion: false,
          },
        }}
      >
        {/* левйы сайдбар */}
        <aside className={styles.sidebarLeft}>
          {/* history TODO: переделать под общее оформление */}
          <CaloriesHistory
            mealDays={mealDays}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            loading={loadingSide}
          />
        </aside>

        {/* центральный контейнер */}
        <main className={styles.main}>
          <CaloriesHeader selectedDate={selectedDate} openAdd={openAdd} />
          <CaloriesSummary meals={meals} calorieGoal={calorieGoal} />

          {/* лента */}
          <CaloriesFeed
            meals={meals}
            loading={loadingFeed}
            onAdd={openAdd}
            onEdit={openEdit}
            onDelete={handleDelete}
            onTagsChange={handleTagsChange}
          />
        </main>

        {/* right sidebar */}
        <aside className={styles.sidebarRight}>
          {/* widget цель */}
          <CaloriesDailyGoal
            meals={meals}
            calorieGoal={calorieGoal}
            editingGoal={editingGoal}
            setGoalInput={setGoalInput}
            goalInput={goalInput}
            setEditingGoal={setEditingGoal}
            saveGoal={saveGoal}
          />

          {/* widget типы */}
          <CaloriesDailyResult meals={meals} />
        </aside>

        {/* create / edit modal */}
        <MealModal
          open={modalOpen}
          editingMeal={editingMeal}
          loading={saving}
          pendingPhoto={pendingPhoto}
          setPendingPhoto={setPendingPhoto}
          onCancel={closeModal}
          onSubmit={async (values) => {
            const result = await handleSave(values);

            if (!result) return;

            if (editingMeal) {
              setMeals((prev) =>
                prev.map((m) => (m.id === result.id ? result : m)),
              );
            } else {
              setMeals((prev) => [...prev, result]);
              setMealDays((prev) =>
                prev.includes(selectedDate) ? prev : [selectedDate, ...prev],
              );
            }
          }}
        />
      </ConfigProvider>
    </div>
  );
};

export default CaloriesPage;
