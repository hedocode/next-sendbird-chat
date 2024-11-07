import { useAuthContext } from "@/contexts/auth";
import { User } from "@sendbird/chat";
import { GroupChannel, GroupChannelCreateParams } from "@sendbird/chat/groupChannel";
import { BaseMessage } from "@sendbird/chat/message";
import { OpenChannel, OpenChannelHandler, OpenChannelListQuery } from "@sendbird/chat/openChannel";
import axios from "axios";
import { useEffect, useState } from "react";



export function useOpenChat(
    {
        currentChannel,
        setCurrentChannel,
        params,
        messages,
        customAddMessage
    } : {
        currentChannel?: OpenChannel|null,
        setCurrentChannel?: Function,
        params?: Promise<{ channel_url?: string }>,
        messages?: BaseMessage[],
        customAddMessage?: Function,
    } = {}
) {
    const { userId, accessToken, sb } = useAuthContext();

    const [openChannels, setOpenChannels] = useState<OpenChannel[]>([]);
    const [channelParticipants, setChannelParticipants] = useState<User[]>([]);

    function loadOpenChannels() {
        (async () => {
            setOpenChannels((await axios.get("/api/channels/open")).data)
        })()
    }
    useEffect( loadOpenChannels, [] );

    
    function connectToAppAndLoadChannel() {
        if(sb && accessToken && userId) {
            (async () => {

                await sb.connect(userId, accessToken);

                // https://sendbird.com/docs/chat/sdk/v4/javascript/channel/retrieving-channels/retrieve-a-list-of-channels                
                const query: OpenChannelListQuery = sb.openChannel.createOpenChannelListQuery();
                if (query.hasNext) {
                    const channels: OpenChannel[] = await query.next();
                    setOpenChannels(channels);
                }
                if (params) {
                    let { channel_url } = (await params);
                    if (channel_url) {
                        const urlChannel = await sb.openChannel.getChannel(channel_url);
                        await urlChannel.enter();
                        const participants = await (await urlChannel.createParticipantListQuery({
                            limit: 25,
                        }).next());
                        setChannelParticipants(participants);
        
                        // const res = (await axios.post("/api/channels/open", { name: "general", channel_url: "general"}));
                        if (setCurrentChannel) {
                            setCurrentChannel(urlChannel);
                        }
                    }
                }
            })()
        }
    }
    useEffect( connectToAppAndLoadChannel, [userId, accessToken, sb, currentChannel, setCurrentChannel] )


    
    function listenMessagesAndParticipantsChanges() {
        if(messages && messages.length && customAddMessage) {
            const channelHandler = new OpenChannelHandler({
                onMessageReceived: customAddMessage,
                onChannelParticipantCountChanged: (channels) => {
                    (async () => {
                        if(currentChannel) {
                            const participants = await (await currentChannel.createParticipantListQuery({
                                limit: 25,
                            }).next());
                            setChannelParticipants(participants);
                        }
                    })()
                }
            });

            sb.openChannel.addOpenChannelHandler("WATCH_MESSAGES", channelHandler);
        }
    }
    useEffect(listenMessagesAndParticipantsChanges, [messages, currentChannel]);

    async function goPrivate(targetUserId: string) {
        // https://sendbird.com/docs/chat/sdk/v4/javascript/channel/creating-a-channel/create-a-channel#2-group-channel
        const params: GroupChannelCreateParams = {
            invitedUserIds: [userId, targetUserId],
            name: userId + " and " + targetUserId,
            channelUrl: userId + "_" + targetUserId,
            isDistinct: true,
        };
        const channel: GroupChannel = (await axios.post("/api/channels/group", { usersId: [userId, targetUserId]})).data;
        console.log("newGroupChannel : %o", channel);
        
        if (channel.isPublic) {
            await channel.join();
        }

        if (setCurrentChannel) {
            setCurrentChannel(channel);
        }
    }

    function isCurrentChannel(channel: OpenChannel) {
        return channel.name === currentChannel?.name;
    }

    return {
        openChannels,
        currentChannel,
        channelParticipants,
        isCurrentChannel,
        goPrivate
    }
}