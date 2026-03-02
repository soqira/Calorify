import React, { useState } from "react";
import styles from "../DashboardPage.module.css";
import {
  Table,
  ConfigProvider,
  Button,
  Space,
  Modal,
  type TableProps,
} from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
interface UsersData {
  key: number;
  name: string;
  age: number;
  email: string;
}

export const DashboardPage: React.FC = () => {
  const columns: TableProps<UsersData>["columns"] = [
    {
      title: "ID",
      dataIndex: "key",
      key: "ID",
    },
    {
      title: "Имя",
      dataIndex: "name",
    },
    {
      title: "Возраст",
      dataIndex: "age",
    },
    {
      title: "E-Mail",
      dataIndex: "email",
    },
    {
      title: "Действие",
      render: (_, record) => (
        <Space size="middle">
          <Button
            icon={<EditOutlined />}
            style={{ color: "#1890ff", border: "solid 0px" }}
            onClick={() => showModal(record)}
          />
          <Button
            icon={<DeleteOutlined />}
            style={{ color: "#1890ff", border: "solid 0px" }}
          />
        </Space>
      ),
    },
  ];

  const TABLE_USERS: UsersData[] = [
    { key: 1, name: "John Brown", age: 23, email: "jhonsonBrown@gmail.com" },
    { key: 2, name: "Alice White", age: 42, email: "iamalivce@gmail.com" },
    { key: 3, name: "Jane Remover", age: 21, email: "jane@gmail.com" },
    { key: 4, name: "Burton Graves", age: 54, email: "btgv@gmail.com" },
    { key: 5, name: "Jhon Gharikh", age: 31, email: "igiasga@gmail.com" },
  ];

  const [selectUser, setSelectedUser] = useState<UsersData | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);

  const showModal = (record: UsersData) => {
    setSelectedUser(record);
    setModalOpen(true);
  };
  const handleModalOk = () => {
    setModalOpen(false);
  };
  const handleModalCancel = () => {
    setModalOpen(false);
  };

  return (
    <div className={styles.dashboardContainer}>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: "#5c9475",
            colorText: "#254634",
          },
        }}
      >
        <Modal
          title="Данные пользователя"
          closable={{ "aria-label": "Custom Close Button" }}
          open={isModalOpen}
          onOk={handleModalOk}
          onCancel={handleModalCancel}
        >
          {selectUser && (
            <>
              <p>
                <strong>Имя</strong> {selectUser.name}
              </p>
              <p>
                <strong>Возраст</strong> {selectUser.age}
              </p>
              <p>
                <strong>Почта</strong> {selectUser.email}
              </p>
            </>
          )}
        </Modal>
        <h3 className={styles.h3}>Пользователи</h3>
        <Table<UsersData>
          className={styles.dashboardTable}
          columns={columns}
          dataSource={TABLE_USERS}
          size="middle"
          footer={() => "Сводка данных на: 2/15/26"}
        />
      </ConfigProvider>
    </div>
  );
};

export default DashboardPage;
