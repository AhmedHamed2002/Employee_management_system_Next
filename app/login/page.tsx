"use client";

import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { userService } from "@/services/userService";
import { toast } from "react-toastify";
import Link from "next/link";

interface LoginForm {
    email: string;
    password: string;
}

export default function LoginPage() {
const router = useRouter();
const [loading, setLoading] = useState<boolean>(false);
const [form, setForm] = useState<LoginForm>({ email: "", password: "" });

useEffect(() => {
    const token = localStorage.getItem("EMS_token");
    if (token) {
    userService
        .checkToken()
        .then((res: any) => {
            console.log(res);
            
        if (res.data.status === "success") {
            localStorage.setItem("EMS_logged", "true");
            toast.info(res.data.data);
            router.push("/");
        }
        })
        .catch(() => localStorage.removeItem("EMS_token"));
    }
}, [router]);

const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
};

const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!form.email || !form.password) {
    toast.warning("Please fill all fields");
    return;
    }

    setLoading(true);
    try {
    const res:any = await userService.login(form);
    setLoading(false);

    if (res.data.status === "success") {
        toast.success(res.data.data);
        localStorage.setItem("EMS_token", res.data.token);
        router.push("/");
    }
    } catch (err: any) {
        setLoading(false);
        if (err.response?.data?.status === "fail") {
            toast.warning(err.response.data?.data || "Login failed");
        } else {
            toast.error(err.response?.data?.message || "Login error");
        }
    }
};

return (
    <div className="mx-4 flex justify-center items-center min-h-screen bg-gray-100 dark:bg-neutral-900 relative">
    <div className="bg-white dark:bg-neutral-800 p-6 rounded-xl shadow-md w-full max-w-md border-t-4 border-blue-600 dark:border-blue-500">
        <h2 className="text-2xl font-serif font-bold text-center text-blue-500 mb-6">
        Login
        </h2>

        <form onSubmit={handleSubmit} className="space-y-3">
        {/* Email */}
        <div className="relative">
            <label
            htmlFor="email"
            className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300"
            >
            Email
            </label>
            <i className="fa fa-envelope absolute left-3 top-10 text-gray-400 dark:text-gray-500 pointer-events-none"></i>
            <input
            type="email"
            id="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Enter your email"
            className="w-full border-b-2 border-gray-300 dark:border-gray-600 rounded-lg focus:border-blue-600 dark:focus:border-blue-400 focus:outline-none pl-10 py-2 bg-transparent text-gray-900 dark:text-gray-100"
            />
        </div>

        {/* Password */}
        <div className="relative">
            <label
            htmlFor="password"
            className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300"
            >
            Password
            </label>
            <i className="fa fa-lock absolute left-3 top-10 text-gray-400 dark:text-gray-500 pointer-events-none"></i>
            <input
            type="password"
            id="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Enter your password"
            className="w-full border-b-2 border-gray-300 dark:border-gray-600 rounded-lg focus:border-blue-600 dark:focus:border-blue-400 focus:outline-none pl-10 py-2 bg-transparent text-gray-900 dark:text-gray-100"
            />
        </div>

        {/* Submit Button */}
        <button
            type="submit"
            disabled={loading}
            className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4
            focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center
            disabled:bg-blue-400 disabled:cursor-not-allowed"
        >
            {loading ? "Logging in..." : "Login"}
        </button>

        {/* Register Link */}
        <p className="text-sm text-center text-gray-500 dark:text-gray-400">
            Don’t have an account?{" "}
            <Link
            href="/register"
            className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
            >
            Register here
            </Link>
        </p>

        {/* Forgot Password */}
        <p className="text-center mt-2">
            <Link
            href="/forgot-password"
            className="text-neutral-200 hover:underline"
            >
            Forgot Password?
            </Link>
        </p>
        </form>
    </div>

    {/* Loading Overlay */}
    {loading && (
        <div className="absolute w-full h-full items-center block p-6 bg-white/70 border border-gray-100 rounded-lg shadow-md dark:bg-gray-800/70 dark:border-gray-800 ">
        <div
            role="status"
            className="absolute -translate-x-1/2 -translate-y-1/2 top-2/4 left-1/2"
        >
        <svg
            aria-hidden="true"
            className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
            viewBox="0 0 100 101"
            xmlns="http://www.w3.org/2000/svg"
            >
            <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 
                50 100.591C22.3858 100.591 0 78.2051 
                0 50.5908C0 22.9766 22.3858 0.59082 
                50 0.59082C77.6142 0.59082 100 22.9766 
                100 50.5908ZM9.08197 50.5908C9.08197 
                73.1895 27.4013 91.5088 50 91.5088C72.5987 
                91.5088 90.918 73.1895 90.918 50.5908C90.918 
                27.9921 72.5987 9.67285 50 9.67285C27.4013 
                9.67285 9.08197 27.9921 9.08197 50.5908Z"
                fill="currentColor"/>
            <path
                d="M93.9676 39.0409C96.393 38.4038 
                97.8624 35.9116 97.0079 33.5533C95.2932 
                28.8227 92.871 24.3692 89.8167 20.348C85.8452 
                15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 
                4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 
                0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 
                1.69328 37.813 4.19778 38.4501 6.62326C39.0873 
                9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 
                9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 
                10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 
                17.9648 79.3347 21.5619 82.5849 25.841C84.9175 
                28.9121 86.7997 32.2913 88.1811 35.8758C89.083 
                38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"/>
        </svg>

            <span className="sr-only">Loading...</span>
        </div>
        </div>
    )}
    </div>
);
}
