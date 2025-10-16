"use client";

import { useEffect, useState } from "react";
import { employeeService } from "@/services/employeeService";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import Link from "next/link";

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
  birthday?: string
  image?: string;
}

export default function AllEmployeesPage() {
  const router = useRouter();

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [displayedEmployees, setDisplayedEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDark, setIsDark] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;
  const totalPages = Math.ceil(employees.length / itemsPerPage);

  useEffect(() => {
    setIsDark(localStorage.getItem("theme") === "dark");
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    setLoading(true);
    try {
      const res:any = await employeeService.getAllEmployees();
      if (res.data.status == "success") {   
        setEmployees(res.data.data || []);
        setRole((res.data as any).role);
        updateDisplayedEmployees(res.data.data || [], 1);
      } else {
        setEmployees([]);
        Swal.fire({
          title: "Unknown",
          text: res.data.message || "Unexpected server response",
          icon: "info",
          background: isDark ? "#1b1b1b" : "#fff",
          color: isDark ? "#f3f4f6" : "#111827",
        });
      }
    } catch (err: any) {
      Swal.fire({
        title: "Error",
        text: err.response?.data?.message || "Cannot connect to server",
        icon: "error",
        background: isDark ? "#1b1b1b" : "#fff",
        color: isDark ? "#f3f4f6" : "#111827",
      });
    } finally {
      setLoading(false);
    }
  };

  const search = async () => {
    if (!searchQuery.trim()) return loadEmployees();
    setLoading(true);
    try {
      const res:any = await employeeService.searchEmployees(searchQuery);
      if (res.data.status == "success") {
        setEmployees(res.data.data || []);
        updateDisplayedEmployees(res.data.data || [], 1);
      } else {
        setEmployees([]);
        Swal.fire({
          title: "Unknown",
          text: res.data.message || "Unexpected server response",
          icon: "info",
          background: isDark ? "#1b1b1b" : "#fff",
          color: isDark ? "#f3f4f6" : "#111827",
        });
      }
    } catch (err: any) {
      Swal.fire({
        title: "Warning",
        text: err.response?.data?.message || "Cannot connect to server",
        icon: "warning",
        background: isDark ? "#1b1b1b" : "#fff",
        color: isDark ? "#f3f4f6" : "#111827",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateDisplayedEmployees = (list: Employee[], page: number) => {
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    setDisplayedEmployees(list.slice(start, end));
  };

  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    updateDisplayedEmployees(employees, page);
  };

  const nextPage = () => goToPage(currentPage + 1);
  const prevPage = () => goToPage(currentPage - 1);

  if (loading) return null; // handled by loading.tsx

  return (
    <div className="min-h-screen pt-28 w-full bg-gradient-to-br from-stone-50 to-stone-100 dark:from-neutral-900 dark:to-neutral-950 p-8">
      {/* Container */}
      <div className="max-w-8xl mx-auto bg-gray-50 dark:bg-neutral-900 shadow-2xl rounded-3xl overflow-hidden border border-gray-200 dark:border-neutral-700">
        <div className="grid grid-cols-1 md:grid-cols-5 lg:grid-cols-4">
          {/* Sidebar */}
          <aside className="p-8 bg-gradient-to-br from-indigo-700 to-blue-800 text-white md:col-span-2 lg:col-span-1 flex flex-col justify-between">
            <div>
              <h2 className="text-2xl font-extrabold mb-6 flex items-center gap-2">
                <i className="fas fa-users"></i> Employees
              </h2>

              {/* Search */}
              <div className="relative w-full max-w-md">
                <div className="flex justify-between items-center">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="by name , position..."
                    className="w-full placeholder:text-neutral-500 bg-white p-3 pr-12 rounded-lg border-0 focus:ring-2 focus:ring-indigo-300 text-gray-900"
                  />
                  <button
                    onClick={search}
                    className="bg-white text-indigo-700 ms-2 px-3 py-3 rounded-lg hover:bg-neutral-300 transition"
                  >
                    <i className="fas fa-search"></i>
                  </button>
                </div>
                <p className="mt-3 text-indigo-100 text-sm">
                  Search by name, position, department...
                </p>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <section className="p-10 md:col-span-3 max-h-[80vh] overflow-y-auto hide-scrollbar">
            {/* No Employees */}
            {employees.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 px-6 text-center bg-white dark:bg-neutral-800 rounded-2xl shadow-sm border border-gray-200 dark:border-neutral-700">
                <div className="mb-4">
                  <i className="fas fa-users text-6xl text-gray-400 dark:text-gray-500"></i>
                </div>
                <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200">
                  No Employees Found
                </h2>
                <p className="mt-2 text-gray-500 dark:text-gray-400 max-w-md">
                  You don’t have any employees added yet. Start by creating a new employee
                  profile.
                </p>
                {role !== "user" && (
                  <Link
                    href="/add-user"
                    className="mt-6 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium transition-all shadow-sm flex items-center gap-2"
                  >
                    <i className="fas fa-plus"></i> Add Employee
                  </Link>
                )}
              </div>
            ) : (
              <>
                {/* Employees Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {displayedEmployees.map((emp) => (
                    <div
                      key={emp.id}
                      onClick={() => router.push(`/all-users/${emp.id}`)}
                      className="bg-gray-200 cursor-pointer dark:bg-neutral-800 rounded-2xl shadow-md p-6 flex flex-col items-center hover:-translate-y-1 transition"
                    >
                      {/* Avatar */}
                      <div className="w-24 h-24 rounded-full overflow-hidden shadow-md mb-4 border-4 border-indigo-100 dark:border-neutral-700">
                        {emp.image && (
                          <img
                            src={emp.image}
                            alt="avatar"
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>

                      {/* Name & Position */}
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white text-center">
                        {emp.name}
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400 text-sm text-center mb-4">
                        {emp.position} - {emp.department}
                      </p>

                      {/* Detailed Info */}
                      <div className="w-full text-sm text-gray-700 dark:text-gray-300 space-y-1 pt-3">
                        <p>
                          <i className="fas fa-id-card mr-1 text-indigo-600"></i>
                          <span className="font-semibold">ID:</span> {emp.id}
                        </p>
                        {emp.gender && (
                          <p>
                            <i className="fas fa-venus-mars mr-1 text-indigo-600"></i>
                            <span className="font-semibold">Gender:</span> {emp.gender}
                          </p>
                        )}
                        {emp.city && (
                          <p>
                            <i className="fas fa-city mr-1 text-indigo-600"></i>
                            <span className="font-semibold">City:</span> {emp.city}
                          </p>
                        )}
                        {emp.age && (
                          <p>
                            <i className="fas fa-user-clock mr-1 text-indigo-600"></i>
                            <span className="font-semibold">Age:</span> {emp.age}
                          </p>
                        )}
                        {emp.birthday && (
                          <p className="pb-2">
                            <i className="fas fa-birthday-cake mr-1 text-indigo-600"></i>
                            <span className="font-semibold">Birthday:</span> {emp.birthday}
                          </p>
                        )}

                        {emp.salary && (
                          <p className="border-t border-gray-400 dark:border-neutral-700 pt-2">
                            <i className="fas fa-dollar-sign mr-1 text-green-400"></i>{" "}
                            <span className="font-semibold">Salary:</span> ${emp.salary}
                          </p>
                        )}
                        {emp.email && (
                          <p>
                            <i className="fas fa-envelope mr-1 text-red-700"></i>{" "}
                            <span className="font-semibold">Email:</span> {emp.email}
                          </p>
                        )}
                        {emp.phone && (
                          <p>
                            <i className="fas fa-phone mr-1 text-violet-600"></i>{" "}
                            <span className="font-semibold">Phone:</span> {emp.phone}
                          </p>
                        )}
                        {emp.hireDate && (
                          <p>
                            <i className="fas fa-calendar-check mr-1 text-cyan-600"></i>
                            <span className="font-semibold">Hire Date:</span> {emp.hireDate}
                          </p>
                        )}

                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="fixed bottom-4 left-0 w-full flex justify-center items-center gap-3 z-50">
                    <button
                      onClick={prevPage}
                      disabled={currentPage === 1}
                      className="px-4 py-2 bg-gray-200 dark:bg-neutral-700 rounded-lg hover:bg-gray-300 dark:hover:bg-neutral-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <i className="fas fa-chevron-left"></i>
                    </button>
                    <span className="px-3 py-2 bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 rounded-lg">
                      Page {currentPage} of {totalPages}
                    </span>
                    <button
                      onClick={nextPage}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 bg-gray-200 dark:bg-neutral-700 rounded-lg hover:bg-gray-300 dark:hover:bg-neutral-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <i className="fas fa-chevron-right"></i>
                    </button>
                  </div>
                )}
              </>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
