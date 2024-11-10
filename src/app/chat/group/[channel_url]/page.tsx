"use client";

import {  useEffect, useRef, useState } from 'react';
import { useAuthContext } from '@/contexts/auth';

import { GroupChannel, GroupChannelModule, SendbirdGroupChat } from '@sendbird/chat/groupChannel';
import { useGroupChat } from '@/hooks/useGroupChat';
import { useMessages } from '@/hooks/useMessages';
import SendbirdChat from '@sendbird/chat';
import { useRouter } from 'next/navigation';

// Imported components
import ChannelsList from '@/app/chat/components/ChannelsList';
import Message from '@/app/chat/components/Message';
import ChannelTypePicker from '@/app/chat/components/ChannelTypePicker';
import ParticipantList from '@/app/chat/components/ParticipantList';
import MessageDraft from '@/app/chat/components/MessageDraft';
import ChatLayoutTemplate from '@/components/ChatLayoutTemplate';

function Chat({
    params,
}: {
    params: Promise<{ type: string, channel_url: string }>
}) {

    const messageWrapperRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    // Separating the logic from the views using hooks.
    
    const [currentChannel, setCurrentChannel] = useState<GroupChannel|null>(null);
    
    const messagesData = useMessages(currentChannel, messageWrapperRef)
    const {
        loadOlderMessages, messages, deleteMessage
    } = messagesData;
    const groupChat = useGroupChat(currentChannel, setCurrentChannel, params);
    const { groupChannels, deleteGroupChannel, isCurrentChannel } = groupChat;

    
    const authContext = useAuthContext();
    const { userId, groupSB, setGroupSB, APP_ID } = authContext ?? {};
    useEffect(
        () => {
            if(setGroupSB && APP_ID) {
                setGroupSB(
                    SendbirdChat.init({
                        appId: APP_ID,
                        modules: [
                            new GroupChannelModule(),
                        ],
                    }) as SendbirdGroupChat
                )
            }

            return () => {
                SendbirdChat.instance.disconnect();
            }
        }, [setGroupSB, APP_ID]
    )
    
    return (
        <ChatLayoutTemplate
            channelTypePicker={<ChannelTypePicker {...groupChat} currentChannelType='group'/>}
            channelList={
                <ChannelsList
                    isCurrentChannel={isCurrentChannel}
                    channelsToDisplay={ groupChannels }
                    deleteChannel={
                        (channel_url) => {
                            (async () => {
                                await deleteGroupChannel(channel_url);
                                router.push("/chat/group")
                            })()
                        }
                    }
                    currentChannelType='group'
                />
            }
        >
            <>
                <ParticipantList {...groupChat} {...messagesData} channelParticipants={undefined}/>
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
                                        deleteMessage={() => deleteMessage(groupSB, currentChannel?.url, message)} 
                                        key={message.messageId}
                                    />
                                )
                            )}
                        </div>
                        <MessageDraft {...groupChat} {...messagesData}/>
                    </article>
                )}
            </>
        </ChatLayoutTemplate>
    )
}

export default Chat;