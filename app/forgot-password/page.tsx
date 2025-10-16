"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { userService } from "@/services/userService";

export default function ForgotPasswordPage() {
    const router = useRouter();
    const [form, setForm] = useState({ email: "" });
    const [errors, setErrors] = useState<{ email?: string }>({});
    const [loading, setLoading] = useState(false);

    const validate = () => {
    const newErrors: { email?: string } = {};
    if (!form.email) {
        newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
        newErrors.email = "Enter a valid email";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
        setLoading(true);
        const res:any = await userService.forgotPassword(form.email);
        setLoading(false);
        if (res.data.status === "success") {
            toast.success(res.data.message || "Reset code sent successfully");
            router.push("/reset-password");
        } 
    } catch (error: any) {
        setLoading(false);
        if (error.response?.data?.status === "fail") {
            toast.warning(error.response.data?.data || "Failed to send email");
        } else if (error.response?.data?.status === "error") {
            toast.error(error.response.data?.message || "Server error");
        } else {
            toast.error("Network error");
        }
    }
    };

    return (
    <div className="mx-4 flex justify-center items-center min-h-screen bg-gray-100 dark:bg-neutral-900">
        <div className="bg-white dark:bg-neutral-800 p-6 rounded-xl shadow-md w-full max-w-md border-t-4 border-blue-600 dark:border-blue-500">
        <h2 className="text-2xl font-serif font-bold text-center text-blue-500 mb-6">
            Forgot Password
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div className="relative">
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                Email
            </label>
            <i className="fa fa-envelope absolute left-3 top-10 text-gray-400 dark:text-gray-500 pointer-events-none"></i>
            <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full border-b-2 border-gray-300 dark:border-gray-600 focus:border-blue-600 dark:focus:border-blue-400
                focus:outline-none pl-10 py-2 bg-transparent text-gray-900 dark:text-gray-100 rounded-lg"
                placeholder="Enter your email"
            />
            {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
            </div>

            {/* Submit Button */}
            <button
            type="submit"
            disabled={loading}
            className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300
                font-medium rounded-lg text-sm px-5 py-2.5 text-center disabled:bg-blue-400 disabled:cursor-not-allowed"
            >
            {loading ? "Sending..." : "Send Reset Code"}
            </button>

            {/* Back to Login */}
            <p className="text-sm text-center text-gray-500 dark:text-gray-400 mt-3">
            Remember your password?{" "}
            <a
                href="/login"
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
            >
                Login here
            </a>
            </p>
        </form>
        </div>
    </div>
    );
}
