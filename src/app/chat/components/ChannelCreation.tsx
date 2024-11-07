"use client";

import { useAuthContext } from "@/contexts/auth";
import { useState } from "react";
import Input from "../../../components/Input";
import Button from "../../../components/Button";
import { useRouter } from "next/navigation";


export default function ChannelCreation() {
    const [name, setName] = useState("");
    const authContext = useAuthContext();
    const { openSB } = authContext ?? {};
    const router = useRouter();

    async function createChannel() {
        // https://sendbird.com/docs/chat/sdk/v4/javascript/channel/creating-a-channel/create-a-channel#2-open-channel
        const params = {
            name,
            channelUrl: name,
        };
        const channel = await openSB.openChannel.createChannel(params);
        
        router.push(`/chat/open/${channel.url}`)
    }

    return (
        <div className='flex w-full z-10 pb-2'>
            <Input className="mr-2" value={name} onChange={(e:React.FormEvent<HTMLInputElement>) => setName(e.currentTarget.value)}/>
            <Button onClick={createChannel}>New</Button>
        </div>
    )
}