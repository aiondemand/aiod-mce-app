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
        const base = this.baseURL.endsWith('/') ? this.baseURL : `${this.baseURL}/`;
        const relativePath = pathname.startsWith('/') ? pathname.slice(1) : pathname;
        const url = new URL(relativePath, base);
        logger.debug(`API Request: ${url.toString()} ${method}`);
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
            const msg = `API Error: ${response.status} ${response.statusText} ${await response.text()}`;
            logger.error(msg);
            throw new Error(msg);
        }
        logger.debug(`API Response: ${response.status} ${response.statusText}`);

        return response.json();
    }
}

export const AiodAPI = new AiodAPIClient();