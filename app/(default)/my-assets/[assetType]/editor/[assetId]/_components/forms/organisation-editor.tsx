"use client"

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { Organisation, organisationSchema } from "@/lib/server/types";
import FormSection from "../form-section";
import { SubmitSection } from "./submit-section";

import { TaxonomyType } from "@/lib/server/types";
import { Textarea } from "@/components/ui/textarea";
import TaxonomySelector from "@/components/taxonomy-selector";
import { convertTaxonomyToEntries } from "@/lib/taxonomy-utils";
import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import LoadingTaxonomiesIndicator from "./loading-taxonomies-indicator";
import LogoutClient from "@/components/logout-client";

interface OrganisationEditorProps {
    isPending: boolean;
    buttonText: string;
    onChange: (asset: Organisation) => void;
    asset?: Organisation;

}

export const OrganisationEditor: React.FC<OrganisationEditorProps> = (props) => {
    const trpc = useTRPC();
    const { data: taxonomyIndustialSectors, isLoading: isLoadingIndustialSectors, error: errorIndustialSectors } = useQuery(
        trpc.taxonomies.get.queryOptions({ taxonomyType: TaxonomyType.INDUSTRIAL_SECTORS }),
    );

    const { data: taxonomyResearchAreas, isLoading: isLoadingResearchAreas, error: errorResearchAreas } = useQuery(
        trpc.taxonomies.get.queryOptions({ taxonomyType: TaxonomyType.RESEARCH_AREAS }),
    );

    const { data: taxonomyScientificDomains, isLoading: isLoadingScientificDomains, error: errorScientificDomains } = useQuery(
        trpc.taxonomies.get.queryOptions({ taxonomyType: TaxonomyType.SCIENTIFIC_DOMAINS }),
    );


    const form = useForm<Organisation>({
        resolver: zodResolver(organisationSchema),
        defaultValues: props.asset ? props.asset : {
            name: '', // Company name
            alternate_name: [], // Alternate names/acronyms
            description: {
                plain: '',
            }, // Organisation description
            same_as: '', // Website URL
            research_area: [], // Research area taxonomy
            application_area: [], // Application area taxonomy
            scientific_domain: [], // Scientific domain taxonomy
        },
    });


    if (isLoadingIndustialSectors || isLoadingResearchAreas || isLoadingScientificDomains) return <LoadingTaxonomiesIndicator />;
    const hasUnauthorizedError = errorIndustialSectors?.message === 'UNAUTHORIZED' || errorResearchAreas?.message === 'UNAUTHORIZED' || errorScientificDomains?.message === 'UNAUTHORIZED';
    if (hasUnauthorizedError) {
        return <LogoutClient />
    }

    if (errorIndustialSectors) return <div>Error: {errorIndustialSectors.message}</div>;
    if (errorResearchAreas) return <div>Error: {errorResearchAreas.message}</div>;
    if (errorScientificDomains) return <div>Error: {errorScientificDomains.message}</div>;

    function onSubmit(values: Organisation) {
        console.log(values);
        props.onChange(values);
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pb-[74px]">
                <FormSection title="Required Information">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Company Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter company name" {...field} />
                                </FormControl>
                                <FormDescription>
                                    The primary name of your organization
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="alternate_name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Alternate Name / Acronym</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Enter alternate name or acronym"
                                        value={field.value?.[0] || ''}
                                        onChange={(e) => field.onChange(e.target.value ? [e.target.value] : [])}
                                    />
                                </FormControl>
                                <FormDescription>
                                    Common abbreviation, acronym, or alternative name (e.g., &quot;TU/e&quot; for &quot;Technische Universiteit Eindhoven&quot;)
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
                                <FormLabel>Organisation Description</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="Enter organisation description"
                                        {...field}
                                    />
                                </FormControl>
                                <FormDescription>
                                    A detailed description of your organization
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </FormSection>

                <FormSection title="Additional Information">
                    <FormField
                        control={form.control}
                        name="same_as"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Website</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Enter website URL (e.g., https://example.com)"
                                        {...field}
                                    />
                                </FormControl>
                                <FormDescription>
                                    Your organization&apos;s official website (must be an external URL)
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="research_area"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Research Area</FormLabel>
                                <FormControl>
                                    <TaxonomySelector
                                        values={field.value || []}
                                        onChange={field.onChange}
                                        taxonomy={convertTaxonomyToEntries(taxonomyResearchAreas || [])}
                                    />
                                </FormControl>
                                <FormDescription>
                                    Select relevant research areas for your organization
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="application_area"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Application Area</FormLabel>
                                <FormControl>
                                    <TaxonomySelector
                                        values={field.value || []}
                                        onChange={field.onChange}
                                        taxonomy={convertTaxonomyToEntries(taxonomyIndustialSectors || [])}
                                    />
                                </FormControl>
                                <FormDescription>
                                    Select relevant application areas for your organization
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="scientific_domain"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Scientific Domain</FormLabel>
                                <FormControl>
                                    <TaxonomySelector
                                        values={field.value || []}
                                        onChange={field.onChange}
                                        taxonomy={convertTaxonomyToEntries(taxonomyScientificDomains || [])}
                                    />
                                </FormControl>
                                <FormDescription>
                                    Select relevant scientific domains for your organization
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