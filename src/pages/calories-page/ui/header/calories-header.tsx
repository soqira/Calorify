import React from "react";
import { Button, ConfigProvider } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { formatDate, formatFullDate } from "../../lib/calories-date.util";
import styles from "./calories-header.module.css";

interface CaloriesHeaderProps {
  selectedDate: string;
  openAdd: () => void;
}

export const CaloriesHeader: React.FC<CaloriesHeaderProps> = ({
  selectedDate,
  openAdd,
}) => {
  const { top } = formatDate(selectedDate);

  return (
    <div>
      <ConfigProvider
        theme={{
          token: {
            borderRadius: 15,
          },
          components: {
            Button: {
              borderRadius: 15,
            },
          },
        }}
      >
        <div className={styles.calories_header_container}>
          <div>
            <h1 className={styles.calories_header_title}>{top}</h1>

            <p className={styles.calories_header_date}>
              {formatFullDate(selectedDate)}
            </p>
          </div>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={openAdd}
            className={styles.calories_header_addButton}
          >
            Добавить
          </Button>
        </div>
      </ConfigProvider>
    </div>
  );
};

export default CaloriesHeader;
