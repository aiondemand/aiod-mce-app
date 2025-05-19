import { Suspense } from "react";
import { AssetListLoader, AssetListLoaderSkeleton } from "./_components/asset-list-loader";

export const dynamic = 'force-dynamic';
interface PageProps {
    params: Promise<{ assetType: string }>
}

const assetTypeToLabel = (assetType: string) => {
    switch (assetType) {
        case "datasets":
            return "Data Sets";
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

export default async function Page({ params }: PageProps) {
    const { assetType } = await params;

    return <>
        <h1 className="text-2xl font-bold font-jura">
            My Assets -
            <span className="text-secondary-foreground ms-2">
                {assetTypeToLabel(assetType)}
            </span>
        </h1>

        <div className="mt-8">
            <Suspense fallback={<AssetListLoaderSkeleton />}>
                <AssetListLoader assetType={assetType} />
            </Suspense>
        </div>
    </>
}