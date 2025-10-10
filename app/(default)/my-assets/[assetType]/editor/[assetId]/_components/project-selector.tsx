"use client"

import * as React from "react"
import { useTRPC } from "@/trpc/client"
import { useQuery } from "@tanstack/react-query"
import MultiSelect from "./multiselect-editor"
import { Project } from "@/lib/server/types"
import { Loader2 } from "lucide-react"

interface ProjectSelectorProps {
    value?: string[]
    onChange?: (ids: string[]) => void
}

export const ProjectSelector: React.FC<ProjectSelectorProps> = (props) => {
    const trpc = useTRPC();

    const { data, isLoading } = useQuery(
        trpc.resources.getProjects.queryOptions({ limit: 1000 })
    );

    const items = React.useMemo(() => (data?.assets || []).map((p: Project, index: number) => ({ id: p.identifier || index.toString(), name: p.name })), [data]);

    if (isLoading) return <div className="flex items-center justify-center py-2 text-sm">
        <Loader2 className="w-4 h-4 animate-spin me-4" />
        Loading projects...
    </div>

    return (
        <div>
            <MultiSelect
                value={props.value}
                items={items}
                onChange={(vals: string[]) => {
                    const ids = vals.map((v: string) => String(v).split("::")[0]).filter((n: string) => n.length > 0);
                    props.onChange?.(ids);
                }}
            />
        </div>
    )
};

export default ProjectSelector;