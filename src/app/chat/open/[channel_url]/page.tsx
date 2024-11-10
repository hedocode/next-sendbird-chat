"use client";

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { OpenChannel, OpenChannelModule, SendbirdOpenChat } from '@sendbird/chat/openChannel';
import SendbirdChat from '@sendbird/chat';

import { useAuthContext } from '@/contexts/auth';
import { useOpenChat } from '@/hooks/useOpenChat';
import { useMessages } from '@/hooks/useMessages';

// Imported components
import ChannelTypePicker from '@/app/chat/components/ChannelTypePicker';
import Message from '@/app/chat/components/Message';
import ParticipantList from '@/app/chat/components/ParticipantList';
import MessageDraft from '@/app/chat/components/MessageDraft';
import ChannelsList from '@/app/chat/components/ChannelsList';
import ChatLayoutTemplate from '@/components/ChatLayoutTemplate';

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
        <ChatLayoutTemplate
            channelTypePicker={<ChannelTypePicker currentChannelType='open'/>}
            channelList={
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
            }
        >
            <>
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
            </>
        </ChatLayoutTemplate>
    )
}

export default Chat;