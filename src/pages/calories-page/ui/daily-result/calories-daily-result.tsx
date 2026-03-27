import React from "react";
import styles from "./calories-daily-result.module.css";
import { Progress } from "antd";
import { FireOutlined } from "@ant-design/icons";
import { calculateMealStats } from "../../lib/calories-daily-result.util.ts";
import type { CaloriesDailyResultProps } from "../../interfaces/calories-daily-result.interface.ts";

export const CaloriesDailyResult: React.FC<CaloriesDailyResultProps> = ({
  meals,
}) => {
  const stats = calculateMealStats(meals);

  return (
    <div className={styles.calories_dailyResult_widgetContainer}>
      <div className={styles.calories_dailyResult_widgetHeader}>
        <FireOutlined className={styles.calories_dailyResult_widgetIcon} />
        <span className={styles.calories_dailyResult_widgetTitle}>
          По приёмам
        </span>
      </div>

      {stats.length === 0 ? (
        <p className={styles.calories_dailyResult_widgetEmpty}>Нет записей</p>
      ) : (
        <ul className={styles.calories_dailyResult_mealTypeList}>
          {stats.map((item) => (
            <li
              key={item.type}
              className={styles.calories_dailyResult_mealTypeItem}
            >
              <div className={styles.calories_dailyResult_mealTypeRow}>
                <span>{item.label}</span>
                <span className={styles.calories_dailyResult_mealTypeKcal}>
                  {item.calories} ккал
                </span>
              </div>

              <Progress
                percent={item.percent}
                strokeColor={item.color}
                railColor="#d6d6d6"
                showInfo={false}
                strokeWidth={5}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CaloriesDailyResult;
