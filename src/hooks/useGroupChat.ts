"use client"; 

import { useEffect, useState } from "react";
import { GroupChannel, GroupChannelListQuery, GroupChannelListQueryParams, QueryType } from "@sendbird/chat/groupChannel";
import axios from "axios";
import { useAuthContext } from "@/contexts/auth";

/**
 * # Channel data provider
 * @param params 
 * @param messageWrapperRef 
 * @returns 
 */
export function useGroupChat(
    currentChannel?: GroupChannel|null,
    setCurrentChannel?: Function,
    params?: Promise<{ type: string, channel_url?: string }>,
) {
    const authContext = useAuthContext();
    const { userId, accessToken, groupSB } = authContext ?? {}
    
    const [groupChannels, setGroupChannels] = useState<GroupChannel[]>([]);

    
    function loadOpenChannels() {
        (async () => {
            
            const groupChannelsFromServer = (await axios.get("/api/channels/group")).data;
            
            setGroupChannels(groupChannelsFromServer)
        })()
    }
    useEffect( loadOpenChannels, [] );

    function connectToAppAndLoadChannel() {
        if(userId && accessToken && groupSB) {
            (async () => {
                await groupSB.connect(userId, accessToken);

                // const params: GroupChannelListQueryParams = {
                //     userIdsFilter: {
                //       userIds: [userId],
                //       queryType: QueryType.OR,
                //     }
                // };
                // const query: GroupChannelListQuery = groupSB.groupChannel.createMyGroupChannelListQuery(params);
                
                // // Only channel A is returned in a result list through the groupChannels parameter of the callback function.
                // const channels: GroupChannel[] = await query.next();
                // console.log("channels : %o", channels);
                // setGroupChannels(channels);

                
                if (params){
                    let { channel_url } = (await params);
                    if (channel_url) {
                        channel_url = decodeURI(channel_url);
                        const urlChannel = await groupSB.groupChannel.getChannel(channel_url) as GroupChannel;
                        const res = (await axios.post(`/api/channels/group/${channel_url}/operators`, [userId])).data;
                        
                        urlChannel.addOperators([userId]);
                        
                        if (urlChannel.isPublic) {
                            await urlChannel.join();
                        }
        
        
                        // const res = (await axios.post("/api/channels/open", { name: "general", channel_url: "general"}));
                        if (setCurrentChannel) {
                            setCurrentChannel(urlChannel);
                        }
                    }
                }
            })()
        }
    }
    useEffect( connectToAppAndLoadChannel, [userId, accessToken, groupSB, currentChannel] )

    function isCurrentChannel(channel: GroupChannel, index?: number | undefined, array?: GroupChannel[] | undefined) {
        return channel.channel_url === currentChannel?.url;
    }

    async function deleteGroupChannel(channel_url: string) {
        await axios.delete(`/api/channels/group/${channel_url}`);
        // const channel: GroupChannel = await groupSB.groupChannel.getChannel(channel_url);

        // await channel.delete();
    }

    
    
    return {
        groupChannels,
        currentChannel,
        isCurrentChannel,
        deleteGroupChannel,
    };
}