"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { employeeService } from "@/services/employeeService";
import { ParticlesPage } from "./components/Particles";
import useAuthGuard from "../hooks/useAuthGuard";

export default function HomePage() {
  useAuthGuard();

  const router = useRouter();
  const [stats, setStats] = useState({ usersCount: 0, employeesCount: 0, role: "" });

  useEffect(() => {
    const token = localStorage.getItem("EMS_token");
    employeeService
      .getHomeStats()
      .then((res) => {
        if (res.data.data) {         
          setStats(res.data.data);
        }
      })
      .catch((err) => {
        if(token){
          toast.error(err.message || "Error fetching stats");
        }
      });
    }, []);


  return (
    <div className="w-full bg-stone-50 dark:bg-neutral-950">
      <div className="max-w-7xl pt-36 mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <section className="relative text-center py-32 bg-gradient-to-r from-blue-800 via-indigo-700 to-purple-700 dark:from-blue-800 dark:via-indigo-900 dark:to-purple-900 text-white rounded-3xl shadow-2xl mb-24 overflow-hidden">
          <ParticlesPage/>

          <div className="relative z-10">
            <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
              Welcome to <span className="text-yellow-300">EmployeeMS</span>
            </h1>
            <p className="text-lg md:text-xl mb-10 max-w-2xl mx-auto text-gray-200">
              Streamline employee management, boost HR efficiency, and access
              reports with ease.
            </p>
            <button
              onClick={() => router.push("/all-users")}
              className="cursor-pointer inline-flex items-center gap-2 bg-yellow-400 text-gray-900 font-bold px-8 py-3 rounded-xl shadow-lg hover:bg-yellow-500 transition transform hover:scale-105"
            >
              <i className="fas fa-users"></i> Get Started
            </button>
          </div>
        </section>

        {/* About Section */}
        <section className="cursor-pointer mb-24 text-center bg-white dark:bg-neutral-900 p-14 rounded-3xl shadow-md shadow-neutral-500">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-neutral-900 dark:text-white">
            About EmployeeMS
          </h2>
          <p className="max-w-3xl mx-auto text-neutral-700 dark:text-neutral-400 text-lg leading-relaxed">
            EmployeeMS is your all-in-one HR solution. From onboarding new hires
            to generating analytics and managing departments, our platform
            ensures efficiency and productivity.
          </p>
        </section>

        {/* Features Section */}
        <section className="mb-24 bg-gradient-to-r from-gray-300 to-indigo-300 dark:from-neutral-900 dark:to-neutral-800 rounded-3xl shadow-md p-14">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-neutral-900 dark:text-white">
            Awesome Features
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-6xl mx-auto">
            <div
              onClick={() => router.push("/all-users")}
              className=" bg-white/80 dark:bg-neutral-900/80 backdrop-blur-lg rounded-2xl shadow-lg p-10 flex flex-col items-center text-center hover:shadow-2xl hover:shadow-indigo-500/70 cursor-pointer transition transform hover:-translate-y-2"
            >
              <i className="fas fa-user-cog text-5xl text-indigo-600 dark:text-indigo-400 mb-6"></i>
              <h3 className="text-xl font-semibold mb-3 text-neutral-900 dark:text-white">
                Manage Users
              </h3>
              <p className="text-neutral-600 dark:text-neutral-400">
                Update, assign roles, or deactivate employees anytime.
              </p>
            </div>

            {stats.role === "user" ? (
              <div className=" bg-white/80 dark:bg-neutral-900/80 backdrop-blur-lg rounded-2xl shadow-lg p-10 flex flex-col items-center text-center hover:shadow-2xl hover:shadow-blue-500/70 cursor-pointer transition transform hover:-translate-y-2">
                <i className="fas fa-user-plus text-5xl text-blue-600 dark:text-blue-400 mb-6"></i>
                <h3 className="text-xl font-semibold mb-3 text-neutral-900 dark:text-white">
                  Add User
                </h3>
                <p className="text-neutral-600 dark:text-neutral-400">
                  Easily onboard employees with a simple and intuitive process.
                </p>
              </div>
            ) : (
              <div
                onClick={() => router.push("/add-user")}
                className="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-lg rounded-2xl shadow-lg p-10 flex flex-col items-center text-center hover:shadow-2xl hover:shadow-blue-500/70 cursor-pointer transition transform hover:-translate-y-2"
              >
                <i className="fas fa-user-plus text-5xl text-blue-600 dark:text-blue-400 mb-6"></i>
                <h3 className="text-xl font-semibold mb-3 text-neutral-900 dark:text-white">
                  Add User
                </h3>
                <p className="text-neutral-600 dark:text-neutral-400">
                  Easily onboard employees with a simple and intuitive process.
                </p>
              </div>
            )}

            <div
              className="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-lg rounded-2xl shadow-lg p-10 flex flex-col items-center text-center hover:shadow-2xl hover:shadow-purple-500/70 cursor-pointer transition transform hover:-translate-y-2"
            >
              <i className="fas fa-chart-line text-5xl text-purple-600 dark:text-purple-400 mb-6"></i>
              <h3 className="text-xl font-semibold mb-3 text-neutral-900 dark:text-white">
                Reports
              </h3>
              <p className="text-neutral-600 dark:text-neutral-400">
                Track performance and generate detailed HR analytics.
              </p>
            </div>
          </div>
        </section>

        {/* Statistics Section */}
        <section className="mb-24 bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-indigo-900 dark:to-purple-900 rounded-3xl shadow p-14 max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-neutral-900 dark:text-white">
            Our Impact
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div className="hover:scale-105 transition cursor-pointer">
              <p className="text-6xl font-extrabold text-blue-600 dark:text-blue-400 mb-3">
                <i className="fas fa-users"></i> {stats.employeesCount}
              </p>
              <p className="text-gray-700 dark:text-gray-300 text-lg">
                Employees Managed
              </p>
            </div>

            <div className="hover:scale-105 transition cursor-pointer">
              <p className="text-6xl font-extrabold text-indigo-600 dark:text-indigo-400 mb-3">
                <i className="fas fa-user-check"></i> {stats.usersCount}
              </p>
              <p className="text-gray-700 dark:text-gray-300 text-lg">
                Active Users
              </p>
            </div>

            <div className="hover:scale-105 transition cursor-pointer" >
              <p className="text-6xl font-extrabold text-purple-600 dark:text-purple-400 mb-3">
                <i className="fas fa-building"></i> 8
              </p>
              <p className="text-gray-700 dark:text-gray-300 text-lg">
                Departments
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* Footer Section */}
      <footer className="bg-gradient-to-r from-gray-900 via-black to-gray-900 text-gray-400 dark:bg-neutral-950 border-t border-gray-800">
        <div className="max-w-screen-xl mx-auto px-6 py-10 flex items-center justify-center flex-col sm:flex-row sm:justify-between">
          <span className="text-sm">© 2024 EmployeeMS. All Rights Reserved.</span>
          <div className="flex mt-6 space-x-8 sm:mt-0 text-xl">
            <a className="hover:text-blue-500 transition">
              <i className="fab fa-facebook-f"></i>
            </a>
            <a className="hover:text-white transition">
              <i className="fab fa-x-twitter"></i>
            </a>
            <a className="hover:text-orange-600 transition">
              <i className="fab fa-github"></i>
            </a>
            <a className="hover:text-pink-500 transition">
              <i className="fab fa-instagram"></i>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
