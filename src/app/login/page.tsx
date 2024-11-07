"use client";

import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '../../contexts/auth';
import { useEffect, useState } from 'react';
import Button from '../../components/Button';
import Input from '../../components/Input';
import SendbirdChat from '@sendbird/chat';
import { OpenChannelModule, SendbirdOpenChat } from '@sendbird/chat/openChannel';

function Login() {
    const { setUserId, setAccessToken, sb, setSb, APP_ID } = useAuthContext();
    
    const [localUserId, setLocalUserId] = useState("");

    const router = useRouter();

    async function createOrGetUserId() {
        setUserId(localUserId);
        let user = (await axios.get(`/api/users/${localUserId}`)).data;
        const userDoNotExists = !!user.error;
        if (userDoNotExists) {
            user = (
                await axios.post("/api/users", { localUserId } )
            ).data;
        }
        const connectedUser = await sb.connect(localUserId, user.access_token);
        console.log("connectedUser : %o", connectedUser);

        setAccessToken(user.access_token);
        router.push("/chat/open/public")
    }

    useEffect(
        () => {
            setSb(
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
        <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
            <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
                <label>Identifiant</label>
                <Input value={localUserId} onChange={(e) => setLocalUserId(e.target.value)}/>
                <Button onClick={createOrGetUserId}>
                    Connexion
                </Button>
            </main>
        </div>
    )
}

export default Login;