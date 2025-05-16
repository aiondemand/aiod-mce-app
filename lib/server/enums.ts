"use server"

import { baseURL } from "./common";

const fetchEnum = async (enumName: string): Promise<string[]> => {
    try {
        const response = await fetch(`${baseURL}/${enumName}/v1`);
        const json = await response.json();
        return json;
    } catch (error: unknown) {
        const errMsg = error instanceof Error ? error.message : String(error);
        console.error(errMsg);
        return [];
    }
}


const enumNames = [
    'event_modes',
    'event_status',
    'application_areas',
    'industrial_sectors',
    'research_areas',
    'scientific_domains',
    'publication_types',
    'edu_access_modes',
    'edu_educational_levels',
    'edu_paces',
    'edu_prerequisites',
    'edu_target_audiences',
    'educational_resource_types',
    'languages',
]


export const fetchAllEnums = async () => {
    const newEnums = {
        eventModes: [] as string[],
        eventStatus: [] as string[],
        applicationAreas: [] as string[],
        industrialSectors: [] as string[],
        researchAreas: [] as string[],
        scienticDomains: [] as string[],
        publicationTypes: [] as string[],
        eduAccessModes: [] as string[],
        eduEducationalLevels: [] as string[],
        eduPaces: [] as string[],
        eduPrerequisites: [] as string[],
        eduTargetAudiences: [] as string[],
        eduType: [] as string[],
        languages: [] as string[],
    }

    await Promise.all(enumNames.map(async (enumName) => {
        const enumData = await fetchEnum(enumName);
        newEnums[enumName as keyof typeof newEnums] = enumData;
    }));

    return newEnums;
}
