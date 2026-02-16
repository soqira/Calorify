import React from "react";
import styles from "../MainLayout.module.css";
import { Layout, FloatButton } from "antd";

const { Header, Content, Footer } = Layout;

const MainLayout: React.FC = ({ children }) => {
  <FloatButton onClick={() => console.log("onClick")} />;
  return (
    <Layout className="layout">
      <Header className={styles.header}></Header>
      <Content>
        <div className="site-layout-content">{children}</div>
      </Content>
      <Footer className={styles.footer} style={{ textAlign: "center" }}>
        <div className={styles.footerContainer}>
          <a>Почта для связи</a>
          <a>Адрес</a>
          <a>Информация</a>
        </div>
      </Footer>
    </Layout>
  );
};

export default MainLayout;
