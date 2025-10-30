"use client"

import { News, Resource, Event, Project, Organisation, CaseStudy, Dataset, Publication } from "@/lib/server/types";
import { NewsEditor } from "./forms/news-editor";
import { EventEditor } from "./forms/event-editor";
import { ProjectEditor } from "./forms/project-editor";
import { OrganisationEditor } from "./forms/organisation-editor";
import { CaseStudiesEditor } from "./forms/case-studies-editor";
import { ensurePlural } from "@/app/(default)/_components/utils";
import { DatasetEditor } from "./forms/dataset-editor";
import { PublicationEditor } from "./forms/publication-editor";

interface AssetEditorFormProps {
    isPending: boolean;
    buttonText: string;
    onChange: (asset: Resource) => void;
    asset?: Resource;
    assetType: string;
}

export const AssetEditorForm: React.FC<AssetEditorFormProps> = (props) => {
    const assetType = ensurePlural(props.assetType);

    switch (assetType) {
        case 'news':
            return <NewsEditor
                {...props}
                asset={props.asset as News}
            />
        case 'events':
            return <EventEditor
                {...props}
                asset={props.asset as Event}
            />
        case 'projects':
            return <ProjectEditor
                {...props}
                asset={props.asset as Project}
            />
        case 'organisations':
            return <OrganisationEditor
                {...props}
                asset={props.asset as Organisation}
            />
        case 'case_studies':
            return <CaseStudiesEditor
                {...props}
                asset={props.asset as CaseStudy}
            />
        case 'datasets':
            return <DatasetEditor
                {...props}
                asset={props.asset as Dataset}
            />
        case 'publications':
            return <PublicationEditor
                {...props}
                asset={props.asset as Publication}
            />
        default:
            return <div className="text-center p-4 border bg-secondary border-border rounded-md">
                <p>No form editor available for this asset type
                    <span className="text-secondary-foreground mx-1">
                        ({props.assetType})
                    </span>
                    currently, check back soon!
                </p>
            </div>
    }
}
