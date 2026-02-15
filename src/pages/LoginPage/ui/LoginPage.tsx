//import React, { useState } from "react";
import {
  Button,
  Input,
  message,
  Form,
  Checkbox,
  Flex,
  ConfigProvider,
} from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import styles from "../LoginPage.module.css";

type FieldType = {
  email: string;
  password: string;
  remember: boolean;
};

export const LoginPage = () => {
  const navigate = useNavigate();

  const onFinish = (values: FieldType) => {
    const { email, password } = values;

    if (email === "blamemyself@gmail.com" && password === "1234") {
      message.success("Вход успешен!");
      navigate("/dashboard");
    } else {
      message.error("Неверное имя пользователя или пароль");
    }
  };

  return (
    <div className={styles.loginContainer}>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: "#5c9475",
            colorText: "#5c9475",
          },
        }}
      >
        <Form<FieldType>
          name="login"
          initialValues={{ remember: true }}
          className={styles.login}
          onFinish={onFinish}
        >
          <h1>Авторизация</h1>
          <Form.Item<FieldType>
            name="email"
            rules={[
              { required: true, type: "email", message: "Неверная почта!" },
            ]}
          >
            <Input prefix={<UserOutlined />} placeholder="Почта" />
          </Form.Item>

          <Form.Item<FieldType>
            name="password"
            rules={[{ required: true, message: "Введите пароль!" }]}
          >
            <Input
              prefix={<LockOutlined />}
              type="password"
              placeholder="Пароль"
            />
          </Form.Item>

          <Form.Item>
            <Flex justify="space-between" align="center">
              <Form.Item<FieldType>
                name="remember"
                valuePropName="checked"
                noStyle
              >
                <Checkbox>Запомнить меня</Checkbox>
              </Form.Item>
              <a href="" className={styles.linkText}>
                Забыли пароль?
              </a>
            </Flex>
          </Form.Item>

          <Form.Item>
            <Button
              block
              type="primary"
              style={{ marginBottom: 8 }}
              htmlType="submit"
            >
              Log in
            </Button>
            <a href="" className={styles.linkText}>
              Регистрация
            </a>
          </Form.Item>
        </Form>
      </ConfigProvider>
    </div>
  );
};

export default LoginPage;
