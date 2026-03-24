import type { UserProfile } from "./types";

const STORAGE_KEY = "calorify_user_profile";

const DEFAULT_PROFILE: UserProfile = {
  id: "1",
  username: "Calorify User",
  email: "calorify@gmail.com",
  gender: "male",
  birthDate: "1995-06-15",
  calorieGoal: 0,
  avatarUrl: null,
  role: "user",
  createdAt: new Date().toISOString(),
  daysInSystem: 10,
  totalEntries: 0,
  averageCalories: 0
};

export async function fetchProfile(): Promise<UserProfile> {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return DEFAULT_PROFILE;
  return JSON.parse(raw) as UserProfile;
}

export async function updateProfile(
  data: Partial<UserProfile>,
): Promise<UserProfile> {
  const current = await fetchProfile();
  const updated = { ...current, ...data };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
}

export async function uploadAvatar(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
