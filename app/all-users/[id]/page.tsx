"use client";

import { useEffect, useState, ChangeEvent } from "react";
import { useParams, useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { employeeService } from "@/services/employeeService";

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
    birthday?: string;
    image?: string;
    role?: string;
    address?: string;
    createdAt?: string;
    updatedAt?: string;
}

export default function EmployeeDetailsPage() {
    const { id } = useParams();
    const router = useRouter();

    const [employee, setEmployee] = useState<Employee | null>(null);
    const [form, setForm] = useState<Employee>({});
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [editMode, setEditMode] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        setIsDark(localStorage.getItem("theme") === "dark");

        if (id) {
        employeeService
            .getEmployeeById(id as string)
            .then((res:any) => {
            setEmployee(res.data.data);
            setForm(res.data.data);
            })
            .catch((err) => {
            setError(err.response?.data?.message || "Failed to fetch employee details");
            })
            .finally(() => setIsLoading(false));
        }
    }, [id]);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
        setSelectedFile(file);
        const reader = new FileReader();
        reader.onload = () => setPreviewUrl(reader.result as string);
        reader.readAsDataURL(file);
        }
    };

    const toggleEdit = () => setEditMode(!editMode);

    const handleUpdate = async () => {
        if (!form.name || !form.email) {
        Swal.fire({
            title: "Validation Error",
            text: "Please check required fields.",
            icon: "warning",
            background: isDark ? "#1b1b1b" : "#fff",
            color: isDark ? "#f3f4f6" : "#111827",
        });
        return;
        }

        const formData = new FormData();
        Object.entries(form).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== "") {
            if (key === "birthday" || key === "hireDate") {
            formData.append(key, new Date(value as string).toISOString());
            } else {
            formData.append(key, value.toString());
            }
        }
        });
        if (selectedFile) formData.append("avatar", selectedFile);

        try {
        const res:any = await employeeService.updateEmployee(formData);
        Swal.fire({
            title: "Success",
            text: "Employee updated successfully",
            icon: "success",
            background: isDark ? "#1b1b1b" : "#fff",
            color: isDark ? "#f3f4f6" : "#111827",
        });
        setEmployee(res.data.data);
        setPreviewUrl(null);
        setEditMode(false);
        } catch (err: any) {
        Swal.fire({
            title: "Error",
            text: err.response?.data?.message || "Update failed",
            icon: "error",
            background: isDark ? "#1b1b1b" : "#fff",
            color: isDark ? "#f3f4f6" : "#111827",
        });
        }
    };

    const handleDelete = async () => {
        if (!employee?.id) return;
        Swal.fire({
        title: "Are you sure?",
        text: "This action cannot be undone!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: isDark ? "#4f46e5" : "#3085d6",
        cancelButtonColor: "#ef4444",
        confirmButtonText: "Yes, delete it!",
        background: isDark ? "#1b1b1b" : "#fff",
        color: isDark ? "#f3f4f6" : "#111827",
        }).then(async (result) => {
        if (result.isConfirmed) {
            try {
            await employeeService.deleteEmployee(employee.id!);
            Swal.fire({
                title: "Deleted!",
                text: "Employee has been deleted.",
                icon: "success",
                background: isDark ? "#1b1b1b" : "#fff",
                color: isDark ? "#f3f4f6" : "#111827",
            });
            router.push("/all-users");
            } catch (err: any) {
            Swal.fire({
                title: "Error!",
                text: err.response?.data?.message || "Failed to delete employee.",
                icon: "error",
                background: isDark ? "#1b1b1b" : "#fff",
                color: isDark ? "#f3f4f6" : "#111827",
            });
            }
        }
        });
    };

    if (isLoading) {
        return (
        <div className="flex flex-col items-center justify-center h-screen text-gray-500 dark:text-gray-400">
            <i className="fas fa-spinner fa-spin text-3xl"></i>
            <p className="mt-3">Loading employee details...</p>
        </div>
        );
    }

    if (error) {
        return (
        <div className="flex flex-col items-center justify-center h-screen text-red-500">
            <i className="fas fa-triangle-exclamation text-3xl"></i>
            <p className="mt-3">{error}</p>
        </div>
        );
    }

  return (
        <div className="min-h-screen bg-gray-100 dark:bg-neutral-900 flex items-center justify-center px-6 pb-6 pt-32">
        <div className="w-full max-w-5xl bg-white dark:bg-neutral-800 rounded-2xl shadow-lg p-8 border border-gray-200 dark:border-gray-700">
            {/* Avatar + Name */}
            <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="relative flex flex-col items-center">
                <img
                src={previewUrl || employee?.image || "/default-avatar.png"}
                alt="Avatar"
                className="w-36 h-36 rounded-full border-4 border-white shadow-lg object-cover"
                />
                {editMode && (
                <label
                    htmlFor="avatarUpload"
                    className="absolute bottom-2 right-1 bg-white text-indigo-600 p-2 rounded-full cursor-pointer shadow-md hover:bg-gray-100 transition"
                >
                    <i className="fas fa-camera"></i>
                </label>
                )}
                <input type="file" id="avatarUpload" hidden accept="image/*" onChange={handleFileChange} />
            </div>

            <div className="text-center md:text-left">
                <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">{form.name}</h2>
                <p className="text-gray-500 dark:text-gray-400 text-lg mt-1">
                <i className="fas fa-briefcase mr-2"></i>
                {form.position} - {form.department}
                </p>
            </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 mt-4">
            <button
                type="button"
                onClick={toggleEdit}
                className="flex items-center gap-2 px-4 py-2 bg-blue-800 text-white rounded-lg shadow hover:bg-blue-700 transition"
            >
                <i className={`fas ${editMode ? "fa-times" : "fa-pen"}`}></i>
                {editMode ? "Cancel" : "Edit"}
            </button>

            {editMode && (
                <button
                onClick={handleUpdate}
                className="flex items-center gap-2 px-4 py-2 bg-cyan-800 text-white rounded-lg shadow hover:bg-cyan-700 transition"
                >
                <i className="fas fa-save"></i> Save
                </button>
            )}

            {employee?.role === "manager" && (
                <button
                onClick={handleDelete}
                className="flex items-center gap-2 px-4 py-2 bg-red-700 text-white rounded-lg shadow hover:bg-red-600 transition"
                >
                <i className="fas fa-trash"></i> Delete
                </button>
            )}
            </div>

            {/* Info fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            {[
                { label: "Email", key: "email", icon: "fa-envelope" },
                { label: "Phone", key: "phone", icon: "fa-phone" },
                { label: "City", key: "city", icon: "fa-city" },
                { label: "Gender", key: "gender", icon: "fa-venus-mars" },
                { label: "Salary", key: "salary", icon: "fa-dollar-sign" },
                { label: "Age", key: "age", icon: "fa-user-clock" },
                { label: "Birthday", key: "birthday", icon: "fa-birthday-cake" },
                { label: "hireDate", key: "hireDate", icon: "fa-calendar-check" },
                { label: "createdAt", key: "createdAt", icon: "fa-calendar-check" },
                { label: "updatedAt", key: "updatedAt", icon: "fa-calendar-check" }
            ].map(({ label, key, icon }) => (
                <div
                key={key}
                className="bg-gray-200 dark:bg-neutral-700 p-4 rounded-lg shadow-sm flex items-center gap-3"
                >
                <i className={`fas ${icon} text-indigo-600`}></i>
                <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
                    {editMode ? (
                    <input
                        name={key}
                        value={(form as any)[key] || ""}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 rounded-md border dark:border-gray-600 dark:bg-neutral-700 dark:text-white"
                    />
                    ) : (
                    <p className="font-medium text-gray-800 dark:text-gray-200">
                        {(form as any)[key] || "-"}
                    </p>
                    )}
                </div>
                </div>
            ))}
            </div>
        </div>
    </div>
  );
}
