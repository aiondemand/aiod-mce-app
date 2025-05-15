
interface PageProps {
    params: Promise<{ assetType: string, assetId: string }>
}

export default async function Page({ params }: PageProps) {
    const { assetType, assetId } = await params;

    return <div>Asset Editor: {assetType} {assetId}</div>
}