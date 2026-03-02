import { useState } from "react";
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
import { registerUser } from "../../../../entities/user/model/authService";
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
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: FieldType) => {
    setLoading(true);

    try {
      await registerUser({
        username: values.username,
        email: values.email,
        password: values.password,
        gender: values.gender,
      });

      message.success("Регистрация успешна!");
      navigate("/calories");
    } catch {
      message.error("Ошибка при регистрации. Попробуйте ещё раз.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.registrationContainer}>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: "#5c9475",
            colorText: "#009b46",
          },
        }}
      >
        <Form<FieldType>
          name="registration"
          initialValues={{ gender: "male" }}
          className={styles.registration}
          onFinish={onFinish}
        >
          <h1>Регистрация</h1>

          <Form.Item<FieldType>
            name="email"
            rules={[
              { required: true, type: "email", message: "Введите почту!" },
            ]}
          >
            <Input prefix={<MailOutlined />} placeholder="Почта" />
          </Form.Item>

          <Form.Item<FieldType>
            name="username"
            rules={[{ required: true, message: "Введите имя пользователя" }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Имя пользователя" />
          </Form.Item>

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

          <Form.Item
            name="confirmpass"
            dependencies={["password"]}
            hasFeedback
            rules={[
              { required: true, message: "Повторите пароль!" },
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

          <Form.Item name="gender">
            <Select
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
                  value
                    ? Promise.resolve()
                    : Promise.reject(new Error("Необходимо согласие")),
              },
            ]}
          >
            <Checkbox>
              Я согласен с{" "}
              <a
                style={{ color: "#5c9475" }}
                href=""
                onClick={() => navigate("/unknown")}
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
              htmlType="submit"
              loading={loading}
              style={{ marginBottom: 8 }}
            >
              Зарегистрироваться
            </Button>

            <a
              className={styles.linkText}
              href=""
              onClick={() => navigate("/")}
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
