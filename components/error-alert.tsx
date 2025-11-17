import { AlertTriangleIcon, ExternalLinkIcon } from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";

interface ErrorAlertProps {
    title: string;
    description: string;
}

export const ErrorAlert: React.FC<ErrorAlertProps> = ({ title, description }) => {
    return <div className="space-y-2 px-8 py-4 border rounded-lg bg-destructive/40 w-fit" >

        <div className="flex items-center gap-4 text-lg font-jura">
            <AlertTriangleIcon className="size-6" />
            {title}
        </div>
        <p className="text-sm">
            {description}
        </p>
        <Button
            className="hover:underline hover:text-foreground"
            variant="outline" asChild>
            <Link
                href="https://aiod.eu/feedback/"
                target="_blank"
                rel="noopener noreferrer"
            >
                Ask for help or give feedback
                <ExternalLinkIcon className="w-4 h-4" />
            </Link>
        </Button>
    </div >
}