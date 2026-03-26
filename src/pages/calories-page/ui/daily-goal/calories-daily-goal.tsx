import React from "react";
import styles from "./calories-daily-goal.module.css";
import {
  TrophyOutlined,
  EditOutlined,
  CheckOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import { Button, InputNumber, Progress, Tooltip } from "antd";
import { calculateProgress } from "../../lib/calories-daily-goal.utils.ts";
import type { CaloriesDailyGoalProps } from "../../interfaces/calories-daily-goal.interface.ts";

export const CaloriesDailyGoal: React.FC<CaloriesDailyGoalProps> = ({
  meals,
  calorieGoal,
  editingGoal,
  setGoalInput,
  goalInput,
  setEditingGoal,
  saveGoal,
}) => {
  const { progressPct, progressColor } = calculateProgress(meals, calorieGoal);
  return (
    <div className={styles.calories_daily_goal_widget}>
      <div className={styles.calories_daily_goal_header}>
        <TrophyOutlined className={styles.calories_daily_goal_icon} />
        <span className={styles.calories_daily_goal_title}>Цель на день</span>
      </div>

      {editingGoal ? (
        <div className={styles.calories_daily_goal_edit_row}>
          <InputNumber
            value={goalInput}
            onChange={(v) => {
              if (typeof v === "number") {
                setGoalInput(v);
              }
            }}
            min={500}
            max={10000}
            className={styles.calories_daily_goal_input}
            autoFocus
            onPressEnter={saveGoal}
          />
          <Tooltip title="Сохранить">
            <Button
              type="primary"
              size="small"
              icon={<CheckOutlined />}
              onClick={saveGoal}
              className={styles.calories_daily_goal_save_button}
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
          className={styles.calories_daily_goal_display}
          onClick={() => setEditingGoal(true)}
        >
          <span className={styles.calories_daily_goal_value}>
            {calorieGoal}
          </span>
          <span className={styles.calories_daily_goal_unit}>ккал / день</span>
          <EditOutlined className={styles.calories_daily_goal_edit_icon} />
        </div>
      )}

      <div className={styles.calories_daily_goal_progress}>
        <Progress
          percent={progressPct}
          strokeColor={progressColor}
          railColor="#eaf4ee"
          showInfo={false}
          size={6}
        />
        <span className={styles.calories_daily_goal_progress_label}>
          {progressPct}% от цели
        </span>
      </div>
    </div>
  );
};

export default CaloriesDailyGoal;
