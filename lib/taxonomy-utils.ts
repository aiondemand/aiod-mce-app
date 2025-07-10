import { Taxonomy } from "@/lib/server/types";

export class TaxonomyEntry {
    term: string;
    definition: string;
    subterms: TaxonomyEntry[];
    path: string[];

    constructor(taxonomy: Taxonomy, path: string[]) {
        this.term = taxonomy.term;
        this.definition = taxonomy.definition;
        this.subterms = taxonomy.subterms.map(subterm => new TaxonomyEntry(subterm, [...path, this.term]));
        this.path = path;
    }

    toString() {
        return this.term;
        //  [...this.path, this.term].map(t => t.toLowerCase()).join(': ');
    }
}


export const convertTaxonomyToEntries = (taxonomy: Taxonomy[]): TaxonomyEntry[] => {
    return taxonomy.map(t => new TaxonomyEntry(t, []));
}