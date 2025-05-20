import { handlers } from "@/auth";
import logger from "@/lib/logger";
import { NextRequest } from "next/server";

const basePath = process.env.BASEPATH ?? '';

function rewriteRequest(req: NextRequest) {
    const {
        headers,
        nextUrl: { protocol, host, pathname, search },
    } = req;

    const detectedHost = headers.get("x-forwarded-host") ?? host;
    const detectedProtocol = headers.get("x-forwarded-proto") ?? protocol;
    logger.info(`detectedHost: ${detectedHost}`);
    logger.info(`detectedProtocol: ${detectedProtocol}`);

    // Clean the host by removing any commas and extra spaces
    const cleanHost = detectedHost.split(',')[0].trim();
    const _protocol = `${detectedProtocol.replace(/:$/, "")}:`;
    const url = new URL(_protocol + "//" + cleanHost + basePath + pathname + search);

    return new NextRequest(url, req);
}

export const GET = async (req: NextRequest) => await handlers.GET(rewriteRequest(req));
export const POST = async (req: NextRequest) => await handlers.POST(rewriteRequest(req));
