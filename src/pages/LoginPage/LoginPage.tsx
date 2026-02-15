import React, { useState } from "react";
import { Button, Input, message } from "antd";
import { useNavigate } from "react-router-dom";

export const LoginPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (username === "admin" && password === "1234") {
      message.success("Вход успешен!");
      navigate("/dashboard");
    } else {
      message.error("Неверное имя пользователя или пароль");
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <h1>Login</h1>
      <Input
        placeholder="Username"
        style={{ marginBottom: 12 }}
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <Input.Password
        placeholder="Password"
        style={{ marginBottom: 12 }}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Button type="primary" block onClick={handleLogin}>
        Login
      </Button>
    </div>
  );
};

export default LoginPage;
