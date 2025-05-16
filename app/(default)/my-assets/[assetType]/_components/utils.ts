
export interface GenericAsset {
    identifier?: number;
    name: string;
    aiod_entry?: {
        status: string;
    }
}

export const assetTypeToLabel = (assetType: string) => {
    switch (assetType) {
        case "datasets":
            return "Data Set";
        case "ml_models":
            return "ML Model";
        case "computational_assets":
            return "Computational Asset";
        case "services":
            return "Service";
        case "experiments":
            return "Experiment";
        case "publications":
            return "Publication";
        case "case_studies":
            return "Case Study";
        case "news":
            return "News Item";
        case "events":
            return "Event";
        case "educational_resources":
            return "Educational Resource";
        case "organisations":
            return "Organisation";
        case "persons":
            return "Person";
        case "projects":
            return "Project";
        case "platforms":
            return "Platform";
        default:
            return assetType;
    }
}