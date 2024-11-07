import Link from "next/link";
import ChannelCreation from "./ChannelCreation";
import { OpenChannel } from "@sendbird/chat/openChannel";
import { GroupChannel } from "@sendbird/chat/groupChannel";

export default function ChannelsList(
    { channelsToDisplay, isCurrentChannel, currentChannelType, deleteChannel }
    : { 
        channelsToDisplay?: OpenChannel[]|GroupChannel[],
        isCurrentChannel: (value: OpenChannel|GroupChannel, index?: number, array?: OpenChannel[]|GroupChannel[]) => value is OpenChannel|GroupChannel,
        currentChannelType: string,
        deleteChannel: (channel_url: string) => void
    }
) {
    function ChannelLink({ channel, isCurrent = false } : { channel: GroupChannel|OpenChannel, isCurrent?: boolean}) {
        const cls = ( isCurrent ? "further pl-2 pr-8" : "openChannel" ) + " channel-link";
        return isCurrent ? 
        (
            <div className={cls}>
                <button
                    className="delete-btn"
                    onClick={ () => deleteChannel(currentChannelType === "group" ? channel.channel_url : channel.name) }
                >
                    x
                </button>
                {channel.name}
            </div>
        ): (
            <Link
                href={`/chat/${currentChannelType}/${currentChannelType === "group" ? channel.channel_url : channel.name}`}
                className={cls}
            >
                {channel.name}
            </Link>
        );
    }
    function channelListMapper( channel: GroupChannel|OpenChannel, isCurrent?: boolean ) {
        return <ChannelLink channel={channel} isCurrent={isCurrent} key={currentChannelType === "group" ? channel.channel_url : channel.name} />
    }

    return (
        <div className='channel-list'>
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