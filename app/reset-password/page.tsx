"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { userService } from "@/services/userService";

export default function ResetPasswordPage() {
const router = useRouter();

const [form, setForm] = useState({
    email: "",
    code: "",
    newPassword: "",
});

const [errors, setErrors] = useState<{
    email?: string;
    code?: string;
    newPassword?: string;
}>({});

const [loading, setLoading] = useState(false);

// ✅ Simple validation (similar to Angular Validators)
const validate = () => {
    const newErrors: typeof errors = {};

    if (!form.email) {
    newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    newErrors.email = "Enter a valid email";
    }

    if (!form.code) newErrors.code = "Reset code is required";

    if (!form.newPassword) {
    newErrors.newPassword = "New password is required";
    } else if (form.newPassword.length < 8) {
    newErrors.newPassword = "Password must be at least 8 characters";
    } else if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(form.newPassword)) {
    newErrors.newPassword =
        "Password must contain at least one letter and one number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
};

// ✅ Handle Submit
const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
    const payload = {
        token: form.code,
        newPassword: form.newPassword,
    };

    const res:any = await userService.resetPassword(payload);
    setLoading(false);

    if (res.data.status === "success") {
        toast.success(res.data.message || "Password reset successfully!");
        router.push("/login");
    } else if (res.data.status === "fail") {
        toast.warning(res.data.data || "Invalid reset code");
    } else {
        toast.error(res.data.message || "Something went wrong");
    }
    } catch (error: any) {
    setLoading(false);
    if (error.response?.data?.status === "fail") {
        toast.warning(error.response.data?.data || "Invalid reset attempt");
    } else if (error.response?.data?.status === "error") {
        toast.error(error.response.data?.message || "Server error");
    } else {
        toast.error("Network error");
    }
    }
};

return (
    <div className="mx-4 flex justify-center items-center min-h-screen bg-gray-100 dark:bg-neutral-900">
    <div className="w-full max-w-md bg-white dark:bg-neutral-800 p-6 rounded-xl shadow-md border-t-4 border-blue-600 dark:border-blue-500">
        <h2 className="text-2xl font-serif font-bold mb-6 text-center text-blue-500">
        Reset Password
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email */}
        <div className="relative">
            <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
            Email
            </label>
            <i className="fa fa-envelope absolute left-3 top-10 text-gray-400 dark:text-gray-500"></i>
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

        {/* Reset Code */}
        <div className="relative">
            <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
            Reset Code
            </label>
            <i className="fa fa-key absolute left-3 top-10 text-gray-400 dark:text-gray-500"></i>
            <input
            type="text"
            value={form.code}
            onChange={(e) => setForm({ ...form, code: e.target.value })}
            className="w-full border-b-2 border-gray-300 dark:border-gray-600 focus:border-blue-600 dark:focus:border-blue-400
                focus:outline-none pl-10 py-2 bg-transparent text-gray-900 dark:text-gray-100 rounded-lg"
            placeholder="Enter reset code"
            />
            {errors.code && (
            <p className="text-red-500 text-sm mt-1">{errors.code}</p>
            )}
        </div>

        {/* New Password */}
        <div className="relative">
            <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
            New Password
            </label>
            <i className="fa fa-lock absolute left-3 top-10 text-gray-400 dark:text-gray-500"></i>
            <input
            type="password"
            value={form.newPassword}
            onChange={(e) =>
                setForm({ ...form, newPassword: e.target.value })
            }
            className="w-full border-b-2 border-gray-300 dark:border-gray-600 focus:border-blue-600 dark:focus:border-blue-400
                focus:outline-none pl-10 py-2 bg-transparent text-gray-900 dark:text-gray-100 rounded-lg"
            placeholder="Enter new password"
            />
            {errors.newPassword && (
            <p className="text-red-500 text-sm mt-1">{errors.newPassword}</p>
            )}
        </div>

        {/* Submit Button */}
        <button
            type="submit"
            disabled={loading}
            className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300
                font-medium rounded-lg text-sm px-5 py-2.5 text-center disabled:bg-blue-300 disabled:cursor-not-allowed"
        >
            {loading ? "Resetting..." : "Reset Password"}
        </button>

        {/* Back to Login */}
        <p className="text-sm text-center text-gray-500 dark:text-gray-400 mt-3">
            Remembered your password?{" "}
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
