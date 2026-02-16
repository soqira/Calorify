import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LoginPage } from "../pages/Auth/LoginPage/ui/LoginPage";
import { DashboardPage } from "../pages/DashboardPage/ui/DashboardPage";
import { UnknownPage } from "../pages/UnknownPage/ui/UnknownPage";
import { RegistrationPage } from "../pages/Auth/RegistrationPage/ui/RegistrationPage";

import MainLayout from "../components/ui/MainLayout";

export const App = () => {
  return (
    <BrowserRouter>
      <MainLayout>
        <Routes>
          <Route path="/" element={<RegistrationPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/unknown" element={<UnknownPage />} />
        </Routes>
      </MainLayout>
    </BrowserRouter>
  );
};

export default App;
