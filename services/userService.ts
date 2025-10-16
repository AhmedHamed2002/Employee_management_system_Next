import axios, { AxiosResponse } from "axios";

const API = `${process.env.NEXT_PUBLIC_BASE_URL}/user`;

const getToken = (): string | null => 
    typeof window !== "undefined" ? localStorage.getItem("EMS_token") : null;

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface ResetPasswordPayload {
    token: string;
    newPassword: string;
}

export interface UserProfile {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    image?: string;
    role?: string;
}

export const userService = {
    register,
    login,
    checkToken,
    profile,
    updateProfile,
    logout,
    forgotPassword,
    resetPassword,
};

// Register user
function register(data: FormData): Promise<AxiosResponse<null>> {
    return axios.post(`${API}/register`, data);
}

// Login user
function login(credentials: LoginCredentials): Promise<AxiosResponse<null>> {
    return axios.post(`${API}/login`, credentials);
}

// Check token validity
function checkToken(): Promise<AxiosResponse<null>> {
    const token = getToken();
    return axios.get(`${API}/check`, {
        headers: { Authorization: `Bearer ${token}` },
    });
}

// Get user profile
function profile(): Promise<AxiosResponse<UserProfile>> {
    const token = getToken();
    return axios.get(`${API}/profile`, {
        headers: { Authorization: `Bearer ${token}` },
    });
}

// Update profile
function updateProfile(data: FormData): Promise<AxiosResponse<null>> {
    const token = getToken();
    return axios.put(`${API}/profile`, data, {
        headers: { Authorization: `Bearer ${token}` },
    });
}

// Logout user
function logout(): Promise<AxiosResponse<null>> {
    const token = getToken();
    return axios.get(`${API}/logout`, {
        headers: { Authorization: `Bearer ${token}` },
    });
}

// Forgot password
function forgotPassword(email: string): Promise<AxiosResponse<null>> {
    return axios.post(`${API}/forgot-password`, { email });
}

// Reset password
function resetPassword(payload: ResetPasswordPayload): Promise<AxiosResponse<null>> {
    return axios.post(`${API}/reset-password`, payload);
}
