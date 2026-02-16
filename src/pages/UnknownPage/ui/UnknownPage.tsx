import React from "react";
import { useNavigate } from "react-router-dom";
import { Button, ConfigProvider } from "antd";
import styles from "../UnknownPage.module.css";

export const UnknownPage = () => {
  const navigate = useNavigate();
  return (
    <div className={styles.unknownContainer}>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: "#5c9475",
            colorText: "#5c9475",
          },
        }}
      >
        <h1 className={styles.h1}>404</h1>
        <p className={styles.text}>похоже такой страницы не существует...</p>
        <Button
          className={styles.button}
          type="primary"
          onClick={() => {
            navigate("../");
          }}
        >
          Вернуться
        </Button>
      </ConfigProvider>
    </div>
  );
};

export default UnknownPage;
