'use client'

import { login } from "@/actions/login"
import LoadingButton from "@/components/loading-button"
import { LogIn } from "lucide-react"
import { useTransition } from "react"

const ClientLogin = () => {
    const [isPending, startTransition] = useTransition()

    const performLogin = () => {
        startTransition(async () => {
            await login()
        })
    }

    return <LoadingButton
        className="w-full"
        onClick={performLogin} isLoading={isPending}>
        <LogIn />
        Login
    </LoadingButton>

}

export default ClientLogin;