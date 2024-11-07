"use client";

import { useEffect, useRef, useState } from 'react';
import { useAuthContext } from '@/contexts/auth';
import { useChannels } from '@/hooks/useChannels';
import Message from '../../components/Message';
import ChannelTypePicker from '../../components/ChannelTypePicker';
import ParticipantList from '../../components/ParticipantList';
import ChannelsList from '../../components/ChannelsList';
import MessageDraft from '../../components/MessageDraft';
import SendbirdChat from '@sendbird/chat';
import { OpenChannelModule, SendbirdOpenChat } from '@sendbird/chat/openChannel';
import { GroupChannelModule, SendbirdGroupChat } from '@sendbird/chat/groupChannel';

function Chat({
    params,
}: {
    params: Promise<{ type: string, channel_url: string }>
}) {

    const messageWrapperRef = useRef<HTMLElement>(null);

    const { userId, APP_ID, sb, setSb } = useAuthContext();

    // Separating the logic from the views using a hook.
    const channelsData = useChannels(params, messageWrapperRef);
    const {
        loadOlderMessages, messages,
    } = channelsData;

    useEffect(
        () => {
            (async () => {
                const { type } = await params;
                if (type === "open") {
                    setSb(
                        SendbirdChat.init({
                            appId: APP_ID,
                            modules: [
                                new OpenChannelModule(),
                            ],
                        }) as SendbirdOpenChat
                    )
                } else {
                    setSb(
                        SendbirdChat.init({
                            appId: APP_ID,
                            modules: [
                                new GroupChannelModule(),
                            ],
                        }) as SendbirdGroupChat
                    )
                }
            })()
        }, []
    );

    return (
        <main className='max-h-screen h-screen flex flex-col divide-y-2'>
            <ChannelTypePicker {...channelsData}/>
            <div className='flex flex-col h-full p-4'>
                <ChannelsList {...channelsData} />
                <section className='flex flex-row flex-grow flex-wrap gap-10 divide-x-2 border-blue-100 bg-gray-100 border-2 border-gray-200'>
                    <aside className='p-2'>
                        <ParticipantList {...channelsData} />
                    </aside>
                    {messages && (
                        <article className='flex flex-col flex-grow'>
                            <h3 className='p-2 shadow-md z-10'>
                                Messages
                            </h3>
                            <div
                                id="messagesWrapper" ref={messageWrapperRef}
                                onScroll={loadOlderMessages}
                                className='p-2 flex flex-col gap-4 items-start flex-grow overflow-auto h-0 bg-gray-50'
                            >
                                {messages.map(
                                    message => <Message message={message} userId={userId} key={message.messageId}/>
                                )}
                            </div>
                            <MessageDraft {...channelsData}/>
                        </article>
                    )}
                </section>
            </div>
        </main>
    )
}

export default Chat;