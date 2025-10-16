'use client'

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { userService } from "@/services/userService";
import { toast } from "react-toastify";
import useAuthGuard from "../../hooks/useAuthGuard";

interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  image: string;
  role: string;
}

export default function ProfilePage() {
  useAuthGuard();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("EMS_token");
    if (!token) {
      router.push("/login");
    } else {
      loadProfile();
    }
  }, []);

  const loadProfile = async () => {
    try {
      const res:any = await userService.profile();   
      setUser(res.data.data);
    } catch (err) {
      toast.error("Failed to load profile");
      setError("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    const isDark = localStorage.getItem("theme") === "dark";
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You will be logged out of EmployeeMS.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: isDark ? "#4f46e5" : "#3085d6",
      cancelButtonColor: "#ef4444",
      confirmButtonText: "Yes, logout!",
      cancelButtonText: "Cancel",
      background: isDark ? "#1b1b1b" : "#fff",
      color: isDark ? "#f3f4f6" : "#111827",
      customClass: {
        popup: "rounded-xl shadow-lg",
        confirmButton: "px-4 py-2 font-semibold rounded-lg",
        cancelButton: "px-4 py-2 font-semibold rounded-lg",
      },
    });

    if (result.isConfirmed) {
      try {
        await userService.logout();
        localStorage.removeItem("EMS_token");
        Swal.fire({
          title: "Logged out!",
          text: "You have been logged out successfully.",
          icon: "success",
          background: isDark ? "#1b1b1b" : "#fff",
          color: isDark ? "#f3f4f6" : "#111827",
        });
        router.push("/login");
      } catch {
        Swal.fire({
          title: "Error!",
          text: "Something went wrong while logging out.",
          icon: "error",
          background: isDark ? "#1b1b1b" : "#fff",
          color: isDark ? "#f3f4f6" : "#111827",
        });
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center text-gray-500 dark:text-gray-400">
        <i className="fas fa-spinner fa-spin text-3xl"></i>
        <p className="mt-3">Loading profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 w-full bg-gray-100 dark:bg-neutral-950 p-8">
      <div className="max-w-6xl mx-auto bg-white dark:bg-neutral-900 shadow-2xl rounded-3xl overflow-hidden border border-gray-200 dark:border-neutral-700 flex flex-col md:flex-row">
        {/* Sidebar */}
        <aside className="w-full md:w-64 bg-gray-50 dark:bg-neutral-800 p-6 border-r border-gray-200 dark:border-neutral-700">
          <div className="flex flex-col items-center text-center mb-10">
            <img
              src={user?.image}
              alt="Avatar"
              className="w-24 h-24 rounded-full border-4 border-indigo-600 dark:border-indigo-500 object-cover shadow-lg mb-4"
            />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              {user?.firstName} {user?.lastName}
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              <i className="fas fa-envelope mr-1"></i> {user?.email}
            </p>
          </div>

          <nav className="space-y-2">
            {["Profile", "Security", "Preferences", "Notifications"].map(
              (item) => (
                <a
                  key={item}
                  className="flex items-center gap-3 px-4 py-2 rounded-lg font-semibold text-gray-700 dark:text-gray-300 hover:bg-indigo-100 dark:hover:bg-neutral-700 transition"
                >
                  <i
                    className={`fas ${
                      item === "Profile"
                        ? "fa-user-circle"
                        : item === "Security"
                        ? "fa-lock"
                        : item === "Preferences"
                        ? "fa-cog"
                        : "fa-bell"
                    }`}
                  ></i>{" "}
                  {item}
                </a>
              )
            )}
          </nav>
        </aside>

        {/* Main Content */}
        <section className="flex-1 p-10">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-8 flex items-center gap-3">
            <i className="fas fa-user-cog text-indigo-600"></i> Account Settings
          </h1>

          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <p className="block text-gray-600 dark:text-gray-400 font-medium mb-2">
                  First Name
                </p>
                <p className="w-full p-3 rounded-lg border border-gray-300 dark:border-neutral-700 dark:text-white">
                  {user?.firstName}
                </p>
              </div>
              <div>
                <p className="block text-gray-600 dark:text-gray-400 font-medium mb-2">
                  Last Name
                </p>
                <p className="w-full p-3 rounded-lg border border-gray-300 dark:border-neutral-700 dark:text-white">
                  {user?.lastName}
                </p>
              </div>
            </div>

            <div>
              <p className="block text-gray-600 dark:text-gray-400 font-medium mb-2">
                Email
              </p>
              <p className="w-full p-3 rounded-lg border border-gray-300 dark:border-neutral-700 dark:text-white">
                {user?.email}
              </p>
            </div>

            <div>
              <label className="block text-gray-600 dark:text-gray-400 font-medium mb-2">
                Role
              </label>
              <p className="px-4 py-2 rounded-lg bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300 font-semibold inline-flex items-center gap-2">
                <i className="fas fa-user-tag"></i> {user?.role}
              </p>
            </div>
          </div>

          <div className="mt-10 flex justify-end gap-4">
            <button  onClick={() => router.push("/edit-profile")} 
              className="flex items-center gap-2 text-indigo-700 hover:text-blue-700 font-semibold px-6 py-3 rounded-lg shadow-md transition"
            >
              <i className="fas fa-edit"></i> Edit Profile
            </button>

            <button
              onClick={logout}
              className="flex items-center gap-2 text-red-600 hover:text-red-700 font-semibold px-6 py-3 rounded-lg shadow-md transition"
            >
              <i className="fas fa-sign-out-alt"></i> Logout
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
