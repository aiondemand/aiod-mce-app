import { auth } from "@/auth";
import ClientLogin from "./_components/client-login";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { redirect } from "next/navigation";

export default async function Login() {
    const session = await auth()
    //console.log(session)

    if (session?.user) {
        redirect("/")
    }

    return (
        <div className="flex justify-center items-center h-screen">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <h1 className="font-jura text-4xl font-bold text-foreground">
                        Login
                    </h1>
                    <p className="text-sm text-foreground mt-2">
                        You need to login to start using the Catalogue Editor.
                    </p>
                </CardHeader>
                <CardContent>
                    <ClientLogin />
                </CardContent>
            </Card>
        </div>
    )
}