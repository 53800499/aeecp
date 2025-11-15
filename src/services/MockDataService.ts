/** @format */

import type { IDataService } from "./interfaces/IDataService";

// Service générique pour les données mock
// Respecte le principe Single Responsibility (SOLID)
export class MockDataService<
  T extends { id: string; createdAt: Date; updatedAt: Date }
> implements IDataService<T>
{
  private data: T[] = [];

  constructor(initialData: T[] = []) {
    this.data = initialData;
  }

  async getAll(): Promise<T[]> {
    return Promise.resolve([...this.data]);
  }

  async getById(id: string): Promise<T | null> {
    const item = this.data.find((item) => item.id === id);
    return Promise.resolve(item || null);
  }

  async create(data: Omit<T, "id" | "createdAt" | "updatedAt">): Promise<T> {
    const newItem = {
      ...data,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date(),
      updatedAt: new Date()
    } as T;
    this.data.push(newItem);
    return Promise.resolve(newItem);
  }

  async update(id: string, data: Partial<T>): Promise<T> {
    const index = this.data.findIndex((item) => item.id === id);
    if (index === -1) {
      throw new Error("Item not found");
    }
    this.data[index] = {
      ...this.data[index],
      ...data,
      updatedAt: new Date()
    };
    return Promise.resolve(this.data[index]);
  }

  async delete(id: string): Promise<boolean> {
    const index = this.data.findIndex((item) => item.id === id);
    if (index === -1) {
      return Promise.resolve(false);
    }
    this.data.splice(index, 1);
    return Promise.resolve(true);
  }

  // Méthodes utilitaires
  setData(data: T[]): void {
    this.data = data;
  }

  getData(): T[] {
    return [...this.data];
  }
}
