/** @format */

import { ApiClient } from "@/lib/api/client";
import type {
  Quarter,
  Building,
  Room,
  RoomOccupation,
  RentPayment
} from "@/types";

// Types pour les réponses paginées
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
}

// Types pour les query parameters
export interface QueryParams {
  page?: number;
  limit?: number;
  sort?: string;
  [key: string]: string | number | undefined;
}

// Service API pour les résidences
export class ResidenceApiService {
  // Quartiers
  static async getQuarters(params?: QueryParams): Promise<Quarter[]> {
    const queryString = params
      ? `?${new URLSearchParams(
          Object.entries(params).reduce(
            (acc, [key, value]) => {
              if (value !== undefined) {
                acc[key] = String(value);
              }
              return acc;
            },
            {} as Record<string, string>
          )
        ).toString()}`
      : "";
    const response = await ApiClient.get<PaginatedResponse<Quarter>>(
      `/residence/quarters${queryString}`
    );
    return response.items || [];
  }

  static async getQuarterById(id: string): Promise<Quarter> {
    const response = await ApiClient.get<Quarter>(`/residence/quarters/${id}`);
    return response;
  }

  static async createQuarter(
    data: Omit<Quarter, "id" | "createdAt" | "updatedAt">
  ): Promise<Quarter> {
    const response = await ApiClient.post<Quarter>("/residence/quarters", data);
    return response;
  }

  static async updateQuarter(
    id: string,
    data: Partial<Quarter>
  ): Promise<Quarter> {
    const response = await ApiClient.patch<Quarter>(
      `/residence/quarters/${id}`,
      data
    );
    return response;
  }

  static async deleteQuarter(id: string): Promise<boolean> {
    await ApiClient.delete(`/residence/quarters/${id}`);
    return true;
  }

  // Bâtiments
  static async getBuildings(params?: QueryParams & { quarterId?: string }): Promise<Building[]> {
    const queryString = params
      ? `?${new URLSearchParams(
          Object.entries(params).reduce(
            (acc, [key, value]) => {
              if (value !== undefined) {
                acc[key] = String(value);
              }
              return acc;
            },
            {} as Record<string, string>
          )
        ).toString()}`
      : "";
    const response = await ApiClient.get<PaginatedResponse<Building>>(
      `/residence/buildings${queryString}`
    );
    return response.items || [];
  }

  static async getBuildingsByQuarter(quarterId: string): Promise<Building[]> {
    const response = await ApiClient.get<Building[]>(
      `/residence/buildings/quarter/${quarterId}`
    );
    return Array.isArray(response) ? response : [];
  }

  static async getBuildingById(id: string): Promise<Building> {
    const response = await ApiClient.get<Building>(`/residence/buildings/${id}`);
    return response;
  }

  static async createBuilding(
    data: Omit<Building, "id" | "createdAt" | "updatedAt">
  ): Promise<Building> {
    const response = await ApiClient.post<Building>("/residence/buildings", data);
    return response;
  }

  static async updateBuilding(
    id: string,
    data: Partial<Building>
  ): Promise<Building> {
    const response = await ApiClient.patch<Building>(
      `/residence/buildings/${id}`,
      data
    );
    return response;
  }

  static async deleteBuilding(id: string): Promise<boolean> {
    await ApiClient.delete(`/residence/buildings/${id}`);
    return true;
  }

  // Chambres
  static async getRooms(
    params?: QueryParams & { buildingId?: string; status?: string }
  ): Promise<Room[]> {
    const queryString = params
      ? `?${new URLSearchParams(
          Object.entries(params).reduce(
            (acc, [key, value]) => {
              if (value !== undefined) {
                acc[key] = String(value);
              }
              return acc;
            },
            {} as Record<string, string>
          )
        ).toString()}`
      : "";
    const response = await ApiClient.get<PaginatedResponse<Room>>(
      `/residence/rooms${queryString}`
    );
    return response.items || [];
  }

  static async getRoomsByBuilding(buildingId: string): Promise<Room[]> {
    const response = await ApiClient.get<Room[]>(
      `/residence/rooms/building/${buildingId}`
    );
    return Array.isArray(response) ? response : [];
  }

  static async getRoomById(id: string): Promise<Room> {
    const response = await ApiClient.get<Room>(`/residence/rooms/${id}`);
    return response;
  }

  static async createRoom(
    data: Omit<Room, "id" | "createdAt" | "updatedAt">
  ): Promise<Room> {
    const response = await ApiClient.post<Room>("/residence/rooms", data);
    return response;
  }

