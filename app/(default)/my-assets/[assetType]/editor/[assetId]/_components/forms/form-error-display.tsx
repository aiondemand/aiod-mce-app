"use client"

import Link from "next/link";
import { ExternalLinkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UseFormReturn, FieldValues } from "react-hook-form";

interface FormErrorDisplayProps<T extends FieldValues = FieldValues> {
    form: UseFormReturn<T>;
}

export const FormErrorDisplay = <T extends FieldValues = FieldValues>({ form }: FormErrorDisplayProps<T>) => {
    const hasErrors = form.formState.errors && Object.keys(form.formState.errors).length > 0;

    if (!hasErrors) return null;

    return (
        <div className="mt-4 p-4 bg-red-800 rounded text-sm">
            <Button
                className="hover:underline hover:text-foreground mb-4"
                variant="outline" asChild>
                <Link
                    href="https://aiod.eu/feedback/"
                    target="_blank"
                >
                    Ask for help or give feedback
                    <ExternalLinkIcon className="w-4 h-4" />
                </Link>
            </Button>

            <h4 className="font-bold">Error details:</h4>
            <div className="space-y-2 p-2">
                <p>Form valid: {form.formState.isValid ? 'Yes' : 'No'}</p>
                <p>Errors: {Object.keys(form.formState.errors).length}</p>
                {Object.keys(form.formState.errors).length > 0 && (
                    <pre className="mt-2 text-xs">
                        {JSON.stringify(form.formState.errors, null, 2)}
                    </pre>
                )}
            </div>
        </div>
    );
};

