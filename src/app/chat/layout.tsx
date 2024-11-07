"use client";

import Button from "@/components/Button";
import { useAuthContext } from "@/contexts/auth";
import { useRouter } from "next/navigation";

export default function ChatLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    const authContext = useAuthContext();
    const { setAccessToken } = authContext ?? {};

    const router = useRouter();

    function disconnect() {
        if (setAccessToken) {
            setAccessToken(null);
            router.replace("/");
        }
    }

    return (
      <>
        <Button color="red" className="rounded-bl absolute top-0 right-0" onClick={disconnect}>
            Disconnect
        </Button>
        {children}
      </>
    );
  }
  
