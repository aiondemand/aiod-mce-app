"use client"

import { useState } from "react";
import LoadingButton from "@/components/loading-button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

export const SubmitSection: React.FC<{
    isPending: boolean;
    buttonText: string;
}> = (props) => {
    const [gdprAgreed, setGdprAgreed] = useState(false);

    return <div className="space-y-4 border border-border rounded-lg p-4">
        <div className="flex items-start gap-3">
            <Checkbox
                id="gdpr-compliance"
                className="size-5"
                checked={gdprAgreed}
                onCheckedChange={(checked) => {
                    if (typeof checked === 'boolean') {
                        setGdprAgreed(checked);
                    }
                }}
            />
            <Label
                htmlFor="gdpr-compliance"
                className="text-sm font-normal leading-relaxed cursor-pointer"
            >
                I declare that, to the best of my knowledge, the submitted asset is fully compliant with the General Data Protection Regulation (GDPR).
            </Label>
        </div>
        <LoadingButton
            isLoading={props.isPending}
            type="submit"
            disabled={!gdprAgreed}
        >
            {props.buttonText}
        </LoadingButton>
    </div>
}


