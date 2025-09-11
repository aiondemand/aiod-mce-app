'use client'

import { logout } from "@/actions/login";
import { useEffect } from "react";

const LogoutClient = () => {
    useEffect(() => {
        const callLogout = async () => {
            await logout();
        }
        callLogout();
    }, [])

    return <p>logging out...</p>;
}

export default LogoutClient;