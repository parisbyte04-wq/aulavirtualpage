import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type { User } from "../types";
import { auth as authApi, decodeToken } from "../services/api";

export const useAuthStore = defineStore("auth", () => {
  const token = ref<string | null>(localStorage.getItem("token"));
  function initUser(): User | null {
    const t = localStorage.getItem("token");
    if (!t) return null;
    const payload = decodeToken(t);
    if (!payload) return null;
    return { id: payload.userId, email: "", name: "", role: payload.role, avatarUrl: null };
  }

  const user = ref<User | null>(initUser());

  const isAuthenticated = computed(() => !!token.value);
  const isAdmin = computed(() => user.value?.role === "admin");
  const isStudent = computed(() => user.value?.role === "student");

  async function login(email: string, password: string) {
    const res = await authApi.login(email, password);
    token.value = res.token;
    user.value = res.user;
    localStorage.setItem("token", res.token);
    return res;
  }

  async function register(name: string, email: string, password: string) {
    const res = await authApi.register(name, email, password);
    token.value = res.token;
    user.value = res.user;
    localStorage.setItem("token", res.token);
    return res;
  }

  async function fetchProfile() {
    try {
      const profile = await authApi.getProfile();
      if (user.value) {
        user.value.name = profile.name;
        user.value.email = profile.email;
        user.value.avatarUrl = profile.avatarUrl;
      } else {
        user.value = profile;
      }
    } catch {
      logout();
    }
  }

  function setAvatar(url: string) {
    if (user.value) user.value.avatarUrl = url;
  }

  function logout() {
    token.value = null;
    user.value = null;
    localStorage.removeItem("token");
  }

  return { user, token, isAuthenticated, isAdmin, isStudent, login, register, fetchProfile, setAvatar, logout };
});
