import React from "react";
import {
  Modal,
  Form,
  Input,
  Select,
  InputNumber,
  Button,
  Upload,
  message,
} from "antd";
import type { UploadProps } from "antd";
import {
  PlusCircleOutlined,
  MinusCircleOutlined,
  CameraOutlined,
} from "@ant-design/icons";

import { MEAL_TYPE_META } from "../../../entities/meal/model/mealTypes";
import { uploadMealPhoto } from "../../../entities/meal/model/mealService";

import styles from "./meal-modal.module.css";
import type { MealModalProps } from "./meal-modal.interface";

export const MealModal: React.FC<MealModalProps> = ({
  open,
  editingMeal,
  loading,
  pendingPhoto,
  setPendingPhoto,
  onCancel,
  onSubmit,
}) => {
  const [form] = Form.useForm();

  const values = {
    type: editingMeal?.type || "breakfast",
    note: editingMeal?.note || "",
    foods: editingMeal?.foods?.map((f) => ({
      name: f.calories,
      calories: f.calories,
      weight: f.weight,
    })) || [{ name: "", calories: 0, weight: 0 }],
  };

  const uploadProps: UploadProps = {
    showUploadList: false,
    accept: "image/*",
    beforeUpload: async (file) => {
      if (!file.type.startsWith("image/")) {
        message.error("Только изображения!");
        return false;
      }
      if (file.size / 1024 / 1024 > 5) {
        message.error("Максимум 5 МБ");
        return false;
      }
      const url = await uploadMealPhoto(file);
      setPendingPhoto(url);
      return false;
    },
  };

  React.useEffect(() => {
    if (open) {
      form.resetFields();
      form.setFieldsValue({ values });
    }
  }, [open, editingMeal]);

  return (
    <Modal
      title={
        <span className={styles.shared_meal_modal_title}>
          {editingMeal ? "Редактирование приема пищи" : "Новый прием пищи"}
        </span>
      }
      open={open}
      onCancel={onCancel}
      onOk={() => form.submit()}
      okText={editingMeal ? "Сохранить" : "Добавить"}
      cancelText="Отмена"
      confirmLoading={loading}
      okButtonProps={{ className: styles.shared_meal_modal_okbtn }}
      width={580}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        className={styles.shared_meal_modal_form}
        onFinish={onSubmit}
        initialValues={values}
      >
        <Form.Item name="type" label="Тип" rules={[{ required: true }]}>
          <Select
            options={Object.entries(MEAL_TYPE_META).map(([v, m]) => ({
              value: v,
              label: `${m.label}`,
            }))}
          />
        </Form.Item>

        {/* photo upload */}
        <Form.Item label="Фото">
          <div className={styles.shared_meal_modal_photo_upload_area}>
            {pendingPhoto ? (
              <div className={styles.shared_meal_modal_photo_preview_wrapper}>
                <img
                  src={pendingPhoto}
                  alt="preview"
                  className={styles.shared_meal_modal_photo_preview}
                />
                <Button
                  size="small"
                  danger
                  className={styles.shared_meal_modal_photo_remove_button}
                  onClick={() => setPendingPhoto(null)}
                >
                  Удалить фото
                </Button>
              </div>
            ) : (
              <Upload
                {...uploadProps}
                className={styles.shared_meal_modal_upload_wrapper}
              >
                <div className={styles.shared_meal_modal_upload_placeholder}>
                  <CameraOutlined
                    className={styles.shared_meal_modal_upload_icon}
                  />
                  <span>Загрузить фото</span>
                  <span className={styles.shared_meal_modal_upload_hint}>
                    JPG, PNG до 5 МБ
                  </span>
                </div>
              </Upload>
            )}
          </div>
        </Form.Item>

        {/* foods */}
        <Form.List name="foods">
          {(fields, { add, remove }) => (
            <div>
              <div className={styles.share_meal_modal_foodListHeader}>
                <span className={styles.share_meal_modal_foodListLabel}>
                  Продукты / блюда
                </span>
                <Button
                  type="link"
                  size="small"
                  icon={<PlusCircleOutlined />}
                  onClick={() => add({ name: "", calories: 0, weight: 0 })}
                  className={styles.share_meal_modal_addFoodBtn}
                >
                  Добавить продукт
                </Button>
              </div>

              {fields.map((field) => (
                <div
                  key={field.key}
                  className={styles.share_meal_modal_foodRow}
                >
                  <Form.Item
                    name={[field.name, "name"]}
                    rules={[{ required: true, message: "Название" }]}
                    noStyle
                  >
                    <Input
                      placeholder="Название"
                      className={styles.share_meal_modal_foodNameInput}
                    />
                  </Form.Item>

                  <Form.Item name={[field.name, "weight"]} noStyle>
                    <InputNumber
                      min={0}
                      placeholder="0"
                      addonAfter="г"
                      className={styles.share_meal_modal_foodNumberInput}
                    />
                  </Form.Item>

                  <Form.Item
                    name={[field.name, "calories"]}
                    rules={[{ required: true, message: "ккал" }]}
                    noStyle
                  >
                    <InputNumber
                      min={0}
                      placeholder="0"
                      addonAfter="ккал"
                      className={styles.share_meal_modal_foodNumberInput}
                    />
                  </Form.Item>

                  <Button
                    type="text"
                    danger
                    icon={<MinusCircleOutlined />}
                    onClick={() => remove(field.name)}
                    disabled={fields.length === 1}
                  />
                </div>
              ))}
            </div>
          )}
        </Form.List>

        <Form.Item name="note" style={{ marginTop: 16 }}>
          <Input.TextArea rows={2} placeholder="Комментарий..." />
        </Form.Item>
      </Form>
    </Modal>
  );
};
