export const supportedAssetTypes = [
    "news",
    "events",
    "organisations",
    "projects",
]

export const assetTypeToLabel = (assetType: string) => {
    switch (assetType) {
        case "datasets":
            return "Datasets";
        case "ml_models":
            return "ML Models";
        case "computational_assets":
            return "Computational Assets";
        case "services":
            return "Services";
        case "experiments":
            return "Experiments";
        case "publications":
            return "Publications";
        case "case_studies":
            return "Case Studies";
        case "news":
            return "News";
        case "events":
            return "Events";
        case "educational_resources":
            return "Educational Resources";
        case "organisations":
            return "Organisations";
        case "persons":
            return "Persons";
        case "projects":
            return "Projects";
        case "platforms":
            return "Platforms";
        default:
            return assetType;
    }
}