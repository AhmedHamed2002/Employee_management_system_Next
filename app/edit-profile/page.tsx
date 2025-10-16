"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { userService, UserProfile } from "@/services/userService";
import { toast } from "react-toastify";
import useAuthGuard from "../../hooks/useAuthGuard";

export default function editProfilePage() {
  useAuthGuard();
  const router = useRouter();

  const [user, setUser] = useState<UserProfile>({
    id: "",
    firstName: "",
    lastName: "",
    email: "",
    role: "",
  });

  const [loading, setLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    userService
      .profile()
      .then((res) => {
        setUser(res.data.data);
      })
      .catch(() => {
        toast.error("Failed to load profile");
        setError("Failed to load profile");
      }).finally(()=>{
        setLoading(false);
      });
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("firstName", user.firstName);
    formData.append("lastName", user.lastName);
    formData.append("email", user.email);
    if (selectedFile) formData.append("avatar", selectedFile);

    try {
      await userService.updateProfile(formData);
      toast.success("Profile updated successfully");
      router.push("/profile");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Update failed");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 dark:bg-neutral-950 text-gray-500 dark:text-gray-400">
        <i className="fas fa-spinner fa-spin text-3xl"></i>
        <p className="mt-3">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-28 w-full bg-gradient-to-br from-stone-50 to-stone-100 dark:from-neutral-900 dark:to-neutral-950 p-8">
      <div className="max-w-6xl mx-auto bg-white dark:bg-neutral-900 shadow-2xl rounded-3xl overflow-hidden border border-gray-200 dark:border-neutral-700">
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left: Profile Preview */}
          <div className="flex flex-col items-center justify-center p-10 bg-gradient-to-br from-indigo-700 to-blue-800 text-white">
            <div className="relative">
              <img
                src={user.image || "/default-avatar.png"}
                alt="Avatar"
                className="w-40 h-40 rounded-full border-4 border-white shadow-lg object-cover"
              />
              <label
                htmlFor="avatarUpload"
                className="absolute bottom-2 right-2 bg-white text-indigo-600 p-2 rounded-full cursor-pointer shadow-md hover:bg-gray-100 transition"
              >
                <i className="fas fa-camera"></i>
              </label>
              <input
                type="file"
                id="avatarUpload"
                hidden
                onChange={handleFileChange}
              />
            </div>

            <h2 className="mt-6 text-2xl font-bold">
              {user.firstName} {user.lastName}
            </h2>
            <p className="text-indigo-100">
              <i className="fas fa-envelope mr-2"></i>
              {user.email}
            </p>
            <p className="mt-2 px-4 py-1 bg-white/20 rounded-lg text-sm font-medium">
              <i className="fas fa-user-shield mr-1"></i>
              {user.role || "Employee"}
            </p>
          </div>

          {/* Right: Edit Form */}
          <div className="p-10">
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-8 flex items-center">
              <i className="fas fa-user-edit mr-3 text-indigo-700"></i> Edit
              Profile
            </h1>

            <form className="space-y-6" onSubmit={handleSave}>
              {/* First Name */}
              <div>
                <label className="block text-gray-700 dark:text-gray-300 font-semibold">
                  First Name
                </label>
                <input
                  value={user.firstName}
                  onChange={(e) =>
                    setUser({ ...user, firstName: e.target.value })
                  }
                  required
                  className="w-full mt-2 p-3 border border-gray-300 rounded-lg dark:bg-neutral-800 dark:text-white dark:border-neutral-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                />
              </div>

              {/* Last Name */}
              <div>
                <label className="block text-gray-700 dark:text-gray-300 font-semibold">
                  Last Name
                </label>
                <input
                  value={user.lastName}
                  onChange={(e) =>
                    setUser({ ...user, lastName: e.target.value })
                  }
                  required
                  className="w-full mt-2 p-3 border border-gray-300 rounded-lg dark:bg-neutral-800 dark:text-white dark:border-neutral-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-gray-700 dark:text-gray-300 font-semibold">
                  Email
                </label>
                <input
                  type="email"
                  value={user.email}
                  onChange={(e) => setUser({ ...user, email: e.target.value })}
                  required
                  className="w-full mt-2 p-3 border border-gray-300 rounded-lg dark:bg-neutral-800 dark:text-white dark:border-neutral-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                />
              </div>

              {/* Buttons */}
              <div className="mt-10 flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => router.push("/profile")}
                  className="flex items-center gap-2 bg-neutral-800 hover:bg-neutral-700 text-white font-semibold px-6 py-3 rounded-lg shadow-md transition"
                >
                  <i className="fas fa-times"></i> Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 bg-indigo-800 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-lg shadow-md transition"
                >
                  <i className="fas fa-save"></i> Save
                </button>
              </div>
            </form>

            {error && (
              <p className="text-center text-red-600 dark:text-red-500 mt-6">
                {error}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
