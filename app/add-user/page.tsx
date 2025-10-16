"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { employeeService } from "@/services/employeeService";

interface EmployeeForm {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  gender: string;
  birthday: string;
  position: string;
  department: string;
  hireDate?: string;
  salary: number;
}

export default function AddEmployeePage() {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<EmployeeForm>();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDark, setIsDark] = useState(false);

  const departments = ["HR","IT","Finance","Marketing","Sales","Operations","Customer Support","Management"];
  const genders = ["male","female"];

  // ✅ Detect dark mode from localStorage
  useEffect(() => {
    setIsDark(localStorage.getItem("theme") === "dark");
  }, []);

  // ✅ File Upload Preview
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = () => setPreviewUrl(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  // ✅ Submit Form
  const onSubmit = async (data: EmployeeForm) => {
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== "") {
          formData.append(key, value.toString());
        }
      });

      if (selectedFile) {
        formData.append("avatar", selectedFile);
      }

      await employeeService.createEmployee(formData);

      Swal.fire({
        title: "Success",
        text: "Employee created successfully",
        icon: "success",
        background: isDark ? "#1b1b1b" : "#fff",
        color: isDark ? "#f3f4f6" : "#111827",
      });

      reset();
      setSelectedFile(null);
      setPreviewUrl(null);
    } catch (err: any) {
      Swal.fire({
        title: "Error",
        text:
          err?.response?.data?.message ||
          "Failed to create employee. Please try again.",
        icon: "error",
        background: isDark ? "#1b1b1b" : "#fff",
        color: isDark ? "#f3f4f6" : "#111827",
      });
    }
  };

  return (
    <div className="w-full bg-gray-100 dark:bg-neutral-900 px-8 pb-8 pt-28 flex items-center justify-center">
      <div className="max-w-7xl w-full bg-white dark:bg-neutral-900 shadow-2xl rounded-3xl overflow-hidden border border-gray-200 dark:border-neutral-700 flex flex-col md:flex-row">
        {/* Sidebar */}
        <aside className="w-full md:w-64 bg-gradient-to-br from-indigo-700 to-blue-800 text-white p-6 flex flex-col items-center justify-center">
          <div className="relative">
            <img
              src={
                previewUrl ||
                "https://res.cloudinary.com/dtnkj1dqe/image/upload/v1757593418/EMS/employees/xvjszdqfp2tfmjm1itwe.jpg"
              }
              alt="Avatar"
              className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
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
              accept="image/*"
              onChange={handleFileChange}
            />
          </div>

          <h2 className="mt-6 text-2xl font-bold">New Employee</h2>
          <p className="mt-2 px-4 py-1 bg-white/20 rounded-lg text-sm font-medium inline-flex items-center gap-1">
            <i className="fas fa-user-shield"></i> Employee
          </p>
        </aside>

        {/* Main Form */}
        <section className="flex-1 p-5 overflow-y-auto">
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-8 flex items-center gap-3">
            <i className="fas fa-user-plus text-indigo-700"></i> Create Employee
          </h1>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
            {/* Name / Email / Phone */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <InputField label="Name" name="name" register={register} required error={errors.name} />
              <InputField label="Email" name="email" type="email" register={register} required error={errors.email} />
              <InputField label="Phone" name="phone" register={register} required error={errors.phone} />
            </div>

            {/* Gender / Address / City */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <SelectField label="Gender" name="gender" options={genders} register={register} required />
              <InputField label="Address" name="address" register={register} required error={errors.address} />
              <InputField label="City" name="city" register={register} required error={errors.city} />
            </div>

            {/* Birthday */}
            <div className="grid grid-cols-1 gap-4">
              <InputField label="Birthday" name="birthday" type="date" register={register} required error={errors.birthday} />
            </div>

            {/* Position / Department / Salary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <InputField label="Position" name="position" register={register} required error={errors.position} />
              <SelectField label="Department" name="department" options={departments} register={register} required />
              <InputField label="Salary" name="salary" type="number" register={register} required error={errors.salary} />
            </div>

            {/* Hire Date */}
            <div className="grid grid-cols-1 gap-4">
              <InputField label="Hire Date" name="hireDate" type="date" register={register} />
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="submit"
                className="flex items-center gap-2 bg-indigo-800 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-lg shadow-md transition"
              >
                <i className="fas fa-plus"></i> Create Employee
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}

// 🧱 Reusable Components
function InputField({ label, name, register, required = false, type = "text", error }: any) {
  return (
    <div>
      <label className="block text-gray-700 dark:text-gray-300 font-semibold">{label}</label>
      <input
        {...register(name, { required })}
        type={type}
        placeholder={label}
        className="w-full placeholder:text-neutral-500 mt-2 p-3 border border-gray-300 rounded-lg dark:bg-neutral-800 dark:text-white dark:border-neutral-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
      />
      {error && <span className="text-red-500 text-sm">This field is required</span>}
    </div>
  );
}

function SelectField({ label, name, options, register, required = false }: any) {
  return (
    <div>
      <label className="block text-gray-700 dark:text-gray-300 font-semibold">{label}</label>
      <select
        {...register(name, { required })}
        className="w-full mt-2 p-3 border border-gray-300 rounded-lg dark:bg-neutral-800 dark:text-white dark:border-neutral-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
      >
        <option value="">Select {label}</option>
        {options.map((opt: string) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    </div>
  );
}
