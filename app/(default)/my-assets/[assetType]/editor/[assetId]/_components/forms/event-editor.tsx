"use client"

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { Event, eventSchema } from "@/lib/server/types";
import FormSection from "../form-section";
import { SubmitSection } from "./submit-section";

import { TaxonomyType } from "@/lib/server/types";
import { Textarea } from "@/components/ui/textarea";
import TaxonomySelector from "@/components/taxonomy-selector";
import { convertTaxonomyToEntries } from "@/lib/taxonomy-utils";
import { DatePicker } from "@/components/ui/datepicker";
import LoadingTaxonomiesIndicator from "./loading-taxonomies-indicator";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import LogoutClient from "@/components/logout-client";
import { ProjectSelector } from "../project-selector";


interface EventEditorProps {
    isPending: boolean;
    buttonText: string;
    onChange: (asset: Event) => void;
    asset?: Event;
}

export const EventEditor: React.FC<EventEditorProps> = (props) => {
    const trpc = useTRPC();
    const { data: taxonomyIndustialSectors, isLoading: isLoadingIndustialSectors, error: errorIndustialSectors } = useQuery(
        trpc.taxonomies.get.queryOptions({ taxonomyType: TaxonomyType.INDUSTRIAL_SECTORS }),
    );

    const form = useForm<Event>({
        resolver: zodResolver(eventSchema),
        defaultValues: props.asset ? props.asset : {
            name: '', // title
            description: {
                plain: '',
            },
            mode: 'Physical',
            start_date: undefined,
            end_date: undefined,
            same_as: '',
            industrial_sector: [],
            is_part_of: [],
        },
    });

    if (isLoadingIndustialSectors) return <LoadingTaxonomiesIndicator />;
    const hasUnauthorizedError = errorIndustialSectors?.message === 'UNAUTHORIZED';
    if (hasUnauthorizedError) {
        return <LogoutClient />
    }
    if (errorIndustialSectors) return <div>Error: {errorIndustialSectors.message}</div>;


    function onSubmit(values: Event) {
        console.log(values);
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
                                <FormLabel>Title</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter event title" {...field} />
                                </FormControl>
                                <FormDescription>
                                    The name of your event
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
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="Enter event description"
                                        {...field}
                                    />
                                </FormControl>
                                <FormDescription>
                                    A detailed description of the event.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

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
                                    When the event starts
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
                                    When the event ends
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
                                <FormLabel>Website</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Enter website URL (e.g., https://example.com)"
                                        {...field}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                </FormSection>

                <FormSection title="Additional Information">
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
                                    Select relevant business/industrial sectors for this event.
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
                                    Select one or more projects this event is part of.
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