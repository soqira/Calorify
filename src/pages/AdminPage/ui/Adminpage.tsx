import React, { useState, useEffect } from "react";
import { Table, Button, Input, Modal, Form, message } from "antd";
import type { ColumnsType } from "antd/es/table";
import type { UserProfile } from "../../../entities/user/model/types";

const PROFILE_KEY = "calorify_user_profile";

function getUsersFromStorage(): UserProfile[] {
  const raw = localStorage.getItem(PROFILE_KEY);
  if (!raw) return[];
  return [JSON.parse(raw) as UserProfile]

}

function saveUserToStorage(user: UserProfile): void {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(user));
}

export const AdminPage: React.FC = () => {

  const [users, setUsers] = useState<UserProfile[]>([]);
  const [search, setSearch] = useState("");
  const [editOpen, setEditOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    setUsers(getUsersFromStorage());
  }, []);

  const filteredUsers = users.filter((user) =>
    user.username.toLowerCase().includes(search.toLowerCase()) ||
    user.email.toLowerCase().includes(search.toLowerCase())
  );

  function openEdit(user: UserProfile) {
    setEditingUser(user);
    form.setFieldsValue(user);
    setEditOpen(true);
  }

  async function handleSave() {
    const values = await form.validateFields();
    if (!editingUser) return;
    const updated = { ...editingUser, ...values };
    saveUserToStorage(updated);
    setUsers([updated]);
    setEditOpen(false);
    message.success("Сохранено");
  }
  const columns: ColumnsType<UserProfile> = [
    {
      title: "Имя",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Роль",
      dataIndex: "role",
      key: "role",
    },
    {
      title: "Действия",
      key: "actions",
      render: (_, user) => (
        <Button size="small" onClick={() => openEdit(user)}>
          Редактировать
        </Button>
      ),
    },
  ];

  return (
    <div>

      <h1>Пользователи</h1>

      <Input
        placeholder="Поиск..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <Table<UserProfile>
        dataSource={filteredUsers}
        columns={columns}
        rowKey="id"
      />

      <Modal
        title="Редактировать"
        open={editOpen}
        onCancel={() => setEditOpen(false)}
        onOk={handleSave}
      >
        <Form form={form} layout="vertical">
          {/* modal items suda dobavit' */}
          <Form.Item name="username" label="Имя">
            <Input />
          </Form.Item>
        </Form>
      </Modal>

    </div>
  );
};

export default AdminPage;