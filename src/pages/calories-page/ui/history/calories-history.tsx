import React from "react";
import styles from "./calories-history.module.css";
import { CalendarOutlined } from "@ant-design/icons";
import { DateUtils } from "../../../../shared/lib/date-utils/date-utils.util";
import { Spin } from "antd";
import type { HistoryProps } from "../../interfaces/calories-date.interface";

export const CaloriesHistory: React.FC<HistoryProps> = ({
  mealDays,
  selectedDate,
  setSelectedDate,
  loading,
}) => {
  return (
    <div>
      <div className={styles.calories_history_header}>
        <CalendarOutlined className={styles.calories_history_header_icon} />
        <span>История</span>
      </div>

      <ul className={styles.calories_history_list}>
        {loading ? (
          <div className={styles.calories_history_item_spin}>
            <Spin size="medium" />
          </div>
        ) : (
          mealDays.map((day) => {
            const { bottom, isToday } = DateUtils.formatDate(day);
            return (
              <li
                key={day}
                className={`${styles.calories_history_day_item} ${
                  day === selectedDate
                    ? styles.calories_history_day_item_active
                    : ""
                }`}
                onClick={() => setSelectedDate(day)}
              >
                <div className={styles.calories_history_day_item_content}>
                  {bottom}
                  {isToday && (
                    <span className={styles.calories_history_today_badge}>
                      сегодня
                    </span>
                  )}
                </div>
              </li>
            );
          })
        )}
      </ul>
    </div>
  );
};

export default CaloriesHistory;
