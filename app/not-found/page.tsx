"use client";

import Link from "next/link";
export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-stone-50 to-stone-100 dark:from-neutral-900 dark:to-neutral-950 p-8 text-center">
        <div className="mb-6">
            <i className="fas fa-exclamation-triangle text-7xl text-red-500 dark:text-red-400"></i>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">404 - Page Not Found</h1>
        <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-lg">
            The page you are looking for does not exist or has been moved.
        </p>
        <Link href="/"  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium transition-shadow shadow-sm">
            <i className="fas fa-home"></i> Go Back Home
        </Link>
    </div>
    );
}