  static async updateRoom(id: string, data: Partial<Room>): Promise<Room> {
    const response = await ApiClient.patch<Room>(`/residence/rooms/${id}`, data);
    return response;
  }

  static async deleteRoom(id: string): Promise<boolean> {
    await ApiClient.delete(`/residence/rooms/${id}`);
    return true;
  }

  // Occupations
  static async getOccupations(
    params?: QueryParams & {
      roomId?: string;
      studentId?: string;
      isActive?: string | boolean;
    }
  ): Promise<RoomOccupation[]> {
    const queryParams: Record<string, string> = {};
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          // Convertir boolean en string pour les query params
          queryParams[key] =
            typeof value === "boolean" ? String(value) : String(value);
        }
      });
    }
    const queryString =
      Object.keys(queryParams).length > 0
        ? `?${new URLSearchParams(queryParams).toString()}`
        : "";
    const response = await ApiClient.get<PaginatedResponse<RoomOccupation>>(
      `/residence/room-occupations${queryString}`
    );
    return response.items || [];
  }

  static async getOccupationsByRoom(roomId: string): Promise<RoomOccupation[]> {
    const response = await ApiClient.get<RoomOccupation[]>(
      `/residence/room-occupations/room/${roomId}`
    );
    return Array.isArray(response) ? response : [];
  }

  static async getOccupationsByStudent(
    studentId: string
  ): Promise<RoomOccupation[]> {
    const response = await ApiClient.get<RoomOccupation[]>(
      `/residence/room-occupations/student/${studentId}`
    );
    return Array.isArray(response) ? response : [];
  }

  static async getActiveOccupations(): Promise<RoomOccupation[]> {
    const queryParams: QueryParams & {
      roomId?: string;
      studentId?: string;
      isActive?: string;
    } = { isActive: "true" };
    return this.getOccupations(queryParams);
  }

  static async getOccupationById(id: string): Promise<RoomOccupation> {
    const response = await ApiClient.get<RoomOccupation>(
      `/residence/room-occupations/${id}`
    );
    return response;
  }

  static async createOccupation(
    data: Omit<RoomOccupation, "id" | "createdAt" | "updatedAt">
  ): Promise<RoomOccupation> {
    const response = await ApiClient.post<RoomOccupation>(
      "/residence/room-occupations",
      data
    );
    return response;
  }

  static async updateOccupation(
    id: string,
    data: Partial<RoomOccupation>
  ): Promise<RoomOccupation> {
    const response = await ApiClient.patch<RoomOccupation>(
      `/residence/room-occupations/${id}`,
      data
    );
    return response;
  }

  static async deleteOccupation(id: string): Promise<boolean> {
    await ApiClient.delete(`/residence/room-occupations/${id}`);
    return true;
  }

  // Paiements de loyer (Note: Ces endpoints ne sont pas documentés dans la spec fournie)
  // Je garde les endpoints existants mais ils devront peut-être être ajustés
  static async getRentPayments(
    params?: QueryParams & { occupationId?: string }
  ): Promise<RentPayment[]> {
    const queryString = params
      ? `?${new URLSearchParams(
          Object.entries(params).reduce(
            (acc, [key, value]) => {
              if (value !== undefined) {
                acc[key] = String(value);
              }
              return acc;
            },
            {} as Record<string, string>
          )
        ).toString()}`
      : "";
    const response = await ApiClient.get<PaginatedResponse<RentPayment>>(
      `/residence/rent-payments${queryString}`
    );
    return response.items || [];
  }

  static async getRentPaymentsByOccupation(
    occupationId: string
  ): Promise<RentPayment[]> {
    return this.getRentPayments({ occupationId });
  }

  static async getRentPaymentById(id: string): Promise<RentPayment> {
    const response = await ApiClient.get<RentPayment>(
      `/residence/rent-payments/${id}`
    );
    return response;
  }

  static async createRentPayment(
    data: Omit<RentPayment, "id" | "createdAt" | "updatedAt">
  ): Promise<RentPayment> {
    const response = await ApiClient.post<RentPayment>(
      "/residence/rent-payments",
      data
    );
    return response;
  }

  static async updateRentPayment(
    id: string,
    data: Partial<RentPayment>
  ): Promise<RentPayment> {
    const response = await ApiClient.patch<RentPayment>(
      `/residence/rent-payments/${id}`,
      data
    );
    return response;
  }

  static async deleteRentPayment(id: string): Promise<boolean> {
    await ApiClient.delete(`/residence/rent-payments/${id}`);
    return true;
  }
}
