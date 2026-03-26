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
          <span className={styles.summaryValue} style={{ color: "#9ca3af" }}>
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
          size={5}
        />
      </Tooltip>
    </div>
  );
};

export default CaloriesSummary;
