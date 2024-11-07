"use client";

import {  useEffect, useRef, useState } from 'react';
import { useAuthContext } from '@/contexts/auth';
import Message from '../../components/Message';
import { GroupChannel, GroupChannelModule, SendbirdGroupChat } from '@sendbird/chat/groupChannel';
import ChannelTypePicker from '../../components/ChannelTypePicker';
import ParticipantList from '../../components/ParticipantList';
import ChannelsList from '../../components/ChannelsList';
import MessageDraft from '../../components/MessageDraft';
import { useGroupChat } from '@/hooks/useGroupChat';
import { useMessages } from '@/hooks/useMessages';
import SendbirdChat from '@sendbird/chat';

function Chat({
    params,
}: {
    params: Promise<{ type: string, channel_url: string }>
}) {

    const messageWrapperRef = useRef<HTMLElement>(null);


    // Separating the logic from the views using hooks.
    
    const [currentChannel, setCurrentChannel] = useState<GroupChannel|null>(null);
    
    const messagesData = useMessages(currentChannel, messageWrapperRef)
    const {
        loadOlderMessages, messages
    } = messagesData;
    const groupChat = useGroupChat(currentChannel, setCurrentChannel, params);
    const { groupChannels } = groupChat;

    
    const { userId, setSb, APP_ID } = useAuthContext();
    useEffect(
        () => {
            setSb(
                SendbirdChat.init({
                    appId: APP_ID,
                    modules: [
                        new GroupChannelModule(),
                    ],
                }) as SendbirdGroupChat
            )

            return () => {
                SendbirdChat.instance.disconnect();
            }
        }, []
    )
    
    return (
        <main className='max-h-screen h-screen flex flex-col divide-y-2'>
            <ChannelTypePicker {...groupChat} currentChannelType='group'/>
            <div className='flex flex-col h-full p-4'>
                <ChannelsList {...groupChat} currentChannelType='group' channelsToDisplay={ groupChannels }/>
                <section className='flex flex-row flex-grow flex-wrap gap-10 divide-x-2 border-blue-100 bg-gray-100 border-2 border-gray-200'>
                    <aside className='p-2'>
                        <ParticipantList {...groupChat} {...messagesData} channelParticipants={undefined}/>
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
                            <MessageDraft {...groupChat} {...messagesData}/>
                        </article>
                    )}
                </section>
            </div>
        </main>
    )
}

export default Chat;