'use server'

import { auth } from "@/auth";
import { AiodAPI } from "./common";


export const renewToken = async (clientId: string, clientSecret: string, refreshToken: string) => {
    const resp = await AiodAPI.fetch<{
        access_token: string;
        refresh_token: string;
        expires_in: number;
    }>(`/aiod-auth/realms/aiod/protocol/openid-connect/token`, undefined, {
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
    return resp;
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

    const resp = await AiodAPI.fetch<{
        name?: string;
        error?: string;
    }>(`/authorization_test`, token, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    });
    return resp;
}