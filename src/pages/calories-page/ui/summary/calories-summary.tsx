import React from "react";
import styles from "./calories-summary.module.css";
import { Progress, Tooltip } from "antd";
import type { CaloriesSummaryProps } from "../../interfaces/calories-daily-goal.interface.ts";
import { calculateProgress } from "../../lib/calories-daily-goal.utils.ts";

export const CaloriesSummary: React.FC<CaloriesSummaryProps> = ({
  meals,
  calorieGoal,
}) => {
  const { totalToday, progressPct, progressColor } = calculateProgress(
    meals,
    calorieGoal,
  );

  return (
    <div className={styles.calories_summary}>
      <div className={styles.calories_summaryNumbers}>
        <div className={styles.calories_summaryItem}>
          <span
            className={styles.calories_summaryValue}
            style={{ color: progressColor }}
          >
            {totalToday}
          </span>
          <span className={styles.calories_summaryLabel}>съедено ккал</span>
        </div>
        <div className={styles.calories_summaryDivider} />
        <div className={styles.calories_summaryItem}>
          <span
            className={styles.calories_summaryValue}
            style={{ color: "#9ca3af" }}
          >
            {calorieGoal}
          </span>
          <span className={styles.calories_summaryLabel}>цель ккал</span>
        </div>
        <div className={styles.calories_summaryDivider} />
        <div className={styles.calories_summaryItem}>
          <span
            className={styles.calories_summaryValue}
            style={{
              color: totalToday > calorieGoal ? "#f5222d" : "#5c9475",
            }}
          >
            {Math.abs(calorieGoal - totalToday)}
          </span>
          <span className={styles.calories_summaryLabel}>
            {totalToday > calorieGoal ? "перебор ккал" : "осталось ккал"}
          </span>
        </div>
      </div>
      <Tooltip title={`${progressPct}% дневной нормы`}>
        <div className={styles.progress_wrapper}>
          <Progress
            percent={progressPct}
            strokeColor={progressColor}
            railColor="#e2e2e2"
            showInfo={false}
            strokeWidth={5}
          />
        </div>
      </Tooltip>
    </div>
  );
};

export default CaloriesSummary;
