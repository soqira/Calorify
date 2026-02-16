//import React, { useState } from "react";
import {
  Button,
  Input,
  message,
  Form,
  Checkbox,
  ConfigProvider,
  Select,
} from "antd";
import { LockOutlined, UserOutlined, MailOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import styles from "../RegistrationPage.module.css";

type FieldType = {
  username: string;
  email: string;
  password: string;
  confirmpass: string;
  gender: string;
  agreement: boolean;
};

export const RegistrationPage = () => {
  const navigate = useNavigate();

  const onFinish = () => {
    navigate("/dashboard");
    message.success("Регистрация успешна!");
  };

  return (
    <div className={styles.registrationContainer}>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: "#5c9475",
            colorText: "#5c9475",
          },
        }}
      >
        <Form<FieldType>
          name="registration"
          initialValues={{ remember: true }}
          className={styles.registration}
          onFinish={onFinish}
        >
          <h1>Регистрация</h1>

          {/* email */}
          <Form.Item<FieldType>
            name="email"
            rules={[
              { required: true, type: "email", message: "Введите почту!" },
            ]}
          >
            <Input prefix={<MailOutlined />} placeholder="Почта" />
          </Form.Item>

          {/* username */}
          <Form.Item<FieldType>
            name="username"
            rules={[{ required: true, message: "Введите имя пользователя" }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Имя пользователя" />
          </Form.Item>

          {/* password */}
          <Form.Item<FieldType>
            name="password"
            rules={[{ required: true, message: "Введите пароль!" }]}
            hasFeedback
          >
            <Input
              prefix={<LockOutlined />}
              type="password"
              placeholder="Пароль"
            />
          </Form.Item>

          {/* password confirmaton */}
          <Form.Item
            name="confirmpass"
            dependencies={["password"]}
            hasFeedback
            rules={[
              {
                required: true,
                message: "Введите пароль!",
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("Пароли не совпадают!"));
                },
              }),
            ]}
          >
            <Input
              prefix={<LockOutlined />}
              type="password"
              placeholder="Подтверждение пароля"
            />
          </Form.Item>

          <Form.Item
            name="gender"
            label="Пол"
            rules={[{ message: "Please select gender!" }]}
          >
            <Select
              placeholder="select your gender"
              defaultValue={"male"}
              options={[
                { label: "Мужчина", value: "male" },
                { label: "Женщина", value: "female" },
                { label: "Другой", value: "other" },
              ]}
            />
          </Form.Item>

          <Form.Item
            name="agreement"
            valuePropName="checked"
            rules={[
              {
                validator: (_, value) =>
                  value ? Promise.resolve() : Promise.reject(),
              },
            ]}
          >
            <Checkbox>
              Я согласен с{" "}
              <a
                href=""
                onClick={() => {
                  navigate("/unknown");
                }}
              >
                правилами
              </a>{" "}
              сайта
            </Checkbox>
          </Form.Item>

          <Form.Item>
            <Button
              block
              type="primary"
              style={{ marginBottom: 8 }}
              htmlType="submit"
            >
              Зарегестрироваться
            </Button>

            <a
              href=""
              className={styles.linkText}
              onClick={() => {
                navigate("/login");
              }}
            >
              Уже есть аккаунт?
            </a>
          </Form.Item>
        </Form>
      </ConfigProvider>
    </div>
  );
};

export default RegistrationPage;
