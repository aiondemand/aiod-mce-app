import LoadingButton from "@/components/loading-button";
import { Resource } from "@/lib/server/types";

interface AssetEditorFormProps {
    isPending: boolean;
    buttonText: string;
    onChange: (asset: Resource) => void;
    asset?: Resource;
    assetType: string;
}

export const AssetEditorForm: React.FC<AssetEditorFormProps> = (props) => {

    switch (props.assetType) {
        case 'events':
            return <EventEditorForm
                {...props}
            />
        case 'publications':
            return <PublicationEditorForm
                {...props}
            />
        case 'educational_resources':
            return <EducationalResourceEditorForm
                {...props}
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

const SubmitSection: React.FC<{
    isPending: boolean;
    buttonText: string;
}> = (props) => {
    return <div>
        <LoadingButton
            isLoading={props.isPending}
            type="submit">
            {props.buttonText}
        </LoadingButton>
    </div>
}

const EventEditorForm: React.FC<AssetEditorFormProps> = (props) => {

    return <div>
        <SubmitSection
            isPending={props.isPending}
            buttonText={props.buttonText}
        />
    </div>;
}


const PublicationEditorForm: React.FC<AssetEditorFormProps> = (props) => {
    return <div>
        <p>Publication Editor Form</p>
        <SubmitSection
            isPending={props.isPending}
            buttonText={props.buttonText}
        />
    </div>
}

const EducationalResourceEditorForm: React.FC<AssetEditorFormProps> = (props) => {
    return <div>
        <p>Educational Resource Editor Form</p>
        <SubmitSection
            isPending={props.isPending}
            buttonText={props.buttonText}
        />
    </div>
}