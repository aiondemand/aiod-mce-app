"use client"

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { News, newsSchema } from "@/lib/server/types";
import FormSection from "../form-section";
import { SubmitSection } from "./submit-section";

import { Taxonomy, TaxonomyType } from "@/lib/server/taxonomies";
import { Textarea } from "@/components/ui/textarea";

interface NewsEditorProps {
    isPending: boolean;
    buttonText: string;
    onChange: (asset: News) => void;
    asset?: News;
    taxonomies: Record<TaxonomyType, Taxonomy[]>;
}

export const NewsEditor: React.FC<NewsEditorProps> = (props) => {
    const form = useForm<News>({
        resolver: zodResolver(newsSchema),
        defaultValues: props.asset ? props.asset : {
            name: 'todo',
            headline: '', // title
            content: {
                plain: '',
            }, // body
            category: [],
            industrial_sector: [],
            tags: [], // keywords
        },
    });

    // console.log(props.taxonomies);


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