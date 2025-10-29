"use client"

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { Project, projectSchema } from "@/lib/server/types";
import FormSection from "../form-section";
import { SubmitSection } from "./submit-section";

import { TaxonomyType } from "@/lib/server/types";
import { Textarea } from "@/components/ui/textarea";
import TaxonomySelector from "@/components/taxonomy-selector";
import { convertTaxonomyToEntries } from "@/lib/taxonomy-utils";
import { DatePicker } from "@/components/ui/datepicker";
import { useTRPC } from "@/trpc/client";
import LoadingTaxonomiesIndicator from "./loading-taxonomies-indicator";
import { useQuery } from "@tanstack/react-query";
import LogoutClient from "@/components/logout-client";
import HasPartEditor from "../has-part-editor";
import { AssetImageManager } from "../asset-image-manager";
import { useEffect } from "react";


interface ProjectEditorProps {
    isPending: boolean;
    buttonText: string;
    onChange: (asset: Project) => void;
    asset?: Project;
}

export const ProjectEditor: React.FC<ProjectEditorProps> = (props) => {
    const trpc = useTRPC();
    const { data: taxonomyIndustialSectors, isLoading: isLoadingIndustialSectors, error: errorIndustialSectors } = useQuery(
        trpc.taxonomies.get.queryOptions({ taxonomyType: TaxonomyType.INDUSTRIAL_SECTORS }),
    );

    const form = useForm<Project>({
        resolver: zodResolver(projectSchema),
        defaultValues: props.asset ? props.asset : {
            name: '', // project full name
            description: {
                plain: '',
            }, // project description
            alternate_name: [], // acronym
            same_as: '', // project website
            start_date: undefined,
            end_date: undefined,
            industrial_sector: [],
            has_part: [],
        },
    });

    useEffect(() => {
        form.reset(props.asset);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.asset]);

    if (isLoadingIndustialSectors) return <LoadingTaxonomiesIndicator />;
    const hasUnauthorizedError = errorIndustialSectors?.message === 'UNAUTHORIZED';
    if (hasUnauthorizedError) {
        return <LogoutClient />
    }
    if (errorIndustialSectors) return <div>Error: {errorIndustialSectors.message}</div>;

    function onSubmit(values: Project) {
        console.log(values);
        props.onChange(values);
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pb-[74px]">
                {props.asset?.identifier && (
                    <FormSection title="Images">
                        <AssetImageManager
                            assetType="projects"
                            identifier={props.asset.identifier}
                            media={props.asset.media}
                        />
                    </FormSection>
                )}

                <FormSection title="Required Information">
                    <FormField
                        control={form.control}
                        name="alternate_name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Acronym</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Enter project acronym"
                                        value={field.value?.[0] || ''}
                                        onChange={(e) => field.onChange([e.target.value])}
                                    />
                                </FormControl>
                                <FormDescription>
                                    The short acronym for your project
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Project Full Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter project full name" {...field} />
                                </FormControl>
                                <FormDescription>
                                    The complete name of your project
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="description.plain"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Project Description</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="Enter project description"
                                        {...field}
                                    />
                                </FormControl>
                                <FormDescription>
                                    A detailed description of the project.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </FormSection>

                <FormSection title="Additional Information">
                    <FormField
                        control={form.control}
                        name="start_date"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Start Date</FormLabel>
                                <FormControl>
                                    <DatePicker
                                        date={field.value ? new Date(field.value) : undefined}
                                        onDateChange={(date) => {
                                            date?.setHours(12, 0, 0, 0);
                                            field.onChange(date ? date.toISOString() : '');
                                        }}
                                        placeholder="Select start date"
                                    />
                                </FormControl>
                                <FormDescription>
                                    When the project starts
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="end_date"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>End Date</FormLabel>
                                <FormControl>
                                    <DatePicker
                                        date={field.value ? new Date(field.value) : undefined}
                                        onDateChange={(date) => {
                                            date?.setHours(12, 0, 0, 0);
                                            field.onChange(date ? date.toISOString() : '');
                                        }}
                                        placeholder="Select end date"
                                    />
                                </FormControl>
                                <FormDescription>
                                    When the project ends
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="same_as"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Project Website</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Enter project website URL"
                                        {...field}
                                    />
                                </FormControl>
                                <FormDescription>
                                    The official website of the project
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="industrial_sector"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Business Category</FormLabel>
                                <FormControl>
                                    <TaxonomySelector
                                        values={field.value || []}
                                        onChange={field.onChange}
                                        taxonomy={convertTaxonomyToEntries(taxonomyIndustialSectors || [])}
                                    />
                                </FormControl>
                                <FormDescription>
                                    Select relevant business/industrial sectors for this project.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </FormSection>

                <FormSection title="Related Assets">
                    <FormField
                        control={form.control}
                        name="has_part"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Assets that are part of this project</FormLabel>
                                <FormControl>
                                    <HasPartEditor
                                        value={field.value || []}
                                        onChange={field.onChange}
                                    />
                                </FormControl>
                                <FormDescription>
                                    Add IDs of datasets, publications, or other assets that belong to this project.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </FormSection>

                <div>
                    <SubmitSection
                        isPending={props.isPending}
                        buttonText={props.buttonText}
                    />
                </div>

                {/* Debug information - remove in production */}
                {process.env.NODE_ENV === 'development' && form.formState.errors && Object.keys(form.formState.errors).length > 0 && (
                    <div className="mt-4 p-4 bg-red-800 rounded text-sm">
                        <h4 className="font-bold">Debug Info:</h4>
                        <p>Form valid: {form.formState.isValid ? 'Yes' : 'No'}</p>
                        <p>Errors: {Object.keys(form.formState.errors).length}</p>
                        {Object.keys(form.formState.errors).length > 0 && (
                            <pre className="mt-2 text-xs">
                                {JSON.stringify(form.formState.errors, null, 2)}
                            </pre>
                        )}
                    </div>
                )}
            </form>
        </Form>
    );
};