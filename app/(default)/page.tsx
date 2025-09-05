import MyAssets from "./_components/my-assets";
import { redirect } from "next/navigation";
import { auth } from "@/auth";

export default async function Home() {
  const session = await auth()


  if (!session?.user) {
    redirect("/login")
  }

  return <MyAssets />
}
