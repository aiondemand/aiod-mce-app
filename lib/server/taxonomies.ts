'use server'

import { baseURL } from "./common";
import { Taxonomy, TaxonomyType } from "./types";


export const fetchTaxonomy = async (taxonomyType: TaxonomyType): Promise<Taxonomy[]> => {
    try {
        const response = await fetch(`${baseURL}/v2/${taxonomyType}`, {
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
        throw new Error(`Error fetching taxonomy ${taxonomyType}: ${errMsg}`);
    }
}

export const fetchAllTaxonomies = async (): Promise<Record<TaxonomyType, Taxonomy[]>> => {
    const taxonomies: Record<TaxonomyType, Taxonomy[]> = {
        industrial_sectors: [],
        scientific_domains: [],
        research_areas: [],
        publication_types: [],
        news_categorys: [],
        licenses: [],
    };
    for (const taxonomyType of Object.values(TaxonomyType)) {
        taxonomies[taxonomyType] = await fetchTaxonomy(taxonomyType);
    }
    return taxonomies;
}