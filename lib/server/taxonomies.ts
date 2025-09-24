'use server'

import { AiodAPI } from "./common";
import { Taxonomy, TaxonomyType } from "./types";


export const fetchTaxonomy = async (taxonomyType: TaxonomyType): Promise<Taxonomy[]> => {
    return AiodAPI.fetch<Taxonomy[]>(`/v2/${taxonomyType}`, undefined, {
        revalidate: 60 * 60 * 24 // 24 hours
    });
}
