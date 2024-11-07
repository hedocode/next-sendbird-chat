"use client";

import ChannelTypePicker from '../components/ChannelTypePicker';
import { useOpenChat } from '@/hooks/useOpenChat';
import ChannelsList from '../components/ChannelsList';

function Chat() {

    // Separating the logic from the views using a hook.
    const channelsData = useOpenChat();
    const { isCurrentChannel, openChannels, deleteOpenChannel } = channelsData;

    return (
        <main className='max-h-dvh h-dvh flex flex-col divide-y-2'>
            <ChannelTypePicker currentChannelType='open'/>
            <div className='flex flex-col items-center h-full p-4'>
                <ChannelsList
                    isCurrentChannel={isCurrentChannel}
                    channelsToDisplay={ openChannels }
                    deleteChannel={ deleteOpenChannel }
                    currentChannelType='open'
                />
                <section className='channel-wrapper justify-center items-center'>
                    Choose a channel to access it's chat
                </section>
            </div>
        </main>
    )
}

export default Chat;