// pages/CaloriesPage/ui/CaloriesPage.tsx

import React, { useEffect, useState, useCallback } from "react";
import {
  Button,
  Tag,
  Progress,
  Empty,
  Modal,
  Form,
  Input,
  Select,
  InputNumber,
  Popconfirm,
  message,
  Spin,
  Tooltip,
  Upload,
  Image,
  ConfigProvider,
  Slider,
} from "antd";
import type { UploadProps } from "antd";
import {
  PlusOutlined,
  DeleteOutlined,
  EditOutlined,
  CheckOutlined,
  PlusCircleOutlined,
  MinusCircleOutlined,
  FireOutlined,
  CameraOutlined,
  CalendarOutlined,
  DropboxOutlined,
  TrophyOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import "dayjs/locale/ru";
import {
  fetchProfile,
  updateProfile,
} from "../../../entities/user/model/profileService";
import {
  getMealsByDate,
  getMealDays,
  createMeal,
  updateMeal,
  deleteMeal,
  uploadMealPhoto,
} from "../../../entities/meal/model/mealService";
import { MEAL_TYPE_META } from "../../../entities/meal/model/mealTypes.ts";
import type {
  MealEntry,
  MealType,
  FoodItem,
} from "../../../entities/meal/model/mealTypes.ts";
import styles from "../CaloriesPage.module.css";

dayjs.locale("ru");

const WATER_KEY = (userId: string, date: string) =>
  `calorify_water_${userId}_${date}`;

interface MealFormValues {
  type: MealType;
  note: string;
  foods: { name: string; calories: number; weight: number }[];
}

function formatSidebarDate(dateStr: string) {
  const d = dayjs(dateStr);
  const today = dayjs().format("YYYY-MM-DD");
  const yesterday = dayjs().subtract(1, "day").format("YYYY-MM-DD");

  if (dateStr === today)
    return { top: "Сегодня", bottom: d.format("D MMMM"), isToday: true };
  if (dateStr === yesterday)
    return { top: "Вчера", bottom: d.format("D MMMM"), isToday: false };
  return { top: d.format("D MMMM"), bottom: d.format("dddd"), isToday: false };
}

// const MEAL_TAGS = [
//   {
//     label: "Десерт",
//     value: "yummu",
//   },
//   {
//     label: "Напиток",
//     value: "drink",
//   },
//   {
//     label: "Без сахара",
//     value: "nosugar",
//   },
//   {
//     label: "Фастфуд",
//     value: "fastfood",
//   },
//   {
//     label: "Жаренное",
//     value: "fried",
//   },
//   {
//     label: "Сырое",
//     value: "wet",
//   },
// ];

export const CaloriesPage: React.FC = () => {
  const [form] = Form.useForm<MealFormValues>();

  const [meals, setMeals] = useState<MealEntry[]>([]);
  const [mealDays, setMealDays] = useState<string[]>([]);
  const [calorieGoal, setCalorieGoal] = useState(0);
  const [userId, setUserId] = useState("1");

  const [selectedDate, setSelectedDate] = useState(
    dayjs().format("YYYY-MM-DD"),
  );
  const [loadingFeed, setLoadingFeed] = useState(true);
  const [loadingSide, setLoadingSide] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingMeal, setEditingMeal] = useState<MealEntry | null>(null);
  const [pendingPhoto, setPendingPhoto] = useState<string | null>(null);

  const [editingGoal, setEditingGoal] = useState(false);
  const [goalInput, setGoalInput] = useState<number>(0);

  const WATER_GOAL = 8;
  const [waterGlasses, setWaterGlasses] = useState(0);

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

  const loadWater = useCallback((uid: string, date: string) => {
    const saved = localStorage.getItem(WATER_KEY(uid, date));
    setWaterGlasses(saved ? parseInt(saved, 10) : 0);
  }, []);

  useEffect(() => {
    fetchProfile().then((p) => {
      setCalorieGoal(p.calorieGoal);
      setGoalInput(p.calorieGoal);
      setUserId(p.id);
      loadDays(p.id);
      loadFeed(p.id, selectedDate);
      loadWater(p.id, selectedDate);
    });
  }, []);

  useEffect(() => {
    if (!userId) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadFeed(userId, selectedDate);
    loadWater(userId, selectedDate);
  }, [selectedDate, userId, loadFeed, loadWater]);

  const totalToday = meals.reduce((s, m) => s + m.totalCalories, 0);
  const progressPct = Math.min(
    Math.round((totalToday / calorieGoal) * 100),
    100,
  );
  const progressColor =
    progressPct >= 100 ? "#f5222d" : progressPct >= 80 ? "#fa8c16" : "#5c9475";

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

  const changeWater = (delta: number) => {
    const next = Math.max(0, Math.min(WATER_GOAL + 2, waterGlasses + delta));
    setWaterGlasses(next);
    localStorage.setItem(WATER_KEY(userId, selectedDate), String(next));
  };

  const openAdd = () => {
    setEditingMeal(null);
    setPendingPhoto(null);
    form.resetFields();
    form.setFieldsValue({
      type: "breakfast",
      foods: [{ name: "", calories: 0, weight: 0 }],
    });
    setModalOpen(true);
  };

  const openEdit = (meal: MealEntry) => {
    setEditingMeal(meal);
    setPendingPhoto(meal.photoUrl);
    form.setFieldsValue({
      type: meal.type,
      note: meal.note,
      foods: meal.foods.map(({ name, calories, weight }) => ({
        name,
        calories,
        weight,
      })),
    });
    setModalOpen(true);
  };

  const handleSave = async () => {
    const values = await form.validateFields().catch(() => {
      message.error("Заполните обязательные поля");
      return null;
    });
    if (!values) return;

    setSaving(true);

    const foods: FoodItem[] = values.foods.map((f) => ({
      id: crypto.randomUUID(),
      name: f.name,
      calories: f.calories,
      weight: f.weight,
    }));

    if (editingMeal) {
      const updated = await updateMeal(editingMeal.id, {
        type: values.type,
        note: values.note,
        foods,
        photoUrl: pendingPhoto,
      });
      setMeals((prev) => prev.map((m) => (m.id === updated.id ? updated : m)));
      message.success("Запись обновлена");
    } else {
      const created = await createMeal({
        userId,
        type: values.type,
        note: values.note,
        foods,
        date: selectedDate,
        photoUrl: pendingPhoto,
      });
      setMeals((prev) => [...prev, created]);
      setMealDays((prev) =>
        prev.includes(selectedDate) ? prev : [selectedDate, ...prev],
      );
      message.success("Запись добавлена");
    }

    setSaving(false);
    setModalOpen(false);
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

  const uploadProps: UploadProps = {
    showUploadList: false,
    accept: "image/*",
    beforeUpload: async (file) => {
      if (!file.type.startsWith("image/")) {
        message.error("Только изображения!");
        return false;
      }
      if (file.size / 1024 / 1024 > 5) {
        message.error("Максимум 5 МБ");
        return false;
      }
      const url = await uploadMealPhoto(file);
      setPendingPhoto(url);
      return false;
    },
  };

  return (
    <div className={styles.layout}>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: "#5c9475",
            //colorText: "#5c9475",
          },
        }}
      >
        {/* левый сайдбар */}
        <aside className={styles.sidebarLeft}>
          <div className={styles.sidebarHeader}>
            <CalendarOutlined className={styles.sidebarHeaderIcon} />
            <span>История</span>
          </div>

          {loadingSide ? (
            <div className={styles.sidebarSpin}>
              <Spin size="small" />
            </div>
          ) : (
            <ul className={styles.dayList}>
              {mealDays.map((day) => {
                const { top, bottom, isToday } = formatSidebarDate(day);
                return (
                  <li
                    key={day}
                    className={`${styles.dayItem} ${day === selectedDate ? styles.dayItemActive : ""}`}
                    onClick={() => setSelectedDate(day)}
                  >
                    <div className={styles.dayTop}>
                      {top}
                      {isToday && (
                        <span className={styles.todayBadge}>сегодня</span>
                      )}
                    </div>
                    <div className={styles.dayBottom}>{bottom}</div>
                  </li>
                );
              })}
            </ul>
          )}
        </aside>

        {/* левый нижний сайдбар */}
        {/* <aside className={styles.sidebarLeftBottom}>
          <div className={styles.sidebarHeader}>
            <HistoryOutlined className={styles.sidebarHeaderIcon} />
            <span>Стабильность</span>
          </div>
          <h1>1 день</h1>
        </aside> */}

        {/* центр */}
        <main className={styles.main}>
          {/* день */}
          <div className={styles.feedHeader}>
            <div>
              <h1 className={styles.feedTitle}>
                {formatSidebarDate(selectedDate).top}
              </h1>
              <p className={styles.feedSubtitle}>
                {dayjs(selectedDate).format("D MMMM YYYY")}
              </p>
            </div>
            <Button
              variant="filled"
              icon={<PlusOutlined />}
              onClick={openAdd}
              className={styles.addBtn}
            >
              Добавить
            </Button>
          </div>

          {/* сводка дня */}
          <div className={styles.summary}>
            <div className={styles.summaryNumbers}>
              <div className={styles.summaryItem}>
                <span
                  className={styles.summaryValue}
                  style={{ color: progressColor }}
                >
                  {totalToday}
                </span>
                <span className={styles.summaryLabel}>съедено ккал</span>
              </div>
              <div className={styles.summaryDivider} />
              <div className={styles.summaryItem}>
                <span
                  className={styles.summaryValue}
                  style={{ color: "#9ca3af" }}
                >
                  {calorieGoal}
                </span>
                <span className={styles.summaryLabel}>цель ккал</span>
              </div>
              <div className={styles.summaryDivider} />
              <div className={styles.summaryItem}>
                <span
                  className={styles.summaryValue}
                  style={{
                    color: totalToday > calorieGoal ? "#f5222d" : "#5c9475",
                  }}
                >
                  {Math.abs(calorieGoal - totalToday)}
                </span>
                <span className={styles.summaryLabel}>
                  {totalToday > calorieGoal ? "перебор ккал" : "осталось ккал"}
                </span>
              </div>
            </div>
            <Tooltip title={`${progressPct}% дневной нормы`}>
              <Progress
                percent={progressPct}
                strokeColor={progressColor}
                railColor="#e2e2e2"
                showInfo={false}
                strokeWidth={5}
              />
            </Tooltip>
          </div>

          {/* лента */}
          {loadingFeed ? (
            <div className={styles.spinWrapper}>
              <Spin size="large" />
            </div>
          ) : meals.length === 0 ? (
            <Empty
              className={styles.empty}
              description="Нет записей за этот день"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            >
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={openAdd}
                className={styles.addBtn}
              >
                Добавить первый приём
              </Button>
            </Empty>
          ) : (
            <div className={styles.feed}>
              {meals.map((meal) => {
                const meta = MEAL_TYPE_META[meal.type];
                return (
                  <div key={meal.id} className={styles.mealCard}>
                    {meal.photoUrl && (
                      <Image
                        src={meal.photoUrl}
                        alt="Фото"
                        className={styles.mealPhoto}
                        preview={{ mask: "Посмотреть" }}
                      />
                    )}

                    <div className={styles.mealBody}>
                      <div className={styles.mealHead}>
                        <div className={styles.mealHeadLeft}>
                          <Tag color={meta.color} className={styles.mealTag}>
                            {meta.label}
                          </Tag>
                          <span className={styles.mealTime}>
                            {dayjs(meal.createdAt).format("HH:mm")}
                          </span>
                        </div>
                        <div className={styles.mealHeadRight}>
                          <span className={styles.mealKcal}>
                            <FireOutlined
                              color="#fa8c16"
                              className={styles.fireIcon}
                            />
                            {meal.totalCalories} ккал
                          </span>
                          <Tooltip title="Редактировать">
                            <Button
                              type="text"
                              size="small"
                              icon={<EditOutlined />}
                              onClick={() => openEdit(meal)}
                              className={styles.iconBtn}
                            />
                          </Tooltip>
                          <Popconfirm
                            title="Удалить запись?"
                            onConfirm={() => handleDelete(meal.id)}
                            okText="Удалить"
                            cancelText="Отмена"
                            okButtonProps={{ danger: true }}
                          >
                            <Tooltip title="Удалить">
                              <Button
                                type="text"
                                size="small"
                                danger
                                icon={<DeleteOutlined />}
                                className={styles.iconBtn}
                              />
                            </Tooltip>
                          </Popconfirm>
                        </div>
                      </div>

                      {/* TAGS */}

                      {/* <Select
                        mode="multiple"
                        className={styles.mealTags}
                        placeholder="Тэги"
                        onChange={(value) => {}}
                        options={MEAL_TAGS}
                        optionRender={(option) => (
                          <Space>{`${option.data.label}`}</Space>
                        )}
                      /> */}

                      <ul className={styles.foodList}>
                        {meal.foods.map((food) => (
                          <li key={food.id} className={styles.foodItem}>
                            <span className={styles.foodName}>{food.name}</span>
                            <span className={styles.foodMeta}>
                              {food.weight > 0 && `${food.weight} г · `}
                              {food.calories} ккал
                            </span>
                          </li>
                        ))}
                      </ul>

                      {meal.note && (
                        <p className={styles.mealNote}>{meal.note}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>

        {/* right sidebar */}
        <aside className={styles.sidebarRight}>
          {/* widget цель */}
          <div className={styles.widget}>
            <div className={styles.widgetHeader}>
              <TrophyOutlined className={styles.widgetIcon} />
              <span className={styles.widgetTitle}>Цель на день</span>
            </div>

            {editingGoal ? (
              <div className={styles.goalEditRow}>
                <InputNumber
                  value={goalInput}
                  onChange={(v) => v && setGoalInput(v)}
                  min={500}
                  max={10000}
                  className={styles.goalInput}
                  autoFocus
                  onPressEnter={saveGoal}
                />
                <Tooltip title="Сохранить">
                  <Button
                    type="primary"
                    size="small"
                    icon={<CheckOutlined />}
                    onClick={saveGoal}
                    className={styles.goalSaveBtn}
                  />
                </Tooltip>
                <Tooltip title="Отмена">
                  <Button
                    size="small"
                    icon={<CloseOutlined />}
                    onClick={() => {
                      setGoalInput(calorieGoal);
                      setEditingGoal(false);
                    }}
                  />
                </Tooltip>
              </div>
            ) : (
              <div
                className={styles.goalDisplay}
                onClick={() => setEditingGoal(true)}
              >
                <span className={styles.goalValue}>{calorieGoal}</span>
                <span className={styles.goalUnit}>ккал / день</span>
                <EditOutlined className={styles.goalEditIcon} />
              </div>
            )}

            {/* widget мини прогресс */}
            <div className={styles.goalProgress}>
              <Progress
                percent={progressPct}
                strokeColor={progressColor}
                trailColor="#eaf4ee"
                showInfo={false}
                strokeWidth={6}
              />
              <span className={styles.goalProgressLabel}>
                {progressPct}% от цели
              </span>
            </div>
          </div>

          {/* widget вода*/}
          <div className={styles.widget}>
            <div className={styles.widgetHeader}>
              <DropboxOutlined className={styles.widgetIcon} />
              <span className={styles.widgetTitle}>Вода</span>
            </div>

            <Slider
              min={0}
              className={styles.waterSlider}
              max={WATER_GOAL}
              value={waterGlasses}
              onChange={(val: number) => {
                setWaterGlasses(val);
                localStorage.setItem(
                  WATER_KEY(userId, selectedDate),
                  String(val),
                );
              }}
            />

            {/* <div className={styles.waterGlasses}>
              {Array.from({ length: WATER_GOAL }).map((_, i) => (
                <div
                  key={i}
                  className={`${styles.glass} ${i < waterGlasses ? styles.glassFull : ""}`}
                  onClick={() =>
                    changeWater(
                      i < waterGlasses
                        ? -(waterGlasses - i)
                        : i + 1 - waterGlasses,
                    )
                  }
                  title={`${i + 1} стакан`}
                >
                  💧
                </div>
              ))}
            </div> */}

            <div className={styles.waterControls}>
              <Button
                size="small"
                icon={<MinusCircleOutlined />}
                onClick={() => changeWater(-1)}
                disabled={waterGlasses === 0}
                className={styles.waterBtn}
              />
              <span className={styles.waterCount}>
                {waterGlasses} / {WATER_GOAL} стаканов
              </span>
              <Button
                size="small"
                icon={<PlusCircleOutlined />}
                onClick={() => changeWater(1)}
                disabled={waterGlasses >= WATER_GOAL + 2}
                className={styles.waterBtn}
              />
            </div>

            <p className={styles.waterHint}>
              {waterGlasses === 0 && "Не забывай пить воду!"}
              {waterGlasses > 0 &&
                waterGlasses < WATER_GOAL &&
                `Ещё ${WATER_GOAL - waterGlasses} стакана до нормы`}
              {waterGlasses >= WATER_GOAL && "Норма выполнена!"}
            </p>
          </div>

          {/* widget типы */}
          <div className={styles.widget}>
            <div className={styles.widgetHeader}>
              <FireOutlined className={styles.widgetIcon} />
              <span className={styles.widgetTitle}>По приёмам</span>
            </div>

            {meals.length === 0 ? (
              <p className={styles.widgetEmpty}>Нет записей</p>
            ) : (
              <ul className={styles.mealTypeList}>
                {Object.entries(MEAL_TYPE_META).map(([type, meta]) => {
                  const typeMeals = meals.filter((m) => m.type === type);
                  const typeKcal = typeMeals.reduce(
                    (s, m) => s + m.totalCalories,
                    0,
                  );
                  if (typeKcal === 0) return null;
                  const pct = Math.round((typeKcal / totalToday) * 100);
                  return (
                    <li key={type} className={styles.mealTypeItem}>
                      <div className={styles.mealTypeRow}>
                        <span>{meta.label}</span>
                        <span className={styles.mealTypeKcal}>
                          {typeKcal} ккал
                        </span>
                      </div>
                      <Progress
                        percent={pct}
                        strokeColor={
                          meta.color === "gold"
                            ? "#faad14"
                            : meta.color === "green"
                              ? "#5c9475"
                              : meta.color === "blue"
                                ? "#3d79ce"
                                : "#fa541c"
                        }
                        trailColor="#d6d6d6"
                        showInfo={false}
                        strokeWidth={5}
                      />
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </aside>

        {/* create / edit modal */}
        <Modal
          title={
            <span className={styles.modalTitle}>
              {editingMeal ? "Редактирование приема пищи" : "Новый прием пищи"}
            </span>
          }
          open={modalOpen}
          onCancel={() => setModalOpen(false)}
          onOk={handleSave}
          okText={editingMeal ? "Сохранить" : "Добавить"}
          cancelText="Отмена"
          confirmLoading={saving}
          okButtonProps={{ className: styles.modalOkBtn }}
          width={580}
          destroyOnClose
        >
          <Form form={form} layout="vertical" className={styles.modalForm}>
            <Form.Item name="type" label="Тип" rules={[{ required: true }]}>
              <Select
                options={Object.entries(MEAL_TYPE_META).map(([v, m]) => ({
                  value: v,
                  label: `${m.label}`,
                }))}
              />
            </Form.Item>

            {/* photo upload */}
            <Form.Item label="Фото">
              <div className={styles.photoUploadArea}>
                {pendingPhoto ? (
                  <div className={styles.photoPreviewWrapper}>
                    <img
                      src={pendingPhoto}
                      alt="preview"
                      className={styles.photoPreview}
                    />
                    <Button
                      size="small"
                      danger
                      className={styles.photoRemoveBtn}
                      onClick={() => setPendingPhoto(null)}
                    >
                      Удалить фото
                    </Button>
                  </div>
                ) : (
                  <Upload {...uploadProps}>
                    <div className={styles.uploadPlaceholder}>
                      <CameraOutlined className={styles.uploadIcon} />
                      <span>Загрузить фото</span>
                      <span className={styles.uploadHint}>
                        JPG, PNG до 5 МБ
                      </span>
                    </div>
                  </Upload>
                )}
              </div>
            </Form.Item>

            {/* foods */}
            <Form.List name="foods">
              {(fields, { add, remove }) => (
                <div>
                  <div className={styles.foodListHeader}>
                    <span className={styles.foodListLabel}>
                      Продукты / блюда
                    </span>
                    <Button
                      type="link"
                      size="small"
                      icon={<PlusCircleOutlined />}
                      onClick={() => add({ name: "", calories: 0, weight: 0 })}
                      className={styles.addFoodBtn}
                    >
                      Добавить продукт
                    </Button>
                  </div>

                  {fields.map((field) => (
                    <div key={field.key} className={styles.foodRow}>
                      <Form.Item
                        name={[field.name, "name"]}
                        rules={[{ required: true, message: "Название" }]}
                        noStyle
                      >
                        <Input
                          placeholder="Название"
                          className={styles.foodNameInput}
                        />
                      </Form.Item>
                      <Form.Item name={[field.name, "weight"]} noStyle>
                        <InputNumber
                          min={0}
                          placeholder="0"
                          addonAfter="г"
                          className={styles.foodNumInput}
                        />
                      </Form.Item>
                      <Form.Item
                        name={[field.name, "calories"]}
                        rules={[{ required: true, message: "ккал" }]}
                        noStyle
                      >
                        <InputNumber
                          min={0}
                          placeholder="0"
                          addonAfter="ккал"
                          className={styles.foodNumInput}
                        />
                      </Form.Item>
                      <Button
                        type="text"
                        danger
                        icon={<MinusCircleOutlined />}
                        onClick={() => remove(field.name)}
                        disabled={fields.length === 1}
                      />
                    </div>
                  ))}
                </div>
              )}
            </Form.List>

            <Form.Item name="note" label="" style={{ marginTop: 16 }}>
              <Input.TextArea rows={2} placeholder="Комментарий..." />
            </Form.Item>
          </Form>
        </Modal>
      </ConfigProvider>
    </div>
  );
};

export default CaloriesPage;
