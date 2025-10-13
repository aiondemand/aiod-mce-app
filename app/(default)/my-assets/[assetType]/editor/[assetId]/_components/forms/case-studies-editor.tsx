"use client"

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { CaseStudy, caseStudySchema, TaxonomyType } from "@/lib/server/types";
import FormSection from "../form-section";
import { SubmitSection } from "./submit-section";
import KeywordEditor from "@/components/keyword-editor";
import TaxonomySelector from "@/components/taxonomy-selector";
import { convertTaxonomyToEntries } from "@/lib/taxonomy-utils";
import LoadingTaxonomiesIndicator from "./loading-taxonomies-indicator";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import LogoutClient from "@/components/logout-client";
import { ProjectSelector } from "../project-selector";

interface CaseStudiesEditorProps {
    isPending: boolean;
    buttonText: string;
    onChange: (asset: CaseStudy) => void;
    asset?: CaseStudy;
}

export const CaseStudiesEditor: React.FC<CaseStudiesEditorProps> = (props) => {
    const trpc = useTRPC();
    const { data: taxonomyIndustialSectors, isLoading: isLoadingIndustialSectors, error: errorIndustialSectors } = useQuery(
        trpc.taxonomies.get.queryOptions({ taxonomyType: TaxonomyType.INDUSTRIAL_SECTORS }),
    );

    const { data: taxonomyResearchAreas, isLoading: isLoadingResearchAreas, error: errorResearchAreas } = useQuery(
        trpc.taxonomies.get.queryOptions({ taxonomyType: TaxonomyType.RESEARCH_AREAS }),
    );

    // Prepare initial values so that:
    // - If editing, parse JSON stored in description.plain like [{ introduction, content }] and
    //   surface it as introduction (via citation[0]) and content (description.plain) for editing.
    // - If creating, start with empty values.
    const initialValues: CaseStudy = (() => {
        if (props.asset) {
            const asset = { ...props.asset } as CaseStudy;
            const rawPlain = asset.description?.plain || "";
            let parsedIntroduction = "";
            let parsedContent = rawPlain;
            try {
                const parsed = JSON.parse(rawPlain);
                if (Array.isArray(parsed) && parsed.length > 0 && typeof parsed[0] === "object" && parsed[0] !== null) {
                    const first = parsed[0] as { introduction?: string; content?: string };
                    parsedIntroduction = first.introduction || "";
                    parsedContent = first.content || "";
                }
            } catch {
                // Not JSON; treat rawPlain as content-only
            }
            asset.description = { ...asset.description, plain: parsedContent };
            asset.citation = [parsedIntroduction];
            return asset;
        }
        return {
            name: "",
            description: {
                plain: "",
            },
            citation: [],
            keyword: [],
            relevant_link: [],
            industrial_sector: [],
            research_area: [],
            is_part_of: [],
        } as CaseStudy;
    })();

    const form = useForm<CaseStudy>({
        resolver: zodResolver(caseStudySchema),
        defaultValues: initialValues,
    });

    if (isLoadingIndustialSectors || isLoadingResearchAreas) return <LoadingTaxonomiesIndicator />;

    const hasUnauthorizedError = errorIndustialSectors?.message === 'UNAUTHORIZED' || errorResearchAreas?.message === 'UNAUTHORIZED';
    if (hasUnauthorizedError) {
        return <LogoutClient />
    }

    if (errorIndustialSectors) return <div>Error: {errorIndustialSectors.message}</div>;
    if (errorResearchAreas) return <div>Error: {errorResearchAreas.message}</div>;

    function onSubmit(values: CaseStudy) {
        // Encode introduction + content into description.plain as JSON object array
        const introductionValue = (values.citation || [])[0] || "";
        const contentValue = values.description?.plain || "";
        values.description = {
            ...values.description,
            plain: JSON.stringify([{ introduction: introductionValue, content: contentValue }]),
        };
        // Do not store introduction in citation; keep minimal placeholder to satisfy validation
        values.citation = values.citation && values.citation.length > 0 ? [""] : [""];
        props.onChange(values);
    }

    // Local helpers for single-value array fields
    const website = (form.watch("relevant_link") || [])[0] || "";
    const setWebsite = (url: string) => {
        try {
            // Basic URL validation
            // Instantiate to validate format; result not used
            void new URL(url);
        } catch {
            // keep setting value; server-side can enforce stricter validation
        }
        form.setValue("relevant_link", url ? [url] : []);
    }

    const introduction = (form.watch("citation") || [])[0] || "";
    const setIntroduction = (intro: string) => {
        form.setValue("citation", intro ? [intro] : []);
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
                                <FormLabel>Title</FormLabel>
                                <FormControl>
                                    <Input placeholder="e.g., SmartRAG Pipeline Construction in AI-Builder" {...field} />
                                </FormControl>
                                <FormDescription>
                                    Enter a clear, concise title that summarises the content.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormItem>
                        <FormLabel>Introduction</FormLabel>
                        <FormControl>
                            <Input
                                placeholder="e.g., This tutorial explains how to build and publish pipelines using AI-Builder."
                                value={introduction}
                                onChange={(e) => setIntroduction(e.target.value)}
                            />
                        </FormControl>
                        <FormDescription>
                            Write a short introduction (1 short sentence) to capture attention.
                        </FormDescription>
                        <FormMessage />
                    </FormItem>

                    <FormField
                        control={form.control}
                        name="description.plain"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Content</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="Add the detailed content here."
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </FormSection>

                <FormSection title="Additional Information">
                    <FormField
                        control={form.control}
                        name="keyword"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Keywords</FormLabel>
                                <FormControl>
                                    <KeywordEditor
                                        keywords={field.value || []}
                                        onChange={field.onChange}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormItem>
                        <FormLabel>Website link</FormLabel>
                        <FormControl>
                            <Input
                                placeholder="e.g., https://www.ai4europe.eu"
                                value={website}
                                onChange={(e) => setWebsite(e.target.value)}
                                inputMode="url"
                            />
                        </FormControl>
                        <FormDescription>
                            Add a relevant external link (e.g., project website).
                        </FormDescription>
                        <FormMessage />
                    </FormItem>

                    <FormField
                        control={form.control}
                        name="industrial_sector"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Industry Sectors</FormLabel>
                                <FormControl>
                                    <TaxonomySelector
                                        values={field.value || []}
                                        onChange={field.onChange}
                                        taxonomy={convertTaxonomyToEntries(taxonomyIndustialSectors || [])}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="research_area"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Research Areas</FormLabel>
                                <FormControl>
                                    <TaxonomySelector
                                        values={field.value || []}
                                        onChange={field.onChange}
                                        taxonomy={convertTaxonomyToEntries(taxonomyResearchAreas || [])}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

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
                                    Select one or more projects this case study is part of.
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
    );
};


