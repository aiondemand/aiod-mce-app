'use server'

import { signIn, signOut } from '@/auth'
import { revalidatePath } from 'next/cache'

export async function login() {
    await signIn('keycloak', {
        redirect: true
    })
    revalidatePath('/')
}

export async function logout() {
    await signOut()
    revalidatePath('/')
}
