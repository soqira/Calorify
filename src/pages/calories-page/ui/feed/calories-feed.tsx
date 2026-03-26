import React from "react";
import { Spin, Empty, Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";

import { CaloriesFeedItem } from "../feed-item/calories-feed-item";
import type { CaloriesFeedProps } from "../../interfaces/calories-feed.interface";

import styles from "./calories-feed.module.css";

export const CaloriesFeed: React.FC<CaloriesFeedProps> = ({
  meals,
  loading,
  onAdd,
  onEdit,
  onDelete,
  onTagsChange,
}) => {
  if (loading) {
    return (
      <div className={styles.calories_feed_spin_wrapper}>
        <Spin size="large" />
      </div>
    );
  }

  if (meals.length === 0) {
    return (
      <Empty
        className={styles.calories_feed_no_data}
        description="Нет записей за этот день"
        image={Empty.PRESENTED_IMAGE_SIMPLE}
      >
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={onAdd}
          className={styles.calories_feed_add_button}
        >
          Добавить первый приём
        </Button>
      </Empty>
    );
  }

  return (
    <div className={styles.calories_feed_container}>
      {meals.map((meal) => (
        <CaloriesFeedItem
          key={meal.id}
          meal={meal}
          onEdit={onEdit}
          onDelete={onDelete}
          onTagsChange={onTagsChange}
        />
      ))}
    </div>
  );
};
