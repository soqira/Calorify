import { Routes, Route } from "react-router-dom";
import { useState } from "react";
import dayjs from "dayjs";
import "dayjs/locale/ru";
import LoginPage from "../pages/Auth/LoginPage/ui/LoginPage";
import DashboardPage from "../pages/DashboardPage/ui/DashboardPage";
import UnknownPage from "../pages/UnknownPage/ui/UnknownPage";
import RegistrationPage from "../pages/Auth/RegistrationPage/ui/RegistrationPage";
import ProfilePage from "../pages/ProfilePage/ui/ProfilePage";
import CaloriesPage from "../pages/calories-page/calories.page";
import AdminPage from "../pages/AdminPage/ui/Adminpage";
import MainLayout from "../components/ui/MainLayout";
import ColorifyControlPanel from "../pages/Admin/ColorifyControlPanel/ui/ColorifyControlPanel";

dayjs.locale("ru");

export const App = () => {
  const [role, setRole] = useState<"admin" | "user">("user");
  return (
    <MainLayout role={role}>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/registration" element={<RegistrationPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/unknown" element={<UnknownPage />} />
        <Route
          path="/profile"
          element={<ProfilePage role={role} setRole={setRole} />}
        />
        <Route path="/calories" element={<CaloriesPage />} />
        <Route path="/adminpage" element={<AdminPage />} />
        <Route path="/clrfpanel" element={<ColorifyControlPanel />} />
      </Routes>
    </MainLayout>
  );
};

export default App;
