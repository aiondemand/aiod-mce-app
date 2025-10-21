"use client";

import { Resource } from "@/lib/server/types"
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useTRPC } from "@/trpc/client";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";


interface ReviewSectionProps {
    asset?: Resource

}

const ReviewSection: React.FC<ReviewSectionProps> = (props) => {
    const trpc = useTRPC();
    const [isOpen, setIsOpen] = useState(false);
    const [comment, setComment] = useState("");

    const submitForReviewMutation = useMutation(trpc.resources.submitForReview.mutationOptions());
    const isSubmitting = submitForReviewMutation.isPending;

    if (!props.asset || !props.asset.identifier) {
        return null;
    }

    if (props.asset.aiod_entry?.status !== 'draft') {
        return null;
    }

    const assetIdentifier = props.asset.identifier;

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        e.stopPropagation();

        try {
            await submitForReviewMutation.mutateAsync({
                comment: comment,
                asset_identifiers: [assetIdentifier],
            });

            toast.success('Asset submitted for review');
            setComment("");
            setIsOpen(false);
        } catch {
            toast.error('Failed to submit asset for review');
        }
    }

    return <div className="space-y-4">
        <div className="flex items-center justify-between rounded-lg border p-4 bg-muted">
            <div>
                <h3 className="font-semibold">Submit for Review</h3>
                <p className="text-sm text-muted-foreground">
                    Submit this asset for review in order to be published.
                </p>
            </div>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild>
                    <Button>Submit for Review</Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Submit for Review</DialogTitle>
                        <DialogDescription>
                            Add a comment explaining your changes or request for review.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="comment">Comment</Label>
                            <Textarea
                                id="comment"
                                placeholder="Enter your comment here..."
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                rows={5}
                                disabled={isSubmitting}
                            />
                        </div>
                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsOpen(false)}
                                disabled={isSubmitting}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isSubmitting || !comment.trim()}>
                                {isSubmitting && <Loader2 className="animate-spin" />}
                                Submit
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    </div>
}

export default ReviewSection;