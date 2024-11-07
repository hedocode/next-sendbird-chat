"use client";

import { useEffect, useRef, useState } from 'react';
import { useAuthContext } from '@/contexts/auth';
import Message from '../../components/Message';
import ChannelTypePicker from '../../components/ChannelTypePicker';
import ParticipantList from '../../components/ParticipantList';
import MessageDraft from '../../components/MessageDraft';
import { useOpenChat } from '@/hooks/useOpenChat';
import { useMessages } from '@/hooks/useMessages';
import { OpenChannel, OpenChannelModule, SendbirdOpenChat } from '@sendbird/chat/openChannel';
import SendbirdChat from '@sendbird/chat';
import ChannelsList from '../../components/ChannelsList';
import { useRouter } from 'next/navigation';

function Chat({
    params,
}: {
    params: Promise<{ type: string, channel_url: string }>
}) {
    const [currentChannel, setCurrentChannel] = useState<OpenChannel|null>(null);
    const messageWrapperRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    // Separating the logic from the views using a hook.
    const messagesData = useMessages(currentChannel, messageWrapperRef);
    const { messages, customAddMessage, loadOlderMessages, deleteMessage } = messagesData;
    
    const openChat = useOpenChat({currentChannel, setCurrentChannel, params, messages, customAddMessage});
    const { openChannels, isCurrentChannel, channelParticipants, goPrivate, deleteOpenChannel } = openChat;

    const authContext = useAuthContext();
    const { openSB, userId, setOpenSB, APP_ID} = authContext ?? {};
    
    useEffect(
        () => {
            if (setOpenSB && APP_ID) {
                setOpenSB(
                    SendbirdChat.init({
                        appId: APP_ID,
                        modules: [
                            new OpenChannelModule(),
                        ],
                    }) as SendbirdOpenChat
                )
            }
            
            return () => {
                SendbirdChat.instance.disconnect();
            }
        }, [setOpenSB, APP_ID]
    )
    

    return (
        <main className='max-h-dvh h-dvh flex flex-col divide-y-2'>
            <ChannelTypePicker currentChannelType='open'/>
            <div className='flex flex-col h-full p-4 items-center'>
                <ChannelsList
                    isCurrentChannel={isCurrentChannel}
                    channelsToDisplay={ openChannels }
                    deleteChannel={
                        (channel_url) => {
                            (async () => {
                                await deleteOpenChannel(channel_url);
                                router.push("/chat/open")
                            })()
                        }
                    }
                    currentChannelType='open'
                />
                <section className='channel-wrapper'>
                    <ParticipantList channelParticipants={channelParticipants} goPrivate={goPrivate}/>
                    {messages && (
                        <article className='message-list'>
                            <h3 className='p-2 shadow-md z-10'>
                                Messages
                            </h3>
                            <div
                                id="messagesWrapper" ref={messageWrapperRef}
                                onScroll={loadOlderMessages}
                                className='message-wrapper'
                            >
                                {messages.map(
                                    message => (
                                        <Message
                                            message={message}
                                            userId={userId}
                                            deleteMessage={() => deleteMessage(openSB, currentChannel?.url, message)}
                                            key={message.messageId}
                                        />
                                    )
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