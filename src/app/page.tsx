"use client";

import { useAuthContext } from '@/contexts/auth';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';


export default function Home() {
  const authContext = useAuthContext();
  const router = useRouter();
  const { userId, accessToken } = authContext ?? {};

  useEffect(
    () => {
      if(authContext) {
        if (!userId || !accessToken) {
          router.push("/login");
        } else {
          router.push("/chat/open/public");
        }
      }
    }, [authContext, userId, accessToken]
  );

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-dvh p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <Link href={"/login"}>Embarquez dans le ChatBus</Link>
      </main>
    </div>
  );
}
