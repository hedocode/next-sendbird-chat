"use client";

import { useEffect, useRef, useState } from 'react';
import { useAuthContext } from '@/contexts/auth';
import Message from '../../components/Message';
import ChannelTypePicker from '../../components/ChannelTypePicker';
import ParticipantList from '../../components/ParticipantList';
import ChannelsList from '../../components/ChannelsList';
import MessageDraft from '../../components/MessageDraft';
import { useOpenChat } from '@/hooks/useOpenChat';
import { useMessages } from '@/hooks/useMessages';
import { OpenChannel, OpenChannelModule, SendbirdOpenChat } from '@sendbird/chat/openChannel';
import SendbirdChat from '@sendbird/chat';

function Chat({
    params,
}: {
    params: Promise<{ type: string, channel_url: string }>
}) {
    const [currentChannel, setCurrentChannel] = useState<OpenChannel|null>(null);
    const messageWrapperRef = useRef<HTMLElement>(null);

    // Separating the logic from the views using a hook.
    const messagesData = useMessages(currentChannel, messageWrapperRef);
    const { messages, customAddMessage, loadOlderMessages } = messagesData;
    
    const openChat = useOpenChat({currentChannel, setCurrentChannel, params, messages, customAddMessage});
    const { openChannels, isCurrentChannel, channelParticipants, goPrivate } = openChat;

    const { userId, setSb, APP_ID} = useAuthContext();
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
            
            return () => {
                SendbirdChat.instance.disconnect();
            }
        }, []
    )

    return (
        <main className='max-h-screen h-screen flex flex-col divide-y-2'>
            <ChannelTypePicker currentChannelType='open'/>
            <div className='flex flex-col h-full p-4'>
                <ChannelsList
                    isCurrentChannel={isCurrentChannel}
                    channelsToDisplay={ openChannels }
                    currentChannelType='open'
                />
                <section className='flex flex-row flex-grow flex-wrap gap-10 divide-x-2 border-blue-100 bg-gray-100 border-2 border-gray-200'>
                    <aside className='p-2'>
                        <ParticipantList channelParticipants={channelParticipants} goPrivate={goPrivate}/>
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
                            <MessageDraft {...openChat} {...messagesData} />
                        </article>
                    )}
                </section>
            </div>
        </main>
    )
}

export default Chat;