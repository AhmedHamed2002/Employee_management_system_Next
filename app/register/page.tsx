"use client";

import { useState , useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { userService } from "@/services/userService";
import Swal from "sweetalert2";
import Link from "next/link";
import { toast } from "react-toastify";

const schema = yup.object().shape({
  firstName: yup.string().required("First name is required."),
  lastName: yup.string().required("Last name is required."),
  email: yup.string().email("Enter a valid email.").required("Email is required."),
  password: yup
    .string()
    .required("Password is required.")
    .min(8, "Password must be at least 8 characters.")
    .matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/, "Include letters and numbers."),
  confirmPassword: yup
    .string()
    .required("Confirm password is required.")
    .oneOf([yup.ref("password")], "Passwords do not match."),
});

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatar, setAvatar] = useState<File | null>(null);
  const router = useRouter();

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

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatar(file);
      const reader = new FileReader();
      reader.onload = () => setAvatarPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: any) => {
    if (loading) return;

    setLoading(true);
    const formData = new FormData();

    Object.keys(data).forEach((key) => formData.append(key, data[key]));
    if (avatar) formData.append("avatar", avatar);

    try {
      const res = await userService.register(formData);
      Swal.fire("Success", "Account created successfully!", "success");
      console.log(res.data);
    } catch (err: any) {
      Swal.fire("Error", err.response?.data?.message || "Registration failed", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-4 flex justify-center items-center min-h-screen bg-gray-100 dark:bg-neutral-900 relative">
      <div className="bg-white dark:bg-neutral-800 p-6 rounded-xl shadow-md w-full max-w-md border-t-4 border-blue-600 dark:border-blue-500">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          {/* Avatar */}
          <div className="flex flex-col items-center mb-3">
            <label
              htmlFor="avatarInput"
              className="cursor-pointer w-24 h-24 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center overflow-hidden border-2 border-blue-400 dark:border-blue-600 hover:border-blue-600 transition"
            >
              {avatarPreview ? (
                <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-10 w-10 text-blue-500 dark:text-blue-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5.121 17.804A9 9 0 1118.88 6.196M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              )}
            </label>
            <input id="avatarInput" type="file" onChange={handleFileChange} className="hidden" />
          </div>

          {/* First Name */}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
              First Name
            </label>
            <input
              {...register("firstName")}
              placeholder="Enter your first name"
              className="w-full border-b-2 border-gray-300 dark:border-gray-600 rounded-lg focus:border-blue-600 dark:focus:border-blue-400 focus:outline-none py-2 bg-transparent text-gray-900 dark:text-gray-100"
            />
            {errors.firstName && (
              <p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p>
            )}
          </div>

          {/* Last Name */}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
              Last Name
            </label>
            <input
              {...register("lastName")}
              placeholder="Enter your last name"
              className="w-full border-b-2 border-gray-300 dark:border-gray-600 rounded-lg focus:border-blue-600 dark:focus:border-blue-400 focus:outline-none py-2 bg-transparent text-gray-900 dark:text-gray-100"
            />
            {errors.lastName && (
              <p className="text-red-500 text-sm mt-1">{errors.lastName.message}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
              Email
            </label>
            <input
              type="email"
              {...register("email")}
              placeholder="Enter your email"
              className="w-full border-b-2 border-gray-300 dark:border-gray-600 rounded-lg focus:border-blue-600 dark:focus:border-blue-400 focus:outline-none py-2 bg-transparent text-gray-900 dark:text-gray-100"
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
              Password
            </label>
            <input
              type="password"
              {...register("password")}
              placeholder="Enter your password"
              className="w-full border-b-2 border-gray-300 dark:border-gray-600 rounded-lg focus:border-blue-600 dark:focus:border-blue-400 focus:outline-none py-2 bg-transparent text-gray-900 dark:text-gray-100"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
              Confirm Password
            </label>
            <input
              type="password"
              {...register("confirmPassword")}
              placeholder="Confirm your password"
              className="w-full border-b-2 border-gray-300 dark:border-gray-600 rounded-lg focus:border-blue-600 dark:focus:border-blue-400 focus:outline-none py-2 bg-transparent text-gray-900 dark:text-gray-100"
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded transition 
                    hover:bg-blue-700 
                    disabled:bg-blue-400 
                    disabled:cursor-not-allowed"
          >
            {loading ? "Registering..." : "Register"}
          </button>

          {/* Link to Login */}
          <p className="text-center text-sm mt-3 text-gray-700 dark:text-gray-300">
            Already have an account?
            <Link href="/login" className="text-blue-600 dark:text-blue-400 hover:underline">Login</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
