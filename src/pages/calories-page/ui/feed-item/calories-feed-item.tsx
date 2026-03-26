import React from "react";
import { Button, Tag, Tooltip, Popconfirm, Select, Space, Image } from "antd";
import { EditOutlined, DeleteOutlined, FireOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

import {
  MEAL_TYPE_META,
  MEAL_TAGS,
} from "../../../../entities/meal/model/mealTypes";

import styles from "./calories-feed-item.module.css";

import type { CaloriesFeedItemProps } from "../../interfaces/calories-feed.interface";

export const CaloriesFeedItem: React.FC<CaloriesFeedItemProps> = ({
  meal,
  onEdit,
  onDelete,
  onTagsChange,
}) => {
  const meta = MEAL_TYPE_META[meal.type];

  return (
    <div className={styles.calorify_feed_item_card}>
      {meal.photoUrl && (
        <Image
          src={meal.photoUrl}
          alt="Фото"
          className={styles.calorify_feed_item_photo}
          preview={{ mask: { blur: true } }}
        />
      )}

      <div className={styles.calorify_feed_item_body}>
        <div className={styles.calorify_feed_item_head}>
          <div className={styles.calorify_feed_item_head_left}>
            <Tag
              color={meta.color}
              className={styles.calorify_feed_item_meal_badge}
            >
              {meta.label.toLocaleUpperCase()}
            </Tag>
            <span className={styles.calorify_feed_item_meal_time}>
              {dayjs(meal.createdAt).format("HH:mm")}
            </span>
          </div>

          <div className={styles.calorify_feed_item_head_right}>
            <span className={styles.calorify_feed_item_meal_kcal}>
              <FireOutlined className={styles.calorify_feed_item_fire_icon} />
              {meal.totalCalories} ккал
            </span>

            <Tooltip title="Редактировать">
              <Button
                type="text"
                size="small"
                icon={<EditOutlined />}
                onClick={() => onEdit(meal)}
                className={styles.calorify_feed_item_icon_button}
              />
            </Tooltip>

            <Popconfirm
              title="Удалить запись?"
              onConfirm={() => onDelete(meal.id)}
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
                  className={styles.calorify_feed_item_icon_button}
                />
              </Tooltip>
            </Popconfirm>
          </div>
        </div>

        {/* TAGS */}
        <Select
          mode="multiple"
          className={styles.calorify_feed_item_tags}
          placeholder="Тэги"
          value={meal.mealTags}
          onChange={(value) => onTagsChange(meal.id, value)}
          options={MEAL_TAGS}
          optionRender={(option) => <Space>{option.data.label}</Space>}
        />

        <ul className={styles.calorify_feed_item_food_list}>
          {meal.foods.map((food) => (
            <li key={food.id} className={styles.calorify_feed_item_food_item}>
              <span className={styles.calorify_feed_item_food_name}>
                {food.name}
              </span>
              <span className={styles.calorify_feed_item_food_meta}>
                {food.weight > 0 && `${food.weight} г · `}
                {food.calories} ккал
              </span>
            </li>
          ))}
        </ul>

        {meal.note && (
          <p className={styles.calorify_feed_item_note}>{meal.note}</p>
        )}
      </div>
    </div>
  );
};

export default CaloriesFeedItem;
