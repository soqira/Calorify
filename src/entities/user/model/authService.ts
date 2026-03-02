//POST /api/auth/register registerUser()
//POST /api/auth/login loginUser()
//POST /api/auth/logout logoutUser()
//GET /api/auth/me getCurrentUser()

import type { UserProfile } from "./types";
import { updateProfile, fetchProfile } from "./profileService";

const SESSION_KEY = "calorify_session";

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  gender: string;
}

export async function registerUser(data: RegisterData): Promise<UserProfile> {
  const newProfile: UserProfile = {
    id: crypto.randomUUID(),
    username: data.username,
    email: data.email,
    gender: data.gender as UserProfile["gender"],
    birthDate: "",
    calorieGoal: 0,
    avatarUrl: null,
    role: "user",
    createdAt: new Date().toISOString(),
  };

  await updateProfile(newProfile);
  localStorage.setItem(SESSION_KEY, newProfile.id);

  return newProfile;
}

export interface LoginData {
  email: string;
  password: string;
}

export async function loginUser(data: LoginData): Promise<UserProfile> {
  const profile = await fetchProfile();

  if (profile.email !== data.email) {
    throw new Error("Пользователь с таким email не найден");
  }
  localStorage.setItem(SESSION_KEY, profile.id);
  return profile;
}

export function logoutUser(): void {
  localStorage.removeItem(SESSION_KEY);
}

export async function getCurrentUser(): Promise<UserProfile | null> {
  const sessionId = localStorage.getItem(SESSION_KEY);
  if (!sessionId) return null;

  return fetchProfile();
}
