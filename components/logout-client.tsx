'use client'

import { logout } from "@/actions/login";
import { useEffect } from "react";

const LogoutClient = () => {

    const callLogout = async () => {
        await logout();
    }

    useEffect(() => {
        callLogout();
    }, [])

    return <p>logging out...</p>;
}

export default LogoutClient;