'use server'

import { auth } from "@/auth";
import { baseURL } from "./common";


export const renewToken = async (clientId: string, clientSecret: string, refreshToken: string) => {
    const resp = await fetch(`${baseURL}/aiod-auth/realms/aiod/protocol/openid-connect/token`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            grant_type: 'refresh_token',
            refresh_token: refreshToken,
            client_id: clientId,
            client_secret: clientSecret,
            scope: 'openid profile email offline_access'
        })
    })
    return resp.json()
}

export const testAuth = async (): Promise<{
    name?: string;
    error?: string;
}> => {
    const session = await auth();
    const token = session?.accessToken;
    if (!token) {
        return {
            error: 'Unauthorized'
        }
    }

    const resp = await fetch(`${baseURL}/authorization_test`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    });
    return resp.json();
}