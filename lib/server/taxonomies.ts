'use server'

import { AiodAPI } from "./common";
import { Taxonomy, TaxonomyType } from "./types";


export const fetchTaxonomy = async (taxonomyType: TaxonomyType): Promise<Taxonomy[]> => {
    return AiodAPI.fetch<Taxonomy[]>(`/v2/${taxonomyType}`, undefined, {
        revalidate: 60 * 60 * 24 // 24 hours
    });
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