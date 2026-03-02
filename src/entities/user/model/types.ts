export type UserRole = "admin" | "user";
export type UserGender = "male" | "female" | "other";

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  gender: UserGender;
  birthDate: string;
  calorieGoal: number;
  avatarUrl: string | null;
  role: UserRole;
  createdAt: string;
}

export interface UserStats {
  daysInSystem: number;
  totalEntries: number;
  avgCaloriesPerDay: number;
}
