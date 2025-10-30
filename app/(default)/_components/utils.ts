export const supportedAssetTypes = [
    "news",
    "event",
    "organisations",
    "projects",
    "datasets",
    "case_studies",
    "publications",
]

export const assetTypeToLabel = (assetType: string) => {
    const sanitized = ensurePlural(assetType).toLowerCase();
    switch (sanitized) {
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
            return "Success Stories";
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
        case "publications":
            return "Publications";
        case "projects":
            return "Projects";
        case "platforms":
            return "Platforms";
        default:
            return assetType;
    }
}

export const removePlural = (assetType: string) => {
    const lower = assetType.toLowerCase();
    if (lower === "news") return "news";
    if (lower === "case_studies") return "case_study";
    return lower.endsWith("s") ? lower.slice(0, -1) : lower;
}

export const ensurePlural = (assetType: string) => {
    const lower = assetType.toLowerCase();
    if (lower === "news") return "news";
    if (lower === "case_study") return "case_studies";
    return lower.endsWith("s") ? lower : lower + "s";
}