/** @format */

import { ApiClient } from "@/lib/api/client";
import type { Student, User } from "@/types";
import type { PaginatedResponse, QueryParams } from "./residenceApi";

// Service API pour les étudiants et utilisateurs
export class StudentApiService {
  // Étudiants
  static async getStudents(
    params?: QueryParams & {
      status?: string;
      levelStudy?: string;
    }
  ): Promise<Student[]> {
    const queryParams: Record<string, string> = {};
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams[key] = String(value);
        }
      });
    }
    const queryString =
      Object.keys(queryParams).length > 0
        ? `?${new URLSearchParams(queryParams).toString()}`
        : "";
    const response = await ApiClient.get<PaginatedResponse<Student>>(
      `/students${queryString}`
    );
    return response.items || [];
  }

  static async getStudentById(id: string): Promise<Student> {
    const response = await ApiClient.get<Student>(`/students/${id}`);
    return response;
  }

  static async getStudentByUserId(userId: string): Promise<Student> {
    const response = await ApiClient.get<Student>(`/students/user/${userId}`);
    return response;
  }

  static async getStudentByRegistrationNumber(
    registrationNumber: string
  ): Promise<Student> {
    const response = await ApiClient.get<Student>(
      `/students/registration/${registrationNumber}`
    );
    return response;
  }

  static async createStudent(
    data: Omit<Student, "id" | "createdAt" | "updatedAt">
  ): Promise<Student> {
    // Convertir les noms de champs du frontend vers le backend
    const studentData = data as Student & { registrationNumber?: string };
    const backendData = {
      userId: data.userId,
      registrationNumber: studentData.registrationNumber || data.matricule,
      dateOfBirth: data.dateOfBirth,
      gender: data.gender,
      levelStudy: data.level,
      faculty: data.faculty,
      fieldOfStudy: data.fieldOfStudy,
      country: data.country,
      city: data.city,
      status: data.status
    };
    const response = await ApiClient.post<Student>("/students", backendData);
    return response;
  }

  static async updateStudent(
    id: string,
    data: Partial<Student>
  ): Promise<Student> {
    // Convertir les noms de champs du frontend vers le backend
    const backendData: Record<string, unknown> = {};
    if (data.dateOfBirth !== undefined) backendData.dateOfBirth = data.dateOfBirth;
    if (data.gender !== undefined) backendData.gender = data.gender;
    if (data.level !== undefined) backendData.levelStudy = data.level;
    if (data.faculty !== undefined) backendData.faculty = data.faculty;
    if (data.fieldOfStudy !== undefined) backendData.fieldOfStudy = data.fieldOfStudy;
    if (data.country !== undefined) backendData.country = data.country;
    if (data.city !== undefined) backendData.city = data.city;
    if (data.status !== undefined) backendData.status = data.status;

    const response = await ApiClient.patch<Student>(`/students/${id}`, backendData);
    return response;
  }

  static async deleteStudent(id: string): Promise<boolean> {
    await ApiClient.delete(`/students/${id}`);
    return true;
  }

  // Utilisateurs (pour les étudiants)
  // Note: Les endpoints users ne sont pas documentés dans la spec fournie
  // Je garde les endpoints existants mais ils devront peut-être être ajustés
  static async getUsers(params?: QueryParams & { role?: string }): Promise<User[]> {
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
    const response = await ApiClient.get<PaginatedResponse<User>>(
      `/users${queryString}`
    );
    return response.items || [];
  }

  static async getUserById(id: string): Promise<User> {
    const response = await ApiClient.get<User>(`/users/${id}`);
    return response;
  }

  static async getUsersByRole(role: string): Promise<User[]> {
    return this.getUsers({ role });
  }
}
