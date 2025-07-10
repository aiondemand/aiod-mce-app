"use client"

import { News, Resource, Event, Project, EnumTypes, Organisation } from "@/lib/server/types";
import { Taxonomy, TaxonomyType } from "@/lib/server/types";
import { NewsEditor } from "./forms/news-editor";
import { EventEditor } from "./forms/event-editor";
import { ProjectEditor } from "./forms/project-editor";
import { OrganisationEditor } from "./forms/organisation-editor";

interface AssetEditorFormProps {
    isPending: boolean;
    buttonText: string;
    onChange: (asset: Resource) => void;
    asset?: Resource;
    assetType: string;
    enums: Record<EnumTypes, string[]>;
    taxonomies: Record<TaxonomyType, Taxonomy[]>;
}

export const AssetEditorForm: React.FC<AssetEditorFormProps> = (props) => {

    switch (props.assetType) {
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
