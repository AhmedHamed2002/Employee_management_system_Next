"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function useAuthGuard() {
const router = useRouter();

useEffect(() => {
    const token = localStorage.getItem("EMS_token");
    if (!token) {
    router.push("/login");
    toast.error("Please login first");
    }
}, [router]);
}
