import { Loader2 } from "lucide-react";


const LoadingTaxonomiesIndicator = () => {
    return <div className="flex items-center justify-center py-4">
        <Loader2 className="w-4 h-4 animate-spin me-4" />
        Loading taxonomies...
    </div>
}

export default LoadingTaxonomiesIndicator;