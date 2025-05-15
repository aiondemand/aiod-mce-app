import { AlertTriangleIcon } from "lucide-react";

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

    </div >
}