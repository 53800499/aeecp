/** @format */

import { getApiUrl } from "./config";

// Types pour les réponses API
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface ApiError {
  message: string;
  status?: number;
  errors?: Record<string, string[]>;
}

// Fonction utilitaire pour gérer les erreurs
const handleError = async (response: Response): Promise<never> => {
  let error: ApiError;
  try {
    const errorData = await response.json();
    error = {
      message: errorData.message || "Une erreur est survenue",
      status: response.status,
      errors: errorData.errors
    };
  } catch {
    error = {
      message: `Erreur ${response.status}: ${response.statusText}`,
      status: response.status
    };
  }
  throw error;
};

// Client API générique
export class ApiClient {
  private static async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = getApiUrl(endpoint);
    const defaultHeaders: HeadersInit = {
      "Content-Type": "application/json"
    };

    // Ajouter le token d'authentification si disponible
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        defaultHeaders["Authorization"] = `Bearer ${token}`;
      }
    }

    const config: RequestInit = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers
      }
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        await handleError(response);
      }

      // Si la réponse est vide (204 No Content)
      if (response.status === 204) {
        return {} as T;
      }

      const data = await response.json();
      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw {
          message: error.message,
          status: 0
        } as ApiError;
      }
      throw error;
    }
  }

  static async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "GET" });
  }

  static async post<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: data ? JSON.stringify(data) : undefined
    });
  }

  static async put<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined
    });
  }

  static async patch<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: "PATCH",
      body: data ? JSON.stringify(data) : undefined
    });
  }

  static async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "DELETE" });
  }
}


