import FileUpload from "@/components/FileUpload";
import { Button } from "@/components/ui/button";
import { UserButton, auth } from "@clerk/nextjs";
import { LogIn } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default async function Home() {
  const { userId } = await auth();
  const isAuth = !!userId;
  return (
    <div className="min-w-screen min-h-screen text-slate-700  from-gray-900 to-gray-600 bg-gradient-to-r">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-50/90 p-6 rounded shadow-xl">
        <div className=" flex items-center justify-center">
          <h1 className="text-5xl font-semibold mr-5">Chat with any PDF</h1>
          <UserButton afterSignOutUrl="/" />
        </div>
        <div className=" flex items center justify-center mt-4">
          {isAuth && <Button>Go to chat</Button>}
        </div>
        <p className=" text-gray-700 mt-2 max-x-lg text-center text-lg">
          Join millions of students, researchers and professionals to instantly answer
          questions and understand documents with the power of AI.
        </p>

        <div className=" w-full text-center mt-4">
          {isAuth ? (
            <FileUpload />
          ) : (
            <Link href="/sign-in">
              <Button>
                Login to get started!
                <LogIn className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
