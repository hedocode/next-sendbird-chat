"use client";

import ChannelTypePicker from '../components/ChannelTypePicker';
import { useOpenChat } from '@/hooks/useOpenChat';
import ChannelsList from '../components/ChannelsList';
import ChatLayoutTemplate from '@/components/ChatLayoutTemplate';

function Chat() {

    // Separating the logic from the views using a hook.
    const channelsData = useOpenChat();
    const { isCurrentChannel, openChannels, deleteOpenChannel } = channelsData;

    return (
        <ChatLayoutTemplate
            channelTypePicker={<ChannelTypePicker currentChannelType='open'/>}
            channelList={
                <ChannelsList
                    isCurrentChannel={isCurrentChannel}
                    channelsToDisplay={ openChannels }
                    deleteChannel={ deleteOpenChannel }
                    currentChannelType='open'
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