"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";

export default function NavbarWrapper() {
    const pathname = usePathname();
    const hiddenRoutes = [
        "/login",
        "/register",
        "/forgot-password",
        "/reset-password",
        "/not-found",
    ];

    const showNavbar = !hiddenRoutes.includes(pathname);

    return showNavbar ? <Navbar/> : null;
}
