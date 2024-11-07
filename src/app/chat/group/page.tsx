"use client";

import ChannelTypePicker from '../components/ChannelTypePicker';
import ChannelsList from '../components/ChannelsList';
import { useGroupChat } from '@/hooks/useGroupChat';

function Chat() {
    
    // Separating the logic from the views using a hook.
    const channelsData = useGroupChat();
    const { groupChannels } = channelsData;

    return (
        <main className='max-h-screen h-screen flex flex-col divide-y-2'>
            <ChannelTypePicker {...channelsData} currentChannelType='group'/>
            <div className='flex flex-col h-full p-4'>
                <ChannelsList {...channelsData} currentChannelType='group' channelsToDisplay={groupChannels}/>
                <section className='flex flex-row justify-center items-center flex-grow flex-wrap gap-10 divide-x-2 border-blue-100 bg-gray-100 border-2 border-gray-200'>
                    Choose a channel to access it's chat
                </section>
            </div>
        </main>
    )
}

export default Chat;