"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Swal from "sweetalert2";
import { Dropdown } from "flowbite-react";
import { useRouter, usePathname } from "next/navigation"; 

export default function Navbar() {
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [avatar, setAvatar] = useState<string>(" ");
    const [role, setRole] = useState<string | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const router = useRouter();
    const pathname = usePathname(); 

    useEffect(() => {
        const token = localStorage.getItem("EMS_token");
        setIsLoggedIn(!!token);

        if (token) {
        fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/employee/home_stats`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((res) => res.json())
            .then((data) => {
            setAvatar(data?.data?.avatar || "/default-avatar.png");
            setRole(data?.data?.role);
            })
            .catch(() => console.log("Error fetching home stats"));
        }

        const savedTheme = localStorage.getItem("theme") || "light";
        const isDark = savedTheme === "dark";
        document.documentElement.classList.toggle("dark", isDark);
        setIsDarkMode(isDark);
    }, []);

    const toggleDarkMode = () => {
        const newMode = !isDarkMode;
        setIsDarkMode(newMode);
        localStorage.setItem("theme", newMode ? "dark" : "light");
        document.documentElement.classList.toggle("dark", newMode);
    };

    const handleLogout = () => {
        const isDark = localStorage.getItem("theme") === "dark";

        Swal.fire({
        title: "Are you sure?",
        text: "You will be logged out of EmployeeMS.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: isDark ? "#4f46e5" : "#3085d6",
        cancelButtonColor: "#ef4444",
        confirmButtonText: "Yes, logout!",
        background: isDark ? "#1b1b1b" : "#fff",
        color: isDark ? "#f3f4f6" : "#111827",
        }).then((result) => {
        if (result.isConfirmed) {
            localStorage.removeItem("EMS_token");
            setIsLoggedIn(false);
            setAvatar("/default-avatar.png");

            Swal.fire({
            title: "Logged out!",
            text: "You have been logged out successfully.",
            icon: "success",
            background: isDark ? "#1b1b1b" : "#fff",
            color: isDark ? "#f3f4f6" : "#111827",
            });

            router.push("/login");
        }
        });
    };
   
    const isActive = (path: string) => pathname === path;

  return (
    <nav className="bg-indigo-600 dark:bg-neutral-900 border-b border-gray-800 dark:border-gray-500 fixed w-full z-30 top-0 left-0 transition-colors duration-300">
    <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        {/* Logo */}
        <Link href="/" className="flex items-center">
        <span className="self-center text-2xl font-semibold whitespace-nowrap text-neutral-900 dark:text-white">
            <i className="fas fa-briefcase text-yellow-500 dark:text-indigo-600 mr-2"></i>
            EmployeeMS
        </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex md:w-auto">
        <ul className="font-medium flex flex-col p-4 md:p-0 md:ps-4 mt-4 border border-gray-100 rounded-lg bg-blue-200/60 md:flex-row md:space-x-8 md:mt-0 md:border-0 dark:bg-neutral-800 dark:border-neutral-700">
            <li>
            <Link
                href="/"
                className={`flex items-center gap-2 py-2 pl-3 pr-4 transition-colors
                ${
                isActive("/")
                    ? "text-blue-700 dark:text-blue-400 font-semibold"
                    : "text-gray-900 dark:text-gray-300 hover:text-blue-700 dark:hover:text-blue-400"
                }`}
            >
                <i className="fas fa-home"></i> Home
            </Link>
            </li>
            <li>
            <Link
                href="/all-users"
                className={`flex items-center gap-2 py-2 pl-3 pr-4 transition-colors
                ${
                isActive("/all-users")
                    ? "text-blue-700 dark:text-blue-400 font-semibold"
                    : "text-gray-900 dark:text-gray-300 hover:text-blue-700 dark:hover:text-blue-400"
                }`}
            >
                <i className="fas fa-users"></i> All Employees
            </Link>
            </li>
            {role !== "user" && (
            <li>
                <Link
                href="/add-user"
                className={`flex items-center gap-2 py-2 pl-3 pr-4 transition-colors
                ${
                    isActive("/add-user")
                    ? "text-blue-700 dark:text-blue-400 font-semibold"
                    : "text-gray-900 dark:text-gray-300 hover:text-blue-700 dark:hover:text-blue-400"
                }`}
                >
                <i className="fas fa-user-plus"></i> Add Employee
                </Link>
            </li>
            )}
        </ul>
        </div>


        <div className="flex items-center">
            <div className="flex items-center space-x-4">
            <button
                onClick={toggleDarkMode}
                aria-label="Toggle Dark Mode"
                className="cursor-pointer text-gray-100 dark:text-gray-400 hover:text-neutral-900 dark:hover:text-white focus:outline-none rounded p-2 transition"
            >
                {isDarkMode ? (
                <i className="fas fa-moon"></i>
                ) : (
                <i className="fas fa-sun"></i>
                )}
            </button>

            {/* Profile Dropdown */}
            {isLoggedIn && (
                <Dropdown className="dark:bg-neutral-800"
                label={<img className="w-8 h-8 rounded-full cursor-pointer" src={avatar} alt="Avatar" />}
                inline
                >
                <Link href="/profile" className={`block p-2  ${
                isActive("/profile")
                    ? "text-blue-700 dark:text-blue-400 font-semibold"
                    : "text-gray-900 dark:text-gray-300 hover:text-blue-700 dark:hover:text-blue-400"
                }`}>
                    <i className="fas fa-user mr-2"></i> Profile
                </Link>
                <Link href="/edit-profile" className={`block p-2  ${
                isActive("/edit-profile")
                    ? "text-blue-700 dark:text-blue-400 font-semibold"
                    : "text-gray-900 dark:text-gray-300 hover:text-blue-700 dark:hover:text-blue-400"
                }`}>
                    <i className="fas fa-cog mr-2"></i> Settings
                </Link>
                <button onClick={handleLogout} className="w-full text-left text-red-500 p-2">
                    <i className="fas fa-sign-out-alt mr-2"></i> Logout
                </button>
                </Dropdown>
            )}
            </div>

            {/* Hamburger button for small screens */}
            <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="cursor-pointer md:hidden text-gray-100 dark:text-gray-400 hover:text-neutral-900 dark:hover:text-white focus:outline-none p-2"
                >
                <i className="fas fa-bars text-2xl"></i>
            </button>
        </div>
    </div>
    
    {/* Small Screen Menu */}
    {isMenuOpen && (
        <ul className="md:hidden flex flex-col bg-indigo-600 dark:bg-neutral-900 p-4 mt-2 space-y-2 rounded-lg">
        <li>
            <Link href="/" className="flex items-center gap-2 text-white hover:text-yellow-300">
            <i className="fas fa-home"></i> Home
            </Link>
        </li>
        <li>
            <Link href="/all-users" className="flex items-center gap-2 text-white hover:text-yellow-300">
            <i className="fas fa-users"></i> All Users
            </Link>
        </li>
        {role !== "user" && (
            <li>
            <Link href="/add-user" className="flex items-center gap-2 text-white hover:text-yellow-300">
                <i className="fas fa-user-plus"></i> Add User
            </Link>
            </li>
        )}
        </ul>
    )}
    </nav>
);
}
