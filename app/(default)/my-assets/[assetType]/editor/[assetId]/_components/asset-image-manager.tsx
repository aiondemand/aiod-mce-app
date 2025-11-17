"use client";

import { useState } from "react";
import { Media } from "@/lib/server/types";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from "@/components/ui/empty";
import {
    Item,
    ItemActions,
    ItemContent,
    ItemGroup,
    ItemHeader,
    ItemSeparator,
    ItemTitle,
} from "@/components/ui/item";
import Filepicker from "@/components/ui/filepicker";
import { ImageIcon, Loader2, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";
import { FileWithPath } from "react-dropzone";
import { useRouter } from "next/navigation";

interface AssetImageManagerProps {
    assetType: string;
    identifier: string;
    media?: Media[];
}

type DialogMode = "add" | "replace" | null;

export function AssetImageManager({
    assetType,
    identifier,
    media = [],
}: AssetImageManagerProps) {
    const [dialogMode, setDialogMode] = useState<DialogMode>(null);
    const [selectedImage, setSelectedImage] = useState<Media | null>(null);
    const [filename, setFilename] = useState("");
    const [selectedFile, setSelectedFile] = useState<FileWithPath | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [isDeleting, setIsDeleting] = useState<string | null>(null);
    const router = useRouter();

    const images = media || [];

    const openDialog = (mode: "add" | "replace", image?: Media) => {
        setDialogMode(mode);
        setSelectedImage(image || null);
        setFilename(mode === "replace" && image ? image.name || "" : "");
        setSelectedFile(null);
    };

    const closeDialog = () => {
        setDialogMode(null);
        setSelectedImage(null);
        setFilename("");
        setSelectedFile(null);
    };

    const handleFileChange = (files: readonly FileWithPath[]) => {
        if (files.length === 0) {
            setSelectedFile(null);
            return;
        }

        const file = files[0];

        // Validate file type
        if (!file.type.match(/^image\/(png|jpeg)$/)) {
            toast.error("Only PNG and JPEG images are allowed");
            setSelectedFile(null);
            return;
        }

        setSelectedFile(file);

        // Auto-fill filename from file name if adding new
        if (dialogMode === "add" && !filename) {
            setFilename(file.name);
        }
    };

    const validateFilename = (): boolean => {
        if (!filename.trim()) {
            toast.error("Filename is required");
            return false;
        }

        // Check for duplicate names when adding
        if (dialogMode === "add") {
            const isDuplicate = images.some(
                (img) => img.name?.toLowerCase() === filename.trim().toLowerCase()
            );
            if (isDuplicate) {
                toast.error("An image with this filename already exists");
                return false;
            }
        }

        return true;
    };

    const convertToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
                if (typeof reader.result === "string") {
                    // Extract base64 data without the data URL prefix
                    const base64 = reader.result.split(",")[1];
                    resolve(base64);
                } else {
                    reject(new Error("Failed to read file"));
                }
            };
            reader.onerror = () => reject(reader.error);
            reader.readAsDataURL(file);
        });
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            toast.error("Please select a file");
            return;
        }

        if (!validateFilename()) {
            return;
        }

        setIsUploading(true);

        try {
            const base64Data = await convertToBase64(selectedFile);
            const formData = new FormData();
            formData.set("file", base64Data);

            const method = dialogMode === "replace" ? "PUT" : "POST";
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_BASEPATH}/api/assets/${assetType}/${identifier}/image?name=${encodeURIComponent(
                    filename.trim()
                )}`,
                {
                    method,
                    body: formData,
                }
            );

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || `Upload failed: ${response.statusText}`);
            }

            toast.success(
                dialogMode === "replace"
                    ? "Image replaced successfully"
                    : "Image uploaded successfully"
            );
            closeDialog();
            router.refresh();
        } catch (error) {
            console.error("Upload error:", error);
            toast.error(
                error instanceof Error ? error.message : "Failed to upload image"
            );
        } finally {
            setIsUploading(false);
        }
    };

    const handleDelete = async (imageName: string) => {
        if (!confirm(`Are you sure you want to delete "${imageName}"?`)) {
            return;
        }

        setIsDeleting(imageName);

        try {
            const response = await fetch(
                `/api/assets/${assetType}/${identifier}/image?name=${encodeURIComponent(
                    imageName
                )}`,
                {
                    method: "DELETE",
                }
            );

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || `Delete failed: ${response.statusText}`);
            }

            toast.success("Image deleted successfully");
            router.refresh();
        } catch (error) {
            console.error("Delete error:", error);
            toast.error(
                error instanceof Error ? error.message : "Failed to delete image"
            );
        } finally {
            setIsDeleting(null);
        }
    };

    return (
        <>
            {images.length === 0 ? (
                <Empty className="border transition-colors duration-200 ease motion-reduce:transition-none">
                    <EmptyHeader>
                        <EmptyMedia variant="icon">
                            <ImageIcon />
                        </EmptyMedia>
                        <EmptyTitle>No images</EmptyTitle>
                        <EmptyDescription>
                            Add images to showcase this asset
                        </EmptyDescription>
                    </EmptyHeader>
                    <EmptyContent>
                        <Button
                            type="button"
                            onClick={() => openDialog("add")}>
                            <Upload className="size-4" />
                            Upload Image
                        </Button>
                    </EmptyContent>
                </Empty>
            ) : (
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-sm font-medium">Images</h3>
                        <Button
                            type="button"
                            size="sm" onClick={() => openDialog("add")}>
                            <Upload className="size-4" />
                            Add Image
                        </Button>
                    </div>
                    <ItemGroup className="border rounded-lg overflow-hidden transition-all duration-200 ease-out motion-reduce:transition-none">
                        {images.map((image, index) => (
                            <div key={image.name || index}>
                                {index > 0 && <ItemSeparator />}
                                <Item variant="outline" className="border-0">
                                    <ItemHeader>

                                        {image.binary_blob ? (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img
                                                src={`data:${image.encoding_format || "image/png"};base64,${(image.binary_blob)}`}
                                                alt={image.name || "Image"}
                                                className="w-full h-32 object-contain"
                                            />
                                        ) : (
                                            <ImageIcon className="size-6 text-muted-foreground" />
                                        )}

                                    </ItemHeader>
                                    <ItemContent>
                                        <ItemTitle>{image.name || "Untitled"}</ItemTitle>
                                        {image.encoding_format && (
                                            <p className="text-xs text-muted-foreground">
                                                {image.encoding_format}
                                                {image.content_size_kb &&
                                                    ` • ${Math.round(image.content_size_kb)} KB`}
                                            </p>
                                        )}
                                    </ItemContent>
                                    <ItemActions>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            type="button"
                                            onClick={() => openDialog("replace", image)}
                                            disabled={isDeleting === image.name}
                                        >
                                            Replace
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            type="button"
                                            onClick={() => handleDelete(image.name || "")}
                                            disabled={
                                                !image.name || isDeleting === image.name
                                            }
                                        >
                                            {isDeleting === image.name ? (
                                                <Loader2 className="size-4 animate-spin" />
                                            ) : (
                                                <Trash2 className="size-4" />
                                            )}
                                        </Button>
                                    </ItemActions>
                                </Item>
                            </div>
                        ))}
                    </ItemGroup>
                </div>
            )}

            <Dialog open={dialogMode !== null} onOpenChange={(open) => !open && closeDialog()}>
                <DialogContent className="transition-all duration-200 ease-out motion-reduce:transition-none max-w-2xl" >
                    <DialogHeader>
                        <DialogTitle>
                            {dialogMode === "add" ? "Upload Image" : "Replace Image"}
                        </DialogTitle>
                        <DialogDescription>
                            {dialogMode === "add"
                                ? "Upload a new image (PNG or JPEG, max 1 MB)"
                                : `Replace "${selectedImage?.name}"`}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 max-w-full overflow-x-hidden">
                        <div className="space-y-1.5">
                            <Label htmlFor="filename">Filename</Label>
                            <Input
                                id="filename"
                                value={filename}
                                onChange={(e) => setFilename(e.target.value)}
                                placeholder="Enter filename"
                                disabled={dialogMode === "replace"}
                                readOnly={dialogMode === "replace"}
                                className={dialogMode === "replace" ? "bg-muted" : ""}
                            />
                            {dialogMode === "add" && (
                                <p className="text-xs text-muted-foreground mt-1">
                                    Must be unique
                                </p>
                            )}
                        </div>

                        <Filepicker
                            id="image-upload"
                            accept={{
                                "image/png": [".png"],
                                "image/jpeg": [".jpg", ".jpeg"],
                            }}
                            onChange={handleFileChange}
                            placeholders={{
                                upload: "Click to select image",
                                drag: "or drag and drop",
                            }}
                        />

                        {selectedFile && (
                            <div className="text-sm text-muted-foreground">
                                Selected: {selectedFile.name} (
                                {Math.round(selectedFile.size / 1024)} KB)
                            </div>
                        )}
                    </div>

                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={closeDialog}
                            disabled={isUploading}
                            type="button"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            onClick={handleUpload} disabled={isUploading}>
                            {isUploading ? (
                                <>
                                    <Loader2 className="size-4 animate-spin" />
                                    Uploading...
                                </>
                            ) : dialogMode === "add" ? (
                                "Upload"
                            ) : (
                                "Replace"
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

