"use client";

import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '../../contexts/auth';
import { useEffect, useRef, useState } from 'react';
import Button from '../../components/Button';
import Input from '../../components/Input';
import SendbirdChat from '@sendbird/chat';
import { OpenChannelModule, SendbirdOpenChat } from '@sendbird/chat/openChannel';

function Login() {
    const { setUserId, setAccessToken, openSB, setOpenSB, APP_ID } = useAuthContext();
    
    const input = useRef(null);

    const router = useRouter();

    async function createOrGetUserId() {
        if (input.current) {
            const userId = input.current.value;
            console.log("user Id : %o", userId);
            setUserId(userId);
            let user = (await axios.get(`/api/users/${userId}`)).data;
            
            const userDoNotExists = !!user.error;
            if (userDoNotExists) {
                user = (
                    await axios.post("/api/users", { userId} )
                ).data;
            }
            const connectedUser = await openSB.connect(userId, user.access_token);
    
            setAccessToken(user.access_token);
            router.push("/chat/open/public")
        }
    }

    useEffect(
        () => {
            setOpenSB(
                SendbirdChat.init({
                appId: APP_ID,
                modules: [
                    new OpenChannelModule(),
                ],
                }) as SendbirdOpenChat
            )
        }, []
    )

    return (
        <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-dvh p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
            <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
                <label>Identifiant</label>
                <Input ref={input}/>
                <Button onClick={createOrGetUserId}>
                    Connexion
                </Button>
            </main>
        </div>
    )
}

export default Login;