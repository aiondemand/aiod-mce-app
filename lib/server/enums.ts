'use server'

import { baseURL } from "./common";
import { EnumTypes } from "./types";

const fetchEnum = async (enumName: EnumTypes): Promise<string[]> => {
    try {
        const response = await fetch(`${baseURL}/v2/${enumName}`, {
            next: {
                revalidate: 60 * 60 * 24 // 24 hours
            }
        });
        if (!response.ok) {
            throw new Error(`${response.status} ${response.statusText}`);
        }
        const json = await response.json();
        return json;
    } catch (error: unknown) {
        const errMsg = error instanceof Error ? error.message : String(error);
        console.error(`Error fetching enum ${enumName}: ${errMsg}`);
        return [];
    }
}



export const fetchAllEnums = async (): Promise<Record<EnumTypes, string[]>> => {
    const newEnums: Record<EnumTypes, string[]> = {} as Record<EnumTypes, string[]>;

    for (const enumName of Object.values(EnumTypes)) {
        const enumData = await fetchEnum(enumName as EnumTypes);
        newEnums[enumName as keyof typeof newEnums] = enumData;
    }
    return newEnums;
}
