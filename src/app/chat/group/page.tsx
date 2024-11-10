"use client";

import ChannelTypePicker from '../components/ChannelTypePicker';
import { useGroupChat } from '@/hooks/useGroupChat';
import ChannelsList from '../components/ChannelsList';
import ChatLayoutTemplate from '@/components/ChatLayoutTemplate';

function Chat() {
    
    // Separating the logic from the views using a hook.
    const groupChat = useGroupChat();
    const { groupChannels, deleteGroupChannel, isCurrentChannel } = groupChat;

    return (
        <ChatLayoutTemplate
            channelTypePicker={<ChannelTypePicker {...groupChat} currentChannelType='group'/>}
            channelList={
                <ChannelsList
                    isCurrentChannel={isCurrentChannel}
                    channelsToDisplay={ groupChannels }
                    deleteChannel={deleteGroupChannel}
                    currentChannelType='group'
                />
            }
        >
            <section className='channel-wrapper justify-center items-center'>
                Choose a channel to access it's chat
            </section>
        </ChatLayoutTemplate>
    )
}

export default Chat;