"use client"

import { EducationalResource, educationalResourceSchema, News, Resource } from "@/lib/server/types";
import { EnumTypes } from "@/lib/server/types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import FormSection from "./form-section";
import { Input } from "@/components/ui/input";
import MultiSelect from "./multiselect-editor";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Taxonomy, TaxonomyType } from "@/lib/server/types";
import { NewsEditor } from "./forms/news-editor";
import { SubmitSection } from "./forms/submit-section";

interface AssetEditorFormProps {
    isPending: boolean;
    buttonText: string;
    onChange: (asset: Resource) => void;
    asset?: Resource;
    assetType: string;
    enums: Record<EnumTypes, string[]>;
    taxonomies: Record<TaxonomyType, Taxonomy[]>;
}

export const AssetEditorForm: React.FC<AssetEditorFormProps> = (props) => {

    switch (props.assetType) {
        case 'news':
            return <NewsEditor
                {...props}
                asset={props.asset as News}
            />
        default:
            return <div className="text-center p-4 border bg-secondary border-border rounded-md">
                <p>No form editor available for this asset type
                    <span className="text-secondary-foreground mx-1">
                        ({props.assetType})
                    </span>
                    currently, check back soon!
                </p>
            </div>
    }
}

const EducationalResourceEditorForm: React.FC<AssetEditorFormProps> = (props) => {
    const form = useForm<EducationalResource>({
        resolver: zodResolver(educationalResourceSchema),
        defaultValues: props.asset ? props.asset : {
            name: '',
        },
    })

    function onSubmit(values: EducationalResource) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        console.log(values)
        props.onChange(values)
    }

    return <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pb-[74px]">
            <FormSection title="Basic Information">

                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input placeholder="" {...field} />
                            </FormControl>
                            <FormDescription>
                                Enter the name of the educational resource.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="time_required"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Time required</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g. 10 hours" {...field} />
                            </FormControl>
                            <FormDescription>
                                Enter the time required to complete the educational resource.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="access_mode"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Access mode</FormLabel>
                            <MultiSelect
                                items={props.enums.eduAccessModes}
                                value={field.value}
                                onChange={field.onChange}
                            />
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="educational_level"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Educational level</FormLabel>
                            <MultiSelect
                                items={props.enums.eduEducationalLevels}
                                value={field.value}
                                onChange={field.onChange}
                            />
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="target_audience"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Target audience</FormLabel>
                            <MultiSelect
                                items={props.enums.eduTargetAudiences}
                                value={field.value}
                                onChange={field.onChange}
                            />
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Type</FormLabel>
                            <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                            >
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select type" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {props.enums[EnumTypes.EDU_TYPE].map((eduType) => (
                                        <SelectItem key={eduType} value={eduType}>{eduType}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="in_language"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>In language</FormLabel>
                            <MultiSelect
                                items={props.enums.languages}
                                value={field.value}
                                onChange={field.onChange}
                            />
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="pace"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Pace</FormLabel>
                            <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                            >
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select pace" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {props.enums.eduPaces.map((eduPace) => (
                                        <SelectItem key={eduPace} value={eduPace}>{eduPace}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

            </FormSection>

            <SubmitSection
                isPending={props.isPending}
                buttonText={props.buttonText}
            />
        </form>
    </Form>
}