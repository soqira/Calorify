// shared/widgets/MainLayout/MainLayout.tsx

import React, { useEffect, useState } from "react";
import { Layout, Avatar, Dropdown, Typography, Badge } from "antd";
import type { MenuProps } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import {
  UserOutlined,
  LogoutOutlined,
  DashboardOutlined,
  ExperimentOutlined,
  PieChartOutlined,
} from "@ant-design/icons";
import { fetchProfile } from "../../entities/user/model/profileService";
import { logoutUser } from "../../entities/user/model/authService";
import styles from "../MainLayout.module.css";

const { Header, Content, Footer } = Layout;
const { Text } = Typography;

interface MainLayoutProps {
  children: React.ReactNode;
}

const NAV_LINKS = [
  // {
  //   label: "Калории",
  //   path: "/calories",
  //   icon: <FireOutlined />,
  // },

  {
    label: "Калькулятор",
    path: "/unknown",
    icon: <ExperimentOutlined />,
  },
  {
    label: "Мои продукты",
    path: "/unknown",
    icon: <PieChartOutlined />,
  },
  {
    label: "Dashboard",
    path: "/dashboard",
    icon: <DashboardOutlined />,
    adminOnly: true,
  },
  {
    label: "CLRF PANEL",
    path: "/clrfpanel",
    icon: <DashboardOutlined />,
    adminOnly: true,
  },
];

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [role, setRole] = useState<"admin" | "user">("user");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [username, setUsername] = useState("Пользователь");

  useEffect(() => {
    fetchProfile().then((p) => {
      setAvatarUrl(p.avatarUrl);
      setUsername(p.username);
      setRole(p.role);
    });
  }, []);

  const handleLogout = () => {
    logoutUser();
    navigate("/");
  };

  const userMenuItems: MenuProps["items"] = [
    {
      key: "profile",
      icon: <UserOutlined />,
      label: "Профиль",
      onClick: () => navigate("/profile"),
    },
    { type: "divider" },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Выйти",
      danger: true,
      onClick: handleLogout,
    },
  ];
  return (
    <Layout className={styles.layout}>
      <Header className={styles.header}>
        <div className={styles.headerInner}>
          {/* лого */}
          <div className={styles.logo} onClick={() => navigate("/calories")}>
            <span className={styles.logoIcon}>🥗</span>
            <span className={styles.logoText}>Calorify</span>
          </div>

          {/* навигация */}
          <nav className={styles.nav}>
            {NAV_LINKS.filter((link) => {
              if (link.adminOnly && role !== "admin") return false;
              return true;
            }).map((link) => (
              <button
                key={link.path}
                className={`${styles.navLink} ${
                  location.pathname === link.path ? styles.navLinkActive : ""
                }`}
                onClick={() => navigate(link.path)}
              >
                {link.icon}
                <span>{link.label}</span>
              </button>
            ))}
          </nav>
          {/* профиль */}
          <Dropdown
            menu={{ items: userMenuItems }}
            placement="bottomRight"
            trigger={["click"]}
          >
            <div className={styles.userArea}>
              <Badge dot count="99999" color={"green"} status="processing">
                <Avatar
                  size={34}
                  src={avatarUrl ?? undefined}
                  icon={!avatarUrl ? <UserOutlined /> : undefined}
                  className={styles.avatar}
                />
              </Badge>
              <Text className={styles.userName}>{username}</Text>
            </div>
          </Dropdown>
        </div>
      </Header>

      {/* контент страницы */}
      <Content className={styles.content}>
        <div className={styles.contentInner}>{children}</div>
      </Content>

      <Footer className={styles.footer}>
        <div className={styles.footerInner}>
          <span className={styles.footerLogo}>🥗 Calorify</span>
          <div className={styles.footerLinks}>
            <a
              className={styles.footerLink}
              href=""
              onClick={() => navigate("/unknown")}
            >
              Контакты
            </a>
            <a
              className={styles.footerLink}
              href=""
              onClick={() => navigate("/unknown")}
            >
              О сервисе
            </a>
            <a
              className={styles.footerLink}
              href=""
              onClick={() => navigate("/unknown")}
            >
              Политика
            </a>
          </div>
          <span className={styles.footerCopy}>© 2025 Calorify</span>
        </div>
      </Footer>
    </Layout>
  );
};

export default MainLayout;
