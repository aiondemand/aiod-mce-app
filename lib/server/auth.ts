'use server'

import { auth } from "@/auth";
import logger from "../logger";
import { AiodAPI } from "./common";


export const renewToken = async (clientId: string, clientSecret: string, refreshToken: string) => {
    const issuer = process.env.AUTH_KEYCLOAK_ISSUER || '';
    if (!issuer) {
        throw new Error('AUTH_KEYCLOAK_ISSUER is not set');
    }

    const tokenEndpoint = `${issuer.replace(/\/$/, '')}/protocol/openid-connect/token`;

    const form = new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
        client_id: clientId,
        scope: 'openid profile email offline_access'
    });
    if (clientSecret) {
        form.append('client_secret', clientSecret);
    }

    const response = await fetch(tokenEndpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: form,
        cache: 'no-store',
    });

    if (!response.ok) {
        const errorBody = await response.text().catch(() => '');
        const message = `Token refresh failed: ${response.status} ${response.statusText}${errorBody ? ` - ${errorBody}` : ''}`;
        logger.error(message);
        throw new Error(message);
    }

    const json = await response.json() as {
        access_token: string;
        refresh_token: string;
        expires_in: number;
    };

    return json;
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