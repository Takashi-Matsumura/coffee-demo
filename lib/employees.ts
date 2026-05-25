import employeesData from "@/data/employees.json";
import type { Employee } from "./types";

const employees = employeesData as Employee[];

export function listEmployees(): Employee[] {
  return employees;
}

export function findEmployee(id: string): Employee | undefined {
  return employees.find((e) => e.id === id);
}

export function listDepartments(): string[] {
  return Array.from(new Set(employees.map((e) => e.department)));
}
