import logger from "../logger";
import { getTokenHeader } from "./utils";

export interface ApiOptions {
    headers?: { [key: string]: string };
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
    body?: BodyInit;
    revalidate?: number;
}

class AiodAPIClient {
    private baseURL: string;

    constructor() {
        this.baseURL = process.env.BACKEND_URL || '';
        if (!this.baseURL) {
            throw new Error('BACKEND_URL is not set');
        }
    }

    async fetch<T>(pathname: string, accessToken?: string, requestOptions?: ApiOptions): Promise<T> {
        const { headers, method = 'GET', body, revalidate = 0 } = requestOptions || {};
        const url = new URL(pathname, this.baseURL);
        const response = await fetch(url, {
            method,
            headers: {
                ...getTokenHeader(accessToken),
                ...headers,
            },
            body: body,
            next: {
                revalidate: revalidate,
            },
        });

        if (!response.ok) {
            const msg = `API Error: ${response.status} ${response.statusText}`;
            logger.error(msg);
            throw new Error(msg);
        }

        return response.json();
    }
}

export const AiodAPI = new AiodAPIClient();