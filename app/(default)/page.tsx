import { LoginButton } from "@/components/login-button";

export default function Home() {
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
