"use client";

import ChannelTypePicker from '../components/ChannelTypePicker';
import ChannelsList from '../components/ChannelsList';
import { useOpenChat } from '@/hooks/useOpenChat';

function Chat() {

    // Separating the logic from the views using a hook.
    const channelsData = useOpenChat();

    const { openChannels } = channelsData;

    return (
        <main className='max-h-screen h-screen flex flex-col divide-y-2'>
            <ChannelTypePicker currentChannelType='open'/>
            <div className='flex flex-col h-full p-4'>
                <ChannelsList {...channelsData} currentChannelType='open' channelsToDisplay={ openChannels }/>
                <section className='flex flex-row justify-center items-center flex-grow flex-wrap gap-10 divide-x-2 border-blue-100 bg-gray-100 border-2 border-gray-200'>
                    Choose a channel to access it's chat
                </section>
            </div>
        </main>
    )
}

export default Chat;