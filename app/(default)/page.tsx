import { LoginButton } from "@/components/login-button";
import TestTRPC from "./_components/test-trpc";
import { redirect } from "next/navigation";
import { auth } from "@/auth";

export default async function Home() {
  const session = await auth()
  //console.log(session)

  if (!session?.user) {
    redirect("/login")
  }

  // redirect("/my-assets/datasets")
  return <TestTRPC />

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="font-jura text-4xl font-bold text-foreground">Hello World</h1>
      <LoginButton />

      <div className="bg-secondary text-secondary-foreground font-sans">
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.
        </p>
      </div>
    </div>
  );
}
