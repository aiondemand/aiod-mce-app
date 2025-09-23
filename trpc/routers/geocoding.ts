import { protectedProcedure, router } from '../init';
import { z } from 'zod';
import { TRPCError } from '@trpc/server';

const AddressInputSchema = z.object({
    // region: z.string().max(256).optional(),
    locality: z.string().max(256).optional(),
    street: z.string().max(256).optional(),
    postal_code: z.string().max(64).optional(),
    // address: z.string().max(256).optional(),
    // country: z.string().length(3).optional(),
});

type AddressInput = z.infer<typeof AddressInputSchema>;

async function geocodeWithNominatim(address: AddressInput) {
    const qParts: string[] = [];

    if (address.postal_code) qParts.push(address.postal_code);
    if (address.locality) qParts.push(address.locality);
    if (address.street) qParts.push(address.street);

    const q = qParts.join(', ');
    if (!q) {
        throw new TRPCError({ code: 'BAD_REQUEST', message: 'Address is empty' });
    }

    const url = new URL('https://nominatim.openstreetmap.org/search');
    url.searchParams.set('format', 'jsonv2');
    url.searchParams.set('limit', '1');
    url.searchParams.set('addressdetails', '0');
    url.searchParams.set('q', q);
    // url.searchParams.set('street', address.street || '');
    // url.searchParams.set('postalcode', address.postal_code || '');
    // url.searchParams.set('country', address.country || '');

    const userAgent = process.env.NOMINATIM_USER_AGENT || 'aiod-mce-app (contact: unknown@example.com)';

    const res = await fetch(url.toString(), {
        headers: {
            'User-Agent': userAgent,
        },
    });
    if (!res.ok) {
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Geocoding request failed' });
    }
    const data = (await res.json()) as Array<{ lat: string; lon: string }>;
    if (!Array.isArray(data) || data.length === 0) {
        throw new TRPCError({ code: 'BAD_REQUEST', message: 'No results found for the provided address' });
    }
    const first = data[0];
    const latitude = Number(first.lat);
    const longitude = Number(first.lon);
    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Invalid geocoding response' });
    }
    return { latitude, longitude };
}

export const geocodingRouter = router({
    lookup: protectedProcedure
        .input(AddressInputSchema)
        .query(async ({ input }) => {
            return await geocodeWithNominatim(input);
        }),
});


