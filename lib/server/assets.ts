'use server';

import { auth } from '@/auth';
import { Resource } from './types';
import { baseURL } from './common';
import logger from '../logger';

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

export const getAsset = async (assetType: string, assetId: string): Promise<{
    error?: string;
    asset?: Resource;
}> => {
    const session = await auth();
    if (!session) {
        return { error: 'Unauthorized' };
    }

    try {
        const response = await fetch(`${baseURL}/${assetType}/v1/${assetId}`, {
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
            asset: data
        };
    } catch (error) {
        console.error(`Error fetching ${assetType}:`, error);
        return { error: 'Failed to fetch asset' };
    }
}

export const getMyAssets = async (): Promise<{
    error?: string;
    assets?: {
        [key: string]: Resource[];
    };
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
        logger.info('fetching my assets');
        const response = await fetch(`${baseUrl}/user/resources/v1`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session.accessToken}`,
            },
        });

        if (!response.ok) {
            return { error: `Failed to fetch my assets: ${response.statusText}` };
        }

        const data = await response.json();
        return {
            assets: data
        };
    } catch (error) {
        console.error('Error fetching my assets:', error);
        return { error: 'Failed to fetch my assets' };
    }
}

export const createAsset = async (assetType: string, asset: Resource) => {
    const session = await auth();
    if (!session) {
        return { error: 'Unauthorized' };
    }

    const baseUrl = process.env.BACKEND_URL;
    if (!baseUrl) {
        return { error: 'Backend URL not configured' };
    }

    try {
        const response = await fetch(`${baseUrl}/${assetType}/v1`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session.accessToken}`,
            },
            body: JSON.stringify(asset),
        });

        if (!response.ok) {
            return { error: `Failed to create ${assetType}: ${response.statusText}` };
        }

        const data = await response.json();
        return {
            asset: data
        };

    } catch (error) {
        console.error(`Error creating ${assetType}:`, error);
        return { error: 'Failed to create asset' };
    }
}

export const updateAsset = async (assetType: string, assetId: string, asset: Resource) => {
    const session = await auth();
    if (!session) {
        return { error: 'Unauthorized' };
    }

    try {
        const response = await fetch(`${baseURL}/${assetType}/v1/${assetId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session.accessToken}`,
            },
            body: JSON.stringify(asset),
        });

        if (!response.ok) {
            return { error: `Failed to update ${assetType}: ${response.statusText}` };
        }

        const data = await response.json();
        return {
            asset: data
        };

    } catch (error) {
        console.error(`Error updating ${assetType}:`, error);
        return { error: 'Failed to update asset' };
    }
}


export const deleteAsset = async (assetType: string, assetId: string): Promise<{
    error?: string;
}> => {
    const session = await auth();
    if (!session) {
        return { error: 'Unauthorized' };
    }

    try {
        const response = await fetch(`${baseURL}/${assetType}/v1/${assetId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session.accessToken}`,
            },
        });

        if (!response.ok) {
            return { error: `Failed to delete ${assetType}: ${response.statusText}` };
        }
    } catch (error) {
        console.error(`Error deleting ${assetType}:`, error);
        return { error: 'Failed to delete asset' };
    }
    return { error: undefined };
}