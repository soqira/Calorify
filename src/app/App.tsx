import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LoginPage } from "../pages/Auth/LoginPage/ui/LoginPage";
import { DashboardPage } from "../pages/DashboardPage/ui/DashboardPage";
import { UnknownPage } from "../pages/UnknownPage/ui/UnknownPage";
import { RegistrationPage } from "../pages/Auth/RegistrationPage/ui/RegistrationPage";
import { ProfilePage } from "../pages/ProfilePage/ui/ProfilePage";
import { CaloriesPage } from "../pages/CaloriesPage/ui/CaloriesPage";

import MainLayout from "../components/ui/MainLayout";

export const App = () => {
  return (
    <BrowserRouter>
      <MainLayout>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/registration" element={<RegistrationPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/unknown" element={<UnknownPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/calories" element={<CaloriesPage />} />
        </Routes>
      </MainLayout>
    </BrowserRouter>
  );
};

export default App;
