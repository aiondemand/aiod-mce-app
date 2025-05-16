
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

export const assetTypeToMyAssetType = (assetType: string) => {
    switch (assetType) {
        case "datasets":
            return "dataset";
        case "ml_models":
            return "ml_model";
        case "computational_assets":
            return "computational_asset";
        case "services":
            return "service";
        case "experiments":
            return "experiment";
        case "publications":
            return "publication";
        case "case_studies":
            return "case_study";
        case "news":
            return "news";
        case "events":
            return "event";
        case "educational_resources":
            return "educational_resource";
        case "organisations":
            return "organisation";
        case "persons":
            return "person";
        case "projects":
            return "project";
        case "platforms":
            return "platform";
        default:
            return assetType;
    }
}
