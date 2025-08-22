'use server'

import { AiodAPI } from "./common";
import { EnumTypes } from "./types";

const fetchEnum = (enumName: EnumTypes) => {
    return AiodAPI.fetch<string[]>(`/v2/${enumName}`, undefined, {
        revalidate: 60 * 60 * 24 // 24 hours
    });
}



export const fetchAllEnums = async (): Promise<Record<EnumTypes, string[]>> => {
    const newEnums: Record<EnumTypes, string[]> = {} as Record<EnumTypes, string[]>;

    for (const enumName of Object.values(EnumTypes)) {
        const enumData = await fetchEnum(enumName as EnumTypes);
        newEnums[enumName as keyof typeof newEnums] = enumData;
    }
    return newEnums;
}
