import axios, { AxiosResponse } from "axios";

const API = `${process.env.NEXT_PUBLIC_BASE_URL}/employee`;

const getToken = (): string | null =>
  typeof window !== "undefined" ? localStorage.getItem("EMS_token") : null;

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
}

interface HomeStats {
  usersCount: number;
  employeesCount: number;
  role: string;
}

interface Employee {
    id?: string;
    name?: string;
    email?: string;
    position?: string;
    department?: string;
    gender?: string;
    city?: string;
    age?: number;
    salary?: number;
    phone?: string;
    hireDate?: string;
    updatedAt?: string;
    createdAt?: string;
    birthday?: string;
    image?: string;
}

export const employeeService = {
  getAllEmployees,
  createEmployee,
  updateEmployee,
  getEmployeeById,
  deleteEmployee,
  searchEmployees,
  getHomeStats,
};

function getAllEmployees(): Promise<AxiosResponse<ApiResponse<Employee[]>>> {
  const token = getToken();
  return axios.get(`${API}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

function createEmployee(data: FormData): Promise<AxiosResponse<ApiResponse<Employee>>> {
  const token = getToken();
  return axios.post(`${API}/create`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

function updateEmployee(data: FormData): Promise<AxiosResponse<ApiResponse<Employee>>> {
  const token = getToken();
  return axios.put(`${API}/update`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

function getEmployeeById(id: string): Promise<AxiosResponse<ApiResponse<Employee>>> {
  const token = getToken();
  return axios.get(`${API}/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

function deleteEmployee(id: string): Promise<AxiosResponse<ApiResponse<null>>> {
  const token = getToken();
  return axios.delete(`${API}/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

function searchEmployees(query: string): Promise<AxiosResponse<ApiResponse<Employee[]>>> {
  const token = getToken();
  return axios.get(`${API}/search?query=${query}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

function getHomeStats(): Promise<AxiosResponse<ApiResponse<HomeStats>>> {
  const token = getToken(); 
  return axios.get(`${API}/home_stats`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}
