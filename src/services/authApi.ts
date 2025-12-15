/** @format */

import { ApiClient } from "@/lib/api/client";
import type { User } from "@/types";

// Types pour l'authentification
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  firstName?: string;
  lastName?: string;
  number?: string;
  role?: string;
  avatar?: string;
  isActive?: boolean;
}

export interface AuthResponse {
  access_token: string;
  user: {
    id: string;
    email: string;
    role?: string;
    name?: string;
  };
}

export interface AuthError {
  message: string;
  errors?: Record<string, string[]>;
}

// Service API pour l'authentification
export class AuthApiService {
  static async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await ApiClient.post<AuthResponse>("/auth/login", credentials);
     console.log("response", response);
    return response;
  }

  static async signup(data: SignupData): Promise<AuthResponse> {
    const response = await ApiClient.post<AuthResponse>("/auth/register", {
      email: data.email,
      password: data.password,
      name: data.name,
      firstName: data.firstName,
      lastName: data.lastName,
      number: data.number,
      role: data.role || "student",
      avatar: data.avatar,
      isActive: data.isActive !== undefined ? data.isActive : true
    });
    return response;
  }

  static async logout(): Promise<void> {
    try {
      await ApiClient.post("/auth/logout", {});
    } catch (error) {
      // Même en cas d'erreur, on déconnecte l'utilisateur côté client
      console.error("Erreur lors de la déconnexion:", error);
    }
  }

  static async refreshToken(refreshToken: string): Promise<AuthResponse> {
    const response = await ApiClient.post<AuthResponse>("/auth/refresh", {
      refreshToken
    });
    return response;
  }

  static async getCurrentUser(): Promise<User> {
    const response = await ApiClient.get<User>("/auth/profile");
    return response;
  }

  static async forgotPassword(email: string): Promise<{ message: string }> {
    const response = await ApiClient.post<{ message: string }>(
      "/auth/forgot-password",
      { email }
    );
    return response;
  }

  static async resetPassword(
    token: string,
    password: string
  ): Promise<{ message: string }> {
    const response = await ApiClient.post<{ message: string }>(
      "/auth/reset-password",
      { token, password }
    );
    return response;
  }
}

