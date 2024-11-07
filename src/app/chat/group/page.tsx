"use client";

import ChannelTypePicker from '../components/ChannelTypePicker';
import { useGroupChat } from '@/hooks/useGroupChat';
import ChannelsList from '../components/ChannelsList';

function Chat() {
    
    // Separating the logic from the views using a hook.
    const groupChat = useGroupChat();
    const { groupChannels, deleteGroupChannel } = groupChat;

    return (
        <main className='max-h-dvh h-dvh flex flex-col divide-y-2'>
            <ChannelTypePicker {...groupChat} currentChannelType='group'/>
            <div className='flex flex-col h-full p-4 items-center'>
                <ChannelsList
                    {...groupChat}
                    channelsToDisplay={ groupChannels }
                    deleteChannel={deleteGroupChannel}
                    currentChannelType='group'
                />
                <section className='channel-wrapper justify-center items-center'>
                    Choose a channel to access it's chat
                </section>
            </div>
        </main>
    )
}

export default Chat;