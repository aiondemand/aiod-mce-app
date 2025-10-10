'use server';

import { auth } from '@/auth';
import { Resource } from './types';
import { AiodAPI } from './common';
import logger from '../logger';
import { revalidatePath } from 'next/cache';

export const getAssets = async (assetType: string, limit: number = 1000, offset: number = 0): Promise<{
    error?: string;
    assets?: Resource[];
}> => {
    const session = await auth();
    if (!session) {
        return { error: 'Unauthorized' };
    }

    try {
        const response = await AiodAPI.fetch<Resource[]>(`/${assetType}?limit=${limit}&offset=${offset}`, session.accessToken, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session.accessToken}`,
            },
        });


        const data = response as Resource[];
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
        const response = await AiodAPI.fetch<Resource>(`/${assetType}/${assetId}`, session.accessToken);

        return {
            asset: response
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

    try {
        logger.info('fetching my assets');
        const response = await AiodAPI.fetch<{
            [key: string]: Resource[];
        }>(`/user/resources?limit=1000&offset=0`, session.accessToken);

        return {
            assets: response
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

    try {
        const response = await AiodAPI.fetch<Resource>(`/${assetType}`, session.accessToken, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(asset),
        });

        return {
            asset: response
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

    delete asset.aiod_entry

    try {
        const response = await AiodAPI.fetch<Resource>(`/${assetType}/${assetId}`, session.accessToken, {
            method: 'PUT',
            body: JSON.stringify(asset),
            headers: {
                'Content-Type': 'application/json',
            },
        });

        revalidatePath(`/my-assets/${assetType}/editor/${assetId}`);
        return {
            asset: response
        };

    } catch (error) {
        console.error(`Error updating ${assetType}:`, error);
        return { error: 'Failed to update asset' };
    }
}


export const deleteAsset = async (assetType: string, assetId: string) => {
    const session = await auth();
    if (!session) {
        return { error: 'Unauthorized' };
    }

    try {
        const response = await AiodAPI.fetch<Resource>(`/${assetType}/${assetId}`, session.accessToken, {
            method: 'DELETE',
        });

        return {
            asset: response
        };

    } catch (error) {
        console.error(`Error deleting ${assetType}:`, error);
        return { error: 'Failed to delete asset' };
    }
}