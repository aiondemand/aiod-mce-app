import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL || "";
const MAX_FILE_SIZE = 1048576; // 1 MB in bytes

interface RouteParams {
    params: Promise<{
        assetType: string;
        identifier: string;
    }>;
}

async function validateSession() {
    const session = await auth();
    if (!session?.accessToken) {
        return null;
    }
    return session;
}

function validateImageType(base64Data: string): string | null {
    // Check magic bytes for PNG and JPEG
    const pngSignature = "iVBORw0KGgo"; // PNG signature in base64
    const jpegSignature1 = "/9j/"; // JPEG JFIF signature in base64
    const jpegSignature2 = "/9g/"; // JPEG EXIF signature in base64

    if (base64Data.startsWith(pngSignature)) {
        return "image/png";
    }
    if (
        base64Data.startsWith(jpegSignature1) ||
        base64Data.startsWith(jpegSignature2)
    ) {
        return "image/jpeg";
    }

    return null;
}

function validateImageSize(base64Data: string): boolean {
    // Base64 encoding increases size by ~33%, so we check the encoded size
    // Actual decoded size will be smaller
    const encodedSize = base64Data.length;
    const approximateDecodedSize = (encodedSize * 3) / 4;
    return approximateDecodedSize <= MAX_FILE_SIZE;
}

export async function POST(request: NextRequest, { params }: RouteParams) {
    const session = await validateSession();
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { assetType, identifier } = await params;
    const searchParams = request.nextUrl.searchParams;
    const name = searchParams.get("name");

    if (!name) {
        return NextResponse.json(
            { error: "Name parameter is required" },
            { status: 400 }
        );
    }

    try {
        const formData = await request.formData();
        const file = formData.get("file");

        if (!file || typeof file !== "string") {
            return NextResponse.json(
                { error: "File field is required and must be base64 encoded" },
                { status: 400 }
            );
        }

        // Validate image type
        const imageType = validateImageType(file);
        if (!imageType) {
            return NextResponse.json(
                { error: "Invalid image type. Only PNG and JPEG are allowed" },
                { status: 400 }
            );
        }

        // Validate size
        if (!validateImageSize(file)) {
            return NextResponse.json(
                { error: "Image size exceeds 1 MB limit" },
                { status: 400 }
            );
        }

        // Forward to backend
        const backendUrl = `${BACKEND_URL}/${assetType}/${identifier}/image?name=${encodeURIComponent(
            name
        )}`;

        // Convert base64 back to blob for backend
        const byteCharacters = atob(file);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: imageType });

        const backendFormData = new FormData();
        backendFormData.set("file", blob, name);

        const response = await fetch(backendUrl, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${session.accessToken}`,
            },
            body: backendFormData,
        });

        if (!response.ok) {
            const errorText = await response.text();
            return NextResponse.json(
                { error: errorText || "Backend request failed" },
                { status: response.status }
            );
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error("Error uploading image:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
    const session = await validateSession();
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { assetType, identifier } = await params;
    const searchParams = request.nextUrl.searchParams;
    const name = searchParams.get("name");

    if (!name) {
        return NextResponse.json(
            { error: "Name parameter is required" },
            { status: 400 }
        );
    }

    try {
        const formData = await request.formData();
        const file = formData.get("file");

        if (!file || typeof file !== "string") {
            return NextResponse.json(
                { error: "File field is required and must be base64 encoded" },
                { status: 400 }
            );
        }

        // Validate image type
        const imageType = validateImageType(file);
        if (!imageType) {
            return NextResponse.json(
                { error: "Invalid image type. Only PNG and JPEG are allowed" },
                { status: 400 }
            );
        }

        // Validate size
        if (!validateImageSize(file)) {
            return NextResponse.json(
                { error: "Image size exceeds 1 MB limit" },
                { status: 400 }
            );
        }

        // Forward to backend
        const backendUrl = `${BACKEND_URL}/${assetType}/${identifier}/image?name=${encodeURIComponent(
            name
        )}`;

        // Convert base64 back to blob for backend
        const byteCharacters = atob(file);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: imageType });

        const backendFormData = new FormData();
        backendFormData.set("file", blob, name);

        const response = await fetch(backendUrl, {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${session.accessToken}`,
            },
            body: backendFormData,
        });

        if (!response.ok) {
            const errorText = await response.text();
            return NextResponse.json(
                { error: errorText || "Backend request failed" },
                { status: response.status }
            );
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error("Error replacing image:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
    const session = await validateSession();
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { assetType, identifier } = await params;
    const searchParams = request.nextUrl.searchParams;
    const name = searchParams.get("name");

    if (!name) {
        return NextResponse.json(
            { error: "Name parameter is required" },
            { status: 400 }
        );
    }

    try {
        const backendUrl = `${BACKEND_URL}/${assetType}/${identifier}/image?name=${encodeURIComponent(
            name
        )}`;

        const response = await fetch(backendUrl, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${session.accessToken}`,
            },
        });

        if (!response.ok) {
            const errorText = await response.text();
            return NextResponse.json(
                { error: errorText || "Backend request failed" },
                { status: response.status }
            );
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error("Error deleting image:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

