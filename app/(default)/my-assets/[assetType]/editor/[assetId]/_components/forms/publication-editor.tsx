"use client"

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { Publication, publicationSchema } from "@/lib/server/types";
import FormSection from "../form-section";
import { SubmitSection } from "./submit-section";
import { FormErrorDisplay } from "./form-error-display";

import { Textarea } from "@/components/ui/textarea";
import { ProjectSelector } from "../project-selector";


interface PublicationEditorProps {
    isPending: boolean;
    buttonText: string;
    onChange: (asset: Publication) => void;
    asset?: Publication;
}

export const PublicationEditor: React.FC<PublicationEditorProps> = (props) => {
    const form = useForm<Publication>({
        resolver: zodResolver(publicationSchema),
        defaultValues: props.asset ? props.asset : {
            name: '', // title
            description: {
                plain: '',
            },
            relevant_link: [],
            is_part_of: [],
        },
    });

    function onSubmit(values: Publication) {
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
                                    <Input placeholder="Enter publication title" {...field} />
                                </FormControl>
                                <FormDescription>
                                    The title of the publication
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
                                        placeholder="Enter publication description"
                                        {...field}
                                    />
                                </FormControl>
                                <FormDescription>
                                    A detailed description of the publication.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="relevant_link"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Link to Paper</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Enter paper URL (e.g., https://example.com/paper.pdf)"
                                        value={field.value?.[0] || ''}
                                        onChange={(e) => {
                                            field.onChange(e.target.value ? [e.target.value] : []);
                                        }}
                                    />
                                </FormControl>
                                <FormDescription>
                                    URL to the publication paper or resource.
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
                                    Select one or more projects this publication is part of.
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

                <FormErrorDisplay form={form} />
            </form>
        </Form>
    );
};

