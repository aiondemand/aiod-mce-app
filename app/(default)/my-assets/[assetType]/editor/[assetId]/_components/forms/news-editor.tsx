"use client"

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { News, newsSchema } from "@/lib/server/types";
import FormSection from "../form-section";
import { SubmitSection } from "./submit-section";

import { TaxonomyType } from "@/lib/server/types";
import { Textarea } from "@/components/ui/textarea";
import KeywordEditor from "@/components/keyword-editor";
import TaxonomySelector from "@/components/taxonomy-selector";
import { convertTaxonomyToEntries } from "@/lib/taxonomy-utils";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import LoadingTaxonomiesIndicator from "./loading-taxonomies-indicator";
import LogoutClient from "@/components/logout-client";


interface NewsEditorProps {
    isPending: boolean;
    buttonText: string;
    onChange: (asset: News) => void;
    asset?: News;
}

export const NewsEditor: React.FC<NewsEditorProps> = (props) => {
    const trpc = useTRPC();
    const { data: taxonomyIndustialSectors, isLoading: isLoadingIndustialSectors, error: errorIndustialSectors } = useQuery(
        trpc.taxonomies.get.queryOptions({ taxonomyType: TaxonomyType.INDUSTRIAL_SECTORS }),
    );

    const { data: taxonomyNewsCategories, isLoading: isLoadingNewsCategories, error: errorNewsCategories } = useQuery(
        trpc.taxonomies.get.queryOptions({ taxonomyType: TaxonomyType.NEWS_CATEGORIES }),
    );


    const form = useForm<News>({
        resolver: zodResolver(newsSchema),
        defaultValues: props.asset ? props.asset : {
            name: 'placeholder because this cannot be empty',
            headline: '', // title
            content: {
                plain: '',
            }, // body
            category: [],
            industrial_sector: [],
            keyword: [],
        },
    });

    if (isLoadingIndustialSectors || isLoadingNewsCategories) return <LoadingTaxonomiesIndicator />;

    const hasUnauthorizedError = errorIndustialSectors?.message === 'UNAUTHORIZED' || errorNewsCategories?.message === 'UNAUTHORIZED';
    if (hasUnauthorizedError) {
        return <LogoutClient />
    }


    if (errorNewsCategories) return <div>Error: {errorNewsCategories.message}</div>;

    // Watch the category field to conditionally show business category
    const watchedCategories = form.watch("category");
    const showBusinessCategory = watchedCategories?.some(category =>
        category.toLowerCase().startsWith("business")
    ) || false;

    function onSubmit(values: News) {
        values.name = values.headline
        props.onChange(values);
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pb-[74px]">
                <FormSection title="Required Information">
                    <FormField
                        control={form.control}
                        name="headline"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Title</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter news title" {...field} />
                                </FormControl>
                                <FormDescription>
                                    The headline of your news
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
                                <FormLabel>Body</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="Enter news body"
                                        {...field}
                                    />
                                </FormControl>
                                <FormDescription>
                                    A brief description or summary of the news.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </FormSection>

                <FormSection title="Additional Information">
                    <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>News Categories</FormLabel>
                                <FormControl>
                                    <TaxonomySelector
                                        values={field.value || []}
                                        onChange={field.onChange}
                                        taxonomy={convertTaxonomyToEntries(taxonomyNewsCategories || [])}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {showBusinessCategory && (
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
                                        Select relevant business/industrial sectors for this news item.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    )}


                    <FormField
                        control={form.control}
                        name="keyword"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Tags</FormLabel>
                                <FormControl>
                                    <KeywordEditor
                                        keywords={field.value || []}
                                        onChange={field.onChange}
                                    />
                                </FormControl>
                                <FormDescription>
                                    Add relevant keywords or tags to help categorize and search for this news item.
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