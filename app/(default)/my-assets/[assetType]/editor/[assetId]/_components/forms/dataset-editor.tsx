"use client"

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { Dataset, datasetSchema, TaxonomyType } from "@/lib/server/types";
import FormSection from "../form-section";
import { SubmitSection } from "./submit-section";
import { Textarea } from "@/components/ui/textarea";
import TaxonomySelector from "@/components/taxonomy-selector";
import { convertTaxonomyToEntries } from "@/lib/taxonomy-utils";
import LoadingTaxonomiesIndicator from "./loading-taxonomies-indicator";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import LogoutClient from "@/components/logout-client";
import { ProjectSelector } from "../project-selector";


interface DatasetEditorProps {
    isPending: boolean;
    buttonText: string;
    onChange: (asset: Dataset) => void;
    asset?: Dataset;
}

export const DatasetEditor: React.FC<DatasetEditorProps> = (props) => {
    const trpc = useTRPC();
    const { data: taxonomyLicenses, isLoading: isLoadingLicenses, error: errorLicenses } = useQuery(
        trpc.taxonomies.get.queryOptions({ taxonomyType: TaxonomyType.LICENSES }),
    );

    const form = useForm<Dataset>({
        resolver: zodResolver(datasetSchema),
        defaultValues: props.asset ? props.asset : {
            name: '',
            content: {
                plain: '',
            },
            relevant_link: [],
            license: '',
            is_part_of: [],
        },
    });

    if (isLoadingLicenses) return <LoadingTaxonomiesIndicator />;
    const hasUnauthorizedError = errorLicenses?.message === 'UNAUTHORIZED';
    if (hasUnauthorizedError) {
        return <LogoutClient />
    }
    if (errorLicenses) return <div>Error: {errorLicenses.message}</div>;

    function onSubmit(values: Dataset) {
        props.onChange(values);
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pb-[74px]">
                <FormSection title="Basic Information">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter dataset name" {...field} />
                                </FormControl>
                                <FormDescription>
                                    The name of your dataset
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="content.plain"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="Enter dataset description"
                                        {...field}
                                    />
                                </FormControl>
                                <FormDescription>
                                    A short description of the dataset.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="relevant_link.0"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Link</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Enter a related URL (e.g., https://example.com)"
                                        {...field}
                                    />
                                </FormControl>
                                <FormDescription>
                                    A single relevant link for this dataset.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </FormSection>

                <FormSection title="Additional Information">
                    <FormField
                        control={form.control}
                        name="license"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>License</FormLabel>
                                <FormControl>
                                    <TaxonomySelector
                                        values={field.value ? [field.value] : []}
                                        onChange={(vals) => field.onChange(vals[0] ?? '')}
                                        taxonomy={convertTaxonomyToEntries(taxonomyLicenses || [])}
                                        maxValues={1}
                                    />
                                </FormControl>
                                <FormDescription>
                                    Select the license under which the dataset is released.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </FormSection>

                <FormSection title="Projects">
                    <FormField
                        control={form.control}
                        name="is_part_of"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Related projects</FormLabel>
                                <FormControl>
                                    <ProjectSelector
                                        value={field.value || []}
                                        onChange={(ids) => field.onChange(ids)}
                                    />
                                </FormControl>
                                <FormDescription>
                                    Select one or more projects this dataset is part of.
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
            </form>
        </Form>
    )
}
