import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Contact, Taxonomy, TaxonomyType } from "@/lib/server/types";
import { useTRPC } from "@/trpc/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { HomeIcon, Loader2, MapPin, PencilIcon } from "lucide-react";
import LoadingButton from "@/components/loading-button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";

interface ContactDetailsEditorProps {
    contactID?: string;
    onChange: (contactID?: string) => void;
}

const noContactAddressPlaceholder = "No contact address";

const contactToAddressPreview = (contact?: Contact) => {
    if (!contact) return noContactAddressPlaceholder;

    const address = contact.location?.[0].address;
    if (!address) return noContactAddressPlaceholder;

    const addressParts = [];
    if (address.street) addressParts.push(address.street);
    if (address.locality) addressParts.push(address.locality);
    if (address.postal_code) addressParts.push(address.postal_code);
    if (address.country) addressParts.push(address.country);
    if (address.address) addressParts.push(address.address);

    return addressParts.join(', ');
}

const noContactCoordinatesPlaceholder = "No contact coordinates";

const contactToCoordinatesPreview = (contact?: Contact) => {
    if (!contact) return noContactCoordinatesPlaceholder;

    const coordinates = contact.location?.[0].geo;
    if (!coordinates) return noContactCoordinatesPlaceholder;
    return `${coordinates.latitude}, ${coordinates.longitude}`;
}

const ContactDetailsEditor: React.FC<ContactDetailsEditorProps> = (props) => {
    const trpc = useTRPC();
    const queryClient = useQueryClient();
    const [open, setOpen] = useState(false);
    const [street, setStreet] = useState("");
    const [locality, setLocality] = useState("");
    const [postalCode, setPostalCode] = useState("");
    const [country, setCountry] = useState("");
    const [isCountryOpen, setIsCountryOpen] = useState(false);
    const [submitError, setSubmitError] = useState<string | undefined>(undefined);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { data: contact, isLoading: isLoadingContact, error: errorContact } = useQuery({
        ...trpc.resources.getContact.queryOptions({ contactId: props.contactID || '' }),
        enabled: !!props.contactID,
    })

    const { data: countries, isLoading: isLoadingCountries, error: errorCountries } = useQuery({
        ...trpc.taxonomies.get.queryOptions({ taxonomyType: TaxonomyType.COUNTRIES }),
        enabled: !!open,
    })


    // Prefill the form from the existing contact when available
    useEffect(() => {
        const address = (contact as Contact | undefined)?.location?.[0]?.address;
        if (address) {
            setStreet(address.street || "");
            setLocality(address.locality || "");
            setPostalCode(address.postal_code || "");
            setCountry(address.country || "");
        }
    }, [contact]);

    const isSubmitDisabled = useMemo(() => {
        return !street && !locality && !postalCode && !country; // require at least one field
    }, [street, locality, postalCode, country]);

    const countryTerms = useMemo(() => {
        if (!countries) return [] as string[];
        const flatten = (entries: Taxonomy[], acc: string[] = []) => {
            for (const entry of entries) {
                if (entry.term) acc.push(entry.term);
                if (entry.subterms && entry.subterms.length > 0) flatten(entry.subterms, acc);
            }
            return acc;
        };
        return flatten(countries as Taxonomy[]).sort((a, b) => a.localeCompare(b));
    }, [countries]);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        e.stopPropagation();
        setSubmitError(undefined);
        if (isSubmitDisabled) {
            setSubmitError("Please enter at least one address field.");
            return;
        }
        setIsSubmitting(true);
        try {
            const result = await queryClient.fetchQuery(
                trpc.geocoding.lookup.queryOptions({
                    street: street || undefined,
                    locality: locality || undefined,
                    postal_code: postalCode || undefined,
                    country: country || undefined,
                })
            );
            console.log(result);


            const updatedContact: Contact = {
                ...contact,
                location: [
                    {
                        ...(contact as Contact)?.location?.[0],
                        address: {
                            ...(contact as Contact)?.location?.[0].address,
                            street: street,
                            locality: locality,
                            postal_code: postalCode,
                            country: country || (contact as Contact)?.location?.[0].address?.country,
                        },
                        geo: result
                    },
                ],
            } as Contact;
            console.log(updatedContact);
            // props.onChange(updated);
            // If we reached here, address was found. Close dialog.
            // setOpen(false);
        } catch (err: unknown) {
            const message = (err as { message?: string })?.message || "Failed to validate address";
            setSubmitError(message);
        } finally {
            setIsSubmitting(false);
        }
    }

    if (isLoadingContact) return <div>Loading...</div>;
    if (errorContact) return <div>Error: {errorContact.message}</div>;
    if (errorCountries) return <div>Error: {errorCountries.message}</div>;


    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="outline"
                    type="button"
                    className="h-auto w-full"
                >
                    <div className="space-y-2 flex-1 text-left">
                        <div className="flex items-center gap-2">
                            <HomeIcon />
                            {contactToAddressPreview(contact as Contact | undefined)}
                        </div>
                        <div className="flex items-center gap-2">
                            <MapPin />
                            {contactToCoordinatesPreview(contact as Contact | undefined)}
                        </div>
                    </div>
                    <PencilIcon
                        className="size-5"
                    />
                </Button>
            </DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit address</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="street">Street</Label>
                        <Input
                            id="street"
                            placeholder="Street and number"
                            value={street}
                            onChange={(e) => setStreet(e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="locality">City</Label>
                        <Input
                            id="locality"
                            placeholder="City"
                            value={locality}
                            onChange={(e) => setLocality(e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="postal">Postal code</Label>
                        <Input
                            id="postal"
                            placeholder="ZIP / Postal code"
                            value={postalCode}
                            onChange={(e) => setPostalCode(e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="country">Country</Label>
                        <Popover
                            modal={true}
                            open={isCountryOpen} onOpenChange={setIsCountryOpen}>
                            <PopoverTrigger asChild>
                                <Button
                                    id="country"
                                    variant="outline"
                                    type="button"
                                    className="w-full justify-between"
                                >
                                    {country || "Select country"}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="p-0 w-[var(--radix-popover-trigger-width)]">
                                <Command>
                                    <CommandInput placeholder="Search country..." />
                                    <CommandList>
                                        {isLoadingCountries && (
                                            <CommandItem>
                                                <Loader2 className="size-4 animate-spin" />
                                                Loading countries...
                                            </CommandItem>
                                        )}
                                        <CommandEmpty>No country found.</CommandEmpty>
                                        <CommandGroup>
                                            {countryTerms.map((term) => (
                                                <CommandItem
                                                    key={term}
                                                    value={term}
                                                    onSelect={(value) => {
                                                        setCountry(value);
                                                        setIsCountryOpen(false);
                                                    }}
                                                >
                                                    {term}
                                                </CommandItem>
                                            ))}
                                        </CommandGroup>
                                    </CommandList>
                                </Command>
                            </PopoverContent>
                        </Popover>
                    </div>
                    {submitError && (
                        <div className="text-red-600 text-sm" role="alert">
                            {submitError}
                        </div>
                    )}
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                            Cancel
                        </Button>
                        <LoadingButton type="submit" disabled={isSubmitDisabled || isLoadingCountries} isLoading={isSubmitting}>
                            {isSubmitting ? "Validating..." : "Save address"}
                        </LoadingButton>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default ContactDetailsEditor;
