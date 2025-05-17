import NextAuth from "next-auth"
import Keycloak from "next-auth/providers/keycloak"
import { renewToken } from "./lib/server/auth"

export const { handlers, signIn, signOut, auth } = NextAuth({
    basePath: process.env.BASEPATH,
    pages: {
        //signIn: "/login",
    },
    providers: [
        Keycloak({
            clientId: process.env.AUTH_KEYCLOAK_ID,
            clientSecret: process.env.AUTH_KEYCLOAK_SECRET,
            issuer: process.env.AUTH_KEYCLOAK_ISSUER,
            authorization: {
                params: {
                    scope: "openid profile email offline_access"
                }
            },
            profile(profile) {
                //console.log(profile)
                return {
                    id: profile.sub,
                    name: profile.name,
                    email: profile.email,
                    image: profile.picture
                }
            }
        })
    ],
    callbacks: {
        async jwt({ token, user, account }) {
            if (account) {
                //console.log('account', account)
                console.log('user', user)
                token.accessToken = account.access_token
                token.refreshToken = account.refresh_token
                token.expiresAt = (account.expires_in || 0) + Date.now() / 1000

            } else if (token.expiresAt !== undefined && Date.now() > token.expiresAt * 1000 && token.refreshToken !== undefined) {
                console.log('refreshing token')
                const resp = await renewToken(process.env.AUTH_KEYCLOAK_ID || '', process.env.AUTH_KEYCLOAK_SECRET || '', token.refreshToken)

                if (resp.error) {
                    console.error(resp.error + ' ' + resp.error_description)
                    return {
                        ...token,
                        error: 'RefreshAccessTokenError' as const,
                    }
                }

                token.accessToken = resp.access_token
                token.refreshToken = resp.refresh_token
                token.expiresAt = (resp.expires_in || 0) + Date.now() / 1000

                return token
            }
            return token
        },
        async session({ session, token }) {
            session.accessToken = token.accessToken;
            session.expiresAt = token.expiresAt;
            return session
        }
    },
})


declare module "next-auth" {
    interface Session {
        accessToken?: string;
        expiresAt?: number;
    }

}

declare module "@auth/core/jwt" {
    /** Returned by the `jwt` callback and `auth`, when using JWT sessions */
    interface JWT {
        provider?: string
        accessToken?: string
        refreshToken?: string
        expiresAt?: number
        error?: "RefreshAccessTokenError" | "LoginFailed"
    }
}
