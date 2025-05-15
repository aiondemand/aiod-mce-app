import { Suspense } from "react";
import { AssetListLoader, AssetListLoaderSkeleton } from "./_components/asset-list-loader";

interface PageProps {
    params: Promise<{ assetType: string }>
}

const assetTypeToLabel = (assetType: string) => {
    switch (assetType) {
        case "datasets":
            return "Data Sets";
        case "ml-models":
            return "ML Models";
        case "computational-assets":
            return "Computational Assets";
        case "services":
            return "Services";
        case "experiments":
            return "Experiments";
        case "publications":
            return "Publications";
        case "case-studies":
            return "Case Studies";
        case "news-and-events":
            return "News & Events";
        case "educational-resources":
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

export default async function Page({ params }: PageProps) {
    const { assetType } = await params;

    return <div className="p-8">
        <h1 className="text-2xl font-bold">
            My Assets
            <span className="text-muted-foreground ms-2">
                ({assetTypeToLabel(assetType)})
            </span>
        </h1>

        <Suspense fallback={<AssetListLoaderSkeleton />}>
            <AssetListLoader assetType={assetType} />
        </Suspense>
    </div>
}