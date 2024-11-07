import { GroupChannel } from "@sendbird/chat/groupChannel";
import { OpenChannel } from "@sendbird/chat/openChannel";
import Link from "next/link";
import ChannelCreation from "./ChannelCreation";

export default function ChannelsList(
    { channelsToDisplay, isCurrentChannel, currentChannelType }
    : { 
        channelsToDisplay?: GroupChannel[]|OpenChannel[],
        isCurrentChannel: Function,
        currentChannelType: string
    }
) {

    function ChannelLink({ channel, isCurrent = false } : { channel: GroupChannel|OpenChannel, isCurrent?: boolean}) {
        const cls = "px-2 py-1 rounded-t-md border-x-2 border-t-2 " + (
            isCurrent ?
            "bg-gray-100 border-gray-200"
        :
            "px-2 py-1 rounded-t-md border-x-2 border-t-2 bg-green-50 border-green-100 hover:bg-green-100 hover:border-green-700"
        );
        return (
            <Link
                href={`/chat/${currentChannelType}/${currentChannelType === "open" ? channel.name : channel.channel_url}`}
                className={cls}
            >
                {channel.name}
            </Link>
        );
    }

    function channelListMapper( channel: OpenChannel|GroupChannel, isCurrent?: boolean ) {
        return <ChannelLink channel={channel} isCurrent={isCurrent} key={currentChannelType === "open" ? channel.name : channel.channel_url}/>
    }

    return (
        <div className='flex gap-2'>
            <nav className='flex gap-2'>
                {channelsToDisplay && channelsToDisplay.filter(isCurrentChannel).map(
                    channel => channelListMapper(channel, true)
                )}
                {channelsToDisplay && channelsToDisplay.filter(channel => !isCurrentChannel(channel)).map(
                    channel => channelListMapper(channel)
                )}
            </nav>
            { currentChannelType != "group" &&  <ChannelCreation/>}
        </div>
    )
}