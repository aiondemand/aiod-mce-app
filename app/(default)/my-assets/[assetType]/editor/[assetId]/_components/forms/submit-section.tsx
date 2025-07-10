import LoadingButton from "@/components/loading-button";

export const SubmitSection: React.FC<{
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


