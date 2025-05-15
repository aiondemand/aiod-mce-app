'use server';

import { auth } from '@/auth';
import { Resource } from './types';

export const getAssets = async (assetType: string, limit: number = 1000, offset: number = 0): Promise<{
    error?: string;
    assets?: Resource[];
}> => {
    const session = await auth();
    if (!session) {
        return { error: 'Unauthorized' };
    }

    const baseUrl = process.env.BACKEND_URL;
    if (!baseUrl) {
        return { error: 'Backend URL not configured' };
    }

    try {
        const response = await fetch(`${baseUrl}/${assetType}/v1/?limit=${limit}&offset=${offset}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session.accessToken}`,
            },
        });

        if (!response.ok) {
            return { error: `Failed to fetch ${assetType}: ${response.statusText}` };
        }

        const data = await response.json();
        return {
            assets: data
        };
    } catch (error) {
        console.error(`Error fetching ${assetType}:`, error);
        return { error: 'Failed to fetch assets' };
    }

}