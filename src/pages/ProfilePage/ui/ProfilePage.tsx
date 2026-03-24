import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  Button,
  Select,
  DatePicker,
  InputNumber,
  Avatar,
  Upload,
  message,
  Spin,
  Tag,
  ConfigProvider,
  Switch,
} from "antd";
import {
  UserOutlined,
  SaveOutlined,
  CameraOutlined,
  CalendarOutlined,
  FireOutlined,
  ThunderboltOutlined,
} from "@ant-design/icons";
import type { UploadProps } from "antd";
import dayjs from "dayjs";
import type {
  UserProfile
} from "../../../entities/user/model/types";
import {
  fetchProfile,
  updateProfile,
  uploadAvatar,
} from "../../../entities/user/model/profileService";
import styles from "../ProfilePage.module.css";

interface ProfilePageProps {
  role: "admin" | "user";
  setRole: (role: "admin" | "user") => void;
}

const GENDER_OPTIONS = [
  { label: "Мужчина", value: "male" },
  { label: "Женщина", value: "female" },
  { label: "Другой", value: "other" },
];

const ROLE_LABELS: Record<string, { label: string; color: string }> = {
  admin: { label: "Администратор", color: "red" },
  user: { label: "Пользователь", color: "green" },
};



export const ProfilePage: React.FC<ProfilePageProps> = ({ role, setRole }) => {
  const [form] = Form.useForm();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  const stats = {
    daysInSystem: profile?.createdAt
    ? dayjs().diff(dayjs(profile.createdAt), "day") 
    : 10,
    totalEntries: profile?.totalEntries ?? 0,
    averageCalories: profile?.averageCalories ?? 0
  }

  useEffect(() => {
    fetchProfile().then((data) => {
      setProfile(data);
      setAvatarUrl(data.avatarUrl);

      // dayjs для datapickerа
      form.setFieldsValue({
        ...data,
        birthDate: data.birthDate ? dayjs(data.birthDate) : null,
      });

      setLoading(false);
    });
  }, [form]);

  const handleSave = async () => {
    const values = await form.validateFields().catch(() => {
      message.error("Проверьте заполненность полей");
      return null;
    });

    if (!values) return;

    setSaving(true);

    const updated = await updateProfile({
      ...values,
      birthDate: values.birthDate,
      avatarUrl,
    });

    setProfile(updated);
    setSaving(false);
    message.success("Профиль сохранён!");
  };

  const uploadProps: UploadProps = {
    showUploadList: false,
    beforeUpload: async (file) => {
      if (!file.type.startsWith("image/")) {
        message.error("Можно загружать только изображения!");
        return false;
      }

      if (file.size / 1024 / 1024 > 2) {
        message.error("Размер файла не должен превышать 2MB!");
        return false;
      }

      const base64 = await uploadAvatar(file);
      setAvatarUrl(base64);
      handleSave()
      message.success("Фото загружено. Профиль обновлен");

      return false;
    },
  };

  if (loading) {
    return (
      <div className={styles.loadingWrapper}>
        <Spin size="large" />
      </div>
    );
  }

  const roleInfo = ROLE_LABELS[profile?.role ?? "admin"];

  const handleAdminChange = async (checked: boolean) => {
    const newRole = checked ? "admin" : "user";
    setRole(newRole);

    setProfile((prev) => prev ? { ...prev, role: newRole } : prev);

    await updateProfile({ 
      role: newRole,
    });
  };

  return (
    <div className={styles.page}>
      <ConfigProvider
        theme={{
          components: {
            Button: {
              colorPrimaryBgHover: "#5c9475",
              colorPrimary: "#f6f6f6",
              colorPrimaryActive: "#2a94308f"

            }
          },
          token: {
            colorPrimary: "#5c9475",
            //colorText: "#5c9475",
          },
        }}
      >
        {/* карточка слева */}

        <div className={styles.card}>
          <div className={styles.avatarWrapper}>
            <Avatar
              size={110}
              src={avatarUrl ?? undefined}
              icon={!avatarUrl && <UserOutlined />}
              className={styles.avatar}
            />
            <Upload {...uploadProps}>
              <button className={styles.avatarEditButton} title="Сменить фото">
                <CameraOutlined />
              </button>
            </Upload>
          </div>

          <h2 className={styles.cardName}>{profile?.username}</h2>
          <p className={styles.cardEmail}>{profile?.email}</p>
          <Tag color={roleInfo.color} className={styles.roleTag}>
            {roleInfo.label}
          </Tag>

          <Switch
            className={styles.adminSwitch}
            onChange={handleAdminChange}
            checked={role=== "admin"}
            unCheckedChildren="User"
            checkedChildren="Admin"
          />

          <div className={styles.divider} />

          <div className={styles.stats}>
            <div className={styles.statItem}>
              <span className={styles.statIcon}>
                <CalendarOutlined />
              </span>
              <div>
                <div className={styles.statValue}>
                  {stats.daysInSystem}
                </div>
                <div className={styles.statLabel}>дней в системе</div>
              </div>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statIcon}>
                <ThunderboltOutlined />
              </span>
              <div>
                <div className={styles.statValue}>
                  {stats.totalEntries}
                </div>
                <div className={styles.statLabel}>записей</div>
              </div>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statIcon}>
                <FireOutlined />
              </span>
              <div>
                <div className={styles.statValue}>
                  {stats.averageCalories}
                </div>
                <div className={styles.statLabel}>ккал / день</div>
              </div>
            </div>
          </div>

          <div className={styles.divider} />

          <p className={styles.cardMeta}>
            Зарегистрирован:{" "}
            {profile?.createdAt
              ? dayjs(profile.createdAt).format("DD.MM.YYYY")
              : "—"}
          </p>
        </div>

        {/* карточка справа */}
        <div className={styles.formSection}>
          <div className={styles.formHeader}>
            <h2 className={styles.formTitle}>Личные данные</h2>            
              <div className={styles.formActions}>
                <Button
                  type="primary"
                  icon={<SaveOutlined />}
                  onClick={handleSave}
                  loading={saving}
                  className={styles.saveBtn}
                >
                  Сохранить
                </Button>
              </div>
            
          </div>

          <Form
            onFinish={handleSave}
            form={form}
            layout="vertical"
            // disabled={!isEditing}
            className={styles.form}
          >
            <div className={styles.formGrid}>
              <Form.Item
                name="username"
                label="Имя пользователя"
                
                rules={[
                  {
                    required: true,
                    message: "Введите имя",
                  },
                ]}
              >
                <Input prefix={<UserOutlined />} placeholder="Ваше имя" />
              </Form.Item>

              <Form.Item
                name="email"
                label="Email"
                rules={[
                  {
                    required: true,
                    type: "email",
                    message: "Введите корректный email",
                  },
                ]}
              >
                <Input placeholder="email@example.com" />
              </Form.Item>

              <Form.Item name="gender" label="Пол">
                <Select options={GENDER_OPTIONS} placeholder="Выберите пол" />
              </Form.Item>

              <Form.Item name="birthDate" label="Дата рождения">
                <DatePicker
                  style={{ width: "100%" }}
                  format="DD.MM.YYYY"
                  placeholder="Выберите дату"
                />
              </Form.Item>

              <Form.Item
                name="calorieGoal"
                label="Цель по калориям (ккал/день)"
                rules={[
                  {
                    required: true,
                    message: "Укажите цель",
                  },
                ]}
              >
                <InputNumber
                  min={500}
                  max={10000}
                  style={{ width: "100%" }}
                  addonAfter="ккал"
                />
              </Form.Item>
            </div>
          </Form>

          <div className={styles.passwordSection}>
            <h3 className={styles.passwordTitle}>Безопасность</h3>
            <Button disabled>Сменить пароль</Button>
            <span className={styles.passwordHint}>Недоступно</span>
          </div>
        </div>
      </ConfigProvider>
    </div>
  );
};

export default ProfilePage;
