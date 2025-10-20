'use client'

import { login } from "@/actions/login"
import LoadingButton from "@/components/loading-button"
import { LogIn } from "lucide-react"
import { useSearchParams } from "next/navigation"
import { useEffect, useTransition } from "react"

const ClientLogin = () => {
    const [isPending, startTransition] = useTransition()
    const searchParams = useSearchParams()

    const autoLogin = searchParams.get('autoLogin') === 'true'

    useEffect(() => {
        if (autoLogin) {
            performLogin()
        }
    }, [autoLogin])

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