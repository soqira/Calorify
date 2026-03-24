import { useState } from "react";
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
import { loginUser } from "../../../../entities/user/model/authService";
import styles from "../LoginPage.module.css";

type FieldType = {
  email: string;
  password: string;
  remember: boolean;
};

export const LoginPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: FieldType) => {
    setLoading(true);

    try {
      await loginUser({
        email: values.email,
        password: values.password,
      });

      message.success("Вход успешен!");
      navigate("/calories");
    } catch (err) {
      const errorText =
        err instanceof Error ? err.message : "Неверный email или пароль";
      message.error(errorText);
    } finally {
      setLoading(false);
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
              <a
                className={styles.linkText}
                href=""
                onClick={() => navigate("/unknown")}
              >
                Забыли пароль?
              </a>
            </Flex>
          </Form.Item>

          <Form.Item>
            <Button
              block
              type="primary"
              htmlType="submit"
              loading={loading}
              style={{ marginBottom: 8 }}
            >
              Войти
            </Button>
            <a
              className={styles.linkText}
              href=""
              onClick={() => navigate("/registration")}
            >
              Регистрация
            </a>
          </Form.Item>
        </Form>
      </ConfigProvider>
    </div>
  );
};

export default LoginPage;
