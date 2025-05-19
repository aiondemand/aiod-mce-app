"use server"

import { baseURL } from "./common";

const fetchEnum = async (enumName: string): Promise<string[]> => {
    try {
        const response = await fetch(`${baseURL}/${enumName}/v1`);
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

export interface Enums {
    eventModes: string[];
    eventStatus: string[];
    applicationAreas: string[];
    industrialSectors: string[];
    researchAreas: string[];
    scienticDomains: string[];
    publicationTypes: string[];
    eduAccessModes: string[];
    eduEducationalLevels: string[];
    eduPaces: string[];
    eduPrerequisites: string[];
    eduTargetAudiences: string[];
    eduType: string[];
    languages: string[];
}


const enumNames = {
    eventModes: 'event_modes',
    eventStatus: 'event_status',
    applicationAreas: 'application_areas',
    industrialSectors: 'industrial_sectors',
    researchAreas: 'research_areas',
    scienticDomains: 'scientific_domains',
    publicationTypes: 'publication_types',
    eduAccessModes: 'edu_access_modes',
    eduEducationalLevels: 'edu_educational_levels',
    eduPaces: 'edu_paces',
    eduPrerequisites: 'edu_prerequisites',
    eduTargetAudiences: 'edu_target_audiences',
    eduType: 'educational_resource_types',
    languages: 'languages',
}


export const fetchAllEnums = async (): Promise<Enums> => {
    const newEnums: Enums = {
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

    for (const enumName of Object.keys(enumNames)) {
        const enumData = await fetchEnum(enumNames[enumName as keyof typeof enumNames]);
        newEnums[enumName as keyof typeof newEnums] = enumData;
    }

    return newEnums;
}
