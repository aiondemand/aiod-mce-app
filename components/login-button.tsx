'use client'

import { signIn } from "next-auth/react"
import { Button } from "./ui/button"

interface LoginButtonProps {
    className?: string;
}

export function LoginButton({ className }: LoginButtonProps) {
    return (
        <Button onClick={() => signIn()} className={className}>Login</Button>
    )
}