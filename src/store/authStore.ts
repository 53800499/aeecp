/** @format */

import { create } from "zustand";
import type { User } from "@/types";
import { UserRole } from "@/types";
import { AuthApiService } from "@/services/authApi";

interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  clearError: () => void;
  checkAuth: () => Promise<void>;
  init: () => void;
}

// Fonction pour charger depuis localStorage
const loadFromStorage = () => {
  if (typeof window === "undefined") return null;
  try {
    const stored = localStorage.getItem("auth-storage");
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error("Erreur lors du chargement de l'état d'authentification:", error);
  }
  return null;
};

// Fonction pour sauvegarder dans localStorage
const saveToStorage = (state: Partial<AuthState>) => {
  if (typeof window === "undefined") return;
  try {
    const toSave = {
      user: state.user,
      token: state.token,
      refreshToken: state.refreshToken,
      isAuthenticated: state.isAuthenticated
    };
    localStorage.setItem("auth-storage", JSON.stringify(toSave));
  } catch (error) {
    console.error("Erreur lors de la sauvegarde de l'état d'authentification:", error);
  }
};

export const useAuthStore = create<AuthState>()((set, get) => ({
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email: string, password: string) => {
        try {
          set({ isLoading: true, error: null });
          const response = await AuthApiService.login({ email, password });
          // Le backend retourne access_token au lieu de token
          const token = response.access_token;
          // Convertir la réponse user du backend vers le format User complet
          const user: User = {
            id: response.user.id,
            email: response.user.email,
            name: response.user.name || "",
            role: (response.user.role as UserRole) || UserRole.Student,
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date()
          };
          set({
            user,
            token,
            refreshToken: null, // Le backend ne retourne pas de refreshToken dans la doc
            isAuthenticated: true,
            isLoading: false,
            error: null
          });
          // Stocker le token dans localStorage pour le client API
          if (typeof window !== "undefined") {
            localStorage.setItem("token", token);
          }
        } catch (error: unknown) {
          const errorMessage =
            error && typeof error === "object" && "message" in error
              ? (error.message as string)
              : "Une erreur est survenue lors de la connexion";
          set({
            isLoading: false,
            error: errorMessage,
            isAuthenticated: false
          });
          throw error;
        }
      },

      signup: async (name: string, email: string, password: string) => {
        try {
          set({ isLoading: true, error: null });
          const response = await AuthApiService.signup({
            name,
            email,
            password,
            confirmPassword: password,
            role: "student"
          });
          // Le backend retourne access_token au lieu de token
          const token = response.access_token;
          // Convertir la réponse user du backend vers le format User complet
          const user: User = {
            id: response.user.id,
            email: response.user.email,
            name: response.user.name || name,
            role: (response.user.role as UserRole) || UserRole.Student,
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date()
          };
          set({
            user,
            token,
            refreshToken: null, // Le backend ne retourne pas de refreshToken dans la doc
            isAuthenticated: true,
            isLoading: false,
            error: null
          });
          // Stocker le token dans localStorage pour le client API
          if (typeof window !== "undefined") {
            localStorage.setItem("token", token);
          }
        } catch (error: unknown) {
          const errorMessage =
            error && typeof error === "object" && "message" in error
              ? (error.message as string)
              : "Une erreur est survenue lors de l'inscription";
          set({
            isLoading: false,
            error: errorMessage,
            isAuthenticated: false
          });
          throw error;
        }
      },

      logout: async () => {
        try {
          await AuthApiService.logout();
        } catch (error) {
          console.error("Erreur lors de la déconnexion:", error);
        } finally {
          set({
            user: null,
            token: null,
            refreshToken: null,
            isAuthenticated: false,
            error: null
          });
          if (typeof window !== "undefined") {
            localStorage.removeItem("token");
            localStorage.removeItem("refreshToken");
          }
        }
      },

      setUser: (user: User | null) => {
        set({ user });
      },

      setToken: (token: string | null) => {
        set({ token });
        if (typeof window !== "undefined") {
          if (token) {
            localStorage.setItem("token", token);
          } else {
            localStorage.removeItem("token");
          }
        }
      },

      clearError: () => {
        set({ error: null });
      },

      checkAuth: async () => {
        try {
          const { token } = get();
          if (!token) {
            set({ isAuthenticated: false, user: null });
            return;
          }

          const user = await AuthApiService.getCurrentUser();
          set({ user, isAuthenticated: true });
          saveToStorage({ user, token, isAuthenticated: true });
        } catch {
          set({
            isAuthenticated: false,
            user: null,
            token: null,
            refreshToken: null
          });
          if (typeof window !== "undefined") {
            localStorage.removeItem("token");
            localStorage.removeItem("refreshToken");
            localStorage.removeItem("auth-storage");
          }
        }
      },

      init: () => {
        const stored = loadFromStorage();
        if (stored) {
          set({
            user: stored.user,
            token: stored.token,
            refreshToken: stored.refreshToken,
            isAuthenticated: stored.isAuthenticated || false
          });
          // Synchroniser avec localStorage pour le token
          if (stored.token && typeof window !== "undefined") {
            localStorage.setItem("token", stored.token);
            if (stored.refreshToken) {
              localStorage.setItem("refreshToken", stored.refreshToken);
            }
          }
        }
      }
    })
  );

// Initialiser depuis localStorage au chargement
if (typeof window !== "undefined") {
  useAuthStore.getState().init();
}

