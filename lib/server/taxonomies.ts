import { baseURL } from "./common";


export enum TaxonomyType {
    INDUSTRIAL_SECTORS = "industrial_sectors",
    SCIENTIFIC_DOMAINS = "scientific_domains",
    RESEARCH_AREAS = "research_areas",
    PUBLICATION_TYPES = "publication_types",
    NEWS_CATEGORIES = "news_categorys", // is typo in the API...
    LICENSES = "licenses",
}

export interface Taxonomy {
    term: string;
    definition: string;
    subterms: Taxonomy[];
}

export const fetchTaxonomy = async (taxonomyType: TaxonomyType): Promise<Taxonomy[]> => {
    try {
        const response = await fetch(`${baseURL}/v2/${taxonomyType}`);
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